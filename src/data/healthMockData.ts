import {
  HealthProfile,
  HealthMetricRecord,
  TrendPoint,
  ConstitutionQuestion,
  MedicalReport,
  FamilyMember,
  HealthProduct,
  HealthOrder,
  HousekeeperPackage,
  HealthArticle,
  HealthNotification
} from '../types/health';

// 默认用户档案（张明，38岁，综合评分85）
export const DEFAULT_HEALTH_PROFILE: HealthProfile = {
  name: '张明',
  gender: '男',
  age: 38,
  birthDate: '1988-05-12',
  height: 175,
  weight: 70,
  bmi: 22.9,
  bloodType: 'A型',
  maritalStatus: '已婚 · 一子',
  emergencyContact: {
    name: '李芳',
    phone: '138****6688',
    relation: '妻子'
  },
  chronicDiseases: ['高血压（2年 · 已通过药物控制）'],
  allergies: ['青霉素过敏 ⚠ 严禁使用青霉素类及头孢交叉过敏药物'],
  medications: ['苯磺酸氨氯地平片 5mg qd'],
  familyHistory: ['父亲高血压史', '母亲2型糖尿病史'],
  healthScore: 85,
  constitution: {
    main: '平和质',
    secondary: '气虚质（倾向）',
    advice: '总体阴阳气血调和，但易感倦怠，平时注意劳逸结合、避免过度劳累，可适度健脾益气。'
  },
  portraitTags: [
    '健康·血压临界',
    '行为·久坐族',
    '需求·慢病预防',
    '消费·注重养生',
    '家庭·顶梁柱'
  ]
};

// 7天收缩压与舒张压趋势
export const BP_TREND_DATA: TrendPoint[] = [
  { date: '08-20', systolic: 128, diastolic: 82 },
  { date: '08-21', systolic: 122, diastolic: 80 },
  { date: '08-22', systolic: 130, diastolic: 84 },
  { date: '08-23', systolic: 120, diastolic: 78 },
  { date: '08-24', systolic: 124, diastolic: 81 },
  { date: '08-25', systolic: 118, diastolic: 78 },
  { date: '今天', systolic: 118, diastolic: 78 }
];

// 指标网格
export const DEFAULT_METRICS: HealthMetricRecord[] = [
  {
    id: 'm1',
    type: 'blood_pressure',
    value: '118/78',
    unit: 'mmHg',
    status: 'ok',
    statusText: '正常理想',
    time: '今天 08:30',
    source: '设备同步'
  },
  {
    id: 'm2',
    type: 'blood_sugar',
    value: '5.2',
    unit: 'mmol/L',
    status: 'ok',
    statusText: '空腹达标',
    time: '昨天 07:10',
    source: '手动录入'
  },
  {
    id: 'm3',
    type: 'heart_rate',
    value: '72',
    unit: 'bpm',
    status: 'warn',
    statusText: '轻度偏快',
    time: '今天 08:30',
    source: '设备同步'
  },
  {
    id: 'm4',
    type: 'spo2',
    value: '98%',
    unit: '',
    status: 'ok',
    statusText: '血氧充沛',
    time: '08-25 21:00',
    source: '康养平台'
  }
];

