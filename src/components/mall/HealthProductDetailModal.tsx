import React, { useState } from 'react';
import { HealthProduct } from '../../types/health';
import { X, ShieldCheck, MapPin, Clock, Calendar, Car, ShoppingCart, ArrowRight, Heart, Share2 } from 'lucide-react';

interface Props {
  product: HealthProduct | null;
  onClose: () => void;
  onAddToCart: (product: HealthProduct, sku: string, qty: number, price: number, itemId?: number) => void;
  onInstantBuy: (product: HealthProduct, sku: string, qty: number, price: number, itemId?: number) => void;
  onOpenStoreDetail: () => void;
}

export const HealthProductDetailModal: React.FC<Props> = ({
  product,
  onClose,
  onAddToCart,
  onInstantBuy,
  onOpenStoreDetail
}) => {
  // [healthmall-ext] 二期：SKU 取商品真实 items[]，缺省回退占位规格
  const skuOptions = product?.items?.length
    ? product.items.map((it) => ({ name: it.itemName || `规格${it.itemId}`, itemId: it.itemId, price: it.price }))
    : [{ name: '标准版', itemId: undefined as number | undefined, price: product?.price ?? 0 }];
  const [selectedSku, setSelectedSku] = useState(skuOptions[0]?.name || '标准版');
  const [quantity, setQuantity] = useState(1);
  const [selectedStore, setSelectedStore] = useState('康养堂（南山科技园旗舰店）');
  const [selectedSlot, setSelectedSlot] = useState('10:00 - 11:00');
  const [dispatchMode, setDispatchMode] = useState<'platform_smart' | 'merchant_assign'>('platform_smart');

  if (!product) return null;

  const currentItem =
    skuOptions.find((s) => s.name === selectedSku) ||
    skuOptions.find((s) => s.itemId === product.items?.find((i) => i.isDefault)?.itemId) ||
    skuOptions[0];
  const activePrice = currentItem?.itemId ? currentItem.price : product.price;

  const isDoorstep = product.type === 'doorstepService';
  const isInStore = product.type === 'inStoreService';
  const isPhysical = product.type === 'product';

  const handleAddCart = () => {
    onAddToCart(product, currentItem?.name || selectedSku, quantity, activePrice, currentItem?.itemId);
  };

  const handleBuy = () => {
    onInstantBuy(product, currentItem?.name || selectedSku, quantity, activePrice, currentItem?.itemId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative max-w-[430px] w-full mx-auto">
        {/* Top Floating Close & Share */}
        <div className="absolute top-3 inset-x-3 z-20 flex justify-between items-center pointer-events-none">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center pointer-events-auto backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex gap-2 pointer-events-auto">
            <button
              onClick={() => alert('已收藏该商品')}
              className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Cover Hero Image */}
          <div className="relative h-60 bg-slate-100">
            <img
              src={product.coverImage}
              alt={product.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="p-4 space-y-3.5">
            {/* Price & Title */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-rose-600 font-mono">
                  ¥{product.price.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  ¥{product.originalPrice.toFixed(2)}
                </span>
                <span className="ml-auto text-[10px] text-slate-400">
                  月销 {product.salesCount}+ · 评分 {product.rating}
                </span>
              </div>

              <h2 className="text-sm font-extrabold text-slate-900 mt-1.5 leading-snug">
                {product.title}
              </h2>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {product.healthTags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[9px] bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 店铺信息与资质认证 (点击跳 P18/P19) */}
            <div
              onClick={onOpenStoreDetail}
              className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🏥</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">{product.store.name}</span>
                    {product.store.isVerified && (
                      <span className="bg-emerald-100 text-emerald-800 text-[8px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> 认证商家
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    综合评分 4.9 · 假一赔十 · 营业执照已核验
                  </p>
                </div>
              </div>
              <span className="text-xs text-teal-600 font-bold">进店/看资质 ›</span>
            </div>

            {/* 实物商品专属：智能硬件绑定引导 (P22) */}
            {isPhysical && product.hardwareBindingGuide && (
              <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-3 text-xs text-teal-950 space-y-1">
                <div className="font-bold flex items-center gap-1 text-teal-800">
                  <span>🔗 智能硬件同步健康档案 (MD-002)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {product.hardwareBindingGuide}
                </p>
              </div>
            )}

            {/* 到店服务专属：门店推荐与时段预约 (P23) */}
            {isInStore && (
              <div className="space-y-3 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs">
                <h4 className="font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>选择预约门店 (IS-007 就近推荐)</span>
                </h4>

                <div className="space-y-1.5">
                  {[
                    { name: '康养堂（南山科技园旗舰店）', dist: '1.2km', today: true },
                    { name: '国医堂（华侨城分店）', dist: '3.5km', today: true }
                  ].map((st, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedStore(st.name)}
                      className={`p-2.5 rounded-xl border flex justify-between items-center cursor-pointer ${
                        selectedStore === st.name
                          ? 'border-teal-500 bg-white shadow-2xs font-bold text-teal-900'
                          : 'border-slate-200 bg-white/60 text-slate-600'
                      }`}
                    >
                      <span>{st.name}</span>
                      <span className="text-[10px] text-slate-400">{st.dist}</span>
                    </div>
                  ))}
                </div>

                <h4 className="font-bold text-slate-800 flex items-center gap-1 pt-1">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>预约服务时段</span>
                </h4>
                <div className="grid grid-cols-2 gap-1.5 text-center text-xs">
                  {['10:00 - 11:00', '14:00 - 15:00', '16:00 - 17:00', '19:00 - 20:00'].map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-1.5 rounded-xl border ${
                        selectedSlot === slot
                          ? 'border-teal-500 bg-teal-50 text-teal-800 font-bold'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <div className="text-[10px] text-slate-500 leading-relaxed pt-1">
                  📋 到店流程：下单支付 → 生成专属核销码 → 凭码到店无需排队即刻服务。
                </div>
              </div>
            )}

            {/* 上门服务专属：双派单模式机制 (P24) */}
            {isDoorstep && (
              <div className="space-y-3 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-indigo-600" />
                  <span>滴滴式双派单服务模式 (OS-009~016)</span>
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => setDispatchMode('platform_smart')}
                    className={`p-2.5 rounded-xl border cursor-pointer ${
                      dispatchMode === 'platform_smart'
                        ? 'border-indigo-500 bg-indigo-50/60 font-bold text-indigo-950 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <span className="block text-xs">🚕 平台智能派单</span>
                    <span className="text-[9px] text-slate-400 font-normal mt-0.5 block">
                      参考滴滴模式，按距离+评分+负荷算法自动调度，60秒极速应答
                    </span>
                  </div>

                  <div
                    onClick={() => setDispatchMode('merchant_assign')}
                    className={`p-2.5 rounded-xl border cursor-pointer ${
                      dispatchMode === 'merchant_assign'
                        ? 'border-indigo-500 bg-indigo-50/60 font-bold text-indigo-950 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <span className="block text-xs">🏪 店家指定派单</span>
                    <span className="text-[9px] text-slate-400 font-normal mt-0.5 block">
                      由商家在店内指派专职当班护士上门服务
                    </span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[10px] text-slate-600 space-y-1">
                  <p>• <b>拒单机制</b>：服务人员因紧急情况可申请改派，系统将自动通知您并在30分钟内完成重新调度。</p>
                  <p>• <b>轨迹可视</b>：接单后可在订单中实时查看护士姓名、资质工号与到达距离。</p>
                </div>
              </div>
            )}

            {/* SKU 规格选择 */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-800">服务/商品规格</label>
              <div className="flex flex-wrap gap-2">
                {skuOptions.map((sku) => (
                  <button
                    key={sku.itemId ?? sku.name}
                    onClick={() => setSelectedSku(sku.name)}
                    className={`px-3 py-1.5 rounded-xl border ${
                      selectedSku === sku.name
                        ? 'border-teal-600 bg-teal-50 text-teal-800 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {sku.name}
                    {sku.price > 0 && sku.price !== product.price ? ` ¥${sku.price}` : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="p-3.5 border-t border-slate-100 bg-white flex items-center gap-2">
          {isPhysical && (
            <button
              onClick={handleAddCart}
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>加购物车</span>
            </button>
          )}

          <button
            onClick={handleBuy}
            className="flex-1 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/25 active:scale-95 transition-all flex items-center justify-center gap-1"
          >
            <span>{isPhysical ? '立即购买' : '立即预约服务'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
