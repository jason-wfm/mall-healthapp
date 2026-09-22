import React, { useState } from 'react';
import { Product, BargainItem } from '../../types';
import { MOCK_BARGAIN_ITEMS, MOCK_PRODUCTS } from '../../data/mockData';
import { Flame, Sparkles, Share2, Users, CheckCircle2, Gift, Sword } from 'lucide-react';

interface Props {
  onSelectProduct: (product: Product, defaultMode?: 'normal' | 'group' | 'bargain' | 'seckill') => void;
  onOpenSharePoster: (title: string, desc: string, img: string) => void;
}

export const BargainModule: React.FC<Props> = ({ onSelectProduct, onOpenSharePoster }) => {
  const [bargainItem, setBargainItem] = useState<BargainItem>(MOCK_BARGAIN_ITEMS[0]);
  const [slashAnimation, setSlashAnimation] = useState<number | null>(null);
  const [hasSelfSlashed, setHasSelfSlashed] = useState(false);

  // Calculate percentage of progress
  const totalDifference = bargainItem.originalPrice - bargainItem.floorPrice;
  const progressPercent = Math.min(
    100,
    Math.round((bargainItem.slashedAmount / totalDifference) * 100)
  );

  // User slashes price or simulates friend slash
  const handleSlash = () => {
    if (bargainItem.currentPrice <= bargainItem.floorPrice) return;

    // Random slash amount between 3.5 and 12.8
    const slashValue = parseFloat((Math.random() * 9 + 3.8).toFixed(2));
    const newPrice = Math.max(bargainItem.floorPrice, parseFloat((bargainItem.currentPrice - slashValue).toFixed(2)));
    const actualCut = parseFloat((bargainItem.currentPrice - newPrice).toFixed(2));

    setSlashAnimation(actualCut);
    setHasSelfSlashed(true);

    setTimeout(() => {
      setSlashAnimation(null);
    }, 1800);

    const newHelper = {
      id: `h-sim-${Date.now()}`,
      name: hasSelfSlashed ? '微信好友【陈晨】' : '我（自砍一刀）',
      avatar: hasSelfSlashed
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      amount: actualCut,
      time: '刚刚',
      comment: hasSelfSlashed ? '好兄弟快0元拿了，祝一臂之力！' : '手气爆棚，直接暴击砍下一大块！'
    };

    setBargainItem((prev) => ({
      ...prev,
      currentPrice: newPrice,
      slashedAmount: parseFloat((prev.slashedAmount + actualCut).toFixed(2)),
      helpers: [newHelper, ...prev.helpers]
    }));
  };

  return (
    <div className="pb-20 space-y-3">
      {/* Bargain Header Hero */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-4 mx-3 mt-2 rounded-2xl shadow-md shadow-orange-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-xs text-orange-100 font-semibold mb-1">
            <Flame className="w-4 h-4 fill-orange-200" />
            <span>砍价免费拿 · 社交裂变助力</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">邀请好友帮忙 · 砍到0元包邮拿</h2>
          <p className="text-xs text-orange-100/90 mt-1">
            无套路无套证 · 人人可助力 · 进度百分百即刻发货
          </p>
        </div>
      </div>

      {/* Active Bargaining Project Card with Progress Bar */}
      <div className="px-3">
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm relative overflow-hidden">
          {/* Animated Slash Floating Badge */}
          {slashAnimation !== null && (
            <div className="absolute inset-0 bg-orange-500/20 backdrop-blur-xs flex items-center justify-center z-30 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex flex-col items-center animate-bounce">
                <span className="text-xs font-bold flex items-center gap-1">
                  <Sword className="w-4 h-4" /> 暴击狂砍！
                </span>
                <span className="text-2xl font-black">-¥{slashAnimation.toFixed(2)}</span>
                <span className="text-[10px] text-orange-100">已直接从当前价扣除</span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <img
              src={bargainItem.productImage}
              alt={bargainItem.productTitle}
              className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold">
                正在进行中
              </span>
              <h3 className="text-xs font-bold text-slate-800 line-clamp-1 mt-1">
                {bargainItem.productTitle}
              </h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xs text-slate-500">
                  当前价: <strong className="text-orange-600 text-sm">¥{bargainItem.currentPrice}</strong>
                </span>
                <span className="text-[10px] text-slate-400">
                  底价: ¥{bargainItem.floorPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3.5 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold">
              <span className="text-slate-600">已砍 ¥{bargainItem.slashedAmount}</span>
              <span className="text-orange-600 font-bold">{progressPercent}% 进度</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full transition-all duration-500 shadow-sm"
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>原价 ¥{bargainItem.originalPrice}</span>
              <span>仅差 ¥{(bargainItem.currentPrice - bargainItem.floorPrice).toFixed(2)} 即成功</span>
            </div>
          </div>

          {/* Action Buttons: Slash & Share */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              id="btn-self-slash"
              onClick={handleSlash}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-md shadow-orange-500/25 flex items-center justify-center gap-1.5 transition-all"
            >
              <Sword className="w-4 h-4" />
              <span>{hasSelfSlashed ? '再砍一刀(模拟)' : '我先砍一刀'}</span>
            </button>

            <button
              id="btn-share-bargain"
              onClick={() =>
                onOpenSharePoster(
                  `差你一刀就0元啦！帮我砍【${bargainItem.productTitle}】`,
                  '每位好友可随机砍掉 5-30 元，快来搭把手吧！',
                  bargainItem.productImage
                )
              }
              className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 active:scale-95 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-md shadow-red-500/25 flex items-center justify-center gap-1.5 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>喊好友帮砍</span>
            </button>
          </div>
        </div>
      </div>

      {/* Helper Records Flow (帮砍助力榜) */}
      <div className="px-3">
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1 text-slate-800 font-bold text-xs">
              <Users className="w-4 h-4 text-orange-500" />
              <span>亲友帮砍团 ({bargainItem.helpers.length}人已助力)</span>
            </div>
            <span className="text-[10px] text-orange-600 font-medium">累计砍掉 ¥{bargainItem.slashedAmount}</span>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto no-scrollbar">
            {bargainItem.helpers.map((h) => (
              <div key={h.id} className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center gap-2">
                  <img
                    src={h.avatar}
                    alt={h.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="font-semibold text-slate-800 text-[11px]">{h.name}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{h.comment}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-orange-600 font-bold text-xs">
                    -¥{h.amount.toFixed(2)}
                  </div>
                  <div className="text-[9px] text-slate-400">{h.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Other Items Available for 0-Yuan Bargaining */}
      <div className="px-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-800 text-xs">更多 0 元砍好物</h3>
          <span className="text-[10px] text-slate-400">已成功领取 18,290 件</span>
        </div>

        <div className="space-y-2">
          {MOCK_PRODUCTS.filter((p) => p.isBargain && p.id !== bargainItem.productId).map((p) => (
            <div
              key={`bg-list-${p.id}`}
              onClick={() => onSelectProduct(p, 'bargain')}
              className="bg-white p-2.5 rounded-2xl border border-slate-100 flex items-center gap-3 cursor-pointer hover:border-orange-200 transition-colors"
            >
              <img
                src={p.coverImage}
                alt={p.title}
                className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                  {p.title}
                </h4>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  原价: ¥{p.originalPrice}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-orange-600 font-bold text-xs">
                    底价 ¥{p.bargainFloorPrice}
                  </span>
                  <button className="bg-orange-50 text-orange-600 border border-orange-200 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                    发起砍价
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