// 中医体质辨识 9 题
export const CONSTITUTION_QUESTIONS: ConstitutionQuestion[] = [
  {
    id: 1,
    question: '您经常感到精力不济、疲乏无力吗？',
    dimension: '气虚质',
    options: [
      { label: 'A. 从不 (没有)', score: 1 },
      { label: 'B. 很少 (偶尔)', score: 2 },
      { label: 'C. 有时 (经常)', score: 3 },
      { label: 'D. 总是 (持续)', score: 4 }
    ]
  },
  {
    id: 2,
    question: '您比一般人怕冷，冬天手脚冰凉或受凉易腹泻吗？',
    dimension: '阳虚质',
    options: [
      { label: 'A. 从不', score: 1 },
      { label: 'B. 很少', score: 2 },
      { label: 'C. 有时', score: 3 },
      { label: 'D. 总是', score: 4 }
    ]
  },
  {
    id: 3,
    question: '您容易口燥咽干、手足心发热或大便干燥吗？',
    dimension: '阴虚质',
    options: [
      { label: 'A. 从不', score: 1 },
      { label: 'B. 很少', score: 2 },
      { label: 'C. 有时', score: 3 },
      { label: 'D. 总是', score: 4 }
    ]
  },
  {
    id: 4,
    question: '您感到面部皮肤油脂较多，或胸闷痰多吗？',
    dimension: '痰湿质',
    options: [
      { label: 'A. 从不', score: 1 },
      { label: 'B. 很少', score: 2 },
      { label: 'C. 有时', score: 3 },
      { label: 'D. 总是', score: 4 }
    ]
  },
  {
    id: 5,
    question: '您容易生痤疮、口苦口臭或大便黏滞不爽吗？',
    dimension: '湿热质',
    options: [
      { label: 'A. 从不', score: 1 },
      { label: 'B. 很少', score: 2 },
      { label: 'C. 有时', score: 3 },
      { label: 'D. 总是', score: 4 }
    ]
  },
  {
    id: 6,
    question: '您的皮肤常不知不觉出现青紫瘀斑，或面部容易有色斑？',
    dimension: '血瘀质',
    options: [
      { label: 'A. 从不', score: 1 },
      { label: 'B. 很少', score: 2 },
      { label: 'C. 有时', score: 3 },
      { label: 'D. 总是', score: 4 }
    ]
  },
  {
    id: 7,
    question: '您容易感到闷闷不乐、情绪低落或常无故叹气吗？',
    dimension: '气郁质',
    options: [
      { label: 'A. 从不', score: 1 },
      { label: 'B. 很少', score: 2 },
      { label: 'C. 有时', score: 3 },
      { label: 'D. 总是', score: 4 }
    ]
  },
  {
    id: 8,
    question: '您对花粉、冷空气、海鲜等容易过敏起风团或鼻痒喷嚏吗？',
    dimension: '特禀质',
    options: [
      { label: 'A. 从不', score: 1 },
      { label: 'B. 很少', score: 2 },
      { label: 'C. 有时', score: 3 },
      { label: 'D. 总是', score: 4 }
    ]
  },
  {
    id: 9,
    question: '您平时面色红润，食欲睡眠正常，耐受寒热适应自然环境吗？',
    dimension: '平和质',
    options: [
      { label: 'A. 总是', score: 4 },
      { label: 'B. 有时', score: 3 },
      { label: 'C. 很少', score: 2 },
      { label: 'D. 从不', score: 1 }
    ]
  }
];

// 体检报告列表
export const MOCK_MEDICAL_REPORTS: MedicalReport[] = [
  {
    id: 'rep-2026',
    title: '2026年度全面深度健康体检报告',
    date: '2026-08-01',
    institution: '深圳市南山人民医院健康管理中心 (康养平台调取)',
    status: 'interpreted',
    abnormalCount: 2,
    indicators: [
      { name: '血压 (收缩压/舒张压)', value: '118/78 mmHg', reference: '90-139 / 60-89', isAbnormal: false, statusTag: '正常' },
      { name: '空腹静脉血糖 (GLU)', value: '6.8 mmol/L', reference: '3.90 - 6.10', isAbnormal: true, statusTag: '偏高' },
      { name: '血清总胆固醇 (TC)', value: '5.6 mmol/L', reference: '2.80 - 5.20', isAbnormal: true, statusTag: '偏高' },
      { name: '身体质量指数 (BMI)', value: '22.9 kg/m²', reference: '18.5 - 23.9', isAbnormal: false, statusTag: '正常' },
      { name: '谷丙转氨酶 (ALT)', value: '28 U/L', reference: '9 - 50', isAbnormal: false, statusTag: '正常' },
      { name: '心电图 (ECG)', value: '窦性心律，正常心电图', reference: '正常窦性', isAbnormal: false, statusTag: '正常' }
    ],
    aiSummary: '本次报告显示空腹血糖与总胆固醇均轻度偏高，提示代谢指标存在异常风险。建议严格控制夜间精制碳水摄入，补充粗纤维并适度增加中等强度有氧运动，2周后进行复查。',
    expert: {
      name: '李主任',
      title: '内分泌与代谢科主任医师',
      hospital: '三甲医院 · 25年临床经验',
      experience: '专注于慢病代谢逆转、中西医结合调理',
      wechatQr: '扫码添加专家企业微信（PE-004）'
    }
  },
  {
    id: 'rep-2025',
    title: '2025年度体检报告（本地OCR上传）',
    date: '2025-07-15',
    institution: '慈铭体检中心',
    status: 'interpreted',
    abnormalCount: 1,
    indicators: [
      { name: '空腹血糖', value: '6.2 mmol/L', reference: '3.9 - 6.1', isAbnormal: true, statusTag: '偏高' },
      { name: '甘油三酯', value: '1.5 mmol/L', reference: '0.5 - 1.7', isAbnormal: false, statusTag: '正常' }
    ],
    aiSummary: '历史体检空腹血糖已处于临界值上限，长期趋势需持续防范胰岛素抵抗。',
    expert: {
      name: '王医师',
      title: '全科主治医师',
      hospital: '健康管理团队',
      experience: '12年慢病随访经验',
      wechatQr: '扫码添加'
    }
  }
];

