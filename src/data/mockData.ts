import { Product, GroupTeam, BargainItem, SeckillSession, CommunityPost, DistributorProfile, DeviceConfig } from '../types';

export const DEVICE_PRESETS: DeviceConfig[] = [
  {
    id: 'iphone15',
    name: 'iPhone 15 Pro',
    width: 393,
    height: 852,
    dpr: 3,
    statusBarHeight: 44,
    safeAreaBottom: 34,
    notchType: 'dynamic-island',
    os: 'iOS'
  },
  {
    id: 'mate60',
    name: 'Huawei Mate 60',
    width: 400,
    height: 888,
    dpr: 2.8,
    statusBarHeight: 38,
    safeAreaBottom: 28,
    notchType: 'punch-hole',
    os: 'HarmonyOS'
  },
  {
    id: 'iphonese',
    name: 'iPhone SE (3rd Gen)',
    width: 375,
    height: 667,
    dpr: 2,
    statusBarHeight: 20,
    safeAreaBottom: 0,
    notchType: 'classic',
    os: 'iOS'
  },
  {
    id: 'ipad',
    name: 'iPad Mini (Tablet)',
    width: 768,
    height: 1024,
    dpr: 2,
    statusBarHeight: 24,
    safeAreaBottom: 20,
    notchType: 'none',
    os: 'iPadOS'
  },
  {
    id: 'fullscreen',
    name: 'H5 浏览器全屏自适应',
    width: 0,
    height: 0,
    dpr: 2,
    statusBarHeight: 0,
    safeAreaBottom: 0,
    notchType: 'none',
    os: 'iOS'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: '【官方正品】降噪无线蓝牙头戴式耳机 Pro',
    subTitle: '主动智能降噪 / 40小时续航 / 空间音频澎湃音质',
    coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    price: 399,
    originalPrice: 899,
    salesCount: 14200,
    stock: 280,
    category: '数码数码',
    tags: ['爆款特惠', '包邮顺丰', '正品保障'],
    isGroupBuy: true,
    groupPrice: 289,
    groupRequiredUsers: 2,
    groupActiveCount: 68,
    isBargain: true,
    bargainFloorPrice: 0,
    bargainInitPrice: 399,
    isSeckill: true,
    seckillPrice: 269,
    seckillSoldPercent: 82,
    seckillStartTime: '14:00',
    distributionCommission: 48.5,
    distributionRatio: '15%',
    skus: [
      { id: 'sku-1', specs: '钛金黑 / 标准降噪版', price: 289, stock: 95 },
      { id: 'sku-2', specs: '晨曦银 / 空间音频臻享版', price: 329, stock: 110 },
      { id: 'sku-3', specs: '深海蓝 / 全能旗舰套装', price: 369, stock: 75 }
    ]
  },
  {
    id: 'p2',
    title: '法式复古法压壶 手工耐热高硼硅玻璃咖啡壶',
    subTitle: '精密微孔滤网 / 醇香原汁油脂保留 / 咖啡师推荐',
    coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80'
    ],
    price: 89,
    originalPrice: 169,
    salesCount: 8920,
    stock: 450,
    category: '居家生活',
    tags: ['7天无理由', '新人专享', '赠咖啡豆'],
    isGroupBuy: true,
    groupPrice: 59,
    groupRequiredUsers: 3,
    groupActiveCount: 34,
    isBargain: false,
    isSeckill: true,
    seckillPrice: 49.9,
    seckillSoldPercent: 91,
    seckillStartTime: '14:00',
    distributionCommission: 12.8,
    distributionRatio: '18%',
    skus: [
      { id: 'sku-4', specs: '350ml 个人独享装 (赠品滤纸)', price: 59, stock: 200 },
      { id: 'sku-5', specs: '600ml 家庭分享装', price: 79, stock: 150 },
      { id: 'sku-6', specs: '1000ml 咖啡店商用旗舰版', price: 99, stock: 100 }
    ]
  },
  {
    id: 'p3',
    title: '智能多功能空气炸锅 5.5L大容量触控可视窗口',
    subTitle: '360°热风烘烤无油低脂 / 智能预约微电脑温控',
    coverImage: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80'
    ],
    price: 269,
    originalPrice: 499,
    salesCount: 5200,
    stock: 120,
    category: '厨房电器',
    tags: ['低脂健康', '官方质保2年'],
    isGroupBuy: false,
    isBargain: true,
    bargainFloorPrice: 0,
    bargainInitPrice: 269,
    isSeckill: false,
    distributionCommission: 35.0,
    distributionRatio: '14%',
    skus: [
      { id: 'sku-7', specs: '经典墨绿 / 可视全息视窗', price: 269, stock: 70 },
      { id: 'sku-8', specs: '复古奶白 / 带烘焙烤架礼包', price: 289, stock: 50 }
    ]
  },
  {
    id: 'p4',
    title: '天然植物萃取 精油水润保湿修护面霜 50g',
    subTitle: '深层水润锁水 / 肌肤屏障强韧舒缓 / 敏感肌可用',
    coverImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    ],
    price: 159,
    originalPrice: 299,
    salesCount: 16800,
    stock: 380,
    category: '美妆个护',
    tags: ['明星同款', '满2件立减', '正品防伪'],
    isGroupBuy: true,
    groupPrice: 99,
    groupRequiredUsers: 2,
    groupActiveCount: 112,
    isBargain: true,
    bargainFloorPrice: 19.9,
    bargainInitPrice: 159,
    isSeckill: false,
    distributionCommission: 28.0,
    distributionRatio: '20%',
    skus: [
      { id: 'sku-9', specs: '滋润型 50g (适合干性/混干)', price: 99, stock: 180 },
      { id: 'sku-10', specs: '清爽凝霜型 50g (适合油皮/夏秋)', price: 99, stock: 200 }
    ]
  },
  {
    id: 'p5',
    title: '复古真皮简约托特包 大容量单肩通勤手提女包',
    subTitle: '头层牛皮细腻手感 / 可容纳14寸电脑 / 多层收纳',
    coverImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80'
    ],
    price: 219,
    originalPrice: 429,
    salesCount: 4300,
    stock: 95,
    category: '箱包服饰',
    tags: ['匠心手工', '赠防尘真丝袋'],
    isGroupBuy: false,
    isBargain: false,
    isSeckill: true,
    seckillPrice: 169,
    seckillSoldPercent: 67,
    seckillStartTime: '14:00',
    distributionCommission: 32.5,
    distributionRatio: '15%',
    skus: [
      { id: 'sku-11', specs: '焦糖棕 / 质感头层皮', price: 169, stock: 50 },
      { id: 'sku-12', specs: '极简黑 / 商务干练款', price: 169, stock: 45 }
    ]
  },
  {
    id: 'p6',
    title: '智能恒温电热水壶 316L母婴级不锈钢 1.5L',
    subTitle: '12小时精准保温 / 提壶记忆 / 触控数显水温',
    coverImage: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80'
    ],
    price: 139,
    originalPrice: 259,
    salesCount: 7800,
    stock: 210,
    category: '厨房电器',
    tags: ['恒温保鲜', '降噪沸水'],
    isGroupBuy: true,
    groupPrice: 89,
    groupRequiredUsers: 2,
    groupActiveCount: 45,
    isBargain: true,
    bargainFloorPrice: 9.9,
    bargainInitPrice: 139,
    isSeckill: false,
    distributionCommission: 18.0,
    distributionRatio: '16%',
    skus: [
      { id: 'sku-13', specs: '月岩白 1.5L 智能数显', price: 89, stock: 120 },
      { id: 'sku-14', specs: '星空灰 1.5L 经典版', price: 89, stock: 90 }
    ]
  }
];

