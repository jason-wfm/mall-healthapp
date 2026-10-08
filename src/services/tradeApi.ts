/**
 * [healthmall-ext] 商城交易接口客户端：购物车 + 收货地址 + 订单（与 /front/trade/**、/front/account/userDeliveryAddress/** 对齐）
 * Bearer token + form-urlencoded + {status,msg,data} 信封（同 familyApi 范式）
 */
import type { ModulithshopResponse } from './authApi';
import type { CartRow, CheckoutPreview, DeliveryAddress, TradeOrder } from '../types/trade';

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

async function request<T>(
  method: 'GET' | 'POST',
  endpoint: string,
  options: { token: string; form?: Record<string, any>; raw?: boolean }
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...authHeaders(options.token)
  };
  let body: string | undefined;
  if (method === 'POST') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    body = Object.entries(options.form || {})
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
  }
  const res = await fetch(endpoint, { method, headers, body });
  if (options.raw) {
    return (await res.json()) as T;
  }
  const responseData: ModulithshopResponse<T> = await res.json();
  if (responseData.status !== 200) {
    throw new Error(responseData.msg || `接口返回异常码 (${responseData.status})`);
  }
  return responseData.data as T;
}

// ---------------- 购物车 ----------------

interface RawCheckoutOutput {
  items?: Array<{
    items?: Array<Record<string, any>>;
  }>;
  orderProductAmount?: number;
  orderFreightAmount?: number;
  orderDiscountAmount?: number;
  orderMoneyAmount?: number;
  tradePaymentAmount?: number;
}

/** 把 CheckoutOutput 的店铺分组行扁平化（供购物车 UI 使用） */
function flattenCartOutput(out: RawCheckoutOutput): { rows: CartRow[]; preview: CheckoutPreview } {
  const rows: CartRow[] = [];
  (out.items || []).forEach((store) => {
    (store.items || []).forEach((it) => {
      rows.push({
        cart_id: Number(it.cart_id ?? it.cartId ?? 0),
        item_id: Number(it.item_id ?? it.itemId ?? 0),
        product_id: Number(it.product_id ?? it.productId ?? 0),
        product_name: String(it.product_name ?? it.item_name ?? it.productName ?? '商品'),
        cover_image: it.product_image ?? it.item_image ?? it.productImage,
        spec: it.item_spec ?? it.itemSpec,
        quantity: Number(it.cart_quantity ?? it.cartQuantity ?? 1),
        price: Number(it.item_unit_price ?? it.itemUnitPrice ?? 0),
        available:
          it.available_quantity == null ||
          Number(it.available_quantity ?? it.availableQuantity ?? 0) >= Number(it.cart_quantity ?? it.cartQuantity ?? 1),
        selected: Boolean(it.cart_select ?? it.cartSelect ?? true)
      });
    });
  });
  return {
    rows,
    preview: {
      product_amount: Number(out.orderProductAmount ?? 0),
      freight_amount: Number(out.orderFreightAmount ?? 0),
      discount_amount: Number(out.orderDiscountAmount ?? 0),
      money_amount: Number(out.orderMoneyAmount ?? 0),
      trade_payment_amount: out.tradePaymentAmount == null ? undefined : Number(out.tradePaymentAmount)
    }
  };
}

/** 我的购物车（含实时价格/库存预览） */
export async function apiGetCart(token: string): Promise<{ rows: CartRow[]; preview: CheckoutPreview }> {
  const data = await request<RawCheckoutOutput>('GET', '/front/trade/cart/list', { token });
  return flattenCartOutput(data || {});
}

/** 加购（itemId=SKU 编号） */
export function apiAddCart(token: string, itemId: number, quantity: number): Promise<ModulithshopResponse<any>> {
  return request<ModulithshopResponse<any>>('POST', '/front/trade/cart/add', {
    token,
    form: { item_id: itemId, cart_quantity: quantity, cart_type: 1 },
    raw: true
  });
}

/** 修改数量 */
export function apiEditCartQuantity(token: string, cartId: number, quantity: number): Promise<void> {
  return request<void>('POST', '/front/trade/cart/editQuantity', {
    token,
    form: { cart_id: cartId, cart_quantity: quantity }
  });
}

/** 删除购物车行 */
export function apiRemoveCart(token: string, cartId: number): Promise<void> {
  return request<void>('POST', '/front/trade/cart/remove', { token, form: { cart_id: cartId } });
}

// ---------------- 收货地址 ----------------

/** 地址列表 */
export async function apiGetAddresses(token: string): Promise<DeliveryAddress[]> {
  const data = await request<{ items?: DeliveryAddress[] } | any>(
    'GET',
    '/front/account/userDeliveryAddress/list?page=1&size=20',
    { token }
  );
  return (data?.items || []) as DeliveryAddress[];
}

