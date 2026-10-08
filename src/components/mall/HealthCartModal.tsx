import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, AlertTriangle } from 'lucide-react';

interface CartLineView {
  id: string;
  title: string;
  spec?: string;
  quantity: number;
  price: number;
  coverImage?: string;
  available: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
  cartItems: CartLineView[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onGoToCheckout: () => void;
}

/**
 * [healthmall-ext] 家庭健康共享购物车（P25，接真 /front/trade/cart/**）
 * 数量/删除直连后端；行金额为后端实时价格，结算以 checkout 预览为准
 */
export const HealthCartModal: React.FC<Props> = ({
  isOpen,
  onClose,
  loading,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onGoToCheckout
}) => {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const hasInvalid = cartItems.some((item) => !item.available);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative max-w-[430px] w-full mx-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-teal-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">家庭健康共享购物车 (P25)</h3>
              <p className="text-[9px] text-slate-500">汇聚全家加购好物 · 实时价格与库存校验</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-3">
          {loading && <p className="text-center text-xs text-slate-400 py-6">加载中...</p>}
          {!loading && cartItems.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-xs space-y-2">
              <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
              <div>购物车还是空的，快去挑选健康好物吧</div>
            </div>
          )}
          {cartItems.map((item) => (
            <div
              key={item.id}
              className={`bg-slate-50 border rounded-2xl p-3 flex gap-3 items-center ${
                item.available ? 'border-slate-200/80' : 'border-rose-200 opacity-75'
              }`}
            >
              {item.coverImage ? (
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-lg shrink-0">
                  🌿
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-slate-400 hover:text-rose-500 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded font-medium">
                    规格：{item.spec || '标准'}
                  </span>
                  {!item.available && (
                    <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                      <AlertTriangle className="w-2.5 h-2.5" /> 库存不足
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-black text-rose-600 font-mono">
                    ¥{item.price.toFixed(2)}
                  </span>

                  <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-2 py-0.5 text-xs font-bold">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="text-slate-500 hover:text-slate-800"
                    >
                      -
                    </button>
                    <span className="font-mono text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="text-slate-500 hover:text-slate-800"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Checkout Bar */}
        {cartItems.length > 0 && (
          <div className="p-3.5 border-t border-slate-100 bg-white flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400">
                合计{hasInvalid ? '（含失效商品，请调整后结算）' : ''}
              </div>
              <div className="text-lg font-black text-rose-600 font-mono">¥{totalAmount.toFixed(2)}</div>
            </div>

            <button
              onClick={() => {
                onClose();
                onGoToCheckout();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/25 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>立即去结算</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
