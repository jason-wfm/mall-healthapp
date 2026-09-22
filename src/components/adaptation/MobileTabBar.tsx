import React from 'react';
import { ActiveTab } from '../../types';
import { Home, Users, Flame, Zap, Sparkles, Share2 } from 'lucide-react';

interface Props {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const MobileTabBar: React.FC<Props> = ({ activeTab, onSelectTab }) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: '首页', icon: <Home className="w-4 h-4" /> },
    { id: 'group', label: '拼团', icon: <Users className="w-4 h-4" />, badge: '省' },
    { id: 'bargain', label: '砍价', icon: <Flame className="w-4 h-4" />, badge: '0元' },
    { id: 'seckill', label: '秒杀', icon: <Zap className="w-4 h-4" /> },
    { id: 'community', label: '种草', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'distribution', label: '分销', icon: <Share2 className="w-4 h-4" />, badge: '赚' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-30 shadow-md">
      <div className="flex items-center justify-around h-[50px] px-1 max-w-[430px] mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-nav-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all relative ${
                isActive ? 'text-rose-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[8px] font-bold px-1 rounded-full leading-tight">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
