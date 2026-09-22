import React, { useState } from 'react';
import { DeviceConfig } from '../../types';
import { X, Calculator, Eye, HelpCircle } from 'lucide-react';

interface Props {
  device: DeviceConfig;
  isLandscape: boolean;
  onClose: () => void;
}

export const RpxInspectorOverlay: React.FC<Props> = ({
  device,
  isLandscape,
  onClose
}) => {
  const [testPx, setTestPx] = useState<number>(375);
  const currentWidth = isLandscape && device.width > 0 ? device.height : (device.width || 393);
  const rpxFactor = currentWidth / 750;
  const convertedPx = (testPx * rpxFactor).toFixed(2);

  return (
    <div className="absolute top-16 right-4 sm:right-8 w-80 bg-slate-900/95 backdrop-blur-md text-slate-100 p-4 rounded-2xl border border-slate-700/80 shadow-2xl z-50 text-xs">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-white">750rpx 适配计算器与参数</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Live Device Properties */}
      <div className="space-y-2 mb-3.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px]">
        <div className="flex justify-between">
          <span className="text-slate-400">当前设备视口:</span>
          <span className="text-emerald-300 font-semibold">{currentWidth} px ({isLandscape ? '横屏' : '竖屏'})</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">设计稿基准:</span>
          <span className="text-slate-200">750 rpx (微信/Uni-app)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">1 rpx 转换系数:</span>
          <span className="text-amber-400 font-bold">{rpxFactor.toFixed(5)} px</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">屏幕物理 DPR:</span>
          <span className="text-cyan-300">@{device.dpr}x Retina</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">顶部状态栏 (Status):</span>
          <span className="text-slate-200">{device.statusBarHeight}px</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">底部安全区 (Home Bar):</span>
          <span className="text-rose-400">{device.safeAreaBottom}px [env(safe-area-inset-bottom)]</span>
        </div>
      </div>

      {/* Interactive Quick Converter */}
      <div className="mb-3">
        <label className="block text-[11px] text-slate-300 font-medium mb-1.5">
          输入设计稿 rpx 测量值：
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={testPx}
            onChange={(e) => setTestPx(Number(e.target.value) || 0)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-hidden focus:border-emerald-500"
          />
          <span className="text-slate-400 font-mono">rpx</span>
        </div>
        <div className="mt-2 p-2 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-emerald-300 font-mono text-[11px] flex items-center justify-between">
          <span>实际屏幕渲染：</span>
          <span className="font-bold text-sm text-emerald-400">{convertedPx} px</span>
        </div>
      </div>

      {/* 1px Hairline Border Visual Test */}
      <div className="pt-2 border-t border-slate-800">
        <div className="flex items-center gap-1.5 text-slate-300 mb-2">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-medium text-[11px]">高分屏 1px 细线适配效果对比</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] text-center font-mono">
          <div className="p-2 bg-slate-800/80 rounded border-b border-white">
            <span className="text-slate-400 block mb-1">原生 1px 边框</span>
            <span className="text-slate-500 text-[9px]">(粗重未缩放)</span>
          </div>
          <div className="p-2 bg-slate-800/80 rounded border-retina-b">
            <span className="text-cyan-300 block mb-1">scaleY(0.5) 细线</span>
            <span className="text-emerald-400 text-[9px]">(高清 0.5px)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