// 家庭圈成员（上限10人，主理人制）
export const MOCK_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'f1',
    name: '我 (张明)',
    relation: '本人',
    avatar: '👨',
    role: 'leader',
    healthScore: 85,
    deviceSynced: true,
    sharedSettings: {
      healthRecords: true,
      medicalReports: true,
      tongueDiagnosis: true,
      sharedCart: true,
      ordersVisibility: 'visible_and_pay'
    }
  },
  {
    id: 'f2',
    name: '张建国 (父亲)',
    relation: '父母',
    avatar: '👴',
    role: 'member',
    healthScore: 78,
    deviceSynced: true,
    sharedSettings: {
      healthRecords: true,
      medicalReports: true,
      tongueDiagnosis: false,
      sharedCart: true,
      ordersVisibility: 'visible_and_pay'
    }
  },
  {
    id: 'f3',
    name: '王秀英 (母亲)',
    relation: '父母',
    avatar: '👵',
    role: 'member',
    healthScore: 82,
    deviceSynced: false,
    sharedSettings: {
      healthRecords: true,
      medicalReports: true,
      tongueDiagnosis: true,
      sharedCart: true,
      ordersVisibility: 'readonly'
    }
  }
];

// 全量商品与健康服务
export const MOCK_HEALTH_PRODUCTS: HealthProduct[] = [
  {
    id: 'P001',
    title: '智能电子血压计 Pro 蓝牙无线款',
    type: 'product',
    category: 'hardware',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80',
    price: 199,
    originalPrice: 259,
    salesCount: 12400,
    rating: 4.8,
    stock: 240,
    isSeckill: true,
    seckillTime: '12:00 场限量抢',
    healthTags: ['慢病监测', '自动同步档案', '医用级精准'],
    store: {
      id: 'ST_KYT',
      name: '康养堂健康旗舰店',
      isVerified: true,
      rating: 4.9,
      distanceKm: 1.2,
      address: '深圳市南山区科技园路8号'
    },
    hardwareBindingGuide: '购买确认收货后，开启设备蓝牙扫码即可与 App 绑定，检测收缩压/舒张压数据自动静默同步至个人与家庭健康档案。'
  },
  {
    id: 'P002',
    title: '天然高活性维生素D3 软胶囊 90粒',
    type: 'product',
    category: 'food',
    coverImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    price: 89,
    originalPrice: 129,
    salesCount: 35000,
    rating: 4.7,
    stock: 580,
    isSeckill: true,
    seckillTime: '12:00 场',
    healthTags: ['骨骼强化', '免疫支持', '澳洲原装进口'],
    store: {
      id: 'ST_KYT',
      name: '康养堂健康旗舰店',
      isVerified: true,
      rating: 4.9,
      distanceKm: 1.2,
      address: '深圳市南山区科技园路8号'
    }
  },
  {
    id: 'P003',
    title: '中医馆 · 颈肩深层经络理疗套餐（60分钟到店）',
    type: 'inStoreService',
    category: 'inStore',
    coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
    price: 128,
    originalPrice: 198,
    salesCount: 5200,
    rating: 4.9,
    stock: 30,
    healthTags: ['到店核销', '三甲资质理疗师', '温阳活血'],
    store: {
      id: 'ST_KYT',
      name: '康养堂中医理疗分馆',
      isVerified: true,
      rating: 4.9,
      distanceKm: 1.2,
      address: '科技园南路88号3栋1层'
    },
    inStoreDetails: {
      durationMinutes: 60,
      validDays: 30,
      nearbyStores: [
        { name: '康养堂（南山科技园旗舰店）', distance: '1.2km', rating: 4.9, availableToday: true },
        { name: '国医馆（华侨城分店）', distance: '3.5km', rating: 4.8, availableToday: true }
      ]
    }
  },
  {
    id: 'P004',
    title: '专业护士上门采血与体征基础检测（含耗材）',
    type: 'doorstepService',
    category: 'doorstep',
    coverImage: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=400&q=80',
    price: 68,
    originalPrice: 98,
    salesCount: 3100,
    rating: 4.9,
    stock: 50,
    healthTags: ['滴滴式双派单', '执业护士', '数据自动入档'],
    store: {
      id: 'ST_KYT',
      name: '康养堂上门护理中心',
      isVerified: true,
      rating: 4.9,
      distanceKm: 0.8,
      address: '粤海街道科技园路8号'
    },
    doorstepDetails: {
      durationMinutes: 30,
      supportedCities: ['北京', '上海', '广州', '深圳', '杭州'],
      nurseQualification: '国家执业护师，统一无菌操作与冷链样本送检',
      serviceScopeKm: 8
    }
  },
  {
    id: 'P005',
    title: '智能精准人体成分分析仪 (WiFi体脂秤)',
    type: 'product',
    category: 'hardware',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80',
    price: 159,
    originalPrice: 219,
    salesCount: 8900,
    rating: 4.8,
    stock: 120,
    healthTags: ['16项指标', '家庭8人自动识别', '减脂追踪'],
    store: {
      id: 'ST_HW',
      name: '智能健康物联生活馆',
      isVerified: true,
      rating: 4.8,
      distanceKm: 2.1,
      address: '高新南四道18号'
    },
    hardwareBindingGuide: '上秤即可自动唤醒蓝牙/WiFi并识别测量者，体脂率与骨骼肌数据自动同步至对应家庭成员档案。'
  },
  {
    id: 'P006',
    title: '高纯度微分子深海鱼油软胶囊 (EPA+DHA 85%)',
    type: 'product',
    category: 'food',
    coverImage: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&q=80',
    price: 168,
    originalPrice: 238,
    salesCount: 16000,
    rating: 4.9,
    stock: 320,
    healthTags: ['血脂调节', '心脑血管守护', 'IFOS五星认证'],
    store: {
      id: 'ST_KYT',
      name: '康养堂健康旗舰店',
      isVerified: true,
      rating: 4.9,
      distanceKm: 1.2,
      address: '深圳市南山区科技园路8号'
    }
  }
];

