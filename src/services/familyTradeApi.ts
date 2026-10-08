/**
 * [healthmall-ext] 家庭圈交易共享与亲情代付接口客户端（二期，与 /front/family/trade/**、/front/family/pay/** 对齐）
 */
import type { ModulithshopResponse } from './authApi';
import type { FamilyPayCandidate, FamilyPayRequest, SharedCartItem, SharedOrderItem, TradeAuthView } from '../types/family';

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

async function request<T>(
  method: 'GET' | 'POST',
  endpoint: string,
  options: { token: string; form?: Record<string, any> }
): Promise<ModulithshopResponse<T>> {
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
  const responseData: ModulithshopResponse<T> = await res.json();
  if (responseData.status !== 200) {
    throw new Error(responseData.msg || `接口返回异常码 (${responseData.status})`);
  }
  return responseData;
}

// ---------------- 交易共享授权（OD-017/ADR-016） ----------------

/** 开启/关闭我的 CART/ORDER 共享（enabled=false 时返回 null） */
export function apiUpdateMyTradeAuth(
  token: string,
  params: { family_id: number; resource_type: 'CART' | 'ORDER'; enabled?: boolean }
): Promise<ModulithshopResponse<TradeAuthView | null>> {
  return request<TradeAuthView | null>('POST', '/front/family/trade/auth/update', {
    token,
    form: { ...params }
  });
}

/** 我的某圈 CART/ORDER 授权状态（两类各一项，未开启为空对象） */
export function apiGetMyTradeAuths(token: string, familyId: number): Promise<ModulithshopResponse<TradeAuthView[]>> {
  return request<TradeAuthView[]>('GET', `/front/family/trade/auth/info?family_id=${familyId}`, { token });
}

/** 家人共享给我的购物车（白名单视图，无价格） */
export function apiGetFamilySharedCart(token: string): Promise<ModulithshopResponse<SharedCartItem[]>> {
  return request<SharedCartItem[]>('GET', '/front/family/trade/shared/cart', { token });
}

/** 家人共享给我的订单（7 字段白名单 + 归属脱敏） */
export function apiGetFamilySharedOrders(
  token: string,
  page = 1,
  size = 20
): Promise<ModulithshopResponse<SharedOrderItem[]>> {
  return request<SharedOrderItem[]>('GET', `/front/family/trade/shared/orders?page=${page}&size=${size}`, {
    token
  });
}

// ---------------- 亲情代付（OD-017/NT-023） ----------------

/** 发起代付请求 */
export function apiCreateFamilyPayRequest(
  token: string,
  orderId: string,
  payerUserId: number
): Promise<ModulithshopResponse<any>> {
  return request<any>('POST', '/front/family/pay/request', {
    token,
    form: { order_id: orderId, payer_user_id: payerUserId }
  });
}

/** 我的代付请求列表（RECEIVED 活跃 + SENT） */
export function apiGetFamilyPayRequests(token: string): Promise<ModulithshopResponse<FamilyPayRequest[]>> {
  return request<FamilyPayRequest[]>('GET', '/front/family/pay/pending', { token });
}

/** 取消我发出的代付请求 */
export function apiCancelFamilyPayRequest(token: string, payRequestId: number): Promise<ModulithshopResponse<boolean>> {
  return request<boolean>('POST', '/front/family/pay/cancel', { token, form: { pay_request_id: payRequestId } });
}

/** 拒绝我收到的代付请求 */
export function apiDeclineFamilyPayRequest(token: string, payRequestId: number): Promise<ModulithshopResponse<boolean>> {
  return request<boolean>('POST', '/front/family/pay/decline', { token, form: { pay_request_id: payRequestId } });
}

/** 代付候选人（圈内成员，去重排除自己） */
export function apiGetFamilyPayCandidates(token: string): Promise<ModulithshopResponse<FamilyPayCandidate[]>> {
  return request<FamilyPayCandidate[]>('GET', '/front/family/pay/candidates', { token });
}
