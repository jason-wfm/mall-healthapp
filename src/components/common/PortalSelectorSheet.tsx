import React from 'react';
import { PortalCity } from '../../types/health';
import { X, Check, Building2, MapPin } from 'lucide-react';

interface Props {
  currentPortal: PortalCity;
  isOpen: boolean;
  onClose: () => void;
  onSelectPortal: (portal: PortalCity) => void;
}

export const PortalSelectorSheet: React.FC<Props> = ({
  currentPortal,
  isOpen,
  onClose,
  onSelectPortal
}) => {
  if (!isOpen) return null;

  const portals: { id: PortalCity; label: string; desc: string }[] = [
    { id: '北京门户', label: '北京区域门户', desc: '覆盖东城、西城、海淀、朝阳等核心区' },
    { id: '上海门户', label: '上海区域门户', desc: '覆盖浦东、黄浦、静安、徐汇等核心区' },
    { id: '广州门户', label: '广州区域门户', desc: '覆盖天河、越秀、海珠、番禺等核心区' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl p-5 max-w-[430px] w-full mx-auto shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-800 text-sm">切换区域门户</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[11px] text-slate-500 my-3 leading-relaxed">
          切换后前台（首页/商城/资讯/我的）仅展示该区域门户范围内的商品与服务；家庭成员、健康档案与商城账户跨门户全量共享。
        </p>

        <div className="space-y-2.5">
          {portals.map((p) => {
            const isSelected = currentPortal === p.id;
            return (
              <div
                key={p.id}
                onClick={() => {
                  onSelectPortal(p.id);
                  onClose();
                }}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{p.id}</h4>
                    <p className="text-[10px] text-slate-400">{p.desc}</p>
                  </div>
                </div>

                {isSelected ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-teal-600">
                    <Check className="w-4 h-4" />
                    当前
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">切换</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400">
          受平台管理后台「区域门户实例」统一管控 (PC-008~011)
        </div>
      </div>
    </div>
  );
};
