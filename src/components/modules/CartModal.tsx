import React, { useState } from 'react';
import { CartItem } from '../../types';
import { X, Trash2, Minus, Plus, ShoppingBag, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export const CartModal: React.FC<Props> = ({
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setOrderSubmitted(true);
    setTimeout(() => {
      onClearCart();
      setOrderSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-500" />
            <h2 className="font-bold text-slate-800 text-sm">
              购物车 ({items.length} 件)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-3">
          {orderSubmitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                订单提交成功！
              </h3>
              <p className="text-xs text-slate-500">
                已进入拼团/发货流，可在【我的订单】中查看物流进度
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
              <p className="text-xs">购物车暂无商品，快去挑选中意好物吧</p>
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={index}
                className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 relative"
              >
                <img
                  src={item.product.coverImage}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          item.buyType === 'group'
                            ? 'bg-rose-100 text-rose-600'
                            : item.buyType === 'seckill'
                            ? 'bg-red-100 text-red-600'
                            : item.buyType === 'bargain'
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.buyType === 'group'
                          ? '拼团订单'
                          : item.buyType === 'seckill'
                          ? '限时秒杀'
                          : item.buyType === 'bargain'
                          ? '砍价领取'
                          : '普通订单'}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-800 truncate">
                        {item.product.title}
                      </h4>
                    </div>

                    <div className="text-[10px] text-slate-400 mt-0.5">
                      规格: {item.skuName || '官方标配'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-rose-600 font-bold font-mono text-sm">
                      ¥{(item.price * item.quantity).toFixed(2)}
                    </span>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                        <button
                          onClick={() =>
                            onUpdateQuantity(index, Math.max(1, item.quantity - 1))
                          }
                          className="text-slate-500 hover:text-slate-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="text-slate-500 hover:text-slate-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Bar */}
        {items.length > 0 && !orderSubmitted && (
          <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400">总计金额 (包邮)</div>
              <div className="text-xl font-black text-rose-600 font-mono">
                ¥{totalPrice.toFixed(2)}
              </div>
            </div>

            <button
              id="btn-cart-checkout"
              onClick={handleCheckout}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-rose-500/25 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>立即微信支付</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
