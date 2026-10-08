/**
 * [healthmall-ext] 收银台接口客户端（/front/pay/** 与 /front/sys/config/info）
 * 渠道：微信 H5 支付 + 余额支付（P2 拍板：微信+余额）
 */
import type { ModulithshopResponse } from './authApi';
import type { PayChannel } from '../types/trade';

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

async function post<T>(endpoint: string, token: string, form: Record<string, any>): Promise<ModulithshopResponse<T>> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      ...authHeaders(token)
    },
    body: Object.entries(form)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&')
  });
  const data: ModulithshopResponse<T> = await res.json();
  if (data.status !== 200) {
    throw new Error(data.msg || `接口返回异常码 (${data.status})`);
  }
  return data;
}

/** 可用支付渠道（只保留 wxpay/money，PRD OD-001 微信为主渠道 + 余额） */
export async function apiGetPayChannels(): Promise<PayChannel[]> {
  const res = await fetch('/front/sys/config/info', { headers: { Accept: 'application/json' } });
  const data: ModulithshopResponse<any> = await res.json();
  const list: PayChannel[] = data?.data?.payment_channel_list || [];
  return list.filter((c) => c.ext2 === 'wxpay' || c.ext2 === 'money');
}

/** 余额支付（需要支付密码；金额可传 0 表示全额） */
export function apiBalancePay(
  token: string,
  orderId: string,
  password: string,
  payMoney?: number
): Promise<ModulithshopResponse<{ paid?: boolean; code?: number }>> {
  return post<{ paid?: boolean; code?: number }>('/front/pay/consumeDeposit/moneyPay', token, {
    order_id: orderId,
    password,
    pm_money: payMoney ?? ''
  });
}

/** 微信 H5 支付（返回 mweb_url 跳转链接；本地无商户号配置时后端会报错，前端置灰提示） */
export function apiWechatH5Pay(
  token: string,
  orderId: string
): Promise<ModulithshopResponse<{ mweb_url?: string; mwebUrl?: string }>> {
  return post<{ mweb_url?: string; mwebUrl?: string }>('/front/pay/consumeDeposit/wechatH5Pay', token, {
    order_id: orderId
  });
}

/** 轮询微信支付结果（200=已支付） */
export async function apiWechatCheck(token: string, orderId: string): Promise<boolean> {
  const res = await fetch(`/front/pay/callback/wechatCheck?order_id=${encodeURIComponent(orderId)}`, {
    headers: authHeaders(token)
  });
  const data: ModulithshopResponse<any> = await res.json();
  return data.status === 200;
}

/** 轮询封装：每 3 秒一次，最多 20 次 */
export function pollWechatPay(token: string, orderId: string): Promise<boolean> {
  return new Promise((resolve) => {
    let attempts = 0;
    const timer = window.setInterval(async () => {
      attempts += 1;
      try {
        if (await apiWechatCheck(token, orderId)) {
          window.clearInterval(timer);
          resolve(true);
          return;
        }
      } catch {
        // 忽略单次轮询失败
      }
      if (attempts >= 20) {
        window.clearInterval(timer);
        resolve(false);
      }
    }, 3000);
  });
}
