/**
 * [healthmall-ext] 多商家 P2：商家中心接口客户端（healthapp）
 * 复用 authApi 的信封与日志范式，扩展 Authorization: Bearer 认证头
 *
 * 接口清单(与 mall-backend merchant/controller/front 对齐):
 * 1. 提交入驻申请:   POST /front/merchant/apply/submit          (form, camelCase 字段绑定 MerchantApplySubmitReq)
 * 2. 入驻进度查询:   GET  /front/merchant/apply/progress        (?apply_id 可选)
 * 3. 工作台概览:     GET  /front/merchant/workbench/overview    (roleId 2/3)
 * 4. 结算单列表:     GET  /front/merchant/workbench/settlements (?page&?size)
 * 5. 结算单确认:     POST /front/merchant/workbench/settlement/confirm (?settlement_id)
 */
import type { ModulithshopResponse } from './authApi';
import type {
  MerchantApplyProgress,
  MerchantApplySubmitReq,
  RecruitConfig,
  WorkbenchOverview,
  WorkbenchSettlement,
} from '../types/merchant';

const logApiCall = (
  method: string,
  endpoint: string,
  requestPayload: any,
  responseStatus: number,
  responseBody: any,
  durationMs: number
) => {
  // 与 authApi.getApiLogs 联动见 authApi.subscribeApiLogs（此处轻量 console 便于排查）
  console.debug('[merchantApi]', method, endpoint, responseStatus, durationMs + 'ms');
};

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

async function request<T>(
  method: 'GET' | 'POST',
  endpoint: string,
  options: { token: string; form?: Record<string, any> }
): Promise<ModulithshopResponse<T>> {
  const startTime = Date.now();
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
  logApiCall(method, endpoint, options.form ?? null, res.status, responseData, Date.now() - startTime);

  if (responseData.status !== 200) {
    throw new Error(responseData.msg || `接口返回异常码 (${responseData.status})`);
  }
  return responseData;
}

/** 1. 提交入驻申请 */
export function apiSubmitMerchantApply(
  req: MerchantApplySubmitReq,
  token: string
): Promise<ModulithshopResponse<number>> {
  return request<number>('POST', '/front/merchant/apply/submit', { token, form: { ...req } });
}

/** 2. 入驻进度查询（applyId 空=最近一单） */
export function apiGetApplyProgress(token: string, applyId?: number): Promise<ModulithshopResponse<MerchantApplyProgress | null>> {
  const query = applyId ? `?apply_id=${applyId}` : '';
  return request<MerchantApplyProgress | null>('GET', `/front/merchant/apply/progress${query}`, { token });
}

/** 3. 工作台概览 */
export function apiGetWorkbenchOverview(token: string): Promise<ModulithshopResponse<WorkbenchOverview>> {
  return request<WorkbenchOverview>('GET', '/front/merchant/workbench/overview', { token });
}

/** 4. 结算单列表 */
export function apiGetWorkbenchSettlements(
  token: string,
  page = 1,
  size = 10
): Promise<ModulithshopResponse<{ items: WorkbenchSettlement[]; total: number; records: number }>> {
  return request(`GET`, `/front/merchant/workbench/settlements?page=${page}&size=${size}`, { token });
}

/** 5. 结算单确认 */
export function apiConfirmWorkbenchSettlement(
  settlementId: number,
  token: string
): Promise<ModulithshopResponse<boolean>> {
  return request<boolean>('POST', '/front/merchant/workbench/settlement/confirm', {
    token,
    form: { settlement_id: settlementId }
  });
}

/** 6. 招募页配置（RJ-001，无需登录；失败由调用方走内置兜底） */
export async function apiGetRecruitConfig(): Promise<ModulithshopResponse<RecruitConfig>> {
  const res = await fetch('/front/merchant/recruit/config', {
    headers: { Accept: 'application/json' }
  });
  const data: ModulithshopResponse<RecruitConfig> = await res.json();
  if (data.status !== 200) throw new Error(data.msg || '招募配置加载失败');
  return data;
}

/** 7. 营业执照等影像上传（POST /front/sys/upload/index，multipart upfile + material_type=image） */
export async function apiUploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('upfile', file);
  form.append('material_type', 'image');
  const res = await fetch('/front/sys/upload/index', { method: 'POST', body: form });
  const data: ModulithshopResponse<any> = await res.json();
  if (data.status !== 200) throw new Error(data.msg || '上传失败');
  return data.data?.url || data.data?.file_url || '';
}

/** 8. 营业执照 OCR 识别（P2.5c：识别成功回填；未配置/失败降级 recognized=false，人工填写不阻断） */
export interface OcrResult {
  recognized: boolean;
  merchant_name?: string;
  credit_code?: string;
  message?: string;
}

export function apiOcrBusinessLicense(imageUrl: string, token: string): Promise<ModulithshopResponse<OcrResult>> {
  return request<OcrResult>('POST', '/front/merchant/apply/ocr', { token, form: { image_url: imageUrl } });
}

/** 9. 门户信息（P_A4：三态 PORTAL/STORE/PLATFORM，H5 启动加载；无需登录） */
export interface PortalInfo {
  context_type: 'PORTAL' | 'STORE' | 'PLATFORM';
  portal_id: number;
  portal_name: string;
  portal_type: string;
  brand_color?: string;
  default_store_id?: number;
  stores?: Array<{
    store_id: number;
    store_name?: string;
    merchant_id?: number;
    merchant_name?: string;
  }> | null;
}

export async function apiGetPortalInfo(): Promise<ModulithshopResponse<PortalInfo>> {
  const res = await fetch('/front/sys/portal/info', {
    headers: { Accept: 'application/json' }
  });
  const data: ModulithshopResponse<PortalInfo> = await res.json();
  if (data.status !== 200) throw new Error(data.msg || '门户信息加载失败');
  return data;
}
