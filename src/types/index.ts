export type DeviceType = 'iphone15' | 'iphonese' | 'mate60' | 'ipad' | 'fullscreen';

export interface DeviceConfig {
  id: DeviceType;
  name: string;
  width: number;
  height: number;
  dpr: number;
  statusBarHeight: number;
  safeAreaBottom: number;
  notchType: 'dynamic-island' | 'classic' | 'punch-hole' | 'none';
  os: 'iOS' | 'HarmonyOS' | 'Android' | 'iPadOS';
}

export type ActiveTab = 'home' | 'seckill' | 'group' | 'bargain' | 'community' | 'distribution';

export interface Product {
  id: string;
  title: string;
  subTitle: string;
  coverImage: string;
  images: string[];
  price: number;
  originalPrice: number;
  salesCount: number;
  stock: number;
  category: string;
  tags: string[];
  // Social commerce extensions
  isGroupBuy?: boolean;
  groupPrice?: number;
  groupRequiredUsers?: number;
  groupActiveCount?: number;
  
  isBargain?: boolean;
  bargainFloorPrice?: number;
  bargainInitPrice?: number;
  
  isSeckill?: boolean;
  seckillPrice?: number;
  seckillSoldPercent?: number;
  seckillStartTime?: string;
  
  distributionCommission?: number; // 预计收益
  distributionRatio?: string; // 佣金比例
  
  skus?: {
    id: string;
    specs: string;
    price: number;
    stock: number;
  }[];
}

export interface GroupTeam {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  groupPrice: number;
  leader: {
    name: string;
    avatar: string;
  };
  members: {
    name: string;
    avatar: string;
  }[];
  requiredCount: number;
  currentCount: number;
  endTime: number; // timestamp
}

export interface BargainItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  originalPrice: number;
  floorPrice: number; // 砍到底价（通常0元或极低价）
  currentPrice: number;
  slashedAmount: number;
  helpers: {
    id: string;
    name: string;
    avatar: string;
    amount: number;
    time: string;
    comment: string;
  }[];
  endTime: number;
}

export interface SeckillSession {
  id: string;
  timeLabel: string;
  status: 'ended' | 'ongoing' | 'upcoming';
  statusText: string;
  products: Product[];
}

export interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    badge?: string;
  };
  image: string;
  title: string;
  content: string;
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  tags: string[];
  relatedProduct: {
    id: string;
    title: string;
    price: number;
    coverImage: string;
    typeText: string;
  };
}

export interface DistributorProfile {
  name: string;
  avatar: string;
  level: string;
  inviteCode: string;
  totalIncome: number;
  withdrawableIncome: number;
  frozenIncome: number;
  teamCount: number;
  directCustomers: number;
  orderCount: number;
  rank: number;
}

export interface CartItem {
  product: Product;
  skuId?: string;
  skuName?: string;
  quantity: number;
  price: number;
  buyType: 'normal' | 'group' | 'seckill' | 'bargain';
}
