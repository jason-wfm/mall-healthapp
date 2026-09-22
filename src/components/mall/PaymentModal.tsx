import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Wallet } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: () => void;
}

export const PaymentModal: React.FC<Props> = ({ isOpen, onClose, amount, onPaymentSuccess }) => {
  const [method, setMethod] = useState<'wechat' | 'alipay' | 'unionpay'>('wechat');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative max-w-[430px] w-full mx-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💳</span>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">收银台与安全支付 (P27)</h3>
              <p className="text-[9px] text-slate-400">已启用 256 位金融级加密传输通道</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-4">
          {/* Amount Display */}
          <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-[10px] text-slate-400">支付剩余时间 14:59</div>
            <div className="text-3xl font-black text-slate-900 font-mono mt-1">
              ¥{amount.toFixed(2)}
            </div>
            <div className="text-[9px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full inline-block mt-1 font-medium">
              满减优惠 -¥50.00 已抵扣
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800">选择支付方式</div>

            {[
              {
                id: 'wechat',
                name: '微信支付',
                icon: '💬',
                desc: '亿万用户的便捷选择 · 推荐'
              },
              {
                id: 'alipay',
                name: '支付宝',
                icon: '🔵',
                desc: '数亿用户使用的安全支付'
              },
              {
                id: 'unionpay',
                name: '云闪付 / 银行卡',
                icon: '🏦',
                desc: '支持各大国有及商业银行借记卡与信用卡'
              }
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => setMethod(m.id as any)}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  method === m.id
                    ? 'border-teal-500 bg-teal-50/50 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{m.name}</div>
                    <div className="text-[10px] text-slate-400">{m.desc}</div>
                  </div>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    method === m.id
                      ? 'border-teal-600 bg-teal-600 text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {method === m.id && <CheckCircle2 className="w-3 h-3" />}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[9px] text-slate-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>中国银联与网联清算机构存管 · 资金由招商银行全程监管</span>
          </div>
        </div>

        {/* Action button */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <button
            disabled={isProcessing}
            onClick={handlePay}
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-teal-600/25 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
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
