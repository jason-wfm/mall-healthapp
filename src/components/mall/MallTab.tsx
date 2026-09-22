import React, { useState } from 'react';
import { HealthProduct, PortalCity } from '../../types/health';
import { MOCK_HEALTH_PRODUCTS } from '../../data/healthMockData';
import { MapPin, Building2, Search, Zap, AlertTriangle, ShieldCheck, ShoppingCart, ChevronDown, Filter } from 'lucide-react';

interface Props {
  currentPortal: PortalCity;
  currentLocation: string;
  isLocationOutOfRange: boolean;
  onOpenPortalSelector: () => void;
  onOpenLocationSelector: () => void;
  onSelectProduct: (product: HealthProduct) => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  cartCount: number;
}

export const MallTab: React.FC<Props> = ({
  currentPortal,
  currentLocation,
  isLocationOutOfRange,
  onOpenPortalSelector,
  onOpenLocationSelector,
  onSelectProduct,
  onOpenSearch,
  onOpenCart,
  cartCount
}) => {
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'hardware' | 'food' | 'medical' | 'inStore' | 'doorstep'
  >('all');

  const categories = [
    { id: 'all', label: '全部门类' },
    { id: 'hardware', label: '智能硬件' },
    { id: 'food', label: '健康食品' },
    { id: 'medical', label: '医疗器械' },
    { id: 'inStore', label: '到店服务 📍' },
    { id: 'doorstep', label: '上门服务 📍' }
  ];

  // 过滤商品：如果定位超出范围，自动隐藏上门服务与到店服务（实物商品不受影响）
  const filteredProducts = MOCK_HEALTH_PRODUCTS.filter((p) => {
    if (isLocationOutOfRange && (p.type === 'inStoreService' || p.type === 'doorstepService')) {
      return false;
    }
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  return (
    <div className="pb-24 space-y-3 bg-slate-50/70 min-h-screen">
      {/* 顶部美团式定位与区域门户栏 (P17) */}
      <div className="bg-white px-3.5 pt-3 pb-2.5 border-b border-slate-100 sticky top-0 z-20 shadow-xs space-y-2">
        {/* Row 1: Location & Portal */}
        <div className="flex items-center justify-between text-xs">
          {/* Location Chip */}
          <button
            onClick={onOpenLocationSelector}
            className="flex items-center gap-1 text-slate-800 font-bold max-w-[200px] truncate hover:text-teal-700 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate text-xs">{currentLocation}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {/* Portal Chip */}
          <button
            onClick={onOpenPortalSelector}
            className="flex items-center gap-1 text-teal-700 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-full font-bold text-[10px] shrink-0"
          >
            <Building2 className="w-3 h-3 text-teal-600" />
            <span>{currentPortal}</span>
            <span className="text-[8px] text-teal-500">切换</span>
          </button>
        </div>

        {/* Row 2: Search Input */}
        <div
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-400 cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-[11px]">搜索血压计、降糖药膳、到店推拿、上门采血...</span>
        </div>
      </div>

      {/* 超距与跨区服务隐藏通知条 (P17 规范) */}
      {isLocationOutOfRange && (
        <div className="px-3">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5 text-amber-900 text-[10px] flex items-start gap-2 shadow-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <b>当前定位已切换至非本地</b>：按后台配置的规则，跨区/跨省时自动隐藏本地【到店服务】与【上门服务】；全国包邮健康实物商品正常提供。
            </div>
          </div>
        </div>
      )}

      {/* 优惠 Banner */}
      <div className="px-3">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-3 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[9px] bg-black/20 px-2 py-0.5 rounded-full font-bold">
              商城大促
            </span>
            <h3 className="font-black text-sm mt-1">全场满 300 减 50</h3>
            <p className="text-[10px] opacity-90 mt-0.5">会员叠加优惠券最高立省 ¥80</p>
          </div>
          <div className="text-3xl opacity-80 select-none">🎁</div>
        </div>
      </div>

      {/* 秒杀专区 (P17 限时秒杀) */}
      <div className="px-3">
        <div className="bg-white rounded-2xl border border-slate-100 p-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-rose-500 fill-rose-500" />
              <h4 className="font-black text-xs text-slate-800">限时秒杀 · 12:00 场</h4>
            </div>
            <span className="text-[10px] text-rose-600 font-mono font-bold bg-rose-50 px-1.5 py-0.2 rounded">
              01:24:18 结束
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2.5">
            {MOCK_HEALTH_PRODUCTS.slice(0, 3).map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="bg-slate-50/70 p-2 rounded-xl text-center cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="w-14 h-14 object-cover rounded-lg mx-auto bg-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div className="text-[10px] font-bold text-slate-800 truncate mt-1.5">
                  {p.title}
                </div>
                <div className="text-xs font-black text-rose-600 font-mono mt-0.5">
                  ¥{p.price}
                </div>
                <div className="text-[9px] text-slate-400 line-through">
                  ¥{p.originalPrice}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 分类切换 Tab */}
      <div className="px-3">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                activeCategory === c.id
                  ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 商品与服务列表 */}
      <div className="px-3 space-y-2.5">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs flex gap-3 cursor-pointer hover:border-teal-200 transition-all"
          >
            <img
              src={product.coverImage}
              alt={product.title}
              className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0"
              referrerPolicy="no-referrer"
            />

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                      product.type === 'doorstepService'
                        ? 'bg-indigo-100 text-indigo-700'
                        : product.type === 'inStoreService'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-teal-100 text-teal-700'
                    }`}
                  >
                    {product.type === 'doorstepService'
                      ? '上门服务'
                      : product.type === 'inStoreService'
                      ? '到店理疗'
                      : '实物商品'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {product.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 text-[9px] text-slate-400 mt-1">
                  <span>{product.store.name}</span>
                  {product.store.isVerified && (
                    <span className="text-teal-600 flex items-center font-bold">
                      <ShieldCheck className="w-3 h-3 inline" /> 认证
                    </span>
                  )}
                  <span>· 距离 {product.store.distanceKm}km</span>
                </div>

                <div className="flex flex-wrap gap-1 mt-1.5">
                  {product.healthTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-baseline justify-between mt-2 pt-1 border-t border-slate-100/60">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-black text-rose-600 font-mono">
                    ¥{product.price}
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">
                    ¥{product.originalPrice}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400">已售 {product.salesCount}+</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 悬浮购物车按钮 (P17) */}
      <button
        onClick={onOpenCart}
        className="fixed bottom-18 right-4 w-12 h-12 rounded-full bg-teal-600 text-white shadow-xl flex items-center justify-center active:scale-90 transition-transform z-30 border-2 border-white"
        title="打开购物车"
      >
        <ShoppingCart className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white font-mono">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
};
