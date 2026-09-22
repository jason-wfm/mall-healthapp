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

export default function App() {
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

  // Business state
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [cartItems, setCartItems] = useState<HealthCartItem[]>(INITIAL_CART);
  const [orders, setOrders] = useState<HealthOrder[]>(MOCK_ORDERS);

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
            {/* 主内容区域 */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative">
              {activeTab === 'home' && (
                <HomeTab
                  currentPortal={currentPortal}
                  currentLocation={currentLocation}
                  isLocationOutOfRange={isLocationOutOfRange}
                  profile={profile}
                  onOpenPortalSelector={() => setIsPortalOpen(true)}
                  onOpenLocationSelector={() => setIsLocationOpen(true)}
                  onOpenConstitution={() => setIsConstitutionOpen(true)}
                  onOpenFaceDiagnostic={() => setIsFaceDiagnosticOpen(true)}
                  onOpenTongueDiagnostic={() => setIsTongueDiagnosticOpen(true)}
                  onOpenMedicalReport={() => setIsMedicalReportOpen(true)}
                  onOpenFamilyCircle={() => setIsFamilyCircleOpen(true)}
                  onSelectProduct={(p: HealthProduct) => setSelectedProduct(p)}
                  onSwitchTab={(t: HealthTabType) => setActiveTab(t)}
                  onOpenSearch={() => setIsSearchOpen(true)}
                />
              )}

              {activeTab === 'healthHub' && (
                <HealthHubTab
                  profile={profile}
                  onOpenConstitution={() => setIsConstitutionOpen(true)}
                  onOpenMetricsEntry={() => setIsMetricsEntryOpen(true)}
                  onOpenMedicalReport={() => setIsMedicalReportOpen(true)}
                  onOpenFamilyCircle={() => setIsFamilyCircleOpen(true)}
                  onOpenFaceDiagnostic={() => setIsFaceDiagnosticOpen(true)}
                />
              )}

              {activeTab === 'mall' && (
                <MallTab
                  currentPortal={currentPortal}
                  currentLocation={currentLocation}
                  isLocationOutOfRange={isLocationOutOfRange}
                  onOpenPortalSelector={() => setIsPortalOpen(true)}
                  onOpenLocationSelector={() => setIsLocationOpen(true)}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onOpenSearch={() => setIsSearchOpen(true)}
                  onOpenCart={() => setIsCartOpen(true)}
                  cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
                />
              )}

              {activeTab === 'services' && (
                <ServicesTab
                  currentLocation={currentLocation}
                  isLocationOutOfRange={isLocationOutOfRange}
                  onOpenLocationSelector={() => setIsLocationOpen(true)}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onOpenFaceDiagnostic={() => setIsFaceDiagnosticOpen(true)}
                  onOpenConstitution={() => setIsConstitutionOpen(true)}
                />
              )}

              {activeTab === 'mine' && (
                <MineTab
                  profile={profile}
                  orders={orders}
                  onOpenOrder={(ord) => setSelectedOrder(ord)}
                  onOpenFamilyCircle={() => setIsFamilyCircleOpen(true)}
                  onOpenConstitution={() => setIsConstitutionOpen(true)}
                  onOpenMedicalReport={() => setIsMedicalReportOpen(true)}
                  onOpenHealthHub={() => setActiveTab('healthHub')}
                />
              )}
            </div>

            {/* 底部 5 键健康导航栏 */}
            <HealthTabBar activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />
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
