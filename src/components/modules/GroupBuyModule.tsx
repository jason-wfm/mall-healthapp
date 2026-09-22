import React, { useState } from 'react';
import { Product, GroupTeam } from '../../types';
import { MOCK_PRODUCTS, MOCK_GROUP_TEAMS } from '../../data/mockData';
import { Users, Clock, Flame, ChevronRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface Props {
  onSelectProduct: (product: Product, defaultMode?: 'normal' | 'group' | 'bargain' | 'seckill') => void;
  onJoinTeam: (team: GroupTeam) => void;
}

export const GroupBuyModule: React.FC<Props> = ({ onSelectProduct, onJoinTeam }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'hot' | 'super'>('all');
  const groupProducts = MOCK_PRODUCTS.filter((p) => p.isGroupBuy);

  return (
    <div className="pb-20 space-y-3">
      {/* Group Buy Hero Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white p-4 mx-3 mt-2 rounded-2xl shadow-md shadow-rose-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-xs text-rose-100 font-semibold mb-1">
            <Users className="w-4 h-4" />
            <span>拼团裂变中心 · 拼着买更划算</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">呼朋唤友 · 两人即成团</h2>
          <p className="text-xs text-rose-100/90 mt-1">
            官方正品直供 · 成团秒发 · 24小时未满全额自动退款
          </p>

          <div className="flex items-center gap-3 mt-3 pt-2 border-t border-white/20 text-[10px] text-white/90">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-300" /> 满人立即发货
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-300" /> 未满自动退款
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-300" /> 团长专享特权
            </span>
          </div>
        </div>
      </div>

      {/* Active High-Priority Teams waiting for members (正在拼单中的队伍，差1人即可成团) */}
      <div className="px-3">
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-600 fill-rose-500" />
              <h3 className="font-bold text-slate-800 text-xs">正在成团中 · 差1人即享超低价</h3>
            </div>
            <span className="text-[10px] text-slate-400">实时滚动的拼团中队伍</span>
          </div>

          <div className="space-y-2.5">
            {MOCK_GROUP_TEAMS.map((team) => {
              const diff = team.requiredCount - team.currentCount;
              return (
                <div
                  key={team.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/50 border border-rose-100/70 hover:bg-rose-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={team.leader.avatar}
                      alt={team.leader.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-400"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800">
                          {team.leader.name}
                        </span>
                        <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.2 rounded-full font-medium">
                          团长
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[130px]">
                        {team.productTitle}
                      </div>
                      <div className="text-[10px] text-rose-600 font-semibold">
                        拼团价 ¥{team.groupPrice}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-[10px] text-rose-600 font-bold">
                        还差 <span className="text-xs text-rose-700">{diff}</span> 人
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono">
                        剩余 42:15
                      </div>
                    </div>
                    <button
                      id={`btn-join-team-${team.id}`}
                      onClick={() => onJoinTeam(team)}
                      className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-95 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm shadow-rose-500/30 transition-all"
                    >
                      去拼单
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Group Buying Products Catalog */}
      <div className="px-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-800 text-xs">精选拼团特惠榜</h3>
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-slate-400">全国包邮</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {groupProducts.map((p) => (
            <div
              key={`group-list-${p.id}`}
              onClick={() => onSelectProduct(p, 'group')}
              className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs flex gap-3 cursor-pointer active:scale-[0.99] transition-all hover:shadow-md"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-1 left-1 bg-rose-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                  {p.groupRequiredUsers}人团
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {p.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {p.subTitle}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[9px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded font-medium">
                      立省 ¥{p.price - (p.groupPrice || 0)}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      已成团 {p.groupActiveCount} 次
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between mt-2 pt-1 border-t border-slate-50">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-rose-600 font-extrabold text-sm">
                      ¥{p.groupPrice}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      单买 ¥{p.price}
                    </span>
                  </div>

                  <button className="bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-semibold px-3 py-1 rounded-lg">
                    发起拼团
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
