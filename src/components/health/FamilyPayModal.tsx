import React, { useCallback, useEffect, useState } from 'react';
import { X, HandCoins, AlertTriangle, Loader2 } from 'lucide-react';
import {
  apiCancelFamilyPayRequest,
  apiDeclineFamilyPayRequest,
  apiGetFamilyPayRequests
} from '../../services/familyTradeApi';
import type { FamilyPayRequest } from '../../types/family';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  /** 代付人点「去支付」：切到收银台支付该订单 */
  onGoPay: (orderId: string, amount: number) => void;
}

const STATUS_TEXT: Record<string, string> = {
  PENDING: '待支付',
  PAYING: '支付中',
  PAID: '已代付',
  DECLINED: '已拒绝',
  EXPIRED: '已过期',
  CANCELLED: '已取消'
};

const fmtTime = (v?: string | null) => (v ? new Date(v).toLocaleString('zh-CN', { hour12: false }) : '-');

/**
 * [healthmall-ext] 亲情代付请求（NT-023）：我收到的（去支付/拒绝）+ 我发出的（取消）
 */
export const FamilyPayModal: React.FC<Props> = ({ isOpen, onClose, token, onGoPay }) => {
  const [requests, setRequests] = useState<FamilyPayRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiGetFamilyPayRequests(token);
      setRequests(res.data || []);
    } catch (err: any) {
      setError(err?.message || '加载失败');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isOpen && token) load();
  }, [isOpen, token, load]);

  if (!isOpen) return null;

  const decline = async (r: FamilyPayRequest) => {
    if (!token || !window.confirm(`确认拒绝为 ${r.requester_nickname || '家人'} 代付该订单？`)) return;
    setActing(r.pay_request_id);
    try {
      await apiDeclineFamilyPayRequest(token, r.pay_request_id);
      load();
    } catch (err: any) {
      setError(err?.message || '操作失败');
    } finally {
      setActing(null);
    }
  };

  const cancel = async (r: FamilyPayRequest) => {
    if (!token || !window.confirm('确认取消该代付请求？')) return;
    setActing(r.pay_request_id);
    try {
      await apiCancelFamilyPayRequest(token, r.pay_request_id);
      load();
    } catch (err: any) {
      setError(err?.message || '操作失败');
    } finally {
      setActing(null);
    }
  };

  const received = requests.filter((r) => r.direction === 'RECEIVED');
  const sent = requests.filter((r) => r.direction === 'SENT');

  const renderCard = (r: FamilyPayRequest, mine: 'RECEIVED' | 'SENT') => (
    <div key={r.pay_request_id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-slate-800">
            订单 {r.order_id}
            <span
              className={`ml-1.5 text-[9px] px-1.5 py-0.2 rounded font-bold ${
                r.status === 'PAID'
                  ? 'bg-emerald-100 text-emerald-700'
                  : r.status === 'PENDING' || r.status === 'PAYING'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {STATUS_TEXT[r.status] || r.status}
            </span>
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {mine === 'RECEIVED'
              ? `${r.requester_nickname || '家人'} 请求你代付`
              : `你请求 ${r.payer_nickname || '家人'} 代付`}
            {r.family_name ? ` · ${r.family_name}` : ''}
          </p>
          <p className="text-[10px] text-slate-400">
            有效期至 {fmtTime(r.expire_time)}
            {r.pay_time ? ` · 支付于 ${fmtTime(r.pay_time)}` : ''}
          </p>
        </div>
        <div className="text-sm font-black text-rose-600 font-mono">¥{Number(r.pay_amount).toFixed(2)}</div>
      </div>

      {mine === 'RECEIVED' && r.status === 'PENDING' && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              onClose();
              onGoPay(r.order_id, Number(r.pay_amount));
            }}
            className="flex-1 py-1.5 bg-purple-600 text-white text-[11px] font-bold rounded-lg"
          >
            去代付
          </button>
          <button
            onClick={() => decline(r)}
            disabled={acting === r.pay_request_id}
            className="flex-1 py-1.5 border border-slate-200 text-slate-500 text-[11px] font-bold rounded-lg disabled:opacity-50"
          >
            {acting === r.pay_request_id ? '处理中...' : '拒绝'}
          </button>
        </div>
      )}
      {mine === 'SENT' && r.status === 'PENDING' && (
        <button
          onClick={() => cancel(r)}
          disabled={acting === r.pay_request_id}
          className="w-full mt-2 py-1.5 border border-slate-200 text-slate-500 text-[11px] font-bold rounded-lg disabled:opacity-50"
        >
          {acting === r.pay_request_id ? '处理中...' : '取消请求'}
        </button>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative max-w-[430px] w-full mx-auto">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-purple-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤝</span>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">亲情代付 (OD-017)</h3>
              <p className="text-[9px] text-slate-500">代付人支付后订单标记「亲情代付」，退款原路退给代付人</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-3">
          {error && (
            <div className="flex items-start gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-2.5">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-6">
              <Loader2 className="w-4 h-4 animate-spin" /> 加载中...
            </div>
          )}

          {!loading && requests.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-xs space-y-2">
              <HandCoins className="w-10 h-10 mx-auto text-slate-300" />
              <div>暂无代付请求</div>
              <div className="text-[10px]">下单后可在收银台选择「请求家人代付」</div>
            </div>
          )}

          {received.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-800">我收到的</p>
              {received.map((r) => renderCard(r, 'RECEIVED'))}
            </div>
          )}
          {sent.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-800">我发出的</p>
              {sent.map((r) => renderCard(r, 'SENT'))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
