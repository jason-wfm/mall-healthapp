import React, { useEffect, useState } from 'react';
import { X, MapPin, ArrowRight, AlertTriangle, Loader2 } from 'lucide-react';
import {
  apiAddAddress,
  apiCheckoutPreview,
  apiCreateOrder,
  apiGetAddresses
} from '../../services/tradeApi';
import type { DeliveryAddress } from '../../types/trade';

interface CheckoutLine {
  title: string;
  spec?: string;
  quantity: number;
  price: number;
  coverImage?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  lines: CheckoutLine[];
  /** itemId|quantity|cartId 逗号分隔；直接购买 cartId 段传 0 */
  cartParam: string;
  /** 下单成功（待付款）回调 */
  onOrderCreated: (orderIds: string[], payAmount: number) => void;
}

const emptyAddrForm = { ud_name: '', ud_mobile: '', ud_province: '广东省', ud_city: '深圳市', ud_county: '南山区', ud_address: '' };

/**
 * [healthmall-ext] 确认订单（P26 接真）：真实地址簿 + /front/trade/cart/checkout 预览 + /front/trade/order/add
 * 亲情代付移至下单后的收银台（P2 决议：请求式代付）
 */
export const CheckoutModal: React.FC<Props> = ({ isOpen, onClose, token, lines, cartParam, onOrderCreated }) => {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [selectedUdId, setSelectedUdId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState({ product_amount: 0, freight_amount: 0, discount_amount: 0, money_amount: 0 });
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrForm, setAddrForm] = useState({ ...emptyAddrForm });

  useEffect(() => {
    if (!isOpen || !token) return;
    setLoading(true);
    setError(null);
    setShowAddrForm(false);
    (async () => {
      try {
        const list = await apiGetAddresses(token);
        setAddresses(list);
        const def = list.find((a) => a.ud_is_default) || list[0];
        if (def) {
          setSelectedUdId(def.ud_id);
          setPreview(await apiCheckoutPreview(token, def.ud_id, cartParam));
        } else {
          setShowAddrForm(true);
        }
      } catch (err: any) {
        setError(err?.message || '结算信息加载失败');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, token, cartParam]);

  if (!isOpen) return null;

  const localSubtotal = lines.reduce((sum, it) => sum + it.price * it.quantity, 0);

  const pickAddress = async (addr: DeliveryAddress) => {
    if (!token) return;
    setSelectedUdId(addr.ud_id);
    setError(null);
    try {
      setPreview(await apiCheckoutPreview(token, addr.ud_id, cartParam));
    } catch (err: any) {
      setError(err?.message || '结算预览失败');
    }
  };

  const handleSaveAddress = async () => {
    if (!token) return;
    if (!addrForm.ud_name.trim() || !addrForm.ud_mobile.trim() || !addrForm.ud_address.trim()) {
      setError('请填写收货人、手机号与详细地址');
      return;
    }
    setSubmitting(true);
    try {
      await apiAddAddress(token, { ...addrForm, ud_is_default: addresses.length === 0 });
      const list = await apiGetAddresses(token);
      setAddresses(list);
      const created = list[list.length - 1];
      if (created) await pickAddress(created);
      setAddrForm({ ...emptyAddrForm });
      setShowAddrForm(false);
    } catch (err: any) {
      setError(err?.message || '地址保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!token || !selectedUdId) {
      setError('请先选择收货地址');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { orderIds, payAmount } = await apiCreateOrder(token, {
        udId: selectedUdId,
        cartIdParam: cartParam
      });
      if (!orderIds.length) throw new Error('下单失败，请重试');
      onOrderCreated(orderIds, payAmount);
    } catch (err: any) {
      setError(err?.message || '下单失败');
    } finally {
      setSubmitting(false);
    }
  };

  const selected = addresses.find((a) => a.ud_id === selectedUdId);
  const finalAmount = preview.money_amount || localSubtotal;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative max-w-[430px] w-full mx-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-teal-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">确认订单信息 (P26)</h3>
              <p className="text-[9px] text-slate-500">真实地址簿与运费/优惠结算</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-3.5">
          {error && (
            <div className="flex items-start gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-2.5">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-6">
              <Loader2 className="w-4 h-4 animate-spin" /> 加载结算信息...
            </div>
          )}

          {!loading && (
            <>
              {/* 地址 */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <MapPin className="w-4 h-4 text-teal-600" /> 收货地址
                </div>
                {addresses.length === 0 && !showAddrForm && (
                  <p className="text-[11px] text-slate-400">暂无地址，请先新增</p>
                )}
                {addresses.map((a) => (
                  <button
                    key={a.ud_id}
                    onClick={() => pickAddress(a)}
                    className={`w-full text-left rounded-xl border p-2.5 text-xs transition-colors ${
                      selectedUdId === a.ud_id
                        ? 'border-teal-500 bg-teal-50/60'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">
                        {a.ud_name} {a.ud_mobile?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                      </span>
                      {a.ud_is_default && (
                        <span className="text-[9px] text-teal-700 bg-teal-100/70 font-bold px-1.5 py-0.2 rounded">默认</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-tight">
                      {a.ud_province}
                      {a.ud_city}
                      {a.ud_county}
                      {a.ud_address}
                    </p>
                  </button>
                ))}
                {!showAddrForm ? (
                  <button
                    onClick={() => setShowAddrForm(true)}
                    className="text-[11px] text-teal-700 font-bold"
                  >
                    + 新增收货地址
                  </button>
                ) : (
                  <div className="space-y-1.5 bg-white rounded-xl border border-slate-200 p-2.5">
                    <input
                      value={addrForm.ud_name}
                      onChange={(e) => setAddrForm({ ...addrForm, ud_name: e.target.value })}
                      placeholder="收货人"
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200"
                    />
                    <input
                      value={addrForm.ud_mobile}
                      onChange={(e) => setAddrForm({ ...addrForm, ud_mobile: e.target.value })}
                      placeholder="手机号"
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200"
                    />
                    <input
                      value={addrForm.ud_address}
                      onChange={(e) => setAddrForm({ ...addrForm, ud_address: e.target.value })}
                      placeholder="详细地址"
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveAddress}
                        disabled={submitting}
                        className="flex-1 py-1.5 bg-teal-600 text-white text-[11px] font-bold rounded-lg disabled:opacity-50"
                      >
                        保存并使用
                      </button>
                      <button
                        onClick={() => setShowAddrForm(false)}
                        className="flex-1 py-1.5 border border-slate-200 text-slate-500 text-[11px] font-bold rounded-lg"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                )}
                {selected && (
                  <p className="text-[9px] text-slate-400">下单前请确认地址可用，服务类商品以实际调度为准</p>
                )}
              </div>

              {/* 商品清单 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
                <div className="text-xs font-bold text-slate-800 pb-1 border-b border-slate-100 flex justify-between">
                  <span>商品清单 ({lines.length}件)</span>
                  <span className="text-[10px] text-slate-400 font-normal">正品正规保证</span>
                </div>
                {lines.map((it, idx) => (
                  <div key={idx} className="flex gap-2.5 items-center text-xs">
                    {it.coverImage && (
                      <img
                        src={it.coverImage}
                        alt={it.title}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-slate-800 font-bold truncate">{it.title}</h5>
                      <div className="text-[10px] text-slate-400 flex justify-between mt-0.5">
                        <span>规格：{it.spec || '标准'}</span>
                        <span>x{it.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right font-mono font-bold text-slate-800">
                      ¥{(it.price * it.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* 金额（真实结算预览） */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>商品小计</span>
                  <span className="font-mono">¥{preview.product_amount.toFixed(2)}</span>
                </div>
                {preview.discount_amount > 0 && (
                  <div className="flex justify-between text-rose-600 font-medium">
                    <span>优惠合计</span>
                    <span className="font-mono">-¥{preview.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>运费</span>
                  <span className="font-mono">
                    {preview.freight_amount > 0 ? `¥${preview.freight_amount.toFixed(2)}` : '免运费'}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between items-center text-slate-900 font-bold">
                  <span>实付总额</span>
                  <span className="text-base text-rose-600 font-mono font-black">¥{finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Submit */}
        <div className="p-3.5 border-t border-slate-100 bg-white flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400">应付金额</div>
            <div className="text-lg font-black text-rose-600 font-mono">¥{finalAmount.toFixed(2)}</div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting || loading}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/25 active:scale-95 transition-all flex items-center gap-1 disabled:opacity-50"
          >
            <span>{submitting ? '提交中...' : '提交订单'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
