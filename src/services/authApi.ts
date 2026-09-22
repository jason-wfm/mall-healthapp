/**
 * Modulithshop (Java SpringBoot3) 统一账户认证接口客户端
 * 项目地址: https://github.com/shsuishang/modulithshop-v3-java
 *
 * 接口清单:
 * 1. 短信验证码登录: POST /front/account/login
 * 2. 账号密码登录:   POST /front/account/login/login
 * 3. 微信授权登录:   POST /front/account/wechat (及 /front/account/wechat/login)
 * 4. 发送短信验证码: POST /front/account/login/send-code
 */

export interface ModulithshopResponse<T = any> {
  status: number; // 200 为成功
  msg: string;
  data: T;
}

export interface ModulithshopUserData {
  token: string;
  user_id: number | string;
  user_nickname: string;
  user_mobile: string;
  user_avatar: string;
  user_level_name: string;
  user_role: string;
  login_type: 'sms' | 'password' | 'wechat';
  openid?: string;
}

export interface SmsLoginParams {
  mobile: string;
  auth_code: string;
  user_type?: number;
}

export interface PasswordLoginParams {
  user_account: string;
  user_password: string;
}

export interface WechatLoginParams {
  code?: string;
  openid?: string;
  user_info?: {
    nickname?: string;
    avatar?: string;
    gender?: number;
  };
  login_target?: 'zhang' | 'li';
}

export interface ApiCallLog {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  requestPayload: any;
  responseStatus: number;
  responseBody: any;
  durationMs: number;
}

// 内存日志记录器，方便在 UI 上展示已真实调用的接口记录
const apiLogs: ApiCallLog[] = [];
const logListeners: Array<(logs: ApiCallLog[]) => void> = [];

export function getApiLogs(): ApiCallLog[] {
  return [...apiLogs];
}

export function subscribeApiLogs(listener: (logs: ApiCallLog[]) => void) {
  logListeners.push(listener);
  return () => {
    const idx = logListeners.indexOf(listener);
    if (idx > -1) logListeners.splice(idx, 1);
  };
}

function recordLog(log: ApiCallLog) {
  apiLogs.unshift(log);
  if (apiLogs.length > 20) apiLogs.pop();
  logListeners.forEach((fn) => fn([...apiLogs]));
}

// 基础 HTTP 请求封装
async function postRequest<T>(endpoint: string, body: any): Promise<ModulithshopResponse<T>> {
  const startTime = Date.now();
  let status = 200;
  let responseData: any;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(body)
    });

    status = res.status;
    responseData = await res.json();

    const durationMs = Date.now() - startTime;
    recordLog({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      method: 'POST',
      endpoint,
      requestPayload: body,
      responseStatus: status,
      responseBody: responseData,
      durationMs
    });

    if (responseData.status !== 200) {
      throw new Error(responseData.msg || `接口返回异常码 (${responseData.status})`);
    }

    return responseData;
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    if (!responseData) {
      responseData = { status: 500, msg: err.message || '网络连接异常' };
      recordLog({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toLocaleTimeString(),
        method: 'POST',
        endpoint,
        requestPayload: body,
        responseStatus: 500,
        responseBody: responseData,
        durationMs
      });
    }
    throw err;
  }
}

/**
 * 1. 发送短信验证码
 * 对应接口: POST /front/account/login/send-code
 */
export async function apiSendSmsCode(mobile: string): Promise<ModulithshopResponse<any>> {
  return postRequest('/front/account/login/send-code', { mobile });
}

/**
 * 2. 短信验证码登录
 * 对应开源项目: https://github.com/shsuishang/modulithshop-v3-java
 * 路径: POST /front/account/login
 */
export async function apiLoginBySms(params: SmsLoginParams): Promise<ModulithshopResponse<ModulithshopUserData>> {
  return postRequest<ModulithshopUserData>('/front/account/login', params);
}

/**
 * 3. 账号密码登录
 * 对应开源项目: https://github.com/shsuishang/modulithshop-v3-java
 * 路径: POST /front/account/login/login
 */
export async function apiLoginByAccount(
  params: PasswordLoginParams
): Promise<ModulithshopResponse<ModulithshopUserData>> {
  return postRequest<ModulithshopUserData>('/front/account/login/login', params);
}

/**
 * 4. 微信授权登录
 * 对应开源项目: https://github.com/shsuishang/modulithshop-v3-java
 * 路径: POST /front/account/wechat (及 /front/account/wechat/login)
 */
export async function apiLoginByWechat(
  params: WechatLoginParams
): Promise<ModulithshopResponse<ModulithshopUserData>> {
  return postRequest<ModulithshopUserData>('/front/account/wechat', params);
}
