import React, { useEffect, useState } from 'react';
import { DeviceConfig } from './types';
import { DEVICE_PRESETS } from './data/mockData';
import {
  DEFAULT_PROFILE,
  MOCK_HEALTH_PRODUCTS,
  MOCK_ORDERS
} from './data/healthMockData';
import {
  HealthTabType,
  PortalCity,
  HealthProduct,
  HealthOrder,
  HealthArticle
} from './types/health';
import { ORDER_STATE, ORDER_STATE_TEXT, type CartRow, type TradeOrder } from './types/trade';

// Layout & Frame
import { AdaptationMetricsBar } from './components/adaptation/AdaptationMetricsBar';
import { MobileFrame } from './components/adaptation/MobileFrame';
import { HealthTabBar } from './components/common/HealthTabBar';

// Health App Tabs
import { HomeTab } from './components/home/HomeTab';
import { HealthHubTab } from './components/health/HealthHubTab';
import { MallTab } from './components/mall/MallTab';
import { ServicesTab } from './components/services/ServicesTab';
import { MineTab } from './components/mine/MineTab';

// Health Modals & Sheets
import { ArchitectureDocModal } from './components/modules/ArchitectureDocModal';
import { PortalSelectorSheet } from './components/common/PortalSelectorSheet';
import { LocationSelectorModal } from './components/common/LocationSelectorModal';
import { ConstitutionAssessmentModal } from './components/health/ConstitutionAssessmentModal';
import { HealthMetricsEntryModal } from './components/health/HealthMetricsEntryModal';
import { MedicalReportModal } from './components/health/MedicalReportModal';
import { FamilyCircleModal } from './components/health/FamilyCircleModal';
import { AIFaceDiagnosticModal } from './components/health/AIFaceDiagnosticModal';
import { AITongueDiagnosticModal } from './components/health/AITongueDiagnosticModal';
import { HealthProductDetailModal } from './components/mall/HealthProductDetailModal';
import { StoreDetailModal } from './components/mall/StoreDetailModal';
import { HealthSearchModal } from './components/mall/HealthSearchModal';
import { HealthCartModal } from './components/mall/HealthCartModal';
import { CheckoutModal } from './components/mall/CheckoutModal';
import { PaymentModal } from './components/mall/PaymentModal';
import { OrderDetailModal } from './components/order/OrderDetailModal';

// User Login & Interceptor
import { LoginPage, UserAccountInfo } from './components/auth/LoginPage';
import { CheckCircle2, Sparkles, LogIn } from 'lucide-react';

// [healthmall-ext] 多商家 P2：商家中心（H5 页面化：招募页/提交资料页 + 资金中心弹窗）
import { RecruitPage } from './components/mine/RecruitPage';
import { ArticleDetailModal } from './components/home/ArticleDetailModal';
import { apiGetPortalInfo } from './services/merchantApi';
import { MerchantApplyPage } from './components/mine/MerchantApplyPage';
import { FinanceCenterModal } from './components/finance/FinanceCenterModal';

// [healthmall-ext] 期2：发现页 · 全量资讯
import { DiscoverTab } from './components/discover/DiscoverTab';

// [healthmall-ext] 二期：完整购物链路 + 家庭交易共享/亲情代付
import { FamilyPayModal } from './components/health/FamilyPayModal';
import {
  apiAddCart,
  apiCancelOrder,
  apiConfirmReceipt,
  apiEditCartQuantity,
  apiGetCart,
  apiGetOrders,
  apiRemoveCart,
  buildCartParam
} from './services/tradeApi';

// [healthmall-ext] P_A4：门户信息模块级缓存（动态标题/品牌色；列表过滤在后端按 Host 上下文完成）
const portalState: { info: import('./services/merchantApi').PortalInfo | null } = { info: null };
export function getPortalInfo() {
  return portalState.info;
}