// 订单列表
export const MOCK_HEALTH_ORDERS: HealthOrder[] = [
  {
    id: 'O001',
    orderNo: '2026082512345678',
    createTime: '2026-08-25 18:02',
    type: 'product',
    status: 'pending_receive',
    items: [
      {
        product: MOCK_HEALTH_PRODUCTS[0],
        skuName: '标准蓝牙款 · 医用级',
        quantity: 1,
        price: 199
      }
    ],
    totalAmount: 199,
    couponAmount: 20,
    paidAmount: 179,
    orderedBy: '本人 (张明)',
    payMethod: 'wechat',
    couponShareList: [
      { storeName: '康养堂健康旗舰店', shareAmount: 20, percent: '100%' }
    ],
    platformCommission: 0,
    tracking: {
      company: '顺丰速运',
      trackingNo: 'SF1428573921',
      currentStatus: '已到达深圳南山科技园派件网点，正在派送',
      timeline: [
        { time: '今天 08:30', text: '顺丰快递员已揽件派送中' },
        { time: '昨天 20:15', text: '深圳转运中心已完成分拣发出' },
        { time: '08-25 18:20', text: '商家已打印快递面单并打包' }
      ]
    }
  },
  {
    id: 'O002',
    orderNo: '2026082611122334',
    createTime: '2026-08-26 11:30',
    type: 'doorstepService',
    status: 'pending_service',
    items: [
      {
        product: MOCK_HEALTH_PRODUCTS[3],
        skuName: '上门常规基础体征采血服务',
        quantity: 1,
        price: 68
      }
    ],
    totalAmount: 68,
    couponAmount: 0,
    paidAmount: 68,
    orderedBy: '张建国 (父亲 · 共享购物车代付)',
    payMethod: 'family_agent_pay',
    platformCommission: 0,
    doorstepDispatch: {
      mode: 'platform_smart',
      nurseName: '王护士',
      nursePhone: '139****1122',
      nurseAvatar: '👩‍⚕️',
      nurseRating: 4.9,
      distance: '距您0.8km',
      estimatedArrival: '今天 14:35',
      serviceStatus: 'departed'
    }
  },
  {
    id: 'O003',
    orderNo: '2026082409104455',
    createTime: '2026-08-24 09:10',
    type: 'inStoreService',
    status: 'pending_verify',
    items: [
      {
        product: MOCK_HEALTH_PRODUCTS[2],
        skuName: '中医馆颈肩调理套餐 (60分钟)',
        quantity: 1,
        price: 128
      }
    ],
    totalAmount: 128,
    couponAmount: 0,
    paidAmount: 128,
    orderedBy: '李女士 (母亲)',
    payMethod: 'wechat',
    platformCommission: 10.24,
    verifyCode: '8 6 4 2 1'
  }
];

