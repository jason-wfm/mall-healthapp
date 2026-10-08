import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X, UserPlus, Copy, Check, LogOut, Users, AlertTriangle, KeyRound, ShieldCheck, ShoppingCart, HandCoins } from 'lucide-react';
import {
  apiConfirmInvite,
  apiCreateFamily,
  apiCreateInvite,
  apiDissolveFamily,
  apiExitFamily,
  apiGetFamilyInfo,
  apiGetMyFamilies,
  apiGetPendingInvites,
  apiRejectInvite,
  apiRemoveMember,
  apiUpdateMyAuth
} from '../../services/familyApi';
import {
  apiGetFamilySharedCart,
  apiGetFamilySharedOrders,
  apiGetMyTradeAuths,
  apiUpdateMyTradeAuth
} from '../../services/familyTradeApi';
import {
  DATA_CATEGORIES,
  RELATION_OPTIONS,
  relationLabel,
  type DataCategory,
  type FamilyCircleSummary,
  type FamilyInfo,
  type FamilyInviteView,
  type InviteCreated,
  type RelationType,
  type SharedCartItem,
  type SharedOrderItem
} from '../../types/family';

interface Props {
  isOpen: boolean;
  token: string | null;
  onClose: () => void;
}

type ViewName = 'list' | 'detail' | 'invite' | 'join' | 'sharing';

const fmtDateTime = (v: string | number | undefined | null) => {
  if (v == null) return '-';
  const d = new Date(v as any);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};

/**
 * [healthmall-ext] 家庭圈健康空间（FM-014~018，接真实后端 /front/family/**）
 * 视图：list 我的圈列表（含创建/加入入口）→ detail 圈详情（成员/授权设置/管理操作）
 *      → invite 生成邀请码（明文仅此一次）→ join 凭码加入 + 定向邀请处理
 */