export default function App() {
  // Tab Name Mapping
  const TAB_NAMES: Record<HealthTabType, string> = {
    home: '商城首页',
    healthHub: '健康中枢与档案',
    health: '健康档案',
    mall: '健康商城',
    services: '医护服务',
    discover: '健康发现',
    mine: '个人中心'
  };

  // Adaptation Environment
  const [currentDevice, setCurrentDevice] = useState<DeviceConfig>(DEVICE_PRESETS[0]);
  const [isLandscape, setIsLandscape] = useState(false);
  const [showBezel, setShowBezel] = useState(true);
  const [isDocOpen, setIsDocOpen] = useState(false);

  // Health Navigation & Data
  const [activeTab, setActiveTab] = useState<HealthTabType>('home');
  const [currentPortal, setCurrentPortal] = useState<PortalCity>('深圳门户');
  // [healthmall-ext] P_A5：门户筛选（null=平台聚合页全量）
  const [portalId, setPortalId] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>(
    '深圳市南山区科技园南路88号3栋1002'
  );
  const [isLocationOutOfRange, setIsLocationOutOfRange] = useState<boolean>(false);

  // User Authentication & Interceptor State (默认为未登录，用于直接展示拦截与登录返回)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [loginNotice, setLoginNotice] = useState<string>('');
  const [authToast, setAuthToast] = useState<string | null>(null);
  const [pendingRedirect, setPendingRedirect] = useState<{
    description: string;
    action: () => void;
  } | null>(null);

  // [healthmall-ext] 多商家 P2：商家中心（全屏页面栈 + 资金中心弹窗）
  const [activeView, setActiveView] = useState<'recruit' | 'apply' | null>(null);
  const [isFinanceCenterOpen, setIsFinanceCenterOpen] = useState<boolean>(false);

  // [healthmall-ext] 期1：健康资讯详情弹窗
  const [selectedArticle, setSelectedArticle] = useState<HealthArticle | null>(null);
  const [isArticleDetailOpen, setIsArticleDetailOpen] = useState<boolean>(false);

  // Business state
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  // [healthmall-ext] 二期：购物车/订单接真（/front/trade/**），mock 仅作失败回退
  const [cartRows, setCartRows] = useState<CartRow[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [orders, setOrders] = useState<HealthOrder[]>(MOCK_ORDERS);
  // 待支付订单（收银台上下文）
  const [pendingOrder, setPendingOrder] = useState<{ orderId: string; amount: number } | null>(null);
  const [isFamilyPayOpen, setIsFamilyPayOpen] = useState(false);

  // Require Auth Guard (未登录拦截并记录回跳目标)
  const requireAuth = (action: () => void, targetDescription: string) => {
    if (!isLoggedIn) {
      setPendingRedirect({
        description: targetDescription,
        action
      });
      setLoginNotice(`您正在访问「${targetDescription}」，当前账号未登录，请先登录通行证`);
      setIsLoginOpen(true);
      return;
    }
    action();
  };

  // 登录成功处理与自动回跳
  const handleLoginSuccess = (user: UserAccountInfo) => {
    setIsLoggedIn(true);
    setIsLoginOpen(false);
    setAuthToken(user.token || null);
    setProfile((prev) => ({
      ...prev,
      name: user.name
    }));

    const apiTag = user.apiSource ? `[${user.apiSource}] ` : '';
    const methodText = user.loginMethod === 'wechat' ? '微信授权鉴权成功' : '登录成功';
    if (pendingRedirect) {
      const { action, description } = pendingRedirect;
      setPendingRedirect(null);
      setLoginNotice('');
      setTimeout(() => {
        action();
        setAuthToast(`${apiTag}${methodText}！已为您自动跳转回「${description}」`);
        setTimeout(() => setAuthToast(null), 3800);
      }, 250);
    } else {
      setAuthToast(`${apiTag}${methodText}！欢迎回来，${user.name}`);
      setTimeout(() => setAuthToast(null), 3500);
    }
  };

  // 退出登录
  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthToken(null);
    setActiveTab('home');
    setAuthToast('已退出登录，已切换至【未登录】模式，点击任意卡片/超链将拦截跳转至登录页');
    setTimeout(() => setAuthToast(null), 4000);
  };

  // [healthmall-ext] P_A4：启动加载门户信息——动态标题与品牌主色（局部生效）
  useEffect(() => {
    apiGetPortalInfo()
      .then((res) => {
        if (res.data?.portal_name) {
          portalState.info = res.data;
          document.title = `${res.data.portal_name}`;
          if (res.data.brand_color) {
            document.documentElement.style.setProperty('--portal-brand', res.data.brand_color);
          }
        }
      })
      .catch(() => undefined);
  }, []);

  // Modals visibility
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isConstitutionOpen, setIsConstitutionOpen] = useState(false);
  const [isMetricsEntryOpen, setIsMetricsEntryOpen] = useState(false);
  const [isMedicalReportOpen, setIsMedicalReportOpen] = useState(false);
  const [isFamilyCircleOpen, setIsFamilyCircleOpen] = useState(false);
  const [isFaceDiagnosticOpen, setIsFaceDiagnosticOpen] = useState(false);
  const [isTongueDiagnosticOpen, setIsTongueDiagnosticOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStoreDetailOpen, setIsStoreDetailOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Target Objects
  const [selectedProduct, setSelectedProduct] = useState<HealthProduct | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<HealthOrder | null>(null);
  const [singleBuyPayload, setSingleBuyPayload] = useState<{
    product: HealthProduct;
    sku: string;
    quantity: number;
    price: number;
    itemId: number | null;
  } | null>(null);

  // Location selector change
  const handleSelectLocation = (loc: string, outOfRange: boolean) => {
    setCurrentLocation(loc);
    setIsLocationOutOfRange(outOfRange);
  };

  // Cart operations（接真 /front/trade/cart/**）
  const refreshCart = async (token: string) => {
    setCartLoading(true);
    try {
      const { rows } = await apiGetCart(token);
      setCartRows(rows);
    } catch {
      // 保留现有行（失败不空屏）
    } finally {
      setCartLoading(false);
    }
  };

  const refreshOrders = async (token: string) => {
    try {
      const list: TradeOrder[] = await apiGetOrders(token, { page: 1, size: 20 });
      setOrders(list.map(mapTradeOrder));
    } catch {
      // 失败保留 mock/现有
    }
  };

  const mapTradeOrder = (o: TradeOrder): HealthOrder => ({
    id: o.order_id,
    orderNo: o.order_id,
    orderType: 'product',
    status:
      o.order_state_id === ORDER_STATE.WAIT_PAY
        ? 'pending_pay'
        : o.order_state_id === ORDER_STATE.SHIPPED
        ? 'pending_receive'
        : o.order_state_id >= ORDER_STATE.RECEIVED
        ? 'completed'
        : o.order_state_id === ORDER_STATE.CANCEL
        ? 'closed'
        : 'pending_ship',
    statusText: ORDER_STATE_TEXT[o.order_state_id] || '处理中',
    totalAmount: o.order_payment_amount,
    orderTime: o.order_time ? new Date(o.order_time).toLocaleString('zh-CN', { hour12: false }) : undefined,
    paidAmount: o.order_is_paid === 3013 ? o.order_payment_amount : 0,
    items: o.items.map((it) => ({
      title: it.product_name,
      sku: it.item_name || '标准',
      price: it.item_unit_price ?? 0,
      quantity: it.order_item_quantity,
      coverImage: it.order_item_image || ''
    }))
  });

  const handleAddToCart = (
    product: HealthProduct,
    sku: string,
    quantity: number,
    _price: number,
    itemId?: number
  ) => {
    if (!authToken) return;
    if (!itemId) {
      setAuthToast('该商品暂不支持加购（缺少 SKU）');
      setTimeout(() => setAuthToast(null), 3000);
      return;
    }
    apiAddCart(authToken, itemId, quantity)
      .then(() => refreshCart(authToken))
      .catch((err) => {
        setAuthToast(err?.message || '加购失败');
        setTimeout(() => setAuthToast(null), 3000);
      });
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    const row = cartRows.find((r) => String(r.cart_id) === id);
    if (!row || !authToken) return;
    const nextQty = row.quantity + delta;
    const op =
      nextQty <= 0
        ? apiRemoveCart(authToken, row.cart_id)
        : apiEditCartQuantity(authToken, row.cart_id, nextQty);
    op.then(() => refreshCart(authToken)).catch(() => refreshCart(authToken));
  };

  const handleRemoveCartItem = (id: string) => {
    const row = cartRows.find((r) => String(r.cart_id) === id);
    if (!row || !authToken) return;
    apiRemoveCart(authToken, row.cart_id)
      .then(() => refreshCart(authToken))
      .catch(() => refreshCart(authToken));
  };

  // Instant Buy
  const handleInstantBuy = (
    product: HealthProduct,
    sku: string,
    quantity: number,
    price: number,
    itemId?: number
  ) => {
    setSingleBuyPayload({ product, sku, quantity, price, itemId: itemId ?? null });
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  // 下单成功（待付款）→ 打开收银台
  const handleOrderCreated = (orderIds: string[], payAmount: number) => {
    setIsCheckoutOpen(false);
    setPendingOrder({ orderId: orderIds[0], amount: payAmount });
    setIsPaymentOpen(true);
  };

  // 支付成功 → 刷新订单与购物车
  const handlePaymentSuccess = () => {
    setIsPaymentOpen(false);
    setSingleBuyPayload(null);
    if (authToken) {
      refreshOrders(authToken);
      refreshCart(authToken);
    }
    setAuthToast('支付成功！订单已生成');
    setTimeout(() => setAuthToast(null), 3200);
  };

  // 待付款订单取消（代付请求由后端联动失效）
  const handleCancelOrder = (orderId: string) => {
    if (!authToken) return;
    apiCancelOrder(authToken, orderId)
      .then(() => refreshOrders(authToken))
      .catch((err) => {
        setAuthToast(err?.message || '取消失败');
        setTimeout(() => setAuthToast(null), 3000);
      });
  };

  // 确认收货
  const handleConfirmReceipt = (orderId: string) => {
    if (!authToken) return;
    apiConfirmReceipt(authToken, orderId)
      .then(() => refreshOrders(authToken))
      .catch((err) => {
        setAuthToast(err?.message || '确认收货失败');
        setTimeout(() => setAuthToast(null), 3000);
      });
  };

  // 登录态变化：拉取真实购物车与订单
  useEffect(() => {
    if (!authToken) {
      setCartRows([]);
      return;
    }
    refreshCart(authToken);
    refreshOrders(authToken);
  }, [authToken]);

  // Save metric to profile
  const handleSaveMetric = (type: string, value: string, text: string) => {
    setProfile((prev) => ({
      ...prev,
      healthScore: Math.min(100, prev.healthScore + 1)
    }));
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-full bg-slate-900 overflow-hidden font-sans">
      {/* 顶部机型与 750rpx 适配监控栏 */}
      <AdaptationMetricsBar
        currentDevice={currentDevice}
        onSelectDevice={setCurrentDevice}
        isLandscape={isLandscape}
        onToggleLandscape={() => setIsLandscape(!isLandscape)}
        showBezel={showBezel}
        onToggleBezel={() => setShowBezel(!showBezel)}
        showRpxInspector={false}
        onToggleRpxInspector={() => {}}
        onOpenDoc={() => setIsDocOpen(true)}
        isLoggedIn={isLoggedIn}
        onToggleAuth={() => {
          if (isLoggedIn) {
            handleLogout();
          } else {
            setLoginNotice('顶栏快速体验登录');
            setIsLoginOpen(true);
          }
        }}
      />

      {/* 模拟器舞台区域 */}
      <div className="flex-1 overflow-hidden relative flex items-center justify-center p-0 md:p-3 bg-slate-950/90">
        <MobileFrame
          device={currentDevice}
          isLandscape={isLandscape}
          showBezel={showBezel}
          navTitle="康养商城 · 750rpx"
        >
          <div className="relative h-full w-full flex flex-col bg-slate-50 overflow-hidden">
            {/* 顶层成功提示浮层 */}
            {authToast && (
              <div className="absolute top-2.5 left-2.5 right-2.5 z-40 bg-teal-950/95 backdrop-blur-md text-white px-3 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg border border-teal-500/30 animate-in fade-in slide-in-from-top-2 duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold flex-1 text-[11px] leading-tight">{authToast}</span>
              </div>
            )}

            {/* 未登录演示状态提示条 (可直接点击体验) */}
            {!isLoggedIn && (
              <div className="bg-amber-500/15 border-b border-amber-500/30 px-3 py-1.5 flex items-center justify-between text-[11px] text-amber-900 shrink-0 z-30">
                <span className="flex items-center gap-1 font-bold truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-ping" />
                  <span>当前状态：未登录访客 (点击任意卡片/超链拦截跳转)</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setLoginNotice('点击顶栏主动登录');
                    setIsLoginOpen(true);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md transition-colors shrink-0 ml-1 shadow-2xs cursor-pointer"
                >
                  去登录
                </button>
              </div>
            )}

            {/* 主内容区域 (支持全局捕获未处理的超链与点击) */}
            <div
              className="flex-1 overflow-y-auto no-scrollbar relative"
              onClickCapture={(e) => {
                if (isLoggedIn) return;
                const target = e.target as HTMLElement;
                const anchor = target.closest('a');
                if (anchor) {
                  e.preventDefault();
                  e.stopPropagation();
                  const linkTitle =
                    anchor.innerText?.trim() || anchor.getAttribute('title') || '页面超链接';
                  requireAuth(() => {
                    console.log('Navigated to link:', anchor.href);
                  }, `超链: ${linkTitle}`);
                }
              }}
            >
              {/* [healthmall-ext] 全屏页面视图：招募详情 / 商家入驻提交（覆盖 Tab 内容） */}
              {activeView === 'recruit' && (
                <RecruitPage
                  onBack={() => setActiveView(null)}
                  onEnterApply={() => setActiveView('apply')}
                />
              )}
              {activeView === 'apply' && (
                <MerchantApplyPage
                  token={authToken}
                  onClose={() => setActiveView(null)}
                  onEnterFinance={() => setIsFinanceCenterOpen(true)}
                />
              )}

              {!activeView && (
              <>
              {activeTab === 'home' && (
                <HomeTab
                  currentPortal={currentPortal}
                  currentLocation={currentLocation}
                  isLocationOutOfRange={isLocationOutOfRange}
                  profile={profile}
                  onOpenPortalSelector={() =>
                    requireAuth(() => setIsPortalOpen(true), '区域门户切换')
                  }
                  onOpenLocationSelector={() =>
                    requireAuth(() => setIsLocationOpen(true), 'LBS定位服务')
                  }
                  onOpenConstitution={() =>
                    requireAuth(() => setIsConstitutionOpen(true), '中医九大体质辨识')
                  }
                  onOpenFaceDiagnostic={() =>
                    requireAuth(() => setIsFaceDiagnosticOpen(true), 'AI 观气色面诊')
                  }
                  onOpenTongueDiagnostic={() =>
                    requireAuth(() => setIsTongueDiagnosticOpen(true), 'AI 舌象辨识')
                  }
                  onOpenMedicalReport={() =>
                    requireAuth(() => setIsMedicalReportOpen(true), '体检报告 AI 深度解读')
                  }
                  onOpenFamilyCircle={() =>
                    requireAuth(() => setIsFamilyCircleOpen(true), '家庭健康圈空间')
                  }
                  onSelectProduct={(p: HealthProduct) =>
                    requireAuth(() => setSelectedProduct(p), `商品详情: ${p.title}`)
                  }
                  onSwitchTab={(t: HealthTabType) =>
                    requireAuth(() => setActiveTab(t), TAB_NAMES[t])
                  }
                  onOpenSearch={() => requireAuth(() => setIsSearchOpen(true), '全域搜索')}
                  onOpenHealthProfile={() =>
                    requireAuth(() => setActiveTab('healthHub'), '健康档案中枢')
                  }
                  onOpenRecruit={() =>
                    requireAuth(
                      () => setActiveView('recruit'),
                      '平台入驻招募'
                    )
                  }
                  onOpenArticle={(art) =>
                    requireAuth(() => {
                      setSelectedArticle(art);
                      setIsArticleDetailOpen(true);
                    }, `健康资讯: ${art.title}`)
                  }
                />
              )}

              {activeTab === 'discover' && (
                <DiscoverTab
                  onBack={() => setActiveTab('home')}
                  onOpenArticle={(art) =>
                    requireAuth(() => {
                      setSelectedArticle(art);
                      setIsArticleDetailOpen(true);
                    }, `健康资讯: ${art.title}`)
                  }
                />
              )}

              {activeTab === 'healthHub' && (
                <HealthHubTab
                  profile={profile}
                  onOpenConstitution={() =>
                    requireAuth(() => setIsConstitutionOpen(true), '中医九大体质辨识')
                  }
                  onOpenMetricsEntry={() =>
                    requireAuth(() => setIsMetricsEntryOpen(true), '健康指标手动录入')
                  }
                  onOpenMedicalReport={() =>
                    requireAuth(() => setIsMedicalReportOpen(true), '体检报告 AI 解读')
                  }
                  onOpenFamilyCircle={() =>
                    requireAuth(() => setIsFamilyCircleOpen(true), '家庭圈空间')
                  }
                  onOpenFaceDiagnostic={() =>
                    requireAuth(() => setIsFaceDiagnosticOpen(true), 'AI 智能面诊')
                  }
                />
              )}

              {activeTab === 'mall' && (
                <MallTab
                  currentPortal={currentPortal}
                  portalId={portalId}
                  currentLocation={currentLocation}
                  isLocationOutOfRange={isLocationOutOfRange}
                  onOpenPortalSelector={() =>
                    requireAuth(() => setIsPortalOpen(true), '区域门户切换')
                  }
                  onOpenLocationSelector={() =>
                    requireAuth(() => setIsLocationOpen(true), 'LBS定位服务')
                  }
                  onSelectProduct={(p) =>
                    requireAuth(() => setSelectedProduct(p), `商品详情: ${p.title}`)
                  }
                  onOpenSearch={() => requireAuth(() => setIsSearchOpen(true), '商城搜索')}
                  onOpenCart={() => requireAuth(() => setIsCartOpen(true), '健康购物车')}
                  cartCount={cartRows.reduce((s, i) => s + i.quantity, 0)}
                />
              )}

              {activeTab === 'services' && (
                <ServicesTab
                  currentLocation={currentLocation}
                  isLocationOutOfRange={isLocationOutOfRange}
                  onOpenLocationSelector={() =>
                    requireAuth(() => setIsLocationOpen(true), 'LBS定位服务')
                  }
                  onSelectProduct={(p) =>
                    requireAuth(() => setSelectedProduct(p), `服务预约: ${p.title}`)
                  }
                  onOpenFaceDiagnostic={() =>
                    requireAuth(() => setIsFaceDiagnosticOpen(true), 'AI 智能面诊')
                  }
                  onOpenConstitution={() =>
                    requireAuth(() => setIsConstitutionOpen(true), '中医体质辨识')
                  }
                />
              )}

              {activeTab === 'mine' && (
                <MineTab
                  profile={profile}
                  orders={orders}
                  isLoggedIn={isLoggedIn}
                  onOpenLogin={() => {
                    setLoginNotice('从个人中心登录通行证');
                    setIsLoginOpen(true);
                  }}
                  onLogout={handleLogout}
                  onOpenOrder={(ord) =>
                    requireAuth(() => setSelectedOrder(ord), `订单详情: ${ord.orderNo}`)
                  }
                  onOpenFamilyCircle={() =>
                    requireAuth(() => setIsFamilyCircleOpen(true), '家庭圈空间')
                  }
                  onOpenFamilyPay={() =>
                    requireAuth(() => setIsFamilyPayOpen(true), '亲情代付')
                  }
                  onOpenConstitution={() =>
                    requireAuth(() => setIsConstitutionOpen(true), '体质辨识报告')
                  }
                  onOpenMedicalReport={() =>
                    requireAuth(() => setIsMedicalReportOpen(true), '体检报告')
                  }
                  onOpenHealthHub={() =>
                    requireAuth(() => setActiveTab('healthHub'), '健康中枢与档案')
                  }
                  onOpenMerchantApply={() =>
                    requireAuth(() => setActiveView('apply'), '商家入驻')
                  }
                  onOpenApplyProgress={() =>
                    requireAuth(() => setActiveView('apply'), '入驻进度')
                  }
                  onOpenMerchantFinance={() =>
                    requireAuth(() => setIsFinanceCenterOpen(true), '商家资金中心')
                  }
                />
              )}
              </>
              )}
            </div>

            {/* 底部 5 键健康导航栏 */}
            <HealthTabBar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                if (tab === activeTab) return;
                if (tab === 'home') {
                  setActiveTab('home');
                  return;
                }
                requireAuth(() => setActiveTab(tab), TAB_NAMES[tab]);
              }}
            />

            {/* 用户登录页面 (沉浸在 750rpx 移动框架内) */}
            <LoginPage
              isOpen={isLoginOpen}
              onClose={() => {
                setIsLoginOpen(false);
                setPendingRedirect(null);
                setLoginNotice('');
              }}
              redirectNotice={loginNotice}
              onLoginSuccess={handleLoginSuccess}
            />

            {/* [healthmall-ext] 多商家 P2：资金中心弹窗 */}
            <FinanceCenterModal
              isOpen={isFinanceCenterOpen}
              token={authToken}
              onClose={() => setIsFinanceCenterOpen(false)}
            />

            {/* [healthmall-ext] 期1：健康资讯详情弹窗 */}
            <ArticleDetailModal
              isOpen={isArticleDetailOpen}
              article={selectedArticle}
              onClose={() => {
                setIsArticleDetailOpen(false);
                setSelectedArticle(null);
              }}
            />
          </div>
        </MobileFrame>
      </div>

      {/* 模态框与底部抽屉系统 */}
      {/* 1. 区域门户切换抽屉 */}
      <PortalSelectorSheet
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        currentPortalId={portalId}
        onSelectPortal={(p) => {
          setPortalId(p.portal_id);
          setCurrentPortal(p.portal_name);
        }}
      />

      {/* 2. 定位与服务范围选择器 */}
      <LocationSelectorModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={handleSelectLocation}
      />

      {/* 3. 中医九大体质辨识 */}
      <ConstitutionAssessmentModal
        isOpen={isConstitutionOpen}
        onClose={() => setIsConstitutionOpen(false)}
        onSaveToProfile={(main, sec) => {
          setProfile((prev) => ({
            ...prev,
            constitution: {
              ...prev.constitution,
              main,
              secondary: sec
            }
          }));
        }}
      />

      {/* 4. 手动指标录入中心 */}
      <HealthMetricsEntryModal
        isOpen={isMetricsEntryOpen}
        onClose={() => setIsMetricsEntryOpen(false)}
        onSaveMetric={handleSaveMetric}
      />

      {/* 5. 体检报告 AI 解读 */}
      <MedicalReportModal
        isOpen={isMedicalReportOpen}
        onClose={() => setIsMedicalReportOpen(false)}
      />

      {/* 6. 家庭圈健康空间 */}
      <FamilyCircleModal
        isOpen={isFamilyCircleOpen}
        token={authToken}
        onClose={() => setIsFamilyCircleOpen(false)}
      />

      {/* 7. AI 智能观气色面诊 */}
      <AIFaceDiagnosticModal
        isOpen={isFaceDiagnosticOpen}
        onClose={() => setIsFaceDiagnosticOpen(false)}
        onOpenTongueDiagnostic={() => setIsTongueDiagnosticOpen(true)}
      />

      {/* 8. AI 舌象辨识 */}
      <AITongueDiagnosticModal
        isOpen={isTongueDiagnosticOpen}
        onClose={() => setIsTongueDiagnosticOpen(false)}
      />

      {/* 9. 全域搜索模态框 */}
      <HealthSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* 10. 商品与服务详情页 */}
      <HealthProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onInstantBuy={handleInstantBuy}
        onOpenStoreDetail={() => setIsStoreDetailOpen(true)}
      />

      {/* 11. 商家资质核验抽屉 */}
      <StoreDetailModal
        isOpen={isStoreDetailOpen}
        onClose={() => setIsStoreDetailOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* 12. 共享购物车（接真 /front/trade/cart/**） */}
      <HealthCartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        loading={cartLoading}
        cartItems={cartRows.map((r) => ({
          id: String(r.cart_id),
          title: r.product_name,
          spec: r.spec,
          quantity: r.quantity,
          price: r.price,
          coverImage: r.cover_image,
          available: r.available
        }))}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onGoToCheckout={() => {
          setSingleBuyPayload(null);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 13. 订单确认结算（真实地址/预览/下单） */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        token={authToken}
        lines={
          singleBuyPayload
            ? [
                {
                  title: singleBuyPayload.product.title,
                  spec: singleBuyPayload.sku,
                  quantity: singleBuyPayload.quantity,
                  price: singleBuyPayload.price,
                  coverImage: singleBuyPayload.product.coverImage
                }
              ]
            : cartRows.map((r) => ({
                title: r.product_name,
                spec: r.spec,
                quantity: r.quantity,
                price: r.price,
                coverImage: r.cover_image
              }))
        }
        cartParam={
          singleBuyPayload && singleBuyPayload.itemId
            ? `${singleBuyPayload.itemId}|${singleBuyPayload.quantity}|0`
            : buildCartParam(cartRows)
        }
        onOrderCreated={handleOrderCreated}
      />

      {/* 14. 安全收银台（微信 H5 + 余额；支持请求家人代付） */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        token={authToken}
        orderId={pendingOrder?.orderId || ''}
        amount={pendingOrder?.amount || 0}
        onPaid={handlePaymentSuccess}
        onRequestFamilyPay={() => setIsFamilyPayOpen(true)}
      />

      {/* 14.1 亲情代付请求收发 */}
      <FamilyPayModal
        isOpen={isFamilyPayOpen}
        onClose={() => setIsFamilyPayOpen(false)}
        token={authToken}
        onGoPay={(orderId, amount) => {
          setPendingOrder({ orderId, amount });
          setIsPaymentOpen(true);
        }}
      />

      {/* 15. 多模态订单详情与履约跟踪 (实物/核销/上门派单) */}
      <OrderDetailModal
        isOpen={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onConfirmReceipt={handleConfirmReceipt}
        onCancelOrder={handleCancelOrder}
      />

      {/* 16. 移动端 750rpx 适配与架构解析文档 */}
      {isDocOpen && (
        <ArchitectureDocModal onClose={() => setIsDocOpen(false)} />
      )}
    </div>
  );
}