/** 新增地址 */
export function apiAddAddress(token: string, addr: Partial<DeliveryAddress>): Promise<ModulithshopResponse<any>> {
  return request<ModulithshopResponse<any>>('POST', '/front/account/userDeliveryAddress/add', {
    token,
    form: {
      ud_name: addr.ud_name,
      ud_mobile: addr.ud_mobile,
      ud_province: addr.ud_province || '',
      ud_city: addr.ud_city || '',
      ud_county: addr.ud_county || '',
      ud_address: addr.ud_address,
      ud_tag_name: addr.ud_tag_name || '家里',
      ud_is_default: addr.ud_is_default ? 1 : 0
    },
    raw: true
  });
}

// ---------------- 订单 ----------------

/** 结算预览（cartId 格式：itemId|quantity|cartId 逗号分隔；直接购买 cartId 段传 0） */
export async function apiCheckoutPreview(
  token: string,
  udId: number,
  cartIdParam: string
): Promise<CheckoutPreview> {
  const data = await request<RawCheckoutOutput>(
    'GET',
    `/front/trade/cart/checkout?ud_id=${udId}&cart_id=${encodeURIComponent(cartIdParam)}`,
    { token }
  );
  return flattenCartOutput(data || {}).preview;
}

/** 创建订单（paymentTypeId 1302=在线支付），返回订单号列表 */
export async function apiCreateOrder(
  token: string,
  params: { udId: number; cartIdParam: string; paymentTypeId?: number; orderMessage?: string }
): Promise<{ orderIds: string[]; payAmount: number }> {
  const data = await request<any>('POST', '/front/trade/order/add', {
    token,
    form: {
      ud_id: params.udId,
      cart_id: params.cartIdParam,
      payment_type_id: params.paymentTypeId ?? 1302,
      // order_message 需为合法 JSON（{storeId:留言}），空留言直接省略
      ...(params.orderMessage ? { order_message: params.orderMessage } : {})
    }
  });
  return {
    orderIds: (data?.order_ids || data?.orderIds || []) as string[],
    payAmount: Number(data?.trade_payment_amount ?? data?.tradePaymentAmount ?? 0)
  };
}

/** 我的订单列表 */
export async function apiGetOrders(
  token: string,
  params?: { orderStateId?: number; page?: number; size?: number }
): Promise<TradeOrder[]> {
  const query = new URLSearchParams({
    page: String(params?.page ?? 1),
    size: String(params?.size ?? 20)
  });
  if (params?.orderStateId) query.set('order_state_id', String(params.orderStateId));
  const data = await request<{ items?: any[] }>(
    'GET',
    `/front/trade/order/list?${query.toString()}`,
    { token }
  );
  return (data?.items || []).map(mapOrder);
}

/** 订单详情 */
export async function apiGetOrderDetail(token: string, orderId: string): Promise<TradeOrder | null> {
  const data = await request<any>('GET', `/front/trade/order/detail?order_id=${encodeURIComponent(orderId)}`, {
    token
  });
  return data ? mapOrder(data) : null;
}

/** 取消订单 */
export function apiCancelOrder(token: string, orderId: string, reason = '用户取消'): Promise<boolean> {
  return request<boolean>('POST', '/front/trade/order/cancel', {
    token,
    form: { order_id: orderId, order_cancel_reason: reason }
  });
}

/** 确认收货 */
export function apiConfirmReceipt(token: string, orderId: string): Promise<boolean> {
  return request<boolean>('POST', '/front/trade/order/receive', { token, form: { order_id: orderId } });
}

function mapOrder(raw: any): TradeOrder {
  return {
    order_id: String(raw.order_id ?? raw.orderId ?? ''),
    order_state_id: Number(raw.order_state_id ?? raw.orderStateId ?? 0),
    order_is_paid: Number(raw.order_is_paid ?? raw.orderIsPaid ?? 0),
    payment_type_id: raw.payment_type_id == null ? undefined : Number(raw.payment_type_id),
    order_payment_amount: Number(raw.order_payment_amount ?? raw.orderPaymentAmount ?? 0),
    order_time: raw.order_time ?? raw.orderTime,
    store_id: raw.store_id == null ? undefined : Number(raw.store_id),
    items: (raw.items || []).map((it: any) => ({
      product_name: String(it.product_name ?? it.productName ?? '商品'),
      item_name: it.item_name ?? it.itemName,
      item_unit_price: it.item_unit_price == null ? undefined : Number(it.item_unit_price ?? it.itemUnitPrice),
      order_item_quantity: Number(it.order_item_quantity ?? it.orderItemQuantity ?? 1),
      order_item_image: it.order_item_image ?? it.orderItemImage
    }))
  };
}

/** 组装 checkout 的 cartId 参数（cartRows 全量或单品） */
export function buildCartParam(rows: Array<{ item_id: number; quantity: number; cart_id: number }>): string {
  return rows
    .map((r) => `${r.item_id}|${r.quantity}|${r.cart_id}`)
    .join(',');
}
