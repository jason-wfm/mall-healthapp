/**
 * mall-backend (Java SpringBoot3) 统一账户认证接口客户端
 * 后端仓库: d:\workspace\healthmall\code\healthmall\mall-backend
 *
 * 接口清单(与后端 LoginController / WechatController 对齐):
 * 1. 发送短信验证码: POST /front/account/login/send-code   (后端: sendCode)
 * 2. 短信验证码登录: POST /front/account/login/doSmsLogin  (后端: doSmsLogin)
 * 3. 账号密码登录:   POST /front/account/login/login        (后端: login, 接收 LoginReq)
 * 4. 微信授权登录:   POST /front/account/wechat             (后端: WechatController.loginByWechat)
 *
 * 字段对齐说明:
 * - 账号密码登录使用 application/x-www-form-urlencoded, 字段名与后端 LoginReq 一致(camelCase):
 *   userAccount / password / verifyCode / verifyKey / encrypt / isManage
 * - 短信登录使用 form-urlencoded, 字段名与后端 RegReq 一致:
 *   verifyKey(手机号) / verifyCode(验证码)
 * - 微信登录使用 JSON body, 字段名: code / openid / user_info / login_target
 * - 后端 LoginRes 带 @JsonNaming(SnakeCase), 响应字段: token / user_id / user_account /
 *   user_nickname / user_mobile / user_avatar / user_level_name / user_role
 */

export interface ModulithshopResponse<T = any> {
  status: number; // 200 为成功
  msg: string;
  data: T;
}

export interface ModulithshopUserData {
  token: string;
  user_id: number | string;
  user_account?: string;
  user_nickname?: string;
  user_mobile?: string;
  user_avatar?: string;
  user_level_name?: string;
  user_role?: string;
  login_type?: 'sms' | 'password' | 'wechat';
  openid?: string;
}

// 后端 LoginReq (camelCase, form-urlencoded)
export interface PasswordLoginParams {
  userAccount: string;
  password: string;
  verifyCode?: string;
  verifyKey?: string;
  encrypt?: boolean;
  isManage?: boolean;
}

// 后端 doSmsLogin 的 RegReq 子集 (form-urlencoded)
export interface SmsLoginParams {
  verifyKey: string; // 手机号, 后端用作 verifyKey
  verifyCode: string; // 短信验证码
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

// 将对象序列化为 application/x-www-form-urlencoded
function toFormUrlencoded(body: Record<string, any>): string {
  return Object.entries(body)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
}

// form-urlencoded 请求(对应后端无 @RequestBody 的 LoginReq/RegReq 表单绑定)
async function postForm<T>(endpoint: string, body: Record<string, any>): Promise<ModulithshopResponse<T>> {
  const startTime = Date.now();
  let status = 200;
  let responseData: any;
  const url = endpoint;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: toFormUrlencoded(body)
    });

    status = res.status;
    responseData = await res.json();

    const durationMs = Date.now() - startTime;
    recordLog({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      method: 'POST',
      endpoint: url,
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
        endpoint: url,
        requestPayload: body,
        responseStatus: 500,
        responseBody: responseData,
        durationMs
      });
    }
    throw err;
  }
}

// JSON body 请求(对应后端 @RequestBody 的接口, 如微信登录)
async function postJson<T>(endpoint: string, body: any): Promise<ModulithshopResponse<T>> {
  const startTime = Date.now();
  let status = 200;
  let responseData: any;
  const url = endpoint;

  try {
    const res = await fetch(url, {
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
      endpoint: url,
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
        endpoint: url,
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
 * 对应后端: POST /front/account/login/send-code (LoginController.sendCode)
 * 返回 { auth_code } 供开发环境自动填入
 */
export async function apiSendSmsCode(mobile: string): Promise<ModulithshopResponse<{ auth_code: string }>> {
  return postForm<{ auth_code: string }>('/front/account/login/send-code', { mobile });
}

/**
 * 2. 短信验证码登录
 * 对应后端: POST /front/account/login/doSmsLogin (LoginController.doSmsLogin)
 * 字段对齐后端 RegReq: verifyKey=手机号, verifyCode=验证码
 */
export async function apiLoginBySms(params: SmsLoginParams): Promise<ModulithshopResponse<ModulithshopUserData>> {
  return postForm<ModulithshopUserData>('/front/account/login/doSmsLogin', {
    verifyKey: params.verifyKey,
    verifyCode: params.verifyCode
  });
}

/**
 * 3. 账号密码登录
 * 对应后端: POST /front/account/login/login (LoginController.login)
 * 字段对齐后端 LoginReq(camelCase): userAccount / password
 */
export async function apiLoginByAccount(
  params: PasswordLoginParams
): Promise<ModulithshopResponse<ModulithshopUserData>> {
  return postForm<ModulithshopUserData>('/front/account/login/login', {
    userAccount: params.userAccount,
    password: params.password,
    encrypt: params.encrypt ?? false,
    isManage: params.isManage ?? false
  });
}

/**
 * 4. 微信授权登录
 * 对应后端: POST /front/account/wechat (WechatController.loginByWechat, @RequestBody)
 * 字段: code / openid / user_info / login_target
 */
export async function apiLoginByWechat(
  params: WechatLoginParams
): Promise<ModulithshopResponse<ModulithshopUserData>> {
  return postJson<ModulithshopUserData>('/front/account/wechat', params);
}