export const MOCK_GROUP_TEAMS: GroupTeam[] = [
  {
    id: 'team-1',
    productId: 'p1',
    productTitle: '降噪无线蓝牙头戴式耳机 Pro',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    productPrice: 399,
    groupPrice: 289,
    leader: {
      name: '林夕月',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'
    },
    members: [
      {
        name: '林夕月',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'
      }
    ],
    requiredCount: 2,
    currentCount: 1,
    endTime: Date.now() + 1000 * 60 * 65 // 1 hour 5 mins left
  },
  {
    id: 'team-2',
    productId: 'p2',
    productTitle: '法式复古耐热玻璃法压壶',
    productImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    productPrice: 89,
    groupPrice: 59,
    leader: {
      name: '陈默舟',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    },
    members: [
      {
        name: '陈默舟',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
      },
      {
        name: '苏小糖',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80'
      }
    ],
    requiredCount: 3,
    currentCount: 2,
    endTime: Date.now() + 1000 * 60 * 18 // 18 mins left
  },
  {
    id: 'team-3',
    productId: 'p4',
    productTitle: '天然精油水润保湿修护面霜',
    productImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    productPrice: 159,
    groupPrice: 99,
    leader: {
      name: '安然悠悠',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    },
    members: [
      {
        name: '安然悠悠',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
      }
    ],
    requiredCount: 2,
    currentCount: 1,
    endTime: Date.now() + 1000 * 60 * 42 // 42 mins left
  }
];

