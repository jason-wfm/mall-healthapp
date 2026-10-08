/**
 * [healthmall-ext] 多商家 P2：商家中心类型定义
 * 对齐 mall-backend merchant 域 @JsonNaming(SnakeCase) 响应
 */

export type MerchantApplyStatus = 10 | 20 | 30; // 10待审核 20通过 30驳回
export type MerchantApplyType = 10 | 20 | 30; // 10入驻 20变更 30退驻
export type WxApplyStatus = 0 | 10 | 20 | 30; // 0未进件 10审核中 20已开通 30驳回

export interface MerchantApplySubmitReq {
  merchant_name: string;
  short_name?: string;
  category?: string;
  logo?: string;
  intro?: string;
  contact_name?: string;
  contact_phone: string;
  business_license: string;
  qualification_urls?: string;
  /** [healthmall-ext] snapshot v1.1：MR-016 法人信息与城市 */
  legal_name?: string;
  id_card?: string;
  gender?: number; // 10男 20女
  age?: number;
  city?: string;
  credit_code?: string;
  invite_code?: string;
}

export interface RecruitRole {
  type: 'MERCHANT' | 'STAFF';
  title: string;
  coupon: string;
  benefits: string[];
  enabled: boolean;
}

export interface RecruitConfig {
  hero: { title: string; subtitle: string };
  roles: RecruitRole[];
  reward_rules: string[];
  flow_steps: string[];
  entry_bar: { title: string; subtitle: string };
}

export interface MerchantApplyProgress {
  apply_id: number;
  merchant_name?: string;
  apply_type: MerchantApplyType;
  status: MerchantApplyStatus;
  audit_remark?: string;
  audit_time?: string;
  create_time?: string;
  /** [healthmall-ext] 申请快照（驳回重提预填用） */
  snapshot_json?: string;
}

export interface WorkbenchOverview {
  merchant_id: number;
  merchant_name: string;
  status: number;
  logo?: string;
  category?: string;
  wx_apply_status: WxApplyStatus;
  store_num: number;
  pending_settle_amount: string | number;
  settled_amount: string | number;
}

export interface WorkbenchSettlement {
  settlement_id: number;
  settlement_number: string;
  store_id: number;
  period_start: string;
  period_end: string;
  order_amount: string | number;
  commission_amount: string | number;
  refund_amount: string | number;
  settle_amount: string | number;
  settlement_state: 0 | 1 | 2 | 3 | 4;
  confirm_time?: number;
}
