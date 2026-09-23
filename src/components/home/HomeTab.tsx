import React, { useState, useEffect } from 'react';
import { HealthProfile, HealthArticle, PortalCity, HealthProduct } from '../../types/health';
import { MOCK_HEALTH_ARTICLES } from '../../data/healthMockData';
import { Search, ChevronRight, Handshake, Sparkles, BookOpen, Activity, Users, ShieldCheck, FileText, MapPin, Building2 } from 'lucide-react';

interface Props {
  profile: HealthProfile;
  onNavigateTab?: (tab: any) => void;
  onOpenConstitution: () => void;
  onOpenHealthProfile?: () => void;
  onOpenMedicalReport: () => void;
  onOpenFamilyCircle: () => void;
  onOpenFaceDiagnostic: () => void;
  onOpenMetricsEntry?: () => void;
  onOpenRecruit?: () => void;
  onOpenArticle?: (article: HealthArticle) => void;
  onOpenSearch: () => void;
  currentPortal?: PortalCity;
  currentLocation?: string;
  isLocationOutOfRange?: boolean;
  onOpenPortalSelector?: () => void;
  onOpenLocationSelector?: () => void;
  onOpenTongueDiagnostic?: () => void;
  onSelectProduct?: (product: HealthProduct) => void;
  onSwitchTab?: (tab: any) => void;
}