// 管家套餐
export const HOUSEKEEPER_PACKAGES: HousekeeperPackage[] = [
  {
    id: 'pkg-health',
    name: '健康管家套餐',
    icon: '🫀',
    priceMonthly: 299,
    subtitle: '1名专属健康管理师专人服务全家',
    badge: '热门优选',
    benefits: [
      '专属健康管理师 1 对 1 全程跟进',
      '全家慢病指标 (血压/血糖) 日常盯测与分析',
      '三甲医院就医挂号与绿色陪诊 2 次/月',
      '三甲名医远程图文问诊 3 次/月',
      '定期家庭健康周报与异常指标预警',
      '体检报告多维度深度中西医联合解读'
    ],
    familyScopeNote: '服务覆盖全家最多5位成员，数据统一纳入家庭档案'
  },
  {
    id: 'pkg-nutrition',
    name: '营养管家套餐',
    icon: '🥗',
    priceMonthly: 199,
    subtitle: '注册营养师制定全家专属药膳配餐',
    benefits: [
      '1 对 1 资深注册营养师定制营养档案',
      '按家庭成员九大体质出具每日三餐定制食谱',
      '三高/肥胖/痛风等慢病针对性饮食干预计划',
      '每月 1 次上门人体成分与微量营养素评估'
    ],
    familyScopeNote: '饮食方案按家庭烹饪习惯综合制定'
  },
  {
    id: 'pkg-life',
    name: '生活管家套餐',
    icon: '🏡',
    priceMonthly: 99,
    subtitle: '助老陪护、家政保洁与家庭跑腿全包',
    benefits: [
      '专业家政深度保洁与环境消毒 2 次/月',
      '长辈就医跑腿取药送药上门 4 次/月',
      '家庭适老化改造与防跌倒安全排查评估',
      '24小时紧急呼叫与家庭联络响应'
    ],
    familyScopeNote: '生活琐事由专人统筹安排，费用入全家账本'
  },
  {
    id: 'pkg-all',
    name: '全家福至尊组合套餐',
    icon: '👑',
    priceMonthly: 499,
    subtitle: '健康 + 营养 + 生活 三合一 · 立省¥98',
    badge: '尊享全包',
    benefits: [
      '涵盖健康、营养、生活三大管家全部权益',
      '家庭成员健康数据全自动智能关联互联',
      '每季度三甲专家上门家庭健康大巡诊 1 次'
    ],
    familyScopeNote: '1个账号护航三代全家健康'
  }
];

