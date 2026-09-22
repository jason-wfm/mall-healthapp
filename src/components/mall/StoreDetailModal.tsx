import React, { useState } from 'react';
import { X, ShieldCheck, Award, Building2, CheckCircle2, AlertTriangle, Phone, ShoppingBag } from 'lucide-react';
import { MOCK_HEALTH_PRODUCTS } from '../../data/healthMockData';
import { HealthProduct } from '../../types/health';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: HealthProduct) => void;
}

export const StoreDetailModal: React.FC<Props> = ({ isOpen, onClose, onSelectProduct }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'services' | 'qualifications'>('all');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative max-w-[430px] w-full mx-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-teal-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-2xl border border-white/20">
              🏥
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm">康养堂健康旗舰店</h3>
                <span className="bg-emerald-400/30 border border-emerald-300/50 text-emerald-200 text-[8px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" /> 认证商家
                </span>
              </div>
              <p className="text-[10px] text-teal-100 mt-0.5">
                ⭐ 4.9 分 · 已稳定入驻 2 年 · 粉丝 2.3w
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats strip */}
        <div className="bg-teal-900 text-teal-100 px-4 py-2 flex justify-around text-center text-[10px] border-t border-white/10">
          <div>
            <span className="block font-bold text-white text-xs">126</span>
            <span>在售商品</span>
          </div>
          <div>
            <span className="block font-bold text-white text-xs">8</span>
            <span>健康服务</span>
          </div>
          <div>
            <span className="block font-bold text-white text-xs">¥50,000</span>
            <span>已缴保证金</span>
          </div>
          <div>
            <span className="block font-bold text-white text-xs">100%</span>
            <span>正品假一赔十</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-white text-xs font-bold text-slate-500">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-all ${
              activeTab === 'all'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent hover:text-slate-700'
            }`}
          >
            全部商品
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-all ${
              activeTab === 'services'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent hover:text-slate-700'
            }`}
          >
            健康服务专区
          </button>
          <button
            onClick={() => setActiveTab('qualifications')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-all ${
              activeTab === 'qualifications'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent hover:text-slate-700'
            }`}
          >
            商家资质与承诺 (P19)
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-3">
          {activeTab === 'qualifications' ? (
            /* 资质介绍 (P19) */
            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <span>企业工商主体信息</span>
                </h4>
                <div className="space-y-1 text-slate-600 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">企业主体</span>
                    <span className="font-medium">康养堂健康产业发展 (深圳) 有限公司</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">统一信用代码</span>
                    <span className="font-mono font-medium">91440300MA5EX7890X</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">营业执照核验</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 已通过工商网签核验
                    </span>
                  </div>
                </div>
              </div>

              {/* 行业特许资质 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-teal-600" />
                  <span>特许医疗与食品经营资质 (ST-002)</span>
                </h4>
                <div className="space-y-1.5 text-[11px] text-slate-700">
                  <div className="p-2 bg-white rounded-xl border border-slate-100 flex justify-between items-center">
                    <span>🩺 第二类医疗器械经营备案凭证</span>
                    <span className="text-emerald-600 font-bold">已备案有效</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-100 flex justify-between items-center">
                    <span>🍎 食品经营许可证 (含保健食品)</span>
                    <span className="text-emerald-600 font-bold">已许可有效</span>
                  </div>
                </div>
              </div>

              {/* 商家承诺 */}
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3 text-[10px] text-amber-900 space-y-1 leading-relaxed">
                <div className="font-bold text-xs flex items-center gap-1">
                  <span>🛡️ 消费者权益保障与承诺 (ST-004)</span>
                </div>
                <p>• 假一赔十：本店全量上架商品均投保正品保证险。</p>
                <p>• 七天无理由退换：实物完好未拆封支持 7 天无理由原路退款退货。</p>
                <p>• 履约保证金：已向平台足额缴纳 ¥50,000 元消费者先行赔付保障金。</p>
              </div>

              <div className="text-center pt-1">
                <button
                  onClick={() => alert('已跳转至平台消费者举报维权通道')}
                  className="text-[10px] text-slate-400 hover:text-rose-600 underline"
                >
                  如发现资质信息与实物不符？点击发起核查举报
                </button>
              </div>
            </div>
          ) : (
            /* 商品/服务列表展示 */
            <div className="space-y-2.5">
              {MOCK_HEALTH_PRODUCTS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(p);
                  }}
                  className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex gap-3 cursor-pointer hover:border-teal-300 transition-colors"
                >
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 truncate">{p.title}</h4>
                      <div className="text-[10px] text-slate-400 mt-0.5">月销 {p.salesCount}+</div>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-black text-rose-600 font-mono">¥{p.price}</span>
                      <span className="text-[10px] text-teal-600 font-bold">查看详情 ›</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
