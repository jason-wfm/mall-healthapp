import React, { useState, useEffect } from 'react';
import { DeviceConfig } from '../../types';
import { Wifi, BatteryMedium, Signal, ChevronLeft, MoreHorizontal, Sparkles } from 'lucide-react';

interface Props {
  device: DeviceConfig;
  isLandscape: boolean;
  showBezel: boolean;
  children: React.ReactNode;
  navTitle?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export const MobileFrame: React.FC<Props> = ({
  device,
  isLandscape,
  showBezel,
  children,
  navTitle = 'ShopSuite 社交电商',
  onBack,
  showBack = false
}) => {
  const [timeStr, setTimeStr] = useState('09:41');
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const isFullscreen = device.id === 'fullscreen';

  // 1. 移动端真实浏览器环境自适应 (宽度 < 768px)：全屏沉浸式无边框，100% 贴合真机视口
  if (isMobileViewport) {
    return (
      <div className="w-full h-full flex flex-col bg-slate-50 relative overflow-hidden">
        {children}
      </div>
    );
  }

  // 2. 桌面端 H5 全屏自适应模式
  if (isFullscreen) {
    return (
      <div className="w-full h-full flex justify-center items-center bg-slate-950/40 p-2 sm:p-4">
        <div className="w-full max-w-[430px] h-full max-h-[920px] bg-slate-50 flex flex-col relative shadow-2xl rounded-3xl overflow-hidden border border-slate-800">
          {children}
        </div>
      </div>
    );
  }

  // Calculate dimensions based on landscape / portrait
  const frameWidth = isLandscape ? device.height : device.width;
  const frameHeight = isLandscape ? device.width : device.height;

  return (
    <div className="py-2 md:py-6 px-2 w-full h-full flex justify-center items-center overflow-auto bg-slate-950/70">
      <div
        style={{
          width: showBezel ? `${frameWidth + 24}px` : `${frameWidth}px`,
          height: showBezel ? `${frameHeight + 24}px` : `${frameHeight}px`,
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        className={`relative transition-all duration-300 flex flex-col shrink-0 ${
          showBezel
            ? 'p-[12px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 rounded-[50px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-black/40'
            : 'rounded-[32px] overflow-hidden shadow-2xl border border-slate-700/80'
        }`}
      >
        {/* Device Outer Buttons simulation if bezel is on */}
        {showBezel && (
          <>
            {/* Volume Up / Down */}
            <div className="absolute -left-[14px] top-[115px] w-[3px] h-[48px] bg-slate-600 rounded-l-md" />
            <div className="absolute -left-[14px] top-[175px] w-[3px] h-[48px] bg-slate-600 rounded-l-md" />
            {/* Power button */}
            <div className="absolute -right-[14px] top-[140px] w-[3px] h-[72px] bg-slate-600 rounded-r-md" />
          </>
        )}

        {/* Screen Container */}
        <div
          id="mobile-screen-viewport"
          className="w-full h-full bg-slate-100 rounded-[38px] overflow-hidden flex flex-col relative select-none"
        >
          {/* Hardware Status Bar & Notch */}
          <div
            style={{ height: `${device.statusBarHeight || 20}px` }}
            className="w-full bg-white/90 backdrop-blur-md shrink-0 flex items-center justify-between px-6 pt-1 text-slate-800 text-[11px] font-semibold tracking-tight z-30 select-none border-b border-black/[0.04]"
          >
            {/* Left: Clock */}
            <div className="flex items-center gap-1">
              <span>{timeStr}</span>
            </div>

            {/* Middle: Dynamic Island / Punch Hole */}
            {device.notchType === 'dynamic-island' && !isLandscape && (
              <div className="absolute left-1/2 -translate-x-1/2 top-1.5 h-[22px] w-[95px] bg-black rounded-full flex items-center justify-between px-2.5 shadow-sm transition-all hover:w-[130px] group cursor-pointer">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[9px] font-mono text-white/80 group-hover:block hidden">
                  ShopSuite
                </span>
                <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
              </div>
            )}

            {device.notchType === 'punch-hole' && !isLandscape && (
              <div className="absolute left-1/2 -translate-x-1/2 top-2 h-[12px] w-[12px] bg-black rounded-full shadow-inner border border-slate-800" />
            )}

            {/* Right: Network & Battery status */}
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="text-[10px] font-mono font-medium">5G</span>
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center">
                <BatteryMedium className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Uni-app Custom Navigation Bar (uni-nav-bar) */}
          <div className="h-[44px] bg-white border-b border-slate-200/80 px-3.5 flex items-center justify-between shrink-0 z-20 shadow-xs">
            <div className="w-16 flex items-center">
              {showBack ? (
                <button
                  id="mobile-nav-back-btn"
                  onClick={onBack}
                  className="flex items-center text-slate-700 hover:text-slate-900 -ml-1 p-1 active:scale-90 transition-transform"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-xs font-medium">返回</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs">
                  <div className="w-4 h-4 rounded bg-rose-500 text-white flex items-center justify-center text-[10px]">
                    S
                  </div>
                  <span>ShopSuite</span>
                </div>
              )}
            </div>

            <div className="text-xs font-bold text-slate-800 truncate max-w-[180px] text-center">
              {navTitle}
            </div>

            {/* WeChat Mini Program Capsule Simulation (微信小程序右上角胶囊) */}
            <div className="w-16 flex justify-end">
              <div className="flex items-center gap-2 px-2 py-1 bg-slate-100 rounded-full border border-slate-200 text-slate-600 text-[10px]">
                <button title="小程序更多选项" className="hover:text-slate-900">
                  <MoreHorizontal className="w-3 h-3" />
                </button>
                <span className="w-[1px] h-2.5 bg-slate-300" />
                <button title="退出小程序" className="w-2.5 h-2.5 rounded-full border border-slate-600 flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area (单层滚动避免嵌套双滚动条) */}
          <div className="flex-1 overflow-hidden relative flex flex-col">
            {children}
          </div>

          {/* Safe Area Bottom Bar (iOS Home Bar Indicator) */}
          {device.safeAreaBottom > 0 && (
            <div
              style={{ height: `${device.safeAreaBottom}px` }}
              className="w-full bg-white shrink-0 flex items-center justify-center relative z-30"
            >
              <div className="w-32 h-1 bg-slate-900/40 rounded-full mb-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
