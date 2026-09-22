import React, { useState, useEffect } from 'react';
import { Product, SeckillSession } from '../../types';
import { MOCK_SECKILL_SESSIONS } from '../../data/mockData';
import { Zap, Clock, Bell, Check, ShoppingCart, Sparkles } from 'lucide-react';

interface Props {
  onSelectProduct: (product: Product, defaultMode?: 'normal' | 'group' | 'bargain' | 'seckill') => void;
  onInstantBuy: (product: Product) => void;
}

export const SeckillModule: React.FC<Props> = ({ onSelectProduct, onInstantBuy }) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string>('s-14');
  const [reminderIds, setReminderIds] = useState<string[]>([]);
  const [countdown, setCountdown] = useState({ hours: 1, mins: 28, secs: 45, ms: 8 });

  // Simulated live countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { hours, mins, secs, ms } = prev;
        ms -= 1;
        if (ms < 0) {
          ms = 9;
          secs -= 1;
          if (secs < 0) {
            secs = 59;
            mins -= 1;
            if (mins < 0) {
              mins = 59;
              hours = Math.max(0, hours - 1);
            }
          }
        }
        return { hours, mins, secs, ms };
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const activeSession =
    MOCK_SECKILL_SESSIONS.find((s) => s.id === selectedSessionId) ||
    MOCK_SECKILL_SESSIONS[1];

  const toggleReminder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReminderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="pb-20 space-y-3">
      {/* Seckill Header with Red Gradient */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-4 mx-3 mt-2 rounded-2xl shadow-md shadow-red-600/20 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 text-xs text-red-200 font-semibold mb-1">
              <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>整点狂欢秒杀 · 超低折扣</span>
            </div>
            <h2 className="text-xl font-black tracking-tight">限时限量 · 抢完即止</h2>
            <p className="text-xs text-red-100/90 mt-0.5">每日多个场次轮番开抢</p>
          </div>

          {/* Countdown Clock Widget */}
          <div className="bg-black/30 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-center font-mono">
            <div className="text-[10px] text-red-200 mb-1 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              <span>距本场结束</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold">
              <span className="bg-white text-red-700 px-1.5 py-0.5 rounded">
                {String(countdown.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-white text-red-700 px-1.5 py-0.5 rounded">
                {String(countdown.mins).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-white text-red-700 px-1.5 py-0.5 rounded">
                {String(countdown.secs).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-amber-300 text-red-900 px-1 py-0.5 rounded text-[10px]">
                {countdown.ms}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Time Slot Tabs (10:00, 14:00, 20:00) */}
      <div className="px-3">
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-xs">
          {MOCK_SECKILL_SESSIONS.map((session) => {
            const isSelected = session.id === selectedSessionId;
            return (
              <button
                key={session.id}
                onClick={() => setSelectedSessionId(session.id)}
                className={`flex-1 py-2 px-1 rounded-xl text-center transition-all ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-sm font-black font-mono leading-none">
                  {session.timeLabel}
                </div>
                <div
                  className={`text-[10px] mt-1 font-medium ${
                    isSelected ? 'text-red-100' : 'text-slate-400'
                  }`}
                >
                  {session.statusText}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seckill Product List */}
      <div className="px-3 space-y-2.5">
        {activeSession.products.map((p) => {
          const isOngoing = activeSession.status === 'ongoing';
          const isReminded = reminderIds.includes(p.id);

          return (
            <div
              key={`seckill-card-${p.id}`}
              onClick={() => onSelectProduct(p, 'seckill')}
              className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs flex gap-3 cursor-pointer active:scale-[0.99] transition-all hover:shadow-md"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-1 left-1 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                  秒杀专享
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {p.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {p.subTitle}
                  </p>

                  {/* Stock progress bar if ongoing */}
                  {isOngoing && (
                    <div className="mt-2 space-y-1">
                      <div className="w-full h-2 bg-red-50 rounded-full overflow-hidden border border-red-100">
                        <div
                          style={{ width: `${p.seckillSoldPercent || 75}%` }}
                          className="h-full bg-gradient-to-r from-red-500 to-rose-600 rounded-full"
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400">
                        <span className="text-red-600 font-semibold">
                          已抢 {p.seckillSoldPercent || 75}%
                        </span>
                        <span>仅剩 {Math.floor(p.stock * 0.15)} 件</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-end justify-between mt-2 pt-1 border-t border-slate-50">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-red-600 font-extrabold text-sm">
                      ¥{p.seckillPrice || p.price}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      ¥{p.originalPrice}
                    </span>
                  </div>

                  {isOngoing ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInstantBuy(p);
                      }}
                      className="bg-red-600 hover:bg-red-700 active:scale-95 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm shadow-red-600/30 transition-all flex items-center gap-1"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>立即秒杀</span>
                    </button>
                  ) : activeSession.status === 'upcoming' ? (
                    <button
                      onClick={(e) => toggleReminder(p.id, e)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                        isReminded
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-amber-500 text-white hover:bg-amber-600'
                      }`}
                    >
                      {isReminded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>已设提醒</span>
                        </>
                      ) : (
                        <>
                          <Bell className="w-3.5 h-3.5" />
                          <span>提醒我</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-slate-200 text-slate-400 text-[11px] font-medium px-3 py-1.5 rounded-lg cursor-not-allowed"
                    >
                      已抢光
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
