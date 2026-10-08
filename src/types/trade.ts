/**
 * [healthmall-ext] 商城交易类型（与 mall-backend trade/pay 域对齐，响应字段 snake_case）
 */

/** 购物车行（/front/trade/cart/list 扁平化后） */
export interface CartRow {
  cart_id: number;
  item_id: number;
  product_id?: number;
  product_name: string;
  cover_image?: string;
  spec?: string;
  quantity: number;
  price: number;
  available: boolean;
  selected: boolean;
}

/** 结算预览（CheckoutOutput 裁剪） */
export interface CheckoutPreview {
  product_amount: number;
  freight_amount: number;
  discount_amount: number;
  money_amount: number;
  trade_payment_amount?: number;
}

/** 收货地址（account_user_delivery_address） */
export interface DeliveryAddress {
  ud_id: number;
  ud_name: string;
  ud_intl?: string;
  ud_mobile: string;
  ud_province?: string;
  ud_city?: string;
  ud_county?: string;
  ud_address: string;
  ud_tag_name?: string;
  ud_is_default: boolean;
}

/** 订单行（OrderVo 裁剪映射） */
export interface TradeOrder {
  order_id: string;
  order_state_id: number;
  order_is_paid: number;
  payment_type_id?: number;
  order_payment_amount: number;
  order_time?: string;
  store_id?: number;
  items: Array<{
    product_name: string;
    item_name?: string;
    item_unit_price?: number;
    order_item_quantity: number;
    order_item_image?: string;
  }>;
}

/** 订单状态 → 文案 */
export const ORDER_STATE_TEXT: Record<number, string> = {
  2010: '待付款',
  2011: '待审核',
  2013: '待财务审核',
  2020: '备货中',
  2030: '待发货',
  2040: '已发货',
  2050: '已收货',
  2060: '已完成',
  2070: '已取消',
  2080: '自提中'
};

export const ORDER_STATE = {
  WAIT_PAY: 2010,
  SHIPPED: 2040,
  RECEIVED: 2050,
  FINISH: 2060,
  CANCEL: 2070
} as const;

/** 支付渠道（/front/sys/config/info → payment_channel_list） */
export interface PayChannel {
  value: number;
  label: string;
  ext1?: string;
  ext2: string; // wxpay / money / alipay / offline ...
}
