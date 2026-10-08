import React, { useState, useEffect } from 'react';
import { Product, ActiveTab } from '../../types';
import { MOCK_PRODUCTS } from '../../data/mockData';
import { 
  Users, 
  Flame, 
  Share2, 
  Zap, 
  Search, 
  ChevronRight, 
  Sparkles, 
  ShoppingBag, 
  HeartHandshake,
  Clock
} from 'lucide-react';

interface Props {
  onSelectProduct: (product: Product, defaultMode?: 'normal' | 'group' | 'bargain' | 'seckill') => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const HomeView: React.FC<Props> = ({ onSelectProduct, onNavigateTab }) => {
  const [bulletIndex, setBulletIndex] = useState(0);

  const bulletNotifs = [
    '用户【林夕月】刚刚拼团成功，立省 ¥110.00！',
    '用户【王小奔】通过好友助力，空气炸锅成功砍至 0 元！',
    '分销商【晨风】刚刚赚取推广佣金 ¥48.50！',
    '用户【苏小糖】参与 14:00 场秒杀，法压壶仅花费 ¥49.9！'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setBulletIndex((prev) => (prev + 1) % bulletNotifs.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [bulletNotifs.length]);

  return (
    <div className="pb-20 space-y-3">
      {/* Top Search & Notice Bar */}
      <div className="bg-white px-3.5 pt-2.5 pb-2 border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1.5 text-slate-400 text-xs">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">搜索拼团好物、0元砍价、限时秒杀...</span>
        </div>
      </div>

      {/* Social Live Notification Ticker */}
      <div className="px-3">
        <div className="bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-100/80 rounded-full px-3 py-1 flex items-center gap-2 text-[11px] text-rose-800 shadow-xs">
          <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
          <span className="font-semibold text-rose-600 shrink-0">实时动态</span>
          <span className="truncate transition-all duration-300">
            {bulletNotifs[bulletIndex]}
          </span>
        </div>
      </div>

      {/* Promotional Hero Banner */}
      <div className="px-3">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 text-white p-4 shadow-lg shadow-rose-500/15">
          <div className="relative z-10 space-y-1">
            <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-semibold">
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>HealthShop 社交电商裂变节</span>
            </div>
            <h2 className="text-lg font-black tracking-tight leading-tight">
              拼着买更便宜 · 砍到底价0元拿
            </h2>
            <p className="text-xs text-white/90">
              好友助力无上限 / 分销返佣高达20% / 限时万人秒杀
            </p>
          </div>
          {/* Subtle graphic decorations */}
          <div className="absolute -right-4 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="absolute right-3 top-3 opacity-20">
            <HeartHandshake className="w-20 h-20 text-white" />
          </div>
        </div>
      </div>

      {/* 4 King Kong Social Portals (四大金刚社交功能入口) */}
      <div className="px-3">
        <div className="grid grid-cols-4 gap-2 bg-white p-3 rounded-2xl shadow-xs border border-slate-100 text-center">
          {/* 1. 拼团 */}
          <button
            onClick={() => onNavigateTab('group')}
            className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">拼团专区</span>
            <span className="text-[9px] text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full font-medium">
              2人成团
            </span>
          </button>

          {/* 2. 砍价 */}
          <button
            onClick={() => onNavigateTab('bargain')}
            className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">砍价0元</span>
            <span className="text-[9px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full font-medium">
              好友助力
            </span>
          </button>

          {/* 3. 秒杀 */}
          <button
            onClick={() => onNavigateTab('seckill')}
            className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">限时秒杀</span>
            <span className="text-[9px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full font-medium">
              14:00开抢
            </span>
          </button>

          {/* 4. 分销 */}
          <button
            onClick={() => onNavigateTab('distribution')}
            className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">分销中心</span>
            <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium">
              赚高佣金
            </span>
          </button>
        </div>
      </div>

      {/* Flash Seckill Strip Card */}
      <div className="px-3">
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-red-600 font-extrabold text-sm">
                <Zap className="w-4 h-4 fill-red-600" />
                <span>限时狂欢秒杀</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                <Clock className="w-3 h-3 text-red-500" />
                <span>距结束 01:28:45</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('seckill')}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center"
            >
              <span>更多</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Horizontal scroll cards */}
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {MOCK_PRODUCTS.filter((p) => p.isSeckill).map((p) => (
              <div
                key={`seckill-home-${p.id}`}
                onClick={() => onSelectProduct(p, 'seckill')}
                className="w-28 shrink-0 bg-slate-50 rounded-xl p-2 cursor-pointer border border-slate-100 hover:border-red-200 transition-colors"
              >
                <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-200 mb-1.5 relative">
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-1 left-1 bg-red-600 text-white text-[8px] font-bold px-1 py-0.5 rounded">
                    已抢{p.seckillSoldPercent}%
                  </span>
                </div>
                <div className="text-[11px] font-medium text-slate-800 line-clamp-1">
                  {p.title}
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-red-600 font-bold text-xs">
                    ¥{p.seckillPrice}
                  </span>
                  <span className="text-[9px] text-slate-400 line-through">
                    ¥{p.originalPrice}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dual Column Social Feed List */}
      <div className="px-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-rose-500" />
            <h3 className="font-bold text-slate-800 text-sm">精选社交爆款</h3>
          </div>
          <span className="text-[10px] text-slate-400">拼团 / 砍价 / 返佣</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {MOCK_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-100 flex flex-col cursor-pointer active:scale-[0.98] transition-all hover:shadow-md"
            >
              <div className="w-full h-36 bg-slate-100 relative overflow-hidden">
                <img
                  src={prod.coverImage}
                  alt={prod.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {prod.isGroupBuy && (
                  <span className="absolute top-2 left-2 bg-gradient-to-r from-rose-600 to-pink-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                    {prod.groupRequiredUsers}人拼团
                  </span>
                )}
                {prod.isBargain && !prod.isGroupBuy && (
                  <span className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                    可砍至¥{prod.bargainFloorPrice}
                  </span>
                )}
              </div>

              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug">
                    {prod.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {prod.subTitle}
                  </p>
                </div>

                <div className="mt-2 pt-1 border-t border-slate-50 flex items-end justify-between">
                  <div>
                    {prod.isGroupBuy ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-rose-600 font-extrabold text-sm">
                          ¥{prod.groupPrice}
                        </span>
                        <span className="text-[9px] text-slate-400 line-through">
                          ¥{prod.price}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-slate-900 font-extrabold text-sm">
                          ¥{prod.price}
                        </span>
                        <span className="text-[9px] text-slate-400 line-through">
                          ¥{prod.originalPrice}
                        </span>
                      </div>
                    )}
                    <span className="text-[9px] text-slate-400">已拼{prod.salesCount}件</span>
                  </div>

                  <div className="bg-rose-50 text-rose-600 text-[10px] font-semibold px-2 py-1 rounded-lg">
                    {prod.isGroupBuy ? '去开团' : prod.isBargain ? '去砍价' : '抢购'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
