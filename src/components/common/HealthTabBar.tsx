import React from 'react';
import { HealthTab } from '../../types/health';
import { Home, Handshake, ShoppingBag, Compass, User } from 'lucide-react';

interface Props {
  activeTab: HealthTab;
  onSelectTab: (tab: HealthTab) => void;
  unreadCount?: number;
  cartCount?: number;
}

export const HealthTabBar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  unreadCount = 5,
  cartCount = 3
}) => {
  return (
    <nav className="shrink-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-30 shadow-lg pb-safe">
      <div className="flex items-center justify-around h-[54px] px-2 w-full max-w-[430px] mx-auto relative">
        {/* 1. 首页 */}
        <button
          id="tab-home"
          onClick={() => onSelectTab('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'home' ? 'text-teal-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">首页</span>
        </button>

        {/* 2. 服务 */}
        <button
          id="tab-services"
          onClick={() => onSelectTab('services')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'services' ? 'text-teal-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Handshake className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[7px] px-1 rounded-full font-bold">
              Plus
            </span>
          </div>
          <span className="text-[10px] mt-0.5 font-medium">服务</span>
        </button>

        {/* 3. 商城 (居中突出大按钮) */}
        <div className="flex-1 flex flex-col items-center justify-center relative -mt-5">
          <button
            id="tab-mall"
            onClick={() => onSelectTab('mall')}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
              activeTab === 'mall'
                ? 'bg-gradient-to-tr from-teal-600 to-emerald-500 ring-3 ring-teal-200'
                : 'bg-gradient-to-tr from-teal-500 to-teal-400'
            }`}
          >
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-bold min-w-[14px] h-[14px] rounded-full flex items-center justify-center border border-white px-0.5">
                {cartCount}
              </span>
            )}
          </button>
          <span
            className={`text-[9px] mt-0.5 font-bold ${
              activeTab === 'mall' ? 'text-teal-600' : 'text-slate-600'
            }`}
          >
            商城
          </span>
        </div>

        {/* 4. 发现 (带健康消息气泡) */}
        <button
          id="tab-discover"
          onClick={() => onSelectTab('discover')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'discover' ? 'text-teal-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Compass className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[8px] font-bold min-w-[14px] h-[14px] rounded-full flex items-center justify-center border border-white px-0.5">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium">发现</span>
        </button>

        {/* 5. 我的 */}
        <button
          id="tab-mine"
          onClick={() => onSelectTab('mine')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'mine' ? 'text-teal-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">我的</span>
        </button>
      </div>
    </nav>
  );
};
