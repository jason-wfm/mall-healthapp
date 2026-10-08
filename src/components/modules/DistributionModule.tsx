import React, { useState } from 'react';
import { Product } from '../../types';
import { MOCK_DISTRIBUTOR_PROFILE, MOCK_PRODUCTS } from '../../data/mockData';
import { 
  Share2, 
  Wallet, 
  TrendingUp, 
  Users, 
  Award, 
  Copy, 
  Check, 
  QrCode, 
  ChevronRight,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface Props {
  onOpenSharePoster: (title: string, desc: string, img: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const DistributionModule: React.FC<Props> = ({ onOpenSharePoster, onSelectProduct }) => {
  const [profile] = useState(MOCK_DISTRIBUTOR_PROFILE);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(profile.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pb-20 space-y-3">
      {/* Distributor Profile & Wallet Card */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white p-4 mx-3 mt-2 rounded-2xl shadow-lg shadow-emerald-900/20 relative overflow-hidden">
        {/* User Info Bar */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-300"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">{profile.name}</span>
                <span className="bg-amber-400 text-slate-900 font-extrabold text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <Award className="w-3 h-3" />
                  {profile.level}
                </span>
              </div>
              <div className="text-[11px] text-emerald-100 flex items-center gap-1.5 mt-0.5 font-mono">
                <span>邀请码: {profile.inviteCode}</span>
                <button
                  onClick={handleCopyCode}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="复制专属推广码"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-300" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            id="btn-gen-invite-poster"
            onClick={() =>
              onOpenSharePoster(
                '加入HealthShop合伙人，月入过万不是梦！',
                `我的专属邀请码：${profile.inviteCode}，注册即享新人百元券包`,
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
              )
            }
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs px-2.5 py-1.5 rounded-xl border border-white/20 active:scale-95 transition-all"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>推广海报</span>
          </button>
        </div>

        {/* Balance Overview */}
        <div className="mt-4 pt-3 border-t border-white/15 relative z-10">
          <div className="text-[11px] text-emerald-200">可提现佣金 (元)</div>
          <div className="flex items-baseline justify-between mt-0.5">
            <div className="text-2xl font-black font-mono tracking-tight text-white">
              ¥{profile.withdrawableIncome.toFixed(2)}
            </div>
            <button
              onClick={() => alert(`已提交提现申请 ¥${profile.withdrawableIncome.toFixed(2)}，将原路打入微信零钱`)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs px-3.5 py-1.5 rounded-lg active:scale-95 shadow-sm transition-all"
            >
              立即提现
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-white/10 text-[11px]">
            <div>
              <span className="text-emerald-200 block text-[10px]">累计总收益</span>
              <span className="font-bold text-white font-mono">
                ¥{profile.totalIncome.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-emerald-200 block text-[10px]">待结算佣金</span>
              <span className="font-bold text-white font-mono">
                ¥{profile.frozenIncome.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Performance Metric Cards */}
      <div className="px-3">
        <div className="grid grid-cols-4 gap-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-xs text-center">
          <div>
            <div className="text-slate-400 text-[10px]">团队成员</div>
            <div className="text-sm font-bold text-slate-800 font-mono mt-0.5">
              {profile.teamCount} 人
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">直属客户</div>
            <div className="text-sm font-bold text-slate-800 font-mono mt-0.5">
              {profile.directCustomers} 人
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">推广订单</div>
            <div className="text-sm font-bold text-slate-800 font-mono mt-0.5">
              {profile.orderCount} 笔
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">全国排名</div>
            <div className="text-sm font-bold text-emerald-600 font-mono mt-0.5">
              第 {profile.rank} 名
            </div>
          </div>
        </div>
      </div>

      {/* High Commission Products to Share (高佣爆款专区) */}
      <div className="px-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-xs">精选高佣金爆品 · 一键锁客</h3>
          </div>
          <span className="text-[10px] text-slate-400">成交立返</span>
        </div>

        <div className="space-y-2.5">
          {MOCK_PRODUCTS.filter((p) => p.distributionCommission).map((p) => (
            <div
              key={`dist-p-${p.id}`}
              onClick={() => onSelectProduct(p)}
              className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs flex gap-3 cursor-pointer hover:border-emerald-200 transition-colors"
            >
              <img
                src={p.coverImage}
                alt={p.title}
                className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {p.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-emerald-700 bg-emerald-50 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-emerald-500" />
                      预计赚 ¥{p.distributionCommission}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      佣金率 {p.distributionRatio}
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between mt-2 pt-1 border-t border-slate-50">
                  <span className="text-slate-900 font-bold text-xs">
                    售价 ¥{p.price}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSharePoster(
                        p.title,
                        `特惠好物推荐！原价 ¥${p.originalPrice}，现在下单仅需 ¥${p.price}`,
                        p.coverImage
                      );
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>立即推广</span>
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
