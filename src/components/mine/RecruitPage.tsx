import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Handshake, Gift, ClipboardList, Share2, Store, Stethoscope } from 'lucide-react';
import { apiGetRecruitConfig } from '../../services/merchantApi';
import type { RecruitConfig } from '../../types/merchant';

interface Props {
  onBack: () => void;
  onEnterApply: () => void;
}

/**
 * [healthmall-ext] H5 页面化（RC-招募）：平台入驻招募详情页
 * 内容来自 GET /front/merchant/recruit/config（RJ-001），失败回退内置默认（对齐原型 P47 文案）
 */
export const RecruitPage: React.FC<Props> = ({ onBack, onEnterApply }) => {
  const [config, setConfig] = useState<RecruitConfig | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    apiGetRecruitConfig()
      .then((res) => setConfig(res.data))
      .catch(() => setConfig(null)); // 兜底：渲染内置占位
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const cfg: RecruitConfig = config
    ? config
    : {
        hero: { title: '平台入驻招募', subtitle: '共建家庭健康生态 · 邀请入驻得现金消费券' },
        roles: [],
        reward_rules: [],
        flow_steps: [],
        entry_bar: { title: '平台入驻招募', subtitle: '邀请入驻得现金消费券 · 详情见招募页' }
      };

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-slate-50/70 text-slate-800 pb-20">
      {/* 导航栏 */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-teal-800 to-slate-900 text-white px-3 py-3 flex items-center gap-2">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-white/10">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="font-bold text-sm">平台入驻招募</span>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white px-4 pb-6 pt-2">
        <div className="flex items-center gap-2 font-extrabold text-lg">
          <Handshake className="w-5 h-5 text-amber-300" />
          {cfg.hero?.title}
        </div>
        <p className="text-[11px] text-teal-100 mt-1">{cfg.hero?.subtitle}</p>
      </div>

      {/* 身份权益卡 */}
      <div className="px-3 -mt-3 space-y-3">
        {(cfg.roles || []).map((role) =>
          role.enabled ? (
            <button
              key={role.type}
              onClick={role.type === 'MERCHANT' ? onEnterApply : () => showToast('服务人员入驻二期开放，敬请期待')}
              className={`w-full text-left bg-white rounded-2xl border border-slate-100 shadow-xs p-4 ${
                role.type === 'MERCHANT' ? 'hover:border-teal-300 cursor-pointer' : 'opacity-90 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-extrabold text-sm">
                  {role.type === 'MERCHANT' ? (
                    <Store className="w-4 h-4 text-teal-700" />
                  ) : (
                    <Stethoscope className="w-4 h-4 text-indigo-600" />
                  )}
                  {role.title}
                </div>
                <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {role.coupon}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {(role.benefits || []).map((b) => (
                  <span key={b} className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full">
                    {b}
                  </span>
                ))}
              </div>
            </button>
          ) : (
            <div
              key={role.type}
              onClick={() => showToast('服务人员入驻二期开放，敬请期待')}
              className="w-full text-left bg-white/70 rounded-2xl border border-dashed border-slate-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-500">
                  <Stethoscope className="w-4 h-4 text-slate-400" />
                  {role.title}
                </div>
                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {role.coupon} · 二期
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {(role.benefits || []).map((b) => (
                  <span key={b} className="text-[10px] bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )
        )}

        {/* 邀请奖励规则 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4">
          <div className="flex items-center gap-1.5 font-extrabold text-sm mb-2">
            <Gift className="w-4 h-4 text-rose-500" /> 邀请奖励规则
          </div>
          <ol className="space-y-1.5">
            {(cfg.reward_rules || []).map((rule, index) => (
              <li key={index} className="text-[11px] text-slate-600 leading-relaxed flex gap-1.5">
                <span className="text-rose-500 font-black shrink-0">{['①', '②', '③', '④'][index] || '·'}</span>
                {rule}
              </li>
            ))}
          </ol>
        </div>

        {/* 入驻流程 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4">
          <div className="flex items-center gap-1.5 font-extrabold text-sm mb-3">
            <ClipboardList className="w-4 h-4 text-teal-700" /> 入驻流程
          </div>
          <ol className="space-y-0">
            {(cfg.flow_steps || []).map((step, index) => (
              <li key={index} className="flex gap-2.5">
                <div className="flex flex-col items-center">
                  <span className="w-5 h-5 rounded-full bg-teal-700 text-white text-[10px] font-black flex items-center justify-center">
                    {index + 1}
                  </span>
                  {index < (cfg.flow_steps?.length || 0) - 1 && <span className="w-0.5 flex-1 bg-teal-200 my-0.5" />}
                </div>
                <p className="text-[11px] text-slate-700 font-medium pb-3">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* 底部固定操作条 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur border-t border-slate-100 px-4 py-3 flex gap-2 z-20">
        <button
          onClick={() => showToast('招募海报已生成（分享功能二期开放）')}
          className="flex-1 py-2.5 rounded-xl border border-teal-700 text-teal-800 text-sm font-bold flex items-center justify-center gap-1.5"
        >
          <Share2 className="w-4 h-4" /> 分享招募海报
        </button>
        <button
          onClick={onEnterApply}
          className="flex-1 py-2.5 rounded-xl bg-teal-700 text-white text-sm font-bold flex items-center justify-center gap-1.5"
        >
          立即入驻 <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-teal-950/95 text-white text-xs font-bold px-4 py-2 rounded-xl z-30">
          {toast}
        </div>
      )}
    </div>
  );
};
