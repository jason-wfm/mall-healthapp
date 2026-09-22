import React, { useState } from 'react';
import { X, Users, UserPlus, ShieldCheck, ShoppingCart, Share2, Copy, LogOut, Check } from 'lucide-react';
import { MOCK_FAMILY_MEMBERS } from '../../data/healthMockData';
import { FamilyMember } from '../../types/health';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FamilyCircleModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [members, setMembers] = useState<FamilyMember[]>(MOCK_FAMILY_MEMBERS);
  const [showInviteView, setShowInviteView] = useState(false);
  const [inviteCodeGenerated, setInviteCodeGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  // Toggle settings
  const [shareRecords, setShareRecords] = useState(true);
  const [shareReports, setShareReports] = useState(true);
  const [shareCart, setShareCart] = useState(true);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative max-w-[430px] w-full mx-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-teal-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏠</span>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">
                {showInviteView ? '邀请家庭圈新成员 (FM-016)' : '家庭圈健康空间 (FM-014~018)'}
              </h3>
              <p className="text-[9px] text-slate-500">主理人制 · 全家档案互通 · 共享购物车与代付</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-3.5">
          {!showInviteView ? (
            <>
              {/* Home Space Card (P16) */}
              <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-2xl p-4 shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-extrabold flex items-center gap-1.5">
                      <span>🏠 幸福之家</span>
                      <span className="bg-white/20 text-[9px] px-2 py-0.5 rounded-full font-bold">
                        主理人：张明
                      </span>
                    </h4>
                    <p className="text-[10px] text-purple-100 mt-1">
                      {members.length} / 10 位成员 (FM-014 上限10人) · 创建于 2026-06
                    </p>
                  </div>
                  <button
                    onClick={() => setShowInviteView(true)}
                    className="bg-white text-purple-900 font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>邀请</span>
                  </button>
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800">家庭圈成员</div>
                <div className="space-y-2">
                  {members.map((m) => (
                    <div
                      key={m.id}
                      className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{m.avatar}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800">{m.name}</span>
                            {m.role === 'leader' && (
                              <span className="bg-purple-100 text-purple-700 text-[8px] font-bold px-1.5 py-0.2 rounded">
                                主理人
                              </span>
                            )}
                            {m.deviceSynced && (
                              <span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-1.5 py-0.2 rounded">
                                血压仪已同步
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            健康评分：{m.healthScore}分 · {m.relation}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] text-teal-600 font-bold">只读共享中</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share Switch Controls (P16) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-3">
                <div className="text-xs font-bold text-slate-800">共享权限设置 (按类别开关)</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-600">🩺 健康档案与检测数据只读互通</span>
                    <button
                      onClick={() => setShareRecords(!shareRecords)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        shareRecords ? 'bg-teal-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${
                          shareRecords ? 'left-5.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-600">📄 体检报告及 AI 解读互通</span>
                    <button
                      onClick={() => setShareReports(!shareReports)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        shareReports ? 'bg-teal-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${
                          shareReports ? 'left-5.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <div>
                      <span className="text-slate-600 block">🛒 家庭共享购物车</span>
                      <span className="text-[9px] text-slate-400">家人加购商品汇聚同一购物车</span>
                    </div>
                    <button
                      onClick={() => setShareCart(!shareCart)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        shareCart ? 'bg-teal-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${
                          shareCart ? 'left-5.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tips & Rules */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 text-[10px] text-amber-900 space-y-1">
                <p>• <b>FM-008 代录入</b>：可为老人或儿童代录健康指标，标注“由主理人代录”。</p>
                <p>• <b>FM-015 纳管上限</b>：单用户最多被 3 个家庭圈纳管，保障个人数据边界。</p>
              </div>

              {/* Exit Family */}
              <button
                onClick={() => alert('已退出当前家庭圈')}
                className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 flex items-center justify-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>退出此家庭圈 (FM-017)</span>
              </button>
            </>
          ) : (
            /* Invite View (P70) */
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-2 text-xs">
                <h4 className="font-bold text-slate-800">① 邀请亲友加入</h4>
                <p className="text-[11px] text-slate-500">
                  生成专属邀请码或分享微信小程序卡片，亲友扫码即刻加入。
                </p>

                {inviteCodeGenerated ? (
                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-center space-y-1.5 mt-2">
                    <span className="text-[10px] text-teal-700 font-bold">专属家庭圈邀请码</span>
                    <div className="text-xl font-black text-teal-900 font-mono tracking-widest">
                      FAM-7K2P-9X
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="text-xs bg-teal-600 text-white px-3 py-1 rounded-lg font-bold inline-flex items-center gap-1 shadow-xs"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? '已复制' : '复制邀请码'}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setInviteCodeGenerated(true)}
                    className="w-full py-2.5 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-xs mt-2"
                  >
                    生成专属家庭圈邀请卡片与邀请码
                  </button>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-[10px] text-slate-500 leading-relaxed space-y-1">
                <div className="font-bold text-slate-700">② 《家庭健康数据共享协议》公示</div>
                <p>
                  加入即视为本人同意：健康档案检测数据、慢病指标默认对主理人互见（只读）；个人银行卡、支付凭证与收货地址严格不共享。
                </p>
              </div>

              <button
                onClick={() => setShowInviteView(false)}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
              >
                返回成员列表
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
