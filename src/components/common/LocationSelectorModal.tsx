import React, { useState } from 'react';
import { X, MapPin, Search, Navigation, AlertCircle, Check } from 'lucide-react';

interface Props {
  currentLocation: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: string, isOutOfRange: boolean) => void;
}

export const LocationSelectorModal: React.FC<Props> = ({
  currentLocation,
  isOpen,
  onClose,
  onSelectLocation
}) => {
  const [keyword, setKeyword] = useState('');

  if (!isOpen) return null;

  const presetLocations = [
    {
      name: '科技园南路88号3栋 (当前位置)',
      district: '深圳市南山区',
      outOfRange: false,
      tag: '就近推荐 · 全部服务可用'
    },
    {
      name: '上海 · 浦东新区世纪大道888号',
      district: '上海市浦东新区',
      outOfRange: true,
      tag: '跨省 · 触发隐藏上门/到店服务'
    },
    {
      name: '北京 · 朝阳区建国路甲1号',
      district: '北京市朝阳区',
      outOfRange: true,
      tag: '跨区跨市 · 仅展示实物'
    },
    {
      name: '广州 · 天河区天河路208号',
      district: '广州市天河区',
      outOfRange: true,
      tag: '超距 · 上门服务隐藏'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl p-5 max-w-[430px] w-full mx-auto shadow-2xl relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-800 text-sm">选择服务定位地址</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative my-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="输入写字楼、小区、街道名称搜索"
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Map Grid Simulation */}
        <div className="relative h-28 rounded-2xl overflow-hidden bg-gradient-to-tr from-teal-50 to-blue-50 border border-slate-200 flex items-center justify-center mb-3 shrink-0">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:12px_12px]" />
          <div className="relative flex flex-col items-center">
            <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-teal-900 mt-1 bg-white/90 px-2 py-0.5 rounded-full border border-teal-200">
              拖动地图或选择下方地址
            </span>
          </div>
        </div>

        {/* Rule Prompt */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 mb-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-800 leading-relaxed">
            <b>定位与服务隐藏规则 (LOC)</b>：跨区、跨市或超出当前服务半径时，系统将智能隐藏【上门服务】与【到店服务】，以确保服务履约质量；全国顺丰包邮实物商品不受影响。
          </p>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
          {presetLocations.map((item, idx) => {
            const isSelected = currentLocation === item.name;
            return (
              <div
                key={idx}
                onClick={() => {
                  onSelectLocation(item.name, item.outOfRange);
                  onClose();
                }}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/50'
                    : 'border-slate-100 bg-slate-50/80 hover:bg-slate-100'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] text-slate-400">{item.district}</span>
                    <span
                      className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${
                        item.outOfRange ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {item.tag}
                    </span>
                  </div>
                </div>

                {isSelected ? (
                  <Check className="w-4 h-4 text-teal-600" />
                ) : (
                  <span className="text-[10px] text-teal-600 font-semibold">选择</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
