import React, { useState } from 'react';
import { HealthProduct } from '../../types/health';
import { MOCK_HEALTH_PRODUCTS } from '../../data/healthMockData';
import { MapPin, ShieldCheck, Clock, Phone, Sparkles, Navigation } from 'lucide-react';

interface Props {
  currentLocation: string;
  isLocationOutOfRange: boolean;
  onOpenLocationSelector: () => void;
  onSelectProduct: (product: HealthProduct) => void;
  onOpenFaceDiagnostic: () => void;
  onOpenConstitution: () => void;
}

export const ServicesTab: React.FC<Props> = ({
  currentLocation,
  isLocationOutOfRange,
  onOpenLocationSelector,
  onSelectProduct,
  onOpenFaceDiagnostic,
  onOpenConstitution
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'doorstep' | 'inStore' | 'ai'>('all');

  const serviceItems = MOCK_HEALTH_PRODUCTS.filter((p) => p.type !== 'product');

  return (
    <div className="pb-24 space-y-3 bg-slate-50/70 min-h-screen">
      {/* 顶部定位与服务保障 */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <div>
          <span className="text-[10px] text-teal-700 font-bold block">健康管理与医护服务</span>
          <button
            onClick={onOpenLocationSelector}
            className="flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-teal-700"
          >
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span className="truncate max-w-[200px]">{currentLocation}</span>
          </button>
        </div>
        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> 100%持证医护
        </span>
      </div>

      {/* AI 自查专区 Banner */}
      <div className="px-3">
        <div className="bg-gradient-to-r from-teal-700 to-indigo-700 text-white rounded-2xl p-3.5 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
              AI 中医智能工坊
            </span>
            <h3 className="font-extrabold text-sm mt-1">面诊 · 舌诊 · 九大体质辨识</h3>
            <p className="text-[10px] text-teal-100 mt-0.5">多模态望诊算法，精准判定气血寒热虚实</p>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={onOpenFaceDiagnostic}
              className="bg-white text-teal-900 font-bold text-xs px-2.5 py-1.5 rounded-xl shadow-xs"
            >
              📷 AI面诊
            </button>
            <button
              onClick={onOpenConstitution}
              className="bg-amber-400 text-amber-950 font-bold text-xs px-2.5 py-1.5 rounded-xl shadow-xs"
            >
              🌿 体质
            </button>
          </div>
        </div>
      </div>

      {/* 服务类型选项卡 */}
      <div className="px-3">
        <div className="flex bg-white rounded-2xl p-1 border border-slate-100 text-xs font-bold text-slate-500">
          {[
            { id: 'all', label: '全部服务' },
            { id: 'doorstep', label: '上门护士 🚕' },
            { id: 'inStore', label: '到店推拿 📍' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex-1 py-1.5 rounded-xl text-center transition-all ${
                activeSubTab === tab.id
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 服务清单 */}
      <div className="px-3 space-y-2.5">
        {serviceItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectProduct(item)}
            className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex gap-3 cursor-pointer hover:border-teal-300 transition-all"
          >
            <img
              src={item.coverImage}
              alt={item.title}
              className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0"
              referrerPolicy="no-referrer"
            />

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                      item.type === 'doorstepService'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {item.type === 'doorstepService' ? '上门服务' : '到店体验'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                </div>

                <p className="text-[10px] text-slate-400 mt-1 truncate">
                  {item.store.name} · 距离 {item.store.distanceKm}km
                </p>

                <div className="flex flex-wrap gap-1 mt-1.5">
                  {item.healthTags.map((tag, idx) => (
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
                <span className="text-sm font-black text-rose-600 font-mono">
                  ¥{item.price.toFixed(2)}
                </span>
                <span className="text-[10px] text-teal-700 font-bold">预约服务 ›</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 合作实体驿站与门店 */}
      <div className="px-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-2">
          <div className="text-xs font-bold text-slate-800 flex justify-between items-center">
            <span>周边合作健康驿站与门店 (IS-007)</span>
            <span className="text-[10px] text-teal-600">全部2家 ›</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800">康养堂（南山科技园旗舰店）</span>
              <span className="text-[10px] text-slate-400">1.2km</span>
            </div>
            <p className="text-[10px] text-slate-500">深圳市南山区科技园高新南九道88号</p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => alert('已开启腾讯地图导航')}
                className="text-[10px] text-teal-700 bg-white border border-teal-200 px-2 py-0.5 rounded-lg font-bold flex items-center gap-0.5"
              >
                <Navigation className="w-3 h-3" />
                <span>一键导航</span>
              </button>
              <button
                onClick={() => alert('拨打电话：0755-88220011')}
                className="text-[10px] text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-lg font-bold flex items-center gap-0.5"
              >
                <Phone className="w-3 h-3" />
                <span>电话直连</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