export const MOCK_BARGAIN_ITEMS: BargainItem[] = [
  {
    id: 'bg-1',
    productId: 'p3',
    productTitle: '智能多功能空气炸锅 5.5L触控可视款',
    productImage: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80',
    originalPrice: 269,
    floorPrice: 0,
    currentPrice: 38.6,
    slashedAmount: 230.4,
    helpers: [
      {
        id: 'h-1',
        name: '王小奔',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        amount: 88.5,
        time: '10分钟前',
        comment: '兄弟一刀入魂！直接砍掉88.5元！'
      },
      {
        id: 'h-2',
        name: '李小萌',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        amount: 62.0,
        time: '35分钟前',
        comment: '助你一臂之力，坐等你的炸鸡大餐~'
      },
      {
        id: 'h-3',
        name: '张云清',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
        amount: 45.3,
        time: '1小时前',
        comment: '砍得不错，还差一点点就0元啦！'
      },
      {
        id: 'h-4',
        name: '自己（发起人）',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        amount: 34.6,
        time: '2小时前',
        comment: '第一刀暴击自砍！'
      }
    ],
    endTime: Date.now() + 1000 * 60 * 60 * 14 // 14 hours left
  },
  {
    id: 'bg-2',
    productId: 'p6',
    productTitle: '智能恒温电热水壶 316L母婴级 1.5L',
    productImage: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80',
    originalPrice: 139,
    floorPrice: 9.9,
    currentPrice: 28.5,
    slashedAmount: 110.5,
    helpers: [
      {
        id: 'h-5',
        name: '阿伟同学',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
        amount: 52.3,
        time: '20分钟前',
        comment: '支持好物砍价！'
      },
      {
        id: 'h-6',
        name: '晓琳',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        amount: 58.2,
        time: '40分钟前',
        comment: '成功砍下一大截！快到底价啦'
      }
    ],
    endTime: Date.now() + 1000 * 60 * 60 * 8
  }
];

export const MOCK_SECKILL_SESSIONS: SeckillSession[] = [
  {
    id: 's-10',
    timeLabel: '10:00',
    status: 'ended',
    statusText: '已结束',
    products: [MOCK_PRODUCTS[1]]
  },
  {
    id: 's-14',
    timeLabel: '14:00',
    status: 'ongoing',
    statusText: '抢购进行中',
    products: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[1], MOCK_PRODUCTS[4]]
  },
  {
    id: 's-20',
    timeLabel: '20:00',
    status: 'upcoming',
    statusText: '即将开抢',
    products: [MOCK_PRODUCTS[2], MOCK_PRODUCTS[5]]
  }
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: {
      name: '小红书种草官·阿澈',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      badge: '金牌买家秀'
    },
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    title: '拼团入手的降噪头戴终于到了！音质彻底惊艳到我🎧',
    content: '之前一直在纠结买哪款，看到群里姐妹发了HealthShop 2人拼团立减110元！戴上去隔音效果绝了，低音浑厚不轰头，通勤地铁上世界瞬间安静。',
    likes: 382,
    isLiked: false,
    commentsCount: 46,
    tags: ['数码好物', '拼团抄底', '耳机测评'],
    relatedProduct: {
      id: 'p1',
      title: '降噪无线蓝牙头戴式耳机 Pro',
      price: 289,
      coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
      typeText: '2人拼团 ¥289'
    }
  },
  {
    id: 'post-2',
    author: {
      name: '日式晨光小厨',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      badge: '咖啡达人'
    },
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    title: '每天早晨被咖啡香唤醒☕️ 法压壶原汁萃取太治愈了',
    content: '限时秒杀抢到的法压壶，双层超细不锈钢滤网几乎没有沉淀渣！油脂非常丰富，比美式机冲出来更有风味层次。',
    likes: 219,
    isLiked: true,
    commentsCount: 19,
    tags: ['咖啡时光', '居家好物', '限时秒杀'],
    relatedProduct: {
      id: 'p2',
      title: '法式复古耐热玻璃法压壶',
      price: 49.9,
      coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
      typeText: '秒杀价 ¥49.9'
    }
  },
  {
    id: 'post-3',
    author: {
      name: '悦悦的减脂日记',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      badge: '美食博主'
    },
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80',
    title: '朋友圈好友助力砍到0元！空气炸锅烤鸡翅封神🐔',
    content: '一开始我还不信真能砍到0元，发到公司群和亲友群，大家热情帮砍，最后真的一分钱没花包邮到家！烤出来的鸡翅外焦里嫩，逼出好多油脂。',
    likes: 541,
    isLiked: false,
    commentsCount: 88,
    tags: ['砍价免费拿', '减脂餐', '厨电神器'],
    relatedProduct: {
      id: 'p3',
      title: '智能多功能空气炸锅 5.5L',
      price: 0,
      coverImage: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&auto=format&fit=crop&q=80',
      typeText: '砍价0元拿'
    }
  }
];

export const MOCK_DISTRIBUTOR_PROFILE: DistributorProfile = {
  name: '晨风（高级分销商）',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  level: 'V3 钻石合伙人',
  inviteCode: 'SUITE-8869',
  totalIncome: 14890.50,
  withdrawableIncome: 3620.00,
  frozenIncome: 1250.00,
  teamCount: 148,
  directCustomers: 42,
  orderCount: 312,
  rank: 12
};
