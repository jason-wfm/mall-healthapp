import React, { useState } from 'react';
import { Product, GroupTeam } from '../../types';
import { MOCK_GROUP_TEAMS } from '../../data/mockData';
import { 
  X, 
  Share2, 
  Users, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Minus, 
  Plus, 
  Check, 
  ShoppingBag,
  Heart
} from 'lucide-react';

interface Props {
  product: Product;
  initialMode?: 'normal' | 'group' | 'bargain' | 'seckill';
  onClose: () => void;
  onAddToCart: (product: Product, skuName: string, quantity: number, price: number, buyType: any) => void;
  onOpenSharePoster: (title: string, desc: string, img: string) => void;
  onJoinTeam: (team: GroupTeam) => void;
}

export const ProductDetailModal: React.FC<Props> = ({
  product,
  initialMode = 'normal',
  onClose,
  onAddToCart,
  onOpenSharePoster,
  onJoinTeam
}) => {
  const [selectedSkuIndex, setSelectedSkuIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showSkuDrawer, setShowSkuDrawer] = useState(false);
  const [buyType, setBuyType] = useState<'normal' | 'group' | 'bargain' | 'seckill'>(
    initialMode !== 'normal'
      ? initialMode
      : product.isGroupBuy
      ? 'group'
      : product.isSeckill
      ? 'seckill'
      : 'normal'
  );
  const [isFavorite, setIsFavorite] = useState(false);

  const skus = product.skus || [
    { id: 'default', specs: '官方标配', price: product.price, stock: product.stock }
  ];
  const activeSku = skus[selectedSkuIndex] || skus[0];

  const currentPrice =
    buyType === 'group' && product.groupPrice
      ? product.groupPrice
      : buyType === 'seckill' && product.seckillPrice
      ? product.seckillPrice
      : activeSku.price;

  // Active teams for this product if group buying
  const productTeams = MOCK_GROUP_TEAMS.filter((t) => t.productId === product.id);

  const handleConfirmPurchase = () => {
    onAddToCart(product, activeSku.specs, quantity, currentPrice, buyType);
    setShowSkuDrawer(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
      <div className="bg-slate-100 rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Header Bar with close & share */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center pointer-events-auto hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={() =>
              onOpenSharePoster(
                product.title,
                `拼团特惠仅需 ¥${product.groupPrice || product.price}，正品保障！`,
                product.coverImage
              )
            }
            className="w-8 h-8 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center pointer-events-auto hover:bg-black/60 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Detail Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar touch-scroll pb-24">
          {/* Main Hero Image */}
          <div className="w-full h-72 bg-slate-200 relative">
            <img
              src={product.coverImage}
              alt={product.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {product.distributionCommission && (
              <div className="absolute bottom-3 left-3 bg-emerald-900/80 backdrop-blur-md text-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 border border-emerald-400/30">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>分销返佣：分享可赚 ¥{product.distributionCommission}</span>
              </div>
            )}
          </div>

          {/* Social Price Strip */}
          <div className="bg-white p-3.5 border-b border-slate-100">
            {product.isGroupBuy && (
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {product.groupRequiredUsers}人拼团专享
                </span>
                <span className="text-[10px] text-rose-600 font-medium">
                  已成功拼单 {product.groupActiveCount} 次
                </span>
              </div>
            )}

            {product.isSeckill && (
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Zap className="w-3 h-3 fill-amber-300 text-amber-300" /> 限时秒杀
                </span>
                <span className="text-[10px] text-red-600 font-medium">
                  抢购进度 {product.seckillSoldPercent}%
                </span>
              </div>
            )}

            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-rose-600 font-mono">
                  ¥{currentPrice}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  ¥{product.originalPrice}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">已售 {product.salesCount} 件</span>
            </div>

            <h1 className="text-sm font-bold text-slate-900 mt-2 leading-snug">
              {product.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">{product.subTitle}</p>

            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {product.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Active Teams on this Product */}
          {product.isGroupBuy && productTeams.length > 0 && (
            <div className="bg-white p-3.5 mt-2 border-b border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-rose-500" />
                  <span>小伙伴正在拼单，可直接参与</span>
                </div>
                <span className="text-[10px] text-slate-400">2人即成团</span>
              </div>

              <div className="space-y-2">
                {productTeams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-rose-50/50 border border-rose-100"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={team.leader.avatar}
                        alt={team.leader.name}
                        className="w-8 h-8 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-xs font-semibold text-slate-800">
                        {team.leader.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right text-[10px]">
                        <div className="text-rose-600 font-bold">还差 1 人成团</div>
                        <div className="text-slate-400 font-mono">剩余 45:10</div>
                      </div>
                      <button
                        onClick={() => {
                          onJoinTeam(team);
                          onClose();
                        }}
                        className="bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg"
                      >
                        去参团
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guarantees */}
          <div className="bg-white p-3 mt-2 flex items-center justify-around text-[10px] text-slate-600 border-b border-slate-100">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" /> 正品保障
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-rose-500" /> 全场包邮
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" /> 极速发货
            </span>
          </div>
        </div>

        {/* Bottom Fixed Action Bar respecting Safe-Area-Inset */}
        <div className="bg-white border-t border-slate-200 px-3.5 py-2.5 shrink-0 z-30 flex items-center gap-2">
          {/* Collect heart */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="flex flex-col items-center justify-center p-1 text-slate-600 hover:text-rose-500"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
            <span className="text-[9px]">收藏</span>
          </button>

          {/* Share */}
          <button
            onClick={() =>
              onOpenSharePoster(
                product.title,
                `特惠只要 ¥${currentPrice}`,
                product.coverImage
              )
            }
            className="flex flex-col items-center justify-center p-1 text-slate-600 hover:text-slate-900"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-[9px]">分享</span>
          </button>

          {/* Dual Action Buttons */}
          <div className="flex-1 flex gap-2">
            {product.isGroupBuy ? (
              <>
                <button
                  onClick={() => {
                    setBuyType('normal');
                    setShowSkuDrawer(true);
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-1.5 px-2 text-center active:scale-95 transition-transform"
                >
                  <div className="text-[10px] leading-tight">单独购买</div>
                  <div className="text-xs font-bold font-mono">¥{product.price}</div>
                </button>

                <button
                  onClick={() => {
                    setBuyType('group');
                    setShowSkuDrawer(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl py-1.5 px-2 text-center active:scale-95 transition-transform shadow-md shadow-rose-500/20"
                >
                  <div className="text-[10px] leading-tight">发起拼团</div>
                  <div className="text-xs font-bold font-mono">¥{product.groupPrice}</div>
                </button>
              </>
            ) : product.isSeckill ? (
              <button
                onClick={() => {
                  setBuyType('seckill');
                  setShowSkuDrawer(true);
                }}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold py-2.5 rounded-xl text-xs active:scale-95 shadow-md shadow-red-500/30 flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4" />
                <span>立即秒杀 ¥{product.seckillPrice || product.price}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setBuyType('normal');
                  setShowSkuDrawer(true);
                }}
                className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs active:scale-95 shadow-md flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>立即购买 ¥{product.price}</span>
              </button>
            )}
          </div>
        </div>

        {/* SKU Selector Bottom Drawer */}
        {showSkuDrawer && (
          <div className="absolute inset-0 bg-black/50 z-40 flex flex-col justify-end animate-in fade-in duration-150">
            <div className="bg-white rounded-t-3xl p-4 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Product mini header */}
              <div className="flex gap-3 pb-3 border-b border-slate-100 relative">
                <img
                  src={product.coverImage}
                  alt={product.title}
                  className="w-16 h-16 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-rose-600 text-lg font-black font-mono">
                    ¥{currentPrice}
                  </div>
                  <div className="text-xs text-slate-500">
                    已选：{activeSku.specs}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    库存：{activeSku.stock} 件
                  </div>
                </div>
                <button
                  onClick={() => setShowSkuDrawer(false)}
                  className="absolute right-0 top-0 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* SKU Specs */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  规格规格
                </label>
                <div className="flex flex-wrap gap-2">
                  {skus.map((s, idx) => {
                    const isSelected = idx === selectedSkuIndex;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSkuIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-rose-50 border-rose-500 text-rose-600 font-bold'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {s.specs}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800">购买数量</span>
                <div className="flex items-center gap-3 bg-slate-100 px-2 py-1 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-slate-600 hover:text-slate-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold font-mono min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-slate-600 hover:text-slate-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                id="btn-confirm-sku-order"
                onClick={handleConfirmPurchase}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 text-white font-bold py-3 rounded-xl text-xs shadow-md shadow-rose-500/25 active:scale-95 transition-all"
              >
                确定 (合计 ¥{(currentPrice * quantity).toFixed(2)})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