export const HomeTab: React.FC<Props> = ({
  profile,
  onNavigateTab,
  onOpenConstitution,
  onOpenHealthProfile,
  onOpenMedicalReport,
  onOpenFamilyCircle,
  onOpenFaceDiagnostic,
  onOpenMetricsEntry,
  onOpenRecruit,
  onOpenArticle,
  onOpenSearch,
  currentPortal = '深圳门户',
  currentLocation = '深圳市南山区科技园南路88号',
  isLocationOutOfRange = false,
  onOpenPortalSelector,
  onOpenLocationSelector,
  onOpenTongueDiagnostic,
  onSelectProduct,
  onSwitchTab
}) => {
  // 首页广告轮播
  const banners = [
    {
      tag: '全民健康节',
      title: '🎉 全民健康节 · 满300减50',
      subtitle: '会员叠加优惠券最高立省 ¥120 · 点击查看',
      gradient: 'from-teal-600 to-emerald-600',
      targetTab: 'mall'
    },
    {
      tag: '名医在线',
      title: '🧑‍⚕️ 三甲名医图文在线咨询',
      subtitle: '按您的阳虚体质精准匹配中医调理方案',
      gradient: 'from-cyan-600 to-teal-600',
      targetTab: 'services'
    },
    {
      tag: '健康体检',
      title: '🏥 年度健康体检 5 折起',
      subtitle: '家庭套餐加赠 AI 报告深度解读与专家随访',
      gradient: 'from-emerald-600 to-teal-700',
      targetTab: 'mall'
    }
  ];

  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIdx((prev) => (prev + 1) % banners.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="pb-20 space-y-3.5 bg-slate-50/60 min-h-full">
      {/* Search Header Bar */}
      <div className="bg-white px-4 pt-3 pb-2 border-b border-slate-100 sticky top-0 z-20 shadow-xs">
        <div
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-400 cursor-pointer hover:bg-slate-100 transition-colors"
        >
          <Search className="w-4 h-4 text-teal-600" />
          <span className="truncate">搜索健康商品 / 到店理疗 / 护士上门 / 健康知识</span>
        </div>
      </div>

      {/* Banner 轮播卡片 (每2.5秒轮播，带跳转) */}
      <div className="px-3">
        <div
          onClick={() => (onNavigateTab ? onNavigateTab(banners[currentBannerIdx].targetTab) : onSwitchTab?.(banners[currentBannerIdx].targetTab))}
          className={`relative rounded-2xl p-4 text-white overflow-hidden shadow-md cursor-pointer transition-all duration-300 bg-gradient-to-r ${banners[currentBannerIdx].gradient}`}
        >
          <div className="flex justify-between items-center text-[10px] opacity-85 mb-1">
            <span className="bg-black/25 px-2 py-0.5 rounded-full font-bold">
              {banners[currentBannerIdx].tag}
            </span>
            <span className="text-[9px]">每2秒自动轮播 ›</span>
          </div>

          <h3 className="font-extrabold text-sm tracking-wide mt-1">
            {banners[currentBannerIdx].title}
          </h3>
          <p className="text-[11px] opacity-90 mt-0.5">
            {banners[currentBannerIdx].subtitle}
          </p>

          <div className="flex justify-center gap-1.5 mt-3">
            {banners.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  currentBannerIdx === i ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 招募入口条 (对应原型 P1 平台入驻招募) */}
      <div className="px-3">
        <div
          onClick={onOpenRecruit}
          className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-3 flex items-center gap-3 cursor-pointer shadow-xs active:scale-98 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Handshake className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-amber-950 text-xs">平台入驻招募</h4>
              <span className="bg-amber-200 text-amber-900 text-[8px] font-bold px-1.5 py-0.2 rounded-full">
                现金券奖励
              </span>
            </div>
            <p className="text-[10px] text-amber-700 truncate mt-0.5">
              邀请商家入驻得 ¥200 券 / 服务人员得 ¥100 现金消费券
            </p>
          </div>
          <span className="text-amber-800 text-xs font-bold bg-white/90 border border-amber-300 px-2.5 py-1 rounded-xl shrink-0">
            入驻 ›
          </span>
        </div>
      </div>

      {/* 四大核心功能卡片 (对应原型 P1 功能宫格) */}
      <div className="px-3">
        <div className="grid grid-cols-2 gap-2.5">
          {/* 1. 中医体质辨识 */}
          <div
            onClick={onOpenConstitution}
            className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs hover:border-teal-200 cursor-pointer flex items-center gap-2.5 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg shrink-0">
              🧑‍⚕️
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">中医体质辨识</div>
              <div className="text-[9px] text-slate-400 mt-0.5">体质测评 · 9大体质判定</div>
            </div>
          </div>

          {/* 2. 健康档案 */}
          <div
            onClick={onOpenHealthProfile}
            className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs hover:border-teal-200 cursor-pointer flex items-center gap-2.5 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-lg shrink-0">
              📋
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">健康档案</div>
              <div className="text-[9px] text-slate-400 mt-0.5">评分 {profile.healthScore} · 趋势分析</div>
            </div>
          </div>

          {/* 3. 健康管理与体检报告 */}
          <div
            onClick={onOpenMedicalReport}
            className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs hover:border-teal-200 cursor-pointer flex items-center gap-2.5 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
              📊
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">健康管理</div>
              <div className="text-[9px] text-slate-400 mt-0.5">慢病监测 · 体检报告解读</div>
            </div>
          </div>

          {/* 4. 家庭健康空间 */}
          <div
            onClick={onOpenFamilyCircle}
            className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs hover:border-teal-200 cursor-pointer flex items-center gap-2.5 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg shrink-0">
              🏠
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">家庭空间</div>
              <div className="text-[9px] text-slate-400 mt-0.5">全家档案 · 共享购物车</div>
            </div>
          </div>
        </div>
      </div>

      {/* 快捷自测体验横幅：AI面诊 & 8项指标录入 */}
      <div className="px-3">
        <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 border border-teal-200/80 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">😊</span>
            <div>
              <div className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                <span>AI 观气色面诊</span>
                <span className="bg-teal-600 text-white text-[8px] px-1 rounded-md font-semibold">
                  智能诊断
                </span>
              </div>
              <div className="text-[9px] text-teal-700 mt-0.5">
                正对镜头拍面部，智能分析面色唇色与气血倾向
              </div>
            </div>
          </div>
          <button
            onClick={onOpenFaceDiagnostic}
            className="bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shrink-0 shadow-xs"
          >
            去测试
          </button>
        </div>
      </div>

      {/* 健康资讯精选 (对应原型 P1 健康资讯模块，体质个性化推荐) */}
      <div className="px-3">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-slate-800 text-xs">健康资讯精选</h3>
            </div>
            <span
              onClick={() => (onNavigateTab ? onNavigateTab('mall') : onSwitchTab?.('mall'))}
              className="text-[10px] text-teal-600 cursor-pointer flex items-center font-medium"
            >
              全部资讯
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {MOCK_HEALTH_ARTICLES.map((article) => (
              <div
                key={article.id}
                onClick={() => onOpenArticle?.(article)}
                className="p-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-lg shrink-0">
                  {article.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 leading-snug">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[9px] text-slate-400 mt-1">
                    <span>{article.category}</span>
                    <span>·</span>
                    <span>{article.readCount} 阅读</span>
                    {article.recommendForConstitution && (
                      <span className="bg-amber-100 text-amber-700 font-bold px-1.5 py-0.2 rounded-md">
                        按您的体质推荐
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            onClick={() => (onNavigateTab ? onNavigateTab('mall') : onSwitchTab?.('mall'))}
            className="p-2.5 text-center text-[10px] text-teal-600 font-bold border-t border-slate-100 bg-slate-50/50 cursor-pointer"
          >
            查看更多健康与慢病科普 ›
          </div>
        </div>
      </div>
    </div>
  );
};
