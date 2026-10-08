import React, { useEffect, useState } from 'react';
import { Wallet, Store, BadgeCheck, CheckCircle2, X } from 'lucide-react';
import {
  apiConfirmWorkbenchSettlement,
  apiGetWorkbenchOverview,
  apiGetWorkbenchSettlements,
} from '../../services/merchantApi';
import type { WorkbenchOverview, WorkbenchSettlement } from '../../types/merchant';

interface Props {
  isOpen: boolean;
  token?: string | null;
  onClose: () => void;
}

const SETTLEMENT_STATE: Record<number, { label: string; cls: string }> = {
  0: { label: '待商家确认', cls: 'bg-amber-100 text-amber-800' },
  1: { label: '已确认待出金', cls: 'bg-blue-100 text-blue-800' },
  2: { label: '出金中', cls: 'bg-blue-100 text-blue-800' },
  3: { label: '已完成', cls: 'bg-teal-100 text-teal-800' },
  4: { label: '已驳回', cls: 'bg-red-100 text-red-700' }
};

const WX_APPLY: Record<number, string> = { 0: '未进件', 10: '审核中', 20: '已开通', 30: '已驳回' };

const fmt = (v: string | number | undefined | null) =>
  v == null ? '-' : `¥${Number(v).toFixed(2)}`;

/**
 * [healthmall-ext] 多商家 P2：B端资金中心弹窗（BW-017~022）
 * 概览（FN-016 口径）+ 名下门店结算单列表 + 结算单确认（FN-004）
 */
export const FinanceCenterModal: React.FC<Props> = ({ isOpen, token, onClose }) => {
  const [overview, setOverview] = useState<WorkbenchOverview | null>(null);
  const [settlements, setSettlements] = useState<WorkbenchSettlement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen || !token) return;
    setLoading(true);
    setError(null);
    Promise.all([apiGetWorkbenchOverview(token), apiGetWorkbenchSettlements(token)])
      .then(([overviewRes, settlementsRes]) => {
        setOverview(overviewRes.data);
        setSettlements(settlementsRes.data?.items || []);
      })
      .catch((err) => setError(err.message || '加载失败'))
      .finally(() => setLoading(false));
  }, [isOpen, token]);

  if (!isOpen) return null;

  const handleConfirm = async (settlementId: number) => {
    if (!token) return;
    setConfirming(settlementId);
    try {
      await apiConfirmWorkbenchSettlement(settlementId, token);
      setSettlements((prev) =>
        prev.map((s) => (s.settlement_id === settlementId ? { ...s, settlement_state: 1 as const } : s))
      );
    } catch (err: any) {
      setError(err.message || '确认失败');
    } finally {
      setConfirming(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white rounded-t-3xl p-5 max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-base flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-teal-700" />
            商家资金中心
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {loading && <p className="text-sm text-slate-400 py-6 text-center">加载中...</p>}
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

        {!loading && overview && (
          <>
            <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-teal-700 to-slate-900 text-white mb-3">
              <div className="flex items-center gap-1.5 text-xs text-teal-100">
                <Store className="w-3.5 h-3.5" />
                {overview.merchant_name}
                <span
                  className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    overview.wx_apply_status === 20 ? 'bg-teal-500 text-white' : 'bg-amber-400 text-amber-950'
                  }`}
                >
                  微信进件：{WX_APPLY[overview.wx_apply_status] || '未进件'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div>
                  <p className="text-[10px] text-teal-100">待结算/确认金额</p>
                  <p className="text-xl font-extrabold">{fmt(overview.pending_settle_amount)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-teal-100">已完成结算</p>
                  <p className="text-xl font-extrabold">{fmt(overview.settled_amount)}</p>
                </div>
              </div>
              <p className="text-[10px] text-teal-100 mt-2">门店 {overview.store_num} 家 · 资金由平台统一收款，按账期分账（FN-001/003）</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500">门店结算单</p>
              {settlements.length === 0 && (
                <p className="text-xs text-slate-400 py-4 text-center">暂无结算单，订单完成并到账期后自动生成（FN-002/024）</p>
              )}
              {settlements.map((s) => {
                const state = SETTLEMENT_STATE[s.settlement_state] || { label: '-', cls: 'bg-slate-100 text-slate-500' };
                return (
                  <div key={s.settlement_id} className="px-3 py-2.5 rounded-xl border border-slate-100 bg-slate-50/60">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-700">{s.settlement_number}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${state.cls}`}>{state.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      店铺 {s.store_id} · {s.period_start} ~ {s.period_end}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-sm font-extrabold text-teal-800">{fmt(s.settle_amount)}</p>
                      {s.settlement_state === 0 && (
                        <button
                          onClick={() => handleConfirm(s.settlement_id)}
                          disabled={confirming === s.settlement_id}
                          className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-teal-700 text-white flex items-center gap-1 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {confirming === s.settlement_id ? '确认中...' : '确认结算'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {overview.wx_apply_status !== 20 && (
              <div className="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-50 text-amber-800 text-[11px] leading-relaxed">
                <BadgeCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <p>完成微信特约商户进件后，订单资金方可自动分账到账（FN-033）；请前往管理后台「支付账户/进件」提交。</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
