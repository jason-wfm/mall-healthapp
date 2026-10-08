import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Users, AlertTriangle, Loader2, KeyRound } from 'lucide-react';
import { apiBalancePay, apiWechatH5Pay, apiGetPayChannels, pollWechatPay } from '../../services/payApi';
import type { PayChannel } from '../../types/trade';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  orderId: string;
  amount: number;
  /** 支付成功（轮询/余额到账） */
  onPaid: () => void;
  /** 下单后发起亲情代付（M3，可选入口） */
  onRequestFamilyPay?: () => void;
}

const CHANNEL_META: Record<string, { name: string; icon: string; desc: string }> = {
  wxpay: { name: '微信支付', icon: '💬', desc: '跳转微信完成支付 · 推荐' },
  money: { name: '余额支付', icon: '💰', desc: '使用账户余额，需支付密码' }
};

/**
 * [healthmall-ext] 收银台（P27 接真）：/front/pay/consumeDeposit/** 微信 H5 + 余额支付
 * 微信支付成功由 wechatCheck 轮询确认；本地无商户号配置时微信渠道置灰
 */
export const PaymentModal: React.FC<Props> = ({ isOpen, onClose, token, orderId, amount, onPaid, onRequestFamilyPay }) => {
  const [channels, setChannels] = useState<PayChannel[]>([]);
  const [method, setMethod] = useState<string>('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setPassword('');
    (async () => {
      try {
        const list = await apiGetPayChannels();
        setChannels(list);
        setMethod(list.some((c) => c.ext2 === 'wxpay') ? 'wxpay' : list[0]?.ext2 || 'money');
      } catch {
        setChannels([{ value: 1406, label: '余额支付', ext2: 'money' }]);
        setMethod('money');
      }
    })();
  }, [isOpen, orderId]);

  if (!isOpen) return null;

  const handlePay = async () => {
    if (!token) return;
    setSubmitting(true);
    setError(null);
    try {
      if (method === 'wxpay') {
        const res = await apiWechatH5Pay(token, orderId);
        const mwebUrl = res.data?.mweb_url || res.data?.mwebUrl;
        if (!mwebUrl) throw new Error(res.msg || '微信支付暂不可用（未配置商户号）');
        setPolling(true);
        window.location.href = mwebUrl;
        const paid = await pollWechatPay(token, orderId);
        setPolling(false);
        if (paid) {
          onPaid();
        } else {
          setError('尚未确认到支付结果，如已完成请稍后在订单中查看');
        }
      } else {
        if (!password) {
          setError('请输入支付密码');
          return;
        }
        const res = await apiBalancePay(token, orderId, password);
        if (res.data?.paid || res.status === 200) {
          onPaid();
        } else {
          setError(res.msg || '余额支付失败');
        }
      }
    } catch (err: any) {
      setError(err?.message || '支付失败');
    } finally {
      setSubmitting(false);
    }
  };

  const moneyChannel = channels.find((c) => c.ext2 === 'money');

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative max-w-[430px] w-full mx-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💳</span>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">收银台与安全支付 (P27)</h3>
              <p className="text-[9px] text-slate-400">订单号 {orderId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-4">
          <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-[10px] text-slate-400">订单应付金额</div>
            <div className="text-3xl font-black text-slate-900 font-mono mt-1">¥{amount.toFixed(2)}</div>
          </div>

          {error && (
            <div className="flex items-start gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-2.5">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {polling && (
            <div className="flex items-center justify-center gap-2 text-xs text-teal-700 bg-teal-50 rounded-xl p-2.5">
              <Loader2 className="w-4 h-4 animate-spin" /> 正在确认微信支付结果...
            </div>
          )}

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800">选择支付方式</div>
            {channels.length === 0 && (
              <p className="text-[11px] text-slate-400">未启用任何支付渠道，请联系平台配置</p>
            )}
            {channels.map((c) => {
              const meta = CHANNEL_META[c.ext2] || { name: c.label, icon: '💳', desc: '' };
              return (
                <div
                  key={c.value}
                  onClick={() => setMethod(c.ext2)}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    method === c.ext2
                      ? 'border-teal-500 bg-teal-50/50 shadow-2xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{meta.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{meta.name}</div>
                      <div className="text-[10px] text-slate-400">{meta.desc}</div>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      method === c.ext2 ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300'
                    }`}
                  >
                    {method === c.ext2 && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                </div>
              );
            })}
          </div>

          {method === 'money' && moneyChannel && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <KeyRound className="w-3.5 h-3.5 text-teal-600" /> 支付密码
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入 6 位支付密码"
                className="w-full text-sm tracking-widest px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
              />
              <p className="text-[9px] text-slate-400">使用账户余额支付，扣除后不可撤销；退款按实付人原路退回</p>
            </div>
          )}

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[9px] text-slate-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>资金进入平台收款账户（持牌机构存管），按订单结算分账</span>
          </div>

          {onRequestFamilyPay && (
            <button
              onClick={() => {
                onClose();
                onRequestFamilyPay();
              }}
              className="w-full py-2.5 rounded-xl border border-purple-200 text-purple-700 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              暂不支付，请求家人代付
            </button>
          )}
        </div>

        {/* Action */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <button
            disabled={submitting || polling || channels.length === 0}
            onClick={handlePay}
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md shadow-teal-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting || polling ? (
              <span>正在处理安全支付...</span>
            ) : (
              <>
                <span>确认并支付 ¥{amount.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
