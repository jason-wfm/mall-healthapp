import React from 'react';
import { DeviceConfig, DeviceType } from '../../types';
import { DEVICE_PRESETS } from '../../data/mockData';
import { Smartphone, Monitor, BookOpen, RotateCw, CheckCircle2, Sliders, Sparkles } from 'lucide-react';

interface Props {
  currentDevice: DeviceConfig;
  onSelectDevice: (device: DeviceConfig) => void;
  isLandscape: boolean;
  onToggleLandscape: () => void;
  showBezel: boolean;
  onToggleBezel: () => void;
  onOpenDoc: () => void;
  showRpxInspector: boolean;
  onToggleRpxInspector: () => void;
}

export const AdaptationMetricsBar: React.FC<Props> = ({
  currentDevice,
  onSelectDevice,
  isLandscape,
  onToggleLandscape,
  showBezel,
  onToggleBezel,
  onOpenDoc,
  showRpxInspector,
  onToggleRpxInspector
}) => {
  const effectiveWidth = isLandscape && currentDevice.width > 0 ? currentDevice.height : currentDevice.width;
  const rpxRatio = effectiveWidth > 0 ? (effectiveWidth / 750).toFixed(4) : '动态自适应';

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-200 px-3 sm:px-6 py-2.5 shadow-md shrink-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Platform Info */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-md shadow-rose-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm tracking-tight">ShopSuite Mobile</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                750rpx 适配方案
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Uni-app 多端响应式 + 拼团 / 砍价 / 分销 / 秒杀 社交电商
            </p>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 overflow-x-auto text-xs">
          {DEVICE_PRESETS.map((d) => {
            const isActive = currentDevice.id === d.id;
            return (
              <button
                key={d.id}
                id={`btn-device-${d.id}`}
                onClick={() => onSelectDevice(d)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {d.id === 'fullscreen' ? (
                  <Monitor className="w-3.5 h-3.5" />
                ) : (
                  <Smartphone className="w-3.5 h-3.5" />
                )}
                <span>{d.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Adaptation Controls & Tech Architecture Doc */}
        <div className="flex items-center gap-2 text-xs">
          {currentDevice.id !== 'fullscreen' && (
            <>
              {/* Rotate button */}
              <button
                id="btn-toggle-landscape"
                onClick={onToggleLandscape}
                className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
                  isLandscape
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="横竖屏旋转 (测试断点与视口响应)"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{isLandscape ? '横屏' : '竖屏'}</span>
              </button>

              {/* Bezel frame toggle */}
              <button
                id="btn-toggle-bezel"
                onClick={onToggleBezel}
                className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
                  showBezel
                    ? 'bg-slate-700 border-slate-600 text-slate-200'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title="切换真实真机边框与极简预览"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{showBezel ? '真机外壳' : '无框'}</span>
              </button>
            </>
          )}

          {/* Rpx inspector toggle */}
          <button
            id="btn-toggle-rpx-inspector"
            onClick={onToggleRpxInspector}
            className={`px-2.5 py-1.5 rounded-lg border font-mono transition-colors flex items-center gap-1.5 ${
              showRpxInspector
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="实时计算 750rpx 转换公式与视口安全区"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>1rpx = {rpxRatio}px</span>
          </button>

          {/* Architecture Documentation Modal Button */}
          <button
            id="btn-open-architecture-doc"
            onClick={onOpenDoc}
            className="flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-3 py-1.5 rounded-lg font-medium shadow-sm shadow-rose-500/30 transition-transform active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>适配方案解析</span>
          </button>
        </div>
      </div>
    </header>
  );
};
