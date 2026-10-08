import React, { useEffect, useState } from 'react';
import { X, Check, Building2, MapPin } from 'lucide-react';
import { apiGetPortalList, MallPortal } from '../../services/mallApi';

interface Props {
  /** 当前选中门户 ID（null=平台聚合页） */
  currentPortalId?: number | null;
  isOpen: boolean;
  onClose: () => void;
  /** [healthmall-ext] 选中真实门户（P_A5：按门户筛选商品） */
  onSelectPortal: (portal: MallPortal) => void;
}

/**
 * [healthmall-ext] 区域门户切换抽屉（PC-008~011）：数据源改为真实门户列表
 * （GET /front/sys/portal/list，启用中门户）；选中后商品按门户门店集合过滤
 */
export const PortalSelectorSheet: React.FC<Props> = ({
  currentPortalId,
  isOpen,
  onClose,
  onSelectPortal
}) => {
  const [portals, setPortals] = useState<MallPortal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    apiGetPortalList()
      .then((list) => setPortals(list))
      .catch(() => setPortals([]))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl p-5 max-w-[430px] w-full mx-auto shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-800 text-sm">切换门户</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[11px] text-slate-500 my-3 leading-relaxed">
          切换后商品/门店按所选门户聚合范围展示（由平台后台「门户配置」统一管控）；
          家庭成员、健康档案与商城账户跨门户全量共享。
        </p>

        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto no-scrollbar">
          {loading && <p className="text-xs text-slate-400 text-center py-4">加载中...</p>}
          {!loading && portals.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-4">
              暂无可用门户（由平台后台「门户配置」维护）
            </p>
          )}
          {portals.map((p) => {
            const isSelected = currentPortalId === p.portal_id;
            return (
              <div
                key={p.portal_id}
                onClick={() => {
                  onSelectPortal(p);
                  onClose();
                }}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: p.brand_color || '#14B8A6' }}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">
                      {p.portal_name}
                      <span className="ml-1.5 text-[9px] font-normal text-slate-400">
                        {p.portal_type}
                      </span>
                    </h4>
                    <p className="text-[10px] text-slate-400">聚合门店 {p.store_count} 家</p>
                  </div>
                </div>

                {isSelected ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-teal-600">
                    <Check className="w-4 h-4" />
                    当前
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">切换</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400">
          受平台管理后台「门户配置」统一管控 (PC-008~011)
        </div>
      </div>
    </div>
  );
};
