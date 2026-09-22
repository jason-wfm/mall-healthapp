import React, { useState } from 'react';
import { X, Truck, QrCode, MapPin, Phone, CheckCircle2, AlertTriangle, RefreshCw, Clock, ShieldCheck, Copy, Check } from 'lucide-react';
import { HealthOrder } from '../../types/health';

interface Props {
  order: HealthOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReceipt?: (orderId: string) => void;
}

export const OrderDetailModal: React.FC<Props> = ({
  order,
  isOpen,
  onClose,
  onConfirmReceipt
}) => {
  const [copied, setCopied] = useState(false);
  const [simulatedDoorstepStatus, setSimulatedDoorstepStatus] = useState<
    'matching' | 'dispatched' | 'arriving' | 'servicing' | 'completed'
  >('arriving');
  const [reassignedAlert, setReassignedAlert] = useState(false);

  if (!isOpen || !order) return null;

  const isPhysical = order.orderType === 'product';
  const isInStore = order.orderType === 'inStoreService';
  const isDoorstep = order.orderType === 'doorstepService';

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // 模拟护士遇紧急突发拒单并触发平台自动重新改派 (OS-011)
  const handleTriggerReassign = () => {
    setSimulatedDoorstepStatus('matching');
    setTimeout(() => {
      setSimulatedDoorstepStatus('arriving');
      setReassignedAlert(true);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative max-w-[430px] w-full mx-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-teal-50/50">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-slate-900">
                {isPhysical ? '实物物流与订单详情 (P28)' : isInStore ? '到店核销服务单 (P29)' : '上门派单履约详情 (P30)'}
              </span>
              <span className="bg-teal-100 text-teal-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                {order.statusText}
              </span>
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5">订单号：{order.orderNo}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-3.5">
          {/* 1. 实物商品物流轨迹 (P28) */}
          {isPhysical && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-start gap-2.5">
                <Truck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="text-xs flex-1">
                  <div className="font-bold text-slate-800 flex justify-between">
                    <span>顺丰速运 (包裹派送中)</span>
                    <span className="font-mono text-[10px] text-slate-400">SF18293049102</span>
                  </div>
                  <p className="text-[11px] text-teal-700 mt-1 font-medium">
                    快件正由派件员 张师傅(139****1829) 派送中，请保持电话畅通
                  </p>
                </div>
              </div>

              {/* 物流节点 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-3 text-xs">
                <h5 className="font-bold text-slate-800">物流轨迹追踪</h5>
                <div className="space-y-3 border-l-2 border-teal-500 ml-2 pl-3">
                  <div className="relative">
                    <span className="w-2 h-2 rounded-full bg-teal-600 absolute -left-[17px] top-1" />
                    <div className="font-bold text-teal-900 text-[11px]">正在派送中 · 预计今日 15:30 送达</div>
                    <div className="text-[10px] text-slate-400">深圳市南山科技园营业点</div>
                  </div>
                  <div className="relative">
                    <span className="w-2 h-2 rounded-full bg-slate-300 absolute -left-[17px] top-1" />
                    <div className="font-medium text-slate-700 text-[11px]">快件已到达 深圳科技园转运中心</div>
                    <div className="text-[10px] text-slate-400">昨天 22:15</div>
                  </div>
                  <div className="relative">
                    <span className="w-2 h-2 rounded-full bg-slate-300 absolute -left-[17px] top-1" />
                    <div className="font-medium text-slate-700 text-[11px]">包裹已由商家打包出库</div>
                    <div className="text-[10px] text-slate-400">前天 18:00</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. 到店服务核销码 (P29) */}
          {isInStore && (
            <div className="space-y-3">
              {/* 核销码大卡片 */}
              <div className="bg-gradient-to-b from-teal-50 to-white border-2 border-teal-500/80 rounded-3xl p-4 text-center space-y-3 shadow-md">
                <div className="text-[11px] font-bold text-teal-800">
                  到店服务专属核销凭证 (IS-008)
                </div>

                <div className="text-2xl font-black font-mono text-slate-900 tracking-wider bg-slate-100 py-2 rounded-2xl border border-slate-200">
                  {order.verificationCode || '8942-1082-3901'}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => handleCopyCode(order.verificationCode || '8942-1082-3901')}
                    className="flex items-center gap-1 text-xs text-teal-700 font-bold bg-teal-100/70 px-3 py-1 rounded-xl"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? '已复制核销码' : '点击复制核销码'}</span>
                  </button>
                </div>

                {/* Simulated Barcode / QR */}
                <div className="w-32 h-32 bg-slate-900 mx-auto rounded-2xl flex flex-col items-center justify-center text-white p-2">
                  <QrCode className="w-20 h-20 text-white" />
                  <span className="text-[8px] font-mono mt-1">出示给门店前台扫码</span>
                </div>

                <div className="text-[10px] text-slate-400">
                  核销状态：<span className="text-amber-600 font-bold">待到店核销</span> (有效期至 2026-10-31)
                </div>
              </div>

              {/* 门店信息与导航 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">
                    {order.storeName || '康养堂（南山科技园旗舰店）'}
                  </span>
                  <span className="text-[10px] text-teal-600 font-bold">距您 1.2km</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  深圳市南山区科技园高新南九道88号1层101
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => alert('已调起地图导航')}
                    className="flex-1 py-1.5 rounded-xl border border-teal-500 text-teal-700 font-bold text-center flex items-center justify-center gap-1 bg-white"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>到店导航</span>
                  </button>
                  <button
                    onClick={() => alert('正在呼叫门店电话 0755-88220011')}
                    className="flex-1 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-center flex items-center justify-center gap-1 bg-white"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>联系门店</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. 上门服务智能派单与改派流转 (P30) */}
          {isDoorstep && (
            <div className="space-y-3">
              {/* 改派预警提示条 */}
              {reassignedAlert && (
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">系统智能自动改派通知 (OS-011)</div>
                    <p className="text-[10px] text-amber-800 mt-0.5 leading-relaxed">
                      原派护士遇紧急医护任务无法按时履约。平台智能调度引擎已在 30 秒内为您无缝改派三甲背景执业护士【陈丽敏】，预计准时上门服务！
                    </p>
                  </div>
                </div>
              )}

              {/* 滴滴式派单状态栏 */}
              <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-4 shadow-md space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                    🚕 平台滴滴式智能调度 (OS-009)
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {simulatedDoorstepStatus === 'matching' ? '调度匹配中...' : '护士接单在途'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl border border-white/20">
                    👩‍⚕️
                  </div>
                  <div>
                    <div className="text-sm font-bold flex items-center gap-1.5">
                      <span>{reassignedAlert ? '陈丽敏 (执业护士)' : '李晓华 (主管护师)'}</span>
                      <span className="text-[9px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.2 rounded border border-emerald-400/40">
                        持证上岗
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 mt-0.5">
                      执业注册证号：粤140928190 · 服务 1,280 次 · 好评 100%
                    </p>
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-indigo-200">
                    <Clock className="w-4 h-4 text-teal-400" />
                    <span>预计 15 分钟后到达现场</span>
                  </div>
                  <span className="font-bold text-white">距您 1.8km</span>
                </div>
              </div>

              {/* 异常改派功能演练按钮 (供验收 OS-011) */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">滴滴式改派兜底机制 (OS-011)</span>
                  <button
                    onClick={handleTriggerReassign}
                    className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded-lg font-bold hover:bg-indigo-100 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>模拟护士拒单重新改派</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  若接单护士因路况或突发急救无法前往，系统自动在 30 秒内智能改派周边其他持证护士，保障履约。
                </p>
              </div>
            </div>
          )}

          {/* 订单商品汇总 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>商品/服务</span>
              <span className="font-bold text-slate-800">{order.items[0]?.title}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>实付总额</span>
              <span className="font-mono font-bold text-rose-600 text-sm">
                ¥{order.totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>支付方式</span>
              <span>微信安全支付 (已付款)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-white flex gap-2">
          {isPhysical && (
            <button
              onClick={() => {
                onConfirmReceipt?.(order.id);
                alert('已确认收货，设备可前往档案页进行一键扫码绑定');
                onClose();
              }}
              className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              确认收货
            </button>
          )}

          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
          >
            返回
          </button>
        </div>
      </div>
    </div>
  );
};
