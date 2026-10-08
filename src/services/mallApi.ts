/**
 * [healthmall-ext] H5 商城商品接口客户端（期1：商品列表对接 + 门户/类别筛选）
 * 后端：GET /front/pt/product/list | listCategory；GET /front/sys/portal/list
 * 门户/多商家过滤在后端按 Host 与 portal_id 参数完成（P_A4）
 */
import type { HealthProduct } from '../types/health';

/** 后端商品列表原始项（只映射用到的字段， snake_case 对齐 @JsonNaming） */
export interface RawProduct {
  product_id: number;
  product_name: string;
  product_image?: string;
  product_tips?: string;
  product_unit_price_min?: number;
  product_unit_price_max?: number;
  product_sale_num?: number;
  product_quantity?: number;
  category_id?: number;
  kind_id?: number;
  product_tags?: string;
  store_id: number;
  store_name?: string | null;
  store_address?: string | null;
  product_state_id?: number;
  product_verify_id?: number;
  items?: Array<{
    item_id: number;
    item_name?: string;
    item_is_default?: boolean;
    item_unit_price?: number;
    item_market_price?: number;
    item_quantity?: number;
  }>;
}

export interface MallProductParams {
  page?: number;
  size?: number;
  keywords?: string;
  category_id?: number;
  portal_id?: number;
}

export interface MallProductList {
  items: HealthProduct[];
  /** 总条数（⚠️ 后端 records=总条数，total=总页数） */
  totalRecords: number;
  totalPages: number;
}

export interface MallCategory {
  category_id: number;
  category_name: string;
}

export interface MallPortal {
  portal_id: number;
  portal_name: string;
  portal_type: string;
  brand_color?: string;
  store_count: number;
}

/** 默认 SKU：items[] 中 item_is_default=true 优先，否则第一个 */
function defaultItem(raw: RawProduct) {
  const items = raw.items || [];
  return items.find((i) => i.item_is_default) || items[0];
}

/** snake_case 原始项 → H5 HealthProduct（映射规则见 wiki 期1 设计 §B） */
export function mapToHealthProduct(raw: RawProduct): HealthProduct {
  const sku = defaultItem(raw);
  const price = Number(sku?.item_unit_price ?? raw.product_unit_price_min ?? 0);
  const originalPrice = Number(sku?.item_market_price ?? raw.product_unit_price_max ?? price);
  return {
    id: String(raw.product_id),
    title: raw.product_name || '',
    // 期1 一律实物商品；到店/上门由 kind_id+product_service_type_ids 映射（期2）
    type: 'product',
    // 真实类目 ID 以字符串承载，筛选时回传 category_id；未匹配归自营
    category: 'self_operated',
    coverImage: raw.product_image || '',
    price,
    originalPrice: originalPrice > price ? originalPrice : price,
    salesCount: raw.product_sale_num ?? 0,
    rating: 5,
    stock: raw.product_quantity ?? sku?.item_quantity ?? 0,
    healthTags: (raw.product_tags || '').split(',').filter((t) => !!t),
    // [healthmall-ext] 二期：SKU 明细（加购/立即购买需要 item_id）
    items: (raw.items || []).map((i) => ({
      itemId: Number(i.item_id),
      itemName: i.item_name,
      isDefault: !!i.item_is_default,
      price: Number(i.item_unit_price ?? 0)
    })),
    store: {
      id: String(raw.store_id),
      name: raw.store_name || `门店${raw.store_id}`,
      isVerified: true,
      rating: 5,
      distanceKm: 0,
      address: raw.store_address || ''
    }
  };
}

function toQuery(params: Record<string, any>): string {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
}

/** 商品列表（真实数据；调用方负责失败时回退 mock） */
export async function apiGetProducts(params: MallProductParams): Promise<MallProductList> {
  const res = await fetch(`/front/pt/product/list?${toQuery({ page: 1, size: 20, ...params })}`, {
    headers: { Accept: 'application/json' }
  });
  const data: any = await res.json();
  if (data.status !== 200) throw new Error(data.msg || '商品列表加载失败');
  const payload = data.data || {};
  const items = (payload.items || []) as RawProduct[];
  return {
    items: items.map(mapToHealthProduct),
    // ⚠️ 后端 records=总条数，total=总页数
    totalRecords: payload.records ?? items.length,
    totalPages: payload.total ?? 1
  };
}

/** 商品类目（后端 listCategory；空/失败返回空数组，调用方回退内置 tab） */
export async function apiGetCategories(): Promise<MallCategory[]> {
  const res = await fetch('/front/pt/product/listCategory?page=1&size=50', {
    headers: { Accept: 'application/json' }
  });
  const data: any = await res.json();
  if (data.status !== 200) return [];
  return ((data.data || {}).items || []).map((c: any) => ({
    category_id: c.category_id,
    category_name: c.category_name
  }));
}

/** 启用中的门户列表（门户筛选数据源，无需登录） */
export async function apiGetPortalList(): Promise<MallPortal[]> {
  const res = await fetch('/front/sys/portal/list', {
    headers: { Accept: 'application/json' }
  });
  const data: any = await res.json();
  if (data.status !== 200) return [];
  return (data.data || []) as MallPortal[];
}
