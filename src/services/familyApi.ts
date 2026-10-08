/**
 * [healthmall-ext] 家庭圈健康空间接口客户端（healthapp）
 * 复用 authApi 信封 + merchantApi 的 Bearer 范式；POST 为 form-urlencoded（snake_case 字段）
 *
 * 接口清单(与 mall-backend family/controller/front 对齐):
 * 1. 创建家庭圈:     POST /front/family/create            (family_name, relation_type?)
 * 2. 我的圈列表:     GET  /front/family/my
 * 3. 圈详情:         GET  /front/family/info              (?family_id)
 * 4. 生成邀请:       POST /front/family/invite/create     (family_id, relation_type?, invitee_user_id?)
 * 5. 取消邀请:       POST /front/family/invite/cancel     (invite_id)
 * 6. 确认邀请:       POST /front/family/invite/confirm    (invite_code 或 invite_id)
 * 7. 定向邀请列表:   GET  /front/family/invite/pending
 * 8. 拒绝邀请:       POST /front/family/invite/reject     (invite_id)
 * 9. 更新我的授权:   POST /front/family/auth/update       (family_id, data_category, allowed_fields)
 * 10. 退出家庭圈:    POST /front/family/exit              (family_id)
 * 11. 移除成员:      POST /front/family/member/remove     (family_id, member_id)
 * 12. 解散家庭圈:    POST /front/family/dissolve          (family_id)
 */
import type { ModulithshopResponse } from './authApi';
import type {
  FamilyAuthorizationView,
  FamilyCircleSummary,
  FamilyInfo,
  FamilyInviteView,
  InviteConfirmed,
  InviteCreated,
  RelationType
} from '../types/family';

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

/** 1. 创建家庭圈（创建人即主理人） */
export function apiCreateFamily(
  token: string,
  familyName: string,
  relationType?: RelationType
): Promise<ModulithshopResponse<FamilyCircleSummary>> {
  return request<FamilyCircleSummary>('POST', '/front/family/create', {
    token,
    form: { family_name: familyName, relation_type: relationType }
  });
}

/** 2. 我的家庭圈列表（含已解散圈） */
export function apiGetMyFamilies(token: string): Promise<ModulithshopResponse<FamilyCircleSummary[]>> {
  return request<FamilyCircleSummary[]>('GET', '/front/family/my', { token });
}

/** 3. 圈详情（成员 + 我的生效授权） */
export function apiGetFamilyInfo(token: string, familyId: number): Promise<ModulithshopResponse<FamilyInfo>> {
  return request<FamilyInfo>('GET', `/front/family/info?family_id=${familyId}`, { token });
}

/** 4. 生成邀请码（仅主理人；明文仅此一次返回） */
export function apiCreateInvite(
  token: string,
  params: { family_id: number; relation_type?: RelationType; invitee_user_id?: number }
): Promise<ModulithshopResponse<InviteCreated>> {
  return request<InviteCreated>('POST', '/front/family/invite/create', { token, form: { ...params } });
}

/** 5. 取消邀请（仅邀请人） */
export function apiCancelInvite(token: string, inviteId: number): Promise<ModulithshopResponse<boolean>> {
  return request<boolean>('POST', '/front/family/invite/cancel', { token, form: { invite_id: inviteId } });
}

/** 6. 确认邀请（凭邀请码，或定向邀请传 invite_id） */
export function apiConfirmInvite(
  token: string,
  params: { invite_code?: string; invite_id?: number }
): Promise<ModulithshopResponse<InviteConfirmed>> {
  return request<InviteConfirmed>('POST', '/front/family/invite/confirm', { token, form: { ...params } });
}

/** 7. 定向邀请我的列表 */
export function apiGetPendingInvites(token: string): Promise<ModulithshopResponse<FamilyInviteView[]>> {
  return request<FamilyInviteView[]>('GET', '/front/family/invite/pending', { token });
}

/** 8. 拒绝邀请（仅被邀请人） */
export function apiRejectInvite(token: string, inviteId: number): Promise<ModulithshopResponse<boolean>> {
  return request<boolean>('POST', '/front/family/invite/reject', { token, form: { invite_id: inviteId } });
}

/** 9. 更新我的健康数据授权（allowed_fields 逗号分隔，空串=撤销整类；返回新授权行或 null） */
export function apiUpdateMyAuth(
  token: string,
  params: { family_id: number; data_category: string; allowed_fields: string }
): Promise<ModulithshopResponse<FamilyAuthorizationView | null>> {
  return request<FamilyAuthorizationView | null>('POST', '/front/family/auth/update', { token, form: { ...params } });
}

/** 10. 退出家庭圈（主理人不可退出） */
export function apiExitFamily(token: string, familyId: number): Promise<ModulithshopResponse<boolean>> {
  return request<boolean>('POST', '/front/family/exit', { token, form: { family_id: familyId } });
}

/** 11. 移除成员（仅主理人） */
export function apiRemoveMember(
  token: string,
  params: { family_id: number; member_id: number }
): Promise<ModulithshopResponse<boolean>> {
  return request<boolean>('POST', '/front/family/member/remove', { token, form: { ...params } });
}

/** 12. 解散家庭圈（仅主理人） */
export function apiDissolveFamily(token: string, familyId: number): Promise<ModulithshopResponse<boolean>> {
  return request<boolean>('POST', '/front/family/dissolve', { token, form: { family_id: familyId } });
}