export const FamilyCircleModal: React.FC<Props> = ({ isOpen, token, onClose }) => {
  const [view, setView] = useState<ViewName>('list');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [families, setFamilies] = useState<FamilyCircleSummary[]>([]);
  const [pendingInvites, setPendingInvites] = useState<FamilyInviteView[]>([]);
  const [createName, setCreateName] = useState('');

  const [activeFamilyId, setActiveFamilyId] = useState<number | null>(null);
  const [info, setInfo] = useState<FamilyInfo | null>(null);
  const [authMap, setAuthMap] = useState<Record<string, string[]>>({});
  const [authNote, setAuthNote] = useState<string | null>(null);

  const [inviteRelation, setInviteRelation] = useState<RelationType>('OTHER');
  const [inviteCreated, setInviteCreated] = useState<InviteCreated | null>(null);
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const tickRef = useRef<number | null>(null);

  const [joinCode, setJoinCode] = useState('');

  // [healthmall-ext] 二期：交易共享（OD-017）与家人共享视图
  const [tradeAuths, setTradeAuths] = useState<Record<string, boolean>>({ CART: false, ORDER: false });
  const [sharedCarts, setSharedCarts] = useState<SharedCartItem[]>([]);
  const [sharedOrders, setSharedOrders] = useState<SharedOrderItem[]>([]);

  const openSharing = useCallback(() => {
    if (!token || !activeFamilyId) return;
    setError(null);
    setLoading(true);
    Promise.all([
      apiGetMyTradeAuths(token, activeFamilyId),
      apiGetFamilySharedCart(token),
      apiGetFamilySharedOrders(token)
    ])
      .then(([authsRes, cartRes, orderRes]) => {
        const map: Record<string, boolean> = { CART: false, ORDER: false };
        (authsRes.data || []).forEach((a) => {
          if (a.resource_type && a.auth_status === 'ACTIVE') map[a.resource_type] = true;
        });
        setTradeAuths(map);
        setSharedCarts(cartRes.data || []);
        setSharedOrders(orderRes.data || []);
        setView('sharing');
      })
      .catch((err: any) => setError(err?.message || '共享信息加载失败'))
      .finally(() => setLoading(false));
  }, [token, activeFamilyId]);

  const toggleTradeAuth = (resourceType: 'CART' | 'ORDER', enabled: boolean) =>
    run(`trade-${resourceType}`, async () => {
      if (!token || !activeFamilyId) return;
      await apiUpdateMyTradeAuth(token, { family_id: activeFamilyId, resource_type: resourceType, enabled });
      setTradeAuths((prev) => ({ ...prev, [resourceType]: enabled }));
    });

  const run = useCallback(async (key: string, fn: () => Promise<void>) => {
    setActionLoading(key);
    setError(null);
    try {
      await fn();
    } catch (err: any) {
      setError(err?.message || '操作失败');
    } finally {
      setActionLoading(null);
    }
  }, []);

  const loadLists = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [famRes, pendingRes] = await Promise.all([apiGetMyFamilies(token), apiGetPendingInvites(token)]);
      setFamilies(famRes.data || []);
      setPendingInvites(pendingRes.data || []);
    } catch (err: any) {
      setError(err?.message || '加载失败');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const openDetail = useCallback(
    (familyId: number) => {
      if (!token) return;
      setActiveFamilyId(familyId);
      setAuthNote(null);
      setLoading(true);
      setError(null);
      apiGetFamilyInfo(token, familyId)
        .then((res) => {
          setInfo(res.data);
          const map: Record<string, string[]> = {};
          (res.data?.my_authorizations || [])
            .filter((a) => a.auth_status === 'ACTIVE')
            .forEach((a) => {
              try {
                map[a.data_category] = a.allowed_fields ? JSON.parse(a.allowed_fields) : [];
              } catch {
                map[a.data_category] = [];
              }
            });
          setAuthMap(map);
          setView('detail');
        })
        .catch((err: any) => setError(err?.message || '加载失败'))
        .finally(() => setLoading(false));
    },
    [token]
  );

  useEffect(() => {
    if (isOpen && token) {
      setView('list');
      setInfo(null);
      setInviteCreated(null);
      setJoinCode('');
      setCreateName('');
      loadLists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, token]);

  // 邀请码倒计时
  useEffect(() => {
    if (!inviteCreated) return;
    const expireAt = new Date(inviteCreated.expire_time as any).getTime();
    const tick = () => setRemaining(Math.max(0, Math.ceil((expireAt - Date.now()) / 1000)));
    tick();
    tickRef.current = window.setInterval(tick, 1000);
    return () => {
      if (tickRef.current != null) window.clearInterval(tickRef.current);
    };
  }, [inviteCreated]);

  if (!isOpen) return null;

  const handleCreate = () =>
    run('create', async () => {
      if (!token || !createName.trim()) {
        setError('请填写家庭圈名称');
        return;
      }
      const res = await apiCreateFamily(token, createName.trim());
      setCreateName('');
      if (res.data?.family_id) {
        await loadLists();
        openDetail(res.data.family_id);
      }
    });

  const handleGenerateInvite = () =>
    run('invite', async () => {
      if (!token || !activeFamilyId) return;
      const res = await apiCreateInvite(token, { family_id: activeFamilyId, relation_type: inviteRelation });
      setInviteCreated(res.data);
    });

  const handleCopy = async () => {
    if (!inviteCreated) return;
    try {
      await navigator.clipboard.writeText(inviteCreated.invite_code);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = inviteCreated.invite_code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleJoinByCode = () =>
    run('join', async () => {
      if (!token || !joinCode.trim()) {
        setError('请输入邀请码');
        return;
      }
      const res = await apiConfirmInvite(token, { invite_code: joinCode.trim() });
      setJoinCode('');
      setView('list');
      await loadLists();
      if (res.data?.family_id) openDetail(res.data.family_id);
    });

  const handleAcceptPending = (invite: FamilyInviteView) =>
    run(`accept-${invite.invite_id}`, async () => {
      if (!token) return;
      const res = await apiConfirmInvite(token, { invite_id: invite.invite_id });
      setPendingInvites((prev) => prev.filter((i) => i.invite_id !== invite.invite_id));
      setView('list');
      await loadLists();
      if (res.data?.family_id) openDetail(res.data.family_id);
    });

  const handleRejectPending = (invite: FamilyInviteView) =>
    run(`reject-${invite.invite_id}`, async () => {
      if (!token) return;
      await apiRejectInvite(token, invite.invite_id);
      setPendingInvites((prev) => prev.filter((i) => i.invite_id !== invite.invite_id));
    });

  const toggleCategory = (cat: DataCategory, on: boolean) =>
    run(`auth-${cat}`, async () => {
      if (!token || !activeFamilyId) return;
      const fields = on ? DATA_CATEGORIES.find((c) => c.key === cat)!.fields.map((f) => f.key).join(',') : '';
      const res = await apiUpdateMyAuth(token, { family_id: activeFamilyId, data_category: cat, allowed_fields: fields });
      setAuthMap((prev) => ({
        ...prev,
        [cat]: res.data?.allowed_fields ? safeParse(res.data.allowed_fields) : []
      }));
      setAuthNote(`${categoryLabel(cat)}已${on ? '全量开启' : '关闭共享'}${res.data ? ` (v${res.data.authorization_version})` : ''}`);
    });

  const toggleField = (cat: DataCategory, fieldKey: string, on: boolean) =>
    run(`auth-${cat}`, async () => {
      if (!token || !activeFamilyId) return;
      const cur = authMap[cat] || [];
      const next = on ? [...cur, fieldKey] : cur.filter((f) => f !== fieldKey);
      const res = await apiUpdateMyAuth(token, {
        family_id: activeFamilyId,
        data_category: cat,
        allowed_fields: next.join(',')
      });
      setAuthMap((prev) => ({
        ...prev,
        [cat]: res.data?.allowed_fields ? safeParse(res.data.allowed_fields) : []
      }));
      setAuthNote(`授权已更新${res.data ? ` (v${res.data.authorization_version})` : ''}`);
    });

  const handleExit = () => {
    if (!window.confirm('确认退出该家庭圈？退出后你的数据共享立即失效')) return;
    run('exit', async () => {
      if (!token || !activeFamilyId) return;
      await apiExitFamily(token, activeFamilyId);
      setView('list');
      setInfo(null);
      await loadLists();
    });
  };

  const handleRemove = (memberId: number, name: string) => {
    if (!window.confirm(`确认将「${name}」移出家庭圈？其数据共享立即失效`)) return;
    run(`remove-${memberId}`, async () => {
      if (!token || !activeFamilyId) return;
      await apiRemoveMember(token, { family_id: activeFamilyId, member_id: memberId });
      if (activeFamilyId) openDetail(activeFamilyId);
    });
  };

  const handleDissolve = () => {
    if (!window.confirm('确认解散家庭圈？全员退出、授权立即失效、待处理邀请自动取消')) return;
    run('dissolve', async () => {
      if (!token || !activeFamilyId) return;
      await apiDissolveFamily(token, activeFamilyId);
      setView('list');
      setInfo(null);
      await loadLists();
    });
  };

  const mmss = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative max-w-[430px] w-full mx-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-teal-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏠</span>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">
                {view === 'invite' ? '邀请家庭圈新成员 (FM-016)' : '家庭圈健康空间 (FM-014~018)'}
              </h3>
              <p className="text-[9px] text-slate-500">主理人制 · 成员本人授权 · 退出即失效</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-3.5">
          {error && (
            <div className="flex items-start gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-2.5">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {loading && <p className="text-sm text-slate-400 py-6 text-center">加载中...</p>}

          {!loading && view === 'list' && (
            <>
              {families.length === 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                  <p className="text-xs text-slate-500">你还没有加入任何家庭圈</p>
                  <p className="text-[10px] text-slate-400 mt-1">创建一个圈子邀请家人，或输入亲友的邀请码加入</p>
                </div>
              )}

              {families.map((f) => {
                const dissolved = f.family_status === 'DISSOLVED';
                return (
                  <button
                    key={f.family_id}
                    disabled={dissolved}
                    onClick={() => openDetail(f.family_id)}
                    className={`w-full text-left rounded-2xl p-3.5 border transition-all ${
                      dissolved
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white border-transparent shadow-md active:scale-[0.99]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold">🏠 {f.family_name}</h4>
                      {dissolved ? (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-500 font-bold">已解散</span>
                      ) : (
                        <span className="text-[10px] opacity-90">{f.member_count} / {f.member_limit} 位成员</span>
                      )}
                    </div>
                    <p className={`text-[10px] mt-1 ${dissolved ? 'text-slate-400' : 'text-purple-100'}`}>
                      {f.is_leader ? '我是主理人' : relationLabel(f.relation_type)} · {f.family_no} · {fmtDateTime(f.join_time)} 加入
                    </p>
                  </button>
                );
              })}

              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <div className="text-xs font-bold text-slate-800">创建新的家庭圈</div>
                <div className="flex gap-2">
                  <input
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    maxLength={64}
                    placeholder="如：幸福之家"
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                  <button
                    onClick={handleCreate}
                    disabled={actionLoading === 'create'}
                    className="px-3 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl disabled:opacity-50"
                  >
                    {actionLoading === 'create' ? '创建中...' : '创建'}
                  </button>
                </div>
                <p className="text-[9px] text-slate-400">创建人即主理人 · 单用户最多加入 3 个家庭圈 (FM-015)</p>
              </div>

              <button
                onClick={() => setView('join')}
                className="w-full py-2.5 rounded-xl border border-teal-200 text-teal-700 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                凭邀请码加入
                {pendingInvites.length > 0 && (
                  <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                    {pendingInvites.length} 个待处理邀请
                  </span>
                )}
              </button>
            </>
          )}

          {!loading && view === 'detail' && info && (
            <>
              <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-2xl p-4 shadow-md">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-extrabold">🏠 {info.family.family_name}</h4>
                  {info.is_leader && (
                    <span className="bg-white/20 text-[9px] px-2 py-0.5 rounded-full font-bold">我是主理人</span>
                  )}
                </div>
                <p className="text-[10px] text-purple-100 mt-1">
                  {info.member_count} / {info.family.member_limit} 位成员 · {info.family.family_no}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800">家庭圈成员</div>
                {info.members.map((m) => (
                  <div
                    key={m.member_id}
                    className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">
                        {(m.user_nickname || '家').slice(0, 1)}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800">{m.user_nickname || `成员${m.user_id}`}</span>
                          {!!m.is_leader && (
                            <span className="bg-purple-100 text-purple-700 text-[8px] font-bold px-1.5 py-0.2 rounded">主理人</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {relationLabel(m.relation_type)} · {fmtDateTime(m.join_time)} 加入
                        </p>
                      </div>
                    </div>
                    {info.is_leader && !m.is_leader && (
                      <button
                        onClick={() => handleRemove(m.member_id, m.user_nickname || `成员${m.user_id}`)}
                        disabled={actionLoading === `remove-${m.member_id}`}
                        className="text-[10px] text-rose-500 font-bold px-2 py-1 rounded-lg hover:bg-rose-50 disabled:opacity-50"
                      >
                        移除
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-800">我的共享授权设置 (FM-018)</div>
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                </div>
                <p className="text-[9px] text-slate-400 -mt-1.5">仅本人可设置，改动即时生效并记录版本；退出后共享立即失效</p>
                {DATA_CATEGORIES.map((cat) => {
                  const fields = authMap[cat.key] || [];
                  const allOn = fields.length === cat.fields.length;
                  return (
                    <div key={cat.key} className="border-b border-slate-100 last:border-b-0 pb-2 last:pb-0">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-xs text-slate-600">
                          {cat.icon} {cat.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <Switch on={allOn} loading={actionLoading === `auth-${cat.key}`} onChange={(on) => toggleCategory(cat.key, on)} />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {cat.fields.map((f) => {
                          const on = fields.includes(f.key);
                          return (
                            <button
                              key={f.key}
                              onClick={() => toggleField(cat.key, f.key, !on)}
                              disabled={actionLoading === `auth-${cat.key}`}
                              className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors disabled:opacity-50 ${
                                on ? 'bg-teal-50 border-teal-300 text-teal-700 font-bold' : 'bg-white border-slate-200 text-slate-400'
                              }`}
                            >
                              {f.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {authNote && <p className="text-[10px] text-teal-700">{authNote}</p>}
              </div>

              <button
                onClick={openSharing}
                className="w-full py-2.5 rounded-xl border border-purple-200 text-purple-700 text-xs font-bold hover:bg-purple-50 flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                交易共享与亲情代付 (OD-017)
              </button>

              {info.is_leader && (
                <button
                  onClick={() => {
                    setInviteCreated(null);
                    setView('invite');
                  }}
                  className="w-full py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  生成邀请码邀请家人
                </button>
              )}

              {info.is_leader ? (
                <button
                  onClick={handleDissolve}
                  disabled={actionLoading === 'dissolve'}
                  className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {actionLoading === 'dissolve' ? '解散中...' : '解散家庭圈'}
                </button>
              ) : (
                <button
                  onClick={handleExit}
                  disabled={actionLoading === 'exit'}
                  className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  退出此家庭圈 (FM-017)
                </button>
              )}

              <button onClick={() => setView('list')} className="w-full py-2 rounded-xl text-slate-500 text-xs font-bold">
                返回我的家庭圈
              </button>
            </>
          )}

          {!loading && view === 'invite' && (
            <div className="space-y-4">
              {!inviteCreated ? (
                <>
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-2 text-xs">
                    <h4 className="font-bold text-slate-800">① 选择与家人的关系</h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {RELATION_OPTIONS.map((o) => (
                        <button
                          key={o.key}
                          onClick={() => setInviteRelation(o.key)}
                          className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                            inviteRelation === o.key
                              ? 'bg-teal-600 border-teal-600 text-white font-bold'
                              : 'bg-white border-slate-200 text-slate-500'
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleGenerateInvite}
                    disabled={actionLoading === 'invite'}
                    className="w-full py-2.5 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50"
                  >
                    {actionLoading === 'invite' ? '生成中...' : '生成专属家庭圈邀请码'}
                  </button>
                </>
              ) : (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center space-y-2">
                  <span className="text-[10px] text-teal-700 font-bold">专属家庭圈邀请码（30 分钟内有效）</span>
                  <div className={`text-xl font-black text-teal-900 font-mono tracking-widest ${remaining === 0 ? 'opacity-40' : ''}`}>
                    {inviteCreated.invite_code}
                  </div>
                  <p className="text-[10px] text-teal-600">
                    {remaining > 0 ? `剩余有效期 ${mmss} · 明文仅显示这一次，请立即分享` : '已过期，请返回重新生成'}
                  </p>
                  <button
                    onClick={handleCopy}
                    disabled={remaining === 0}
                    className="text-xs bg-teal-600 text-white px-3 py-1 rounded-lg font-bold inline-flex items-center gap-1 shadow-xs disabled:opacity-50"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? '已复制' : '复制邀请码'}</span>
                  </button>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-[10px] text-slate-500 leading-relaxed space-y-1">
                <div className="font-bold text-slate-700">② 《家庭健康数据共享协议》</div>
                <p>家人凭码加入后，默认不共享任何数据；由成员本人在授权设置中逐类开启（只读）。</p>
                <p>个人银行卡、支付凭证与收货地址严格不共享。</p>
              </div>

              <button
                onClick={() => setView(info ? 'detail' : 'list')}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
              >
                返回
              </button>
            </div>
          )}

          {!loading && view === 'join' && (
            <div className="space-y-3.5">
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <div className="text-xs font-bold text-slate-800">输入家人分享的邀请码</div>
                <input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="如 FAM-7K2P9XQ4"
                  className="w-full text-sm font-mono tracking-widest px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
                <button
                  onClick={handleJoinByCode}
                  disabled={actionLoading === 'join'}
                  className="w-full py-2 bg-teal-600 text-white text-xs font-bold rounded-xl disabled:opacity-50"
                >
                  {actionLoading === 'join' ? '加入中...' : '确认加入'}
                </button>
              </div>

              {pendingInvites.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-800">定向邀请我的</div>
                  {pendingInvites.map((inv) => (
                    <div key={inv.invite_id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
                      <p className="text-xs font-bold text-slate-800">
                        {inv.family_name}
                        <span className="text-[10px] font-normal text-slate-400 ml-1.5">
                          {inv.inviter_name || '家人'}邀请 · {relationLabel(inv.relation_type)}
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">有效期至 {fmtDateTime(inv.expire_time)}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleAcceptPending(inv)}
                          disabled={actionLoading === `accept-${inv.invite_id}`}
                          className="flex-1 py-1.5 bg-teal-600 text-white text-[11px] font-bold rounded-lg disabled:opacity-50"
                        >
                          {actionLoading === `accept-${inv.invite_id}` ? '加入中...' : '接受邀请'}
                        </button>
                        <button
                          onClick={() => handleRejectPending(inv)}
                          disabled={actionLoading === `reject-${inv.invite_id}`}
                          className="flex-1 py-1.5 border border-slate-200 text-slate-500 text-[11px] font-bold rounded-lg disabled:opacity-50"
                        >
                          拒绝
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={() => setView('list')} className="w-full py-2 rounded-xl text-slate-500 text-xs font-bold">
                返回
              </button>
            </div>
          )}

          {!loading && view === 'sharing' && activeFamilyId && (
            <div className="space-y-3.5">
              <div className="bg-purple-50/60 border border-purple-200/80 rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                  <HandCoins className="w-4 h-4 text-purple-600" />
                  我的交易共享授权 (OD-017/ADR-016)
                </div>
                <p className="text-[10px] text-purple-700 -mt-1.5">
                  开启后家人可见对应数据的白名单视图；地址、支付记录、优惠券永不共享；退出/解散即时失效
                </p>
                {([['CART', '🛒 共享我的购物车', '商品名/数量/库存（不含价格）'], ['ORDER', '🧾 共享我的订单', '订单号/状态/商品/金额等 7 字段']] as const).map(
                  ([key, label, desc]) => (
                    <div key={key} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-purple-100">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{label}</p>
                        <p className="text-[10px] text-slate-400">{desc}</p>
                      </div>
                      <Switch
                        on={tradeAuths[key]}
                        loading={actionLoading === `trade-${key}`}
                        onChange={(on) => toggleTradeAuth(key, on)}
                      />
                    </div>
                  )
                )}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800">家人共享给我的购物车</div>
                {sharedCarts.length === 0 && <p className="text-[10px] text-slate-400">暂无家人开启购物车共享</p>}
                {sharedCarts.map((it, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800 truncate">{it.product_name}</p>
                      <p className="text-[10px] text-slate-400">
                        {it.masked_owner_name} · {relationLabel(it.relation_type)} · {it.family_name}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold ${it.available ? 'text-emerald-700' : 'text-rose-500'}`}>
                      x{it.quantity} · {it.available ? '可代购' : '已失效'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800">家人共享给我的订单</div>
                {sharedOrders.length === 0 && <p className="text-[10px] text-slate-400">暂无家人开启订单共享</p>}
                {sharedOrders.map((o) => (
                  <div key={`${o.order_id}-${o.masked_owner_name}`} className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-slate-800">{o.order_id}</p>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded">
                        {o.fulfillment_node}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 truncate">
                      {o.item_titles.join('、') || '-'} · 共{o.quantity}件
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[10px] text-slate-400">
                        {o.masked_owner_name} · {relationLabel(o.relation_type)} · {o.family_name}
                      </span>
                      <span className="font-mono font-bold text-rose-600">¥{Number(o.pay_amount).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => setView('detail')} className="w-full py-2 rounded-xl text-slate-500 text-xs font-bold">
                返回圈详情
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function categoryLabel(key: string): string {
  return DATA_CATEGORIES.find((c) => c.key === key)?.label || key;
}

function safeParse(json: string): string[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

const Switch: React.FC<{ on: boolean; loading?: boolean; onChange: (on: boolean) => void }> = ({ on, loading, onChange }) => (
  <button
    onClick={() => onChange(!on)}
    disabled={loading}
    className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${on ? 'bg-teal-600' : 'bg-slate-300'} ${
      loading ? 'opacity-60' : ''
    }`}
  >
    <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${on ? 'left-5.5' : 'left-0.5'}`} />
  </button>
);