// 健康资讯
export const MOCK_HEALTH_ARTICLES: HealthArticle[] = [
  {
    id: 'art-1',
    title: '阳虚体质秋冬温补指南：这5种当季食材别错过',
    category: '中医养生',
    readCount: '2.3w',
    date: '3天前',
    coverImage: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80',
    icon: '🍲',
    author: {
      name: '陈医生',
      title: '三甲医院中医科主任医师',
      hospital: '广东省中医院',
      verified: true
    },
    recommendForConstitution: '按您的阳虚/气虚体质推荐',
    content: [
      '秋冬阳气潜藏，阳虚体质常表现为畏寒肢冷、面色晄白、喜热饮食。',
      '调理原则遵循“温阳补肾、健脾化湿”，日常推荐生姜、羊肉、当归、山药、黑豆五大平补温补食材。',
      '进补切忌盲目大温大燥，建议结合自身舌苔与体质自测结果循序渐进。'
    ]
  },
  {
    id: 'art-2',
    title: '药师提醒：这5类常用降压与降糖药千万别用热水送服',
    category: '安全用药',
    readCount: '1.8w',
    date: '5天前',
    coverImage: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80',
    icon: '💊',
    author: {
      name: '刘药师',
      title: '临床主管药师',
      hospital: '北京大学深圳医院',
      verified: true
    },
    content: [
      '含活性菌类制剂、维生素C、助消化酶类以及部分缓释胶囊，遇高温水极易灭活或加速释药导致血压骤降。',
      '温开水温度建议控制在40℃以下，送服水量保持在150-200ml最佳。'
    ]
  },
  {
    id: 'art-3',
    title: '每天10分钟八段锦：改善冬季手脚冰凉与久坐肩颈僵硬',
    category: '运动健康',
    readCount: '1.1w',
    date: '1周前',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80',
    icon: '🧘',
    author: {
      name: '张教练',
      title: '国家社会体育指导员',
      hospital: '传统养生体育学会',
      verified: true
    },
    content: [
      '“双手托天理三焦，左右开弓似射雕”，八段锦动作柔和连绵，动静相兼。',
      '晨起或午间久坐后练习，有助于调理脏腑气机、疏通四肢经络血脉。'
    ]
  }
];

// 消息通知
export const MOCK_NOTIFICATIONS: HealthNotification[] = [
  {
    id: 'n1',
    type: 'report',
    title: '体检报告已生成',
    content: '您的2026年度体检报告已同步至健康档案，AI已完成深度解读，发现2项异常指标建议复查。',
    time: '今天 10:23',
    isRead: false
  },
  {
    id: 'n2',
    type: 'reminder',
    title: '复测提醒：今日血压打卡',
    content: '今天是您慢病管理计划推荐的静息血压监测日，请在晨起静坐5分钟后测量并记录。',
    time: '今天 08:00',
    isRead: false
  },
  {
    id: 'n3',
    type: 'service',
    title: '上门服务接单通知',
    content: '王护士已接单您的上门采血服务，预计今天 14:35 到达您的预约地址。',
    time: '昨天 13:40',
    isRead: true
  },
  {
    id: 'n4',
    type: 'system',
    title: '现金消费券已到账',
    content: '成功参与平台新用户入驻活动，已向您的钱包发放 ¥20.00 无门槛现金券（北京门户可用）。',
    time: '08-25 15:00',
    isRead: true
  }
];

// 别名导出与初始化购物车
export const DEFAULT_PROFILE = DEFAULT_HEALTH_PROFILE;
export const MOCK_ORDERS = MOCK_HEALTH_ORDERS;
export const INITIAL_CART = [
  {
    id: 'cart-init-1',
    product: MOCK_HEALTH_PRODUCTS[0],
    sku: '标准医用版',
    quantity: 1,
    price: MOCK_HEALTH_PRODUCTS[0].price,
    addedBy: '本人 (张明)'
  }
];

