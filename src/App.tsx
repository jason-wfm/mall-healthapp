import React, { useState } from 'react';
import { DeviceConfig } from './types';
import { DEVICE_PRESETS } from './data/mockData';
import {
  DEFAULT_PROFILE,
  MOCK_HEALTH_PRODUCTS,
  MOCK_ORDERS,
  INITIAL_CART
} from './data/healthMockData';
import {
  HealthTabType,
  PortalCity,
  HealthProduct,
  HealthOrder,
  CartItem as HealthCartItem
} from './types/health';

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

  // Health Navigation & Data
  const [activeTab, setActiveTab] = useState<HealthTabType>('home');
  const [currentPortal, setCurrentPortal] = useState<PortalCity>('深圳门户');
  const [currentLocation, setCurrentLocation] = useState<string>(
    '深圳市南山区科技园南路88号3栋1002'
  );
  const [isLocationOutOfRange, setIsLocationOutOfRange] = useState<boolean>(false);

  // User Authentication & Interceptor State (默认为未登录，用于直接展示拦截与登录返回)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [loginNotice, setLoginNotice] = useState<string>('');
  const [authToast, setAuthToast] = useState<string | null>(null);
  const [pendingRedirect, setPendingRedirect] = useState<{
    description: string;
    action: () => void;
  } | null>(null);

  // Business state
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [cartItems, setCartItems] = useState<HealthCartItem[]>(INITIAL_CART);
  const [orders, setOrders] = useState<HealthOrder[]>(MOCK_ORDERS);

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
    setActiveTab('home');
    setAuthToast('已退出登录，已切换至【未登录】模式，点击任意卡片/超链将拦截跳转至登录页');
    setTimeout(() => setAuthToast(null), 4000);
  };

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
  } | null>(null);
  const [checkoutPayload, setCheckoutPayload] = useState<{
    items: any[];
    totalAmount: number;
    askFamilyPay: boolean;
    payer: string;
  } | null>(null);

  // Location selector change
  const handleSelectLocation = (loc: string, outOfRange: boolean) => {
    setCurrentLocation(loc);
    setIsLocationOutOfRange(outOfRange);
  };

  // Cart operations
  const handleAddToCart = (
    product: HealthProduct,
    sku: string,
    quantity: number,
    price: number
  ) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.sku === sku);
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}`,
          product,
          sku,
          quantity,
          price,
          addedBy: '本人 (张明)'
        }
      ];
    });
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as HealthCartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Instant Buy
  const handleInstantBuy = (
    product: HealthProduct,
    sku: string,
    quantity: number,
    price: number
  ) => {
    setSingleBuyPayload({ product, sku, quantity, price });
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  // Checkout to Payment
  const handleConfirmOrder = (orderData: any) => {
    setCheckoutPayload(orderData);
    setIsCheckoutOpen(false);
    setIsPaymentOpen(true);
  };

  // Payment Success -> create order & open detail
  const handlePaymentSuccess = () => {
    setIsPaymentOpen(false);
    const firstItem = checkoutPayload?.items[0];
    const newOrder: HealthOrder = {
      id: `ord-${Date.now()}`,
      orderNo: `HLT2026${Math.floor(100000 + Math.random() * 900000)}`,
      orderType: firstItem?.product?.type || 'product',
      status: 'pending_use',
      statusText:
        firstItem?.product?.type === 'doorstepService'
          ? '待护士上门 (智能调度中)'
          : firstItem?.product?.type === 'inStoreService'
          ? '待到店核销'
          : '待揽收发货',
      totalAmount: checkoutPayload?.totalAmount || 199,
      orderTime: '刚刚 10:15',
      items: [
        {
          title: firstItem?.product?.title || '健康服务项目',
          sku: firstItem?.sku || '标准版',
          price: firstItem?.price || 199,
          quantity: firstItem?.quantity || 1,
          coverImage:
            firstItem?.product?.coverImage ||
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'
        }
      ],
      storeName: firstItem?.product?.store?.name,
      verificationCode: '8942-1082-3901',
      dispatchInfo:
        firstItem?.product?.type === 'doorstepService'
          ? {
              status: 'arriving',
              nurseName: '李晓华 (主管护师)',
              nursePhone: '138****8899',
              nursePhoto: '👩‍⚕️',
              estimatedMinutes: 15,
              currentDistanceKm: 1.8
            }
          : undefined
    };

    setOrders([newOrder, ...orders]);
    setSelectedOrder(newOrder);
    // Clear cart if was cart checkout
    if (!singleBuyPayload) {
      setCartItems([]);
    }
    setSingleBuyPayload(null);
  };

  // Save metric to profile
  const handleSaveMetric = (type: string, value: string, text: string) => {
    setProfile((prev) => ({
      ...prev,
      healthScore: Math.min(100, prev.healthScore + 1)
    }));
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-900 overflow-hidden select-none font-sans">
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
        onOpenDoc={() => {}}
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
      <div className="flex-1 overflow-hidden relative flex items-center justify-center p-2 sm:p-4 bg-slate-950/80">
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
                      () => alert('已进入平台服务商招募通道，审核通过即可接单获得返现！'),
                      '平台入驻招募'
                    )
                  }
                  onOpenArticle={(art) =>
                    requireAuth(
                      () =>
                        alert(
                          `打开健康资讯：《${art.title}》\n已为您匹配慢病关怀与体质调理方案`
                        ),
                      `健康资讯: ${art.title}`
                    )
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
                  cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
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
                  onOpenConstitution={() =>
                    requireAuth(() => setIsConstitutionOpen(true), '体质辨识报告')
                  }
                  onOpenMedicalReport={() =>
                    requireAuth(() => setIsMedicalReportOpen(true), '体检报告')
                  }
                  onOpenHealthHub={() =>
                    requireAuth(() => setActiveTab('healthHub'), '健康中枢与档案')
                  }
                />
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
          </div>
        </MobileFrame>
      </div>

      {/* 模态框与底部抽屉系统 */}
      {/* 1. 区域门户切换抽屉 */}
      <PortalSelectorSheet
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        currentPortal={currentPortal}
        onSelectPortal={(city) => setCurrentPortal(city)}
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

      {/* 12. 共享购物车 */}
      <HealthCartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onGoToCheckout={() => {
          setSingleBuyPayload(null);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 13. 订单确认结算 */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        singleProductBuy={singleBuyPayload}
        onConfirmOrder={handleConfirmOrder}
      />

      {/* 14. 安全收银台 */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={checkoutPayload?.totalAmount || 0}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* 15. 多模态订单详情与履约跟踪 (实物/核销/上门派单) */}
      <OrderDetailModal
        isOpen={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onConfirmReceipt={(id) => {
          setOrders((prev) =>
            prev.map((o) => (o.id === id ? { ...o, status: 'completed', statusText: '已完成' } : o))
          );
        }}
      />
    </div>
  );
}
