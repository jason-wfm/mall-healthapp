/**
 * [healthmall-ext] 家庭圈健康空间类型（与 mall-backend family 域 FM-014~018 对齐）
 * 后端实体带 @JsonNaming(SnakeCase)，响应字段均为 snake_case
 */

export type FamilyStatus = 'ACTIVE' | 'DISSOLVED';

export type RelationType = 'PARENT' | 'SPOUSE' | 'CHILD' | 'OTHER' | 'GUARDIAN';

export type DataCategory = 'HEALTH_PROFILE' | 'HEALTH_RECORD' | 'MEDICAL_REPORT';

/** 我的家庭圈行（/front/family/my） */
export interface FamilyCircleSummary {
  family_id: number;
  family_no: string;
  family_name: string;
  family_status: FamilyStatus;
  member_limit: number;
  member_count: number;
  is_leader: boolean;
  relation_type: RelationType;
  join_time: string;
}

/** fam_circle 实体 */
export interface FamilyCircleEntity {
  family_id: number;
  family_no: string;
  family_name: string;
  owner_user_id: number;
  member_limit: number;
  family_status: FamilyStatus;
  dissolved_time?: string | null;
}

/** 家庭圈成员视图（昵称由后端从 account 域组装） */
export interface FamilyMemberView {
  member_id: number;
  family_id: number;
  user_id: number;
  relation_type: RelationType;
  is_leader: number; // 1 主理人 / 0 普通成员
  member_status: string;
  join_time: string;
  user_nickname: string;
}

/** 健康数据授权行（allowed_fields 为 JSON 数组字符串） */
export interface FamilyAuthorizationView {
  auth_id: number;
  family_id: number;
  member_id: number;
  data_category: DataCategory;
  allowed_fields: string | null;
  authorization_version: number;
  auth_status: string;
  granted_time: string;
  revoked_time?: string | null;
}

/** 圈详情（/front/family/info，仅圈内成员可见） */
export interface FamilyInfo {
  family: FamilyCircleEntity;
  members: FamilyMemberView[];
  my_authorizations: FamilyAuthorizationView[];
  member_count: number;
  is_leader: boolean;
}

/** 生成邀请返回（invite_code 明文仅此一次） */
export interface InviteCreated {
  invite_id: number;
  invite_code: string;
  expire_time: string;
  relation_type: RelationType;
}

/** 确认邀请返回 */
export interface InviteConfirmed {
  family_id: number;
  family_name: string;
  member_id: number;
}

/** 定向邀请视图（pending 列表项） */
export interface FamilyInviteView {
  invite_id: number;
  family_id: number;
  invitee_user_id?: number | null;
  relation_type: RelationType;
  invite_status: string;
  expire_time: string;
  family_name: string;
  inviter_name: string;
}

/** 数据类别 → 可授权字段白名单（与后端 ConstantFamily.DATA_CATEGORY_FIELDS 对齐） */
export const DATA_CATEGORIES: Array<{
  key: DataCategory;
  label: string;
  icon: string;
  fields: Array<{ key: string; label: string }>;
}> = [
  {
    key: 'HEALTH_PROFILE',
    label: '健康档案',
    icon: '🩺',
    fields: [
      { key: 'height', label: '身高' },
      { key: 'weight', label: '体重' },
      { key: 'blood_type', label: '血型' },
      { key: 'constitution_type', label: '中医体质' },
      { key: 'allergy_history', label: '过敏史' }
    ]
  },
  {
    key: 'HEALTH_RECORD',
    label: '检测数据',
    icon: '📈',
    fields: [
      { key: 'blood_pressure', label: '血压' },
      { key: 'blood_sugar', label: '血糖' },
      { key: 'heart_rate', label: '心率' },
      { key: 'blood_oxygen', label: '血氧' },
      { key: 'uric_acid', label: '尿酸' }
    ]
  },
  {
    key: 'MEDICAL_REPORT',
    label: '体检报告',
    icon: '📄',
    fields: [
      { key: 'report_summary', label: '报告摘要' },
      { key: 'abnormal_indicators', label: '异常指标' },
      { key: 'ai_interpretation', label: 'AI 解读' }
    ]
  }
];

export const RELATION_OPTIONS: Array<{ key: RelationType; label: string }> = [
  { key: 'PARENT', label: '父母/长辈' },
  { key: 'SPOUSE', label: '配偶' },
  { key: 'CHILD', label: '子女' },
  { key: 'GUARDIAN', label: '监护人' },
  { key: 'OTHER', label: '其他亲友' }
];

export function relationLabel(key: string | null | undefined): string {
  return RELATION_OPTIONS.find((o) => o.key === key)?.label || '其他亲友';
}

// ==================== 二期：交易共享与亲情代付 ====================

export type TradeResourceType = 'CART' | 'ORDER';

/** 交易共享授权行（未开启时为空对象，仅 resource_type 可判） */
export interface TradeAuthView {
  trade_auth_id?: number;
  family_id?: number;
  granter_member_id?: number;
  resource_type?: TradeResourceType;
  sharing_mode?: string;
  visible_fields?: string | null;
  authorization_version?: number;
  auth_status?: string;
  granted_time?: string;
  revoked_time?: string | null;
}

/** 家人共享购物车条目（ADR-016 白名单，无价格） */
export interface SharedCartItem {
  product_name: string;
  quantity: number;
  available: boolean;
  masked_owner_name: string;
  next_action: 'NONE' | 'INVALID';
  relation_type: RelationType;
  family_name: string;
}

/** 家人共享订单条目（OD-017 白名单 7 字段 + 归属标识） */
export interface SharedOrderItem {
  order_id: string;
  status: number;
  fulfillment_node: string;
  item_titles: string[];
  quantity: number;
  pay_amount: number;
  created_at?: string;
  masked_owner_name: string;
  relation_type: RelationType;
  family_name: string;
}

/** 亲情代付请求 */
export interface FamilyPayRequest {
  pay_request_id: number;
  pay_request_no: string;
  family_id: number;
  order_id: string;
  requester_user_id: number;
  payer_user_id: number;
  pay_amount: number;
  status: 'PENDING' | 'PAYING' | 'PAID' | 'DECLINED' | 'EXPIRED' | 'CANCELLED';
  pay_channel_id?: number | null;
  expire_time: string;
  pay_time?: string | null;
  direction?: 'RECEIVED' | 'SENT';
  requester_nickname?: string;
  payer_nickname?: string;
  family_name?: string;
}

/** 代付候选人 */
export interface FamilyPayCandidate {
  user_id: number;
  nickname: string;
  relation_type: RelationType;
  family_name: string;
}
