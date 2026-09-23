import React, { useState } from 'react';
import { X, Layers, Code2, Smartphone, ShieldCheck, Share2, Users, Flame, Zap, Sparkles } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const ArchitectureDocModal: React.FC<Props> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<'adaptation' | 'social' | 'code'>('adaptation');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-slate-200">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-white text-sm sm:text-base truncate">
                ShopSuite Mobile 移动端适配与架构解析
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                750rpx 多端自适应原理、安全区方案与社交电商业务闭环
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            title="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (支持手机端水平平滑滑动，避免撑开宽度) */}
        <div className="flex border-b border-slate-800 px-3 sm:px-6 bg-slate-950/40 text-xs overflow-x-auto no-scrollbar scroll-smooth shrink-0">
          <button
            onClick={() => setActiveSection('adaptation')}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
              activeSection === 'adaptation'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>1. 移动端 750rpx 适配方案</span>
          </button>

          <button
            onClick={() => setActiveSection('social')}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
              activeSection === 'social'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>2. 社交电商四大业务模型</span>
          </button>

          <button
            onClick={() => setActiveSection('code')}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
              activeSection === 'code'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>3. 核心配置与代码实现</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-4 sm:space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {activeSection === 'adaptation' && (
            <div className="space-y-4 sm:space-y-5">
              {/* Point 1 */}
              <div className="bg-slate-800/40 p-3.5 sm:p-4 rounded-2xl border border-slate-800">
                <h3 className="font-bold text-white text-xs sm:text-sm mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px] sm:text-xs font-mono shrink-0">
                    01
                  </span>
                  <span>750rpx 响应式设计基准与跨端换算公式</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mb-2">
                  Uni-app 遵循微信小程序标准，将屏幕宽度均分为 750 份：
                </p>
                <div className="bg-slate-950 p-2.5 sm:p-3 rounded-xl font-mono text-[11px] sm:text-xs text-amber-300 border border-slate-800 mb-2 overflow-x-auto break-all">
                  1rpx = (deviceWidth / 750) px
                  <br />
                  在 375px (iPhone 6/7/8) 屏幕上：1rpx = 0.5px (750rpx = 375px)
                  <br />
                  在 393px (iPhone 15 Pro) 屏幕上：1rpx = 0.524px
                </div>
                <ul className="text-[11px] sm:text-xs text-slate-300 list-disc list-inside space-y-1">
                  <li><strong>小程序端</strong>：底层直接原生支持 rpx 单位。</li>
                  <li><strong>H5 端适配</strong>：Uni-app 通过 PostCSS 编译插件将 rpx 转换为 <code>vw</code> 或 <code>rem</code>，实现全屏幕等比例自适应。</li>
                  <li><strong>宽屏/PC 端约束</strong>：设置 <code>max-width: 480px; margin: 0 auto;</code>，防止在 PC 显示器无限放大导致布局扭曲。</li>
                </ul>
              </div>

              {/* Point 2 */}
              <div className="bg-slate-800/40 p-3.5 sm:p-4 rounded-2xl border border-slate-800">
                <h3 className="font-bold text-white text-xs sm:text-sm mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] sm:text-xs font-mono shrink-0">
                    02
                  </span>
                  <span>全面屏灵动岛、刘海与底部安全区 (Safe Area Inset)</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mb-2">
                  针对 iPhone X 及后续全面屏设备底部 Home Indicator 遮挡操作按钮的问题：
                </p>
                <div className="bg-slate-950 p-2.5 sm:p-3 rounded-xl font-mono text-[10px] sm:text-xs text-emerald-400 border border-slate-800 mb-2 overflow-x-auto">
                  {`/* 底部吸底操作栏 (如购物车结算条、立即拼团条) */
.fixed-bottom-bar {
  padding-bottom: constant(safe-area-inset-bottom); /* iOS 11.0 */
  padding-bottom: env(safe-area-inset-bottom);      /* iOS 11.2+ */
  box-sizing: content-box;
}`}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300">
                  <strong>自定义导航栏高度</strong>：通过 <code>uni.getSystemInfoSync()</code> 获取 <code>statusBarHeight</code>，自定义 NavBar 高度固定为 <code>statusBarHeight + 44px</code>，避免与胶囊按钮重叠。
                </p>
              </div>

              {/* Point 3 */}
              <div className="bg-slate-800/40 p-3.5 sm:p-4 rounded-2xl border border-slate-800">
                <h3 className="font-bold text-white text-xs sm:text-sm mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] sm:text-xs font-mono shrink-0">
                    03
                  </span>
                  <span>Retina 高分屏 1px 细线边框 (Hairline Border)</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300">
                  在高 DPR 设备（如 @2x、@3x Retina 屏）上，<code>border: 1px solid</code> 会显得粗大。ShopSuite 采用伪元素配合 <code>transform: scaleY(0.5)</code> 实现真正的 0.5px 高清细线。
                </p>
              </div>
            </div>
          )}

          {activeSection === 'social' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Group Buying */}
              <div className="bg-slate-800/40 p-3.5 sm:p-4 rounded-2xl border border-rose-500/30 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs sm:text-sm">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>1. 拼团裂变 (Group Buying)</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300">
                  <strong>核心逻辑</strong>：阶梯定价（如 2人成团享 7 折优惠）。开团者作为团长生成专属团链接，参团者扫码加入。
                </p>
                <div className="bg-slate-950 p-2.5 rounded-xl text-[10px] sm:text-[11px] font-mono text-slate-400 border border-slate-800">
                  状态机: 待成团(开团倒计时) → 成团成功(批量发货) → 超时未满(自动全额原路退款)
                </div>
              </div>

              {/* Bargaining */}
              <div className="bg-slate-800/40 p-3.5 sm:p-4 rounded-2xl border border-orange-500/30 space-y-2">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-xs sm:text-sm">
                  <Flame className="w-4 h-4 shrink-0" />
                  <span>2. 砍价免费拿 (Bargaining)</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300">
                  <strong>防刷衰减算法</strong>：用户首次自砍获得 30%~50% 额度暴击；后续好友帮砍金额逐步衰减，刺激更多朋友参与助力。
                </p>
                <div className="bg-slate-950 p-2.5 rounded-xl text-[10px] sm:text-[11px] font-mono text-slate-400 border border-slate-800">
                  当前价 = 原价 - (自砍金额 + ∑好友助力金额)；触达底价即生成0元提货单
                </div>
              </div>

              {/* Seckill */}
              <div className="bg-slate-800/40 p-3.5 sm:p-4 rounded-2xl border border-red-500/30 space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs sm:text-sm">
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>3. 限时秒杀 (Flash Seckill)</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300">
                  <strong>高频抢购优化</strong>：前端定时器服务器时间漂移对齐校准，本地乐观锁扣除库存进度条，提升秒杀刺激感与转化率。
                </p>
              </div>

              {/* Distribution */}
              <div className="bg-slate-800/40 p-3.5 sm:p-4 rounded-2xl border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
                  <Share2 className="w-4 h-4 shrink-0" />
                  <span>4. 分销裂变中心 (Affiliate)</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300">
                  <strong>合规分销体系</strong>：一级/二级收益自动结算。结合 HTML5 Canvas / 小程序海报组件，动态合成包含推广码的分享卡片。
                </p>
              </div>
            </div>
          )}

          {activeSection === 'code' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-white mb-1.5">
                  1. Uni-app `pages.json` 与全局样式配置
                </h4>
                <div className="bg-slate-950 p-3 rounded-xl font-mono text-[10px] sm:text-xs text-slate-300 border border-slate-800 overflow-x-auto">
{`{
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "ShopSuite",
    "navigationBarBackgroundColor": "#FFFFFF",
    "backgroundColor": "#F8F9FA",
    "rpxCalcMaxDeviceWidth": 480, // 最大计算宽度(避免PC端无限放大)
    "rpxCalcBaseDeviceWidth": 375 // 默认以 375px 为基础设计稿
  }
}`}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white mb-1.5">
                  2. 安全区与自定义导航栏计算逻辑
                </h4>
                <div className="bg-slate-950 p-3 rounded-xl font-mono text-[10px] sm:text-xs text-emerald-400 border border-slate-800 overflow-x-auto">
{`// 获取系统信息，计算自定义导航栏与底部安全内边距
export function getSystemAdaptation() {
  const sysInfo = uni.getSystemInfoSync();
  const statusBarHeight = sysInfo.statusBarHeight || 20;
  // 微信小程序右上角胶囊尺寸与位置
  const menuButton = uni.getMenuButtonBoundingClientRect ? uni.getMenuButtonBoundingClientRect() : null;
  const navBarHeight = menuButton 
    ? (menuButton.top - statusBarHeight) * 2 + menuButton.height 
    : 44;

  return {
    statusBarHeight,
    navBarHeight,
    safeAreaBottom: sysInfo.safeAreaInsets ? sysInfo.safeAreaInsets.bottom : 0,
    totalHeaderHeight: statusBarHeight + navBarHeight
  };
}`}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0 text-xs pb-safe">
          <span className="text-[11px] sm:text-xs text-slate-400 truncate max-w-full text-center sm:text-left">
            ShopSuite Mobile 技术规范 · 750rpx 响应式与社交电商业务闭环
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2 rounded-xl active:scale-95 transition-all cursor-pointer shadow-sm text-center"
          >
            完成阅读
          </button>
        </div>
      </div>
    </div>
  );
};
