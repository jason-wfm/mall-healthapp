import React, { useState } from 'react';
import { X, MapPin, Calendar, Clock, CreditCard, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { CartItem, HealthProduct } from '../../types/health';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  singleProductBuy?: {
    product: HealthProduct;
    sku: string;
    quantity: number;
    price: number;
  } | null;
  onConfirmOrder: (orderDetails: any) => void;
}

export const CheckoutModal: React.FC<Props> = ({
  isOpen,
  onClose,
  items,
  singleProductBuy,
  onConfirmOrder
}) => {
  const [askFamilyPay, setAskFamilyPay] = useState(false);
  const [selectedPayer, setSelectedPayer] = useState('张明 (主理人/本人)');
  const [remarks, setRemarks] = useState('');

  if (!isOpen) return null;

  // Compute checkout items
  const checkoutList = singleProductBuy
    ? [
        {
          id: 'single',
          product: singleProductBuy.product,
          sku: singleProductBuy.sku,
          quantity: singleProductBuy.quantity,
          price: singleProductBuy.price,
          addedBy: '本人'
        }
      ]
    : items;

  const rawSubtotal = checkoutList.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const discount = rawSubtotal >= 300 ? 50 : 0;
  const finalAmount = Math.max(0, rawSubtotal - discount);

  const isServiceOrder = checkoutList.some((it) => it.product.type !== 'product');

  const handleSubmit = () => {
    onConfirmOrder({
      items: checkoutList,
      totalAmount: finalAmount,
      askFamilyPay,
      payer: askFamilyPay ? '张建国(父亲) 代付' : '本人支付',
      remarks
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative max-w-[430px] w-full mx-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-teal-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">确认订单信息 (P26)</h3>
              <p className="text-[9px] text-slate-500">多模态服务结算 · 智能地址核验与家庭代付</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll Body */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-3.5">
          {/* Address / Service Location (P26) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">张明 138****0001</span>
                <span className="text-[9px] text-teal-700 bg-teal-100/70 font-bold px-1.5 py-0.2 rounded">
                  默认地址
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 leading-tight">
                广东省深圳市南山区高新南九道科技园南路88号3栋1002
              </p>
              {isServiceOrder && (
                <div className="text-[10px] text-teal-800 mt-1.5 font-medium">
                  🕒 预约服务时间：2026-09-25 10:00 - 11:00
                </div>
              )}
            </div>
          </div>

          {/* Items Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
            <div className="text-xs font-bold text-slate-800 pb-1 border-b border-slate-100 flex justify-between">
              <span>商品/服务清单 ({checkoutList.length}件)</span>
              <span className="text-[10px] text-slate-400 font-normal">正品正规保证</span>
            </div>

            {checkoutList.map((it, idx) => (
              <div key={idx} className="flex gap-2.5 items-center text-xs">
                <img
                  src={it.product.coverImage}
                  alt={it.product.title}
                  className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="text-slate-800 font-bold truncate">{it.product.title}</h5>
                  <div className="text-[10px] text-slate-400 flex justify-between mt-0.5">
                    <span>规格：{it.sku}</span>
                    <span>x{it.quantity}</span>
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-slate-800">
                  ¥{(it.price * it.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>商品小计</span>
              <span className="font-mono">¥{rawSubtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-rose-600 font-medium">
                <span>满 300 减 50 优惠券</span>
                <span className="font-mono">-¥{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>运费 / 预约调度服务费</span>
              <span className="text-emerald-700 font-bold">免运费 / 免调度费</span>
            </div>
            <div className="border-t border-slate-200 pt-1.5 flex justify-between items-center text-slate-900 font-bold">
              <span>实付总额</span>
              <span className="text-base text-rose-600 font-mono font-black">
                ¥{finalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* 家庭圈代付选项 (FM-012/013) */}
          <div className="bg-purple-50/60 border border-purple-200/80 rounded-2xl p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-purple-900">
                <Users className="w-4 h-4 text-purple-600" />
                <span>找家庭圈成员代付 (FM-012)</span>
              </div>
              <input
                type="checkbox"
                checked={askFamilyPay}
                onChange={(e) => setAskFamilyPay(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded"
              />
            </div>

            {askFamilyPay && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] text-purple-700 leading-relaxed">
                  选择指定家庭成员，下单后将通过微信与短信向其推送代付链接与关怀留言。
                </p>
                <div className="flex gap-2">
                  {['张建国 (父亲)', '王秀英 (母亲)'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedPayer(p)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                        selectedPayer.includes(p.slice(0, 3))
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white border-purple-200 text-purple-800'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="p-3.5 border-t border-slate-100 bg-white flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400">应付金额</div>
            <div className="text-lg font-black text-rose-600 font-mono">
              ¥{finalAmount.toFixed(2)}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/25 active:scale-95 transition-all flex items-center gap-1"
          >
            <span>{askFamilyPay ? '发送代付申请' : '提交订单'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
