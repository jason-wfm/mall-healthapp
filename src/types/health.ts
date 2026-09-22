export type HealthTab = 'home' | 'services' | 'mall' | 'discover' | 'mine' | 'healthHub' | 'health';
export type HealthTabType = HealthTab;

// 区域门户实例
export type PortalCity = '深圳门户' | '北京门户' | '上海门户' | '广州门户' | 'sz' | 'bj' | 'sh' | 'gz';

// 购物车通用项
export interface CartItem {
  id: string;
  product: HealthProduct;
  sku: string;
  quantity: number;
  price: number;
  addedBy: string;
}

// 会员等级
export type MemberTier = 'visitor' | 'standard' | 'plus';

// 用户画像与基础健康档案
export interface HealthProfile {
  name: string;
  gender: '男' | '女';
  age: number;
  birthDate: string;
  height: number; // cm
  weight: number; // kg
  bmi: number;
  bloodType: string;
  maritalStatus: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  chronicDiseases: string[];
  allergies: string[]; // 如 "青霉素过敏"
  medications: string[];
  familyHistory: string[];
  healthScore: number; // 综合健康评分，如 85
  constitution: {
    main: string; // 主体质，如 "平和质"
    secondary: string; // 兼体质，如 "气虚质（倾向）"
    advice: string;
  };
  portraitTags: string[]; // 360画像标签：健康·血压临界、行为·久坐族、需求·慢病预防等
}

// 单项检测指标
export interface HealthMetricRecord {
  id: string;
  type: 'blood_pressure' | 'blood_sugar' | 'weight' | 'heart_rate' | 'spo2' | 'temperature' | 'sleep' | 'exercise';
  value: string | number;
  unit: string;
  status: 'ok' | 'warn' | 'err';
  statusText: string;
  time: string;
  source: '设备同步' | '手动录入' | '康养平台' | '医院调取';
  details?: Record<string, any>;
}

// 趋势点
export interface TrendPoint {
  date: string;
  systolic: number; // 收缩压
  diastolic: number; // 舒张压
}

// 中医体质辨识题目与结果
export interface ConstitutionQuestion {
  id: number;
  question: string;
  dimension: string;
  options: { label: string; score: number }[];
}

export interface ConstitutionResult {
  mainType: string;
  secondaryType: string;
  score: number;
  description: string;
  recommendations: {
    diet: string[];
    exercise: string[];
    lifestyle: string[];
    products: string[];
  };
}

// 体检报告
export interface MedicalReport {
  id: string;
  title: string;
  date: string;
  institution: string;
  status: 'interpreted' | 'processing' | 'uploaded';
  abnormalCount: number;
  indicators: {
    name: string;
    value: string;
    reference: string;
    isAbnormal: boolean;
    statusTag: '偏高' | '偏低' | '正常' | '阳性';
  }[];
  aiSummary: string;
  expert: {
    name: string;
    title: string;
    hospital: string;
    experience: string;
    wechatQr: string;
  };
}

// 家庭成员
export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  avatar: string;
  role: 'leader' | 'member';
  healthScore: number;
  deviceSynced: boolean;
  sharedSettings: {
    healthRecords: boolean;
    medicalReports: boolean;
    tongueDiagnosis: boolean;
    sharedCart: boolean;
    ordersVisibility: 'visible_and_pay' | 'readonly' | 'none';
  };
}

// 商品与服务
export interface HealthProduct {
  id: string;
  title: string;
  type: 'product' | 'inStoreService' | 'doorstepService';
  category: 'hardware' | 'food' | 'medical' | 'inStore' | 'doorstep' | 'self_operated';
  coverImage: string;
  price: number;
  originalPrice: number;
  salesCount: number;
  rating: number;
  stock: number;
  isSeckill?: boolean;
  seckillTime?: string;
  healthTags: string[];
  store: {
    id: string;
    name: string;
    isVerified: boolean;
    rating: number;
    distanceKm: number;
    address: string;
  };
  // 硬件绑定专属引导
  hardwareBindingGuide?: string;
  // 到店服务专属属性
  inStoreDetails?: {
    durationMinutes: number;
    validDays: number;
    nearbyStores: { name: string; distance: string; rating: number; availableToday: boolean }[];
  };
  // 上门服务专属属性（双派单）
  doorstepDetails?: {
    durationMinutes: number;
    supportedCities: string[];
    nurseQualification: string;
    serviceScopeKm: number;
  };
}

// 购物车商品
export interface HealthCartItem {
  id: string;
  product: HealthProduct;
  skuName: string;
  quantity: number;
  price: number;
  selected: boolean;
  addedByMemberName?: string; // 标识家庭成员加购（如"李女士(母亲)"）
  isInvalid?: boolean; // 是否失效/缺货
}

// 订单跨店消费券分摊
export interface CouponShareItem {
  storeName: string;
  shareAmount: number;
  percent: string;
}

export interface HealthOrder {
  id: string;
  orderNo: string;
  createTime?: string;
  orderTime?: string;
  type?: 'product' | 'inStoreService' | 'doorstepService';
  orderType?: 'product' | 'inStoreService' | 'doorstepService';
  status: 'pending_pay' | 'pending_ship' | 'pending_receive' | 'pending_service' | 'pending_verify' | 'completed' | 'refund_processing' | 'closed' | 'pending_use';
  statusText?: string;
  items: any[];
  totalAmount: number;
  couponAmount?: number;
  paidAmount?: number;
  orderedBy?: string; // 下单人
  payMethod?: 'wechat' | 'family_agent_pay'; // 微信支付或亲情代付
  couponShareList?: CouponShareItem[]; // 跨店消费券分摊明细
  platformCommission?: number; // 平台佣金（用券商品可为0）
  storeName?: string;
  // 物流
  tracking?: {
    company: string;
    trackingNo: string;
    currentStatus: string;
    timeline: { time: string; text: string }[];
  };
  // 到店核销码
  verifyCode?: string;
  verificationCode?: string;
  // 上门派单信息
  dispatchInfo?: any;
  doorstepDispatch?: {
    mode: 'platform_smart' | 'merchant_assign';
    nurseName: string;
    nursePhone: string;
    nurseAvatar: string;
    nurseRating: number;
    distance: string;
    estimatedArrival: string;
    serviceStatus: 'dispatched' | 'departed' | 'in_service' | 'finished';
  };
}

// 管家套餐
export interface HousekeeperPackage {
  id: string;
  name: string;
  icon: string;
  priceMonthly: number;
  subtitle: string;
  badge?: string;
  benefits: string[];
  familyScopeNote: string;
}

// 健康资讯
export interface HealthArticle {
  id: string;
  title: string;
  category: string;
  readCount: string;
  date: string;
  coverImage: string;
  icon: string;
  author: {
    name: string;
    title: string;
    hospital: string;
    verified: boolean;
  };
  content: string[];
  recommendForConstitution?: string; // 如 "按您的阳虚体质推荐"
}

// 健康消息通知
export interface HealthNotification {
  id: string;
  type: 'report' | 'reminder' | 'service' | 'system';
  title: string;
  content: string;
  time: string;
  isRead: boolean;
}

// 四大工作台角色
export type WorkbenchType = 'merchant' | 'nurse' | 'butler' | 'store';
