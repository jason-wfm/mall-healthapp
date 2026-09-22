import React from 'react';
import { HealthProfile, HealthOrder } from '../../types/health';
import { ChevronRight, CreditCard, Clock, Truck, ShieldCheck, Settings, Users, FileText, Activity, Gift, Smartphone, HelpCircle } from 'lucide-react';

interface Props {
  profile: HealthProfile;
  orders: HealthOrder[];
  onOpenOrder: (order: HealthOrder) => void;
  onOpenFamilyCircle: () => void;
  onOpenConstitution: () => void;
  onOpenMedicalReport: () => void;
  onOpenHealthHub: () => void;
}

export const MineTab: React.FC<Props> = ({
  profile,
  orders,
  onOpenOrder,
  onOpenFamilyCircle,
  onOpenConstitution,
  onOpenMedicalReport,
  onOpenHealthHub
}) => {
  return (
    <div className="pb-24 space-y-3 bg-slate-50/70 min-h-screen text-slate-800">
      {/* 顶部个人卡片 */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white pt-6 pb-5 px-4 rounded-b-3xl shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-teal-600 border-2 border-white flex items-center justify-center text-2xl shadow-md">
              👨‍💼
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-extrabold text-base">{profile.name}</h2>
                <span className="bg-amber-400 text-amber-950 font-black text-[9px] px-1.5 py-0.2 rounded-full">
                  VIP 黄金会员
                </span>
              </div>
              <p className="text-[10px] text-teal-100 mt-0.5">
                手机号 138****0001 · 幸福之家主理人
              </p>
            </div>
          </div>

          <button
            onClick={onOpenHealthHub}
            className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl backdrop-blur-xs border border-white/20 flex items-center gap-0.5"
          >
            <span>档案 85分</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* 资产四宫格 */}
        <div className="grid grid-cols-4 gap-2 text-center text-white mt-5 pt-3 border-t border-white/10 text-xs">
          <div>
            <span className="font-black text-sm block font-mono">1,280</span>
            <span className="text-[10px] text-teal-100">健康豆</span>
          </div>
          <div>
            <span className="font-black text-sm block font-mono">3</span>
            <span className="text-[10px] text-teal-100">优惠券</span>
          </div>
          <div>
            <span className="font-black text-sm block font-mono">2</span>
            <span className="text-[10px] text-teal-100">体检报告</span>
          </div>
          <div>
            <span className="font-black text-sm block font-mono">1</span>
            <span className="text-[10px] text-teal-100">智能设备</span>
          </div>
        </div>
      </div>

      {/* 我的健康订单金刚区 */}
      <div className="px-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-2.5">
          <div className="flex justify-between items-center text-xs font-bold text-slate-800">
            <span>我的健康订单</span>
            <span className="text-[10px] text-slate-400 font-normal">全部订单 ›</span>
          </div>

          <div className="grid grid-cols-5 gap-1 text-center text-[10px] text-slate-600 pt-1">
            <div
              onClick={() => orders[0] && onOpenOrder(orders[0])}
              className="space-y-1 cursor-pointer hover:text-teal-700"
            >
              <div className="text-xl">💳</div>
              <div>待付款</div>
            </div>

            <div
              onClick={() => {
                const inStore = orders.find((o) => o.orderType === 'inStoreService');
                if (inStore) onOpenOrder(inStore);
              }}
              className="space-y-1 cursor-pointer hover:text-teal-700 relative"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-0 right-3" />
              <div className="text-xl">🎟️</div>
              <div>待核销 (到店)</div>
            </div>

            <div
              onClick={() => {
                const doorstep = orders.find((o) => o.orderType === 'doorstepService');
                if (doorstep) onOpenOrder(doorstep);
              }}
              className="space-y-1 cursor-pointer hover:text-teal-700 relative"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-0 right-3" />
              <div className="text-xl">🚕</div>
              <div>待上门 (派单)</div>
            </div>

            <div
              onClick={() => {
                const prod = orders.find((o) => o.orderType === 'product');
                if (prod) onOpenOrder(prod);
              }}
              className="space-y-1 cursor-pointer hover:text-teal-700"
            >
              <div className="text-xl">📦</div>
              <div>待收货 (物流)</div>
            </div>

            <div
              onClick={() => alert('暂无退款售后服务')}
              className="space-y-1 cursor-pointer hover:text-teal-700"
            >
              <div className="text-xl">🛡️</div>
              <div>售后/退款</div>
            </div>
          </div>
        </div>
      </div>

      {/* 近期订单快捷入口 */}
      <div className="px-3">
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs space-y-2 text-xs">
          <div className="font-bold text-slate-800 text-[11px]">最新进行中服务</div>
          {orders.slice(0, 2).map((ord) => (
            <div
              key={ord.id}
              onClick={() => onOpenOrder(ord)}
              className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 flex items-center justify-between cursor-pointer hover:bg-teal-50/50"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                      ord.orderType === 'doorstepService'
                        ? 'bg-indigo-100 text-indigo-700'
                        : ord.orderType === 'inStoreService'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-teal-100 text-teal-700'
                    }`}
                  >
                    {ord.orderType === 'doorstepService'
                      ? '上门服务'
                      : ord.orderType === 'inStoreService'
                      ? '到店服务'
                      : '实物商品'}
                  </span>
                  <span className="font-bold text-slate-800 truncate">{ord.items[0]?.title}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {ord.orderTime} · ¥{ord.totalAmount.toFixed(2)}
                </div>
              </div>
              <span className="text-[10px] font-bold text-teal-700 shrink-0 ml-2">
                查看状态 ›
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 常用功能列表 */}
      <div className="px-3">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs divide-y divide-slate-100 text-xs">
          <div
            onClick={onOpenFamilyCircle}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50"
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="font-bold">家庭圈健康空间 (FM-014 幸福之家 3人)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </div>

          <div
            onClick={onOpenConstitution}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50"
          >
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span className="font-bold">中医九大体质辨识报告 (TC-001)</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">平和质兼气虚 ›</span>
          </div>

          <div
            onClick={onOpenMedicalReport}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-teal-600" />
              <span className="font-bold">体检报告与 AI 深度解读 (PE)</span>
            </div>
            <span className="text-[10px] text-amber-600 font-medium">2项异常 ›</span>
          </div>

          <div
            onClick={() => alert('智能血压计 Pro 已连接 (蓝牙已配对，每早8:30自动同步)')}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50"
          >
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-indigo-600" />
              <span className="font-bold">智能健康硬件与绑定管理 (MD-002)</span>
            </div>
            <span className="text-[10px] text-slate-400">已连 1 台 ›</span>
          </div>

          <div
            onClick={() => alert('已严格通过国家等保三级与个人健康信息隐私安全认证')}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span className="font-bold">数据隐私合规与授权管理 (HR-007)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
};
