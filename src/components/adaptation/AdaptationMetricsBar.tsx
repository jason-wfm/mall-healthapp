import React, { useState, useEffect } from 'react';
import { DeviceConfig, DeviceType } from '../../types';
import { DEVICE_PRESETS } from '../../data/mockData';
import { Smartphone, Monitor, BookOpen, RotateCw, CheckCircle2, Sliders, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

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
  isLoggedIn?: boolean;
  onToggleAuth?: () => void;
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
  onToggleRpxInspector,
  isLoggedIn,
  onToggleAuth
}) => {
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [showMobileTools, setShowMobileTools] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const effectiveWidth = isLandscape && currentDevice.width > 0 ? currentDevice.height : currentDevice.width;
  const rpxRatio = effectiveWidth > 0 ? (effectiveWidth / 750).toFixed(4) : '动态自适应';

  // 移动端紧凑顶栏：仅占极少高度，不挤压真机内容视口
  if (isMobileViewport) {
    return (
      <header className="bg-slate-900 border-b border-slate-800 text-slate-200 px-3 py-1.5 shadow-sm shrink-0 z-40">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Mobile Status Indicator */}
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-white text-xs truncate">ShopSuite</span>
            <span className="text-[9px] px-1 py-0.2 rounded font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>750rpx 视口全屏自适应</span>
            </span>
          </div>

          {/* Right: Quick actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onOpenDoc}
              className="flex items-center gap-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-2 py-1 rounded-md text-[10px] font-medium"
              title="查看 750rpx 适配与架构解析"
            >
              <BookOpen className="w-3 h-3" />
              <span>架构</span>
            </button>

            {onToggleAuth && (
              <button
                onClick={onToggleAuth}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border transition-colors ${
                  isLoggedIn
                    ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                    : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isLoggedIn ? 'bg-teal-400' : 'bg-amber-400'}`} />
                <span>{isLoggedIn ? '已登录' : '未登录'}</span>
              </button>
            )}

            <button
              onClick={() => setShowMobileTools(!showMobileTools)}
              className="p-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
              title="展开/收起模拟器调控工具"
            >
              {showMobileTools ? <ChevronUp className="w-3.5 h-3.5" /> : <Sliders className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 可折叠的移动端机型切换浮层 */}
        {showMobileTools && (
          <div className="mt-2 pt-2 border-t border-slate-800 space-y-2 animate-in slide-in-from-top-1 duration-150">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>机型切换</span>
              <span className="font-mono text-emerald-400">1rpx = {rpxRatio}px</span>
            </div>
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 text-xs">
              {DEVICE_PRESETS.map((d) => {
                const isActive = currentDevice.id === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      onSelectDevice(d);
                      setShowMobileTools(false);
                    }}
                    className={`px-2 py-1 rounded text-[10px] whitespace-nowrap font-medium border ${
                      isActive
                        ? 'bg-rose-500 border-rose-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {d.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>
    );
  }

  // 桌面端完整调测工作台
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
            className="flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-3 py-1.5 rounded-lg font-medium shadow-sm shadow-rose-500/30 transition-transform active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>适配方案解析</span>
          </button>

          {/* Auth State Switcher for rapid test */}
          {onToggleAuth !== undefined && (
            <button
              id="btn-toggle-auth-state"
              onClick={onToggleAuth}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs border transition-all cursor-pointer ${
                isLoggedIn
                  ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 hover:bg-teal-500/30'
                  : 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30'
              }`}
              title="点击在 [已登录] 与 [未登录拦截] 状态间快速切换"
            >
              <span className={`w-2 h-2 rounded-full ${isLoggedIn ? 'bg-teal-400' : 'bg-amber-400'}`} />
              <span>{isLoggedIn ? '账号状态：已登录 (张明)' : '账号状态：未登录 (测试拦截)'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
