/**
 * [healthmall-ext] H5 健康资讯接口客户端（期1：首页资讯精选 + 详情）
 * 后端：GET /front/cms/articleBase/{list,get,listCategory}（list 强制上架过滤）
 */
import type { HealthArticle } from '../types/health';

/** 后端文章原始项（ArticleBaseRes 子集，snake_case） */
export interface RawArticle {
  article_id: number;
  article_title: string;
  article_name?: string;
  article_excerpt?: string;
  article_content?: string;
  article_image?: string;
  category_id?: number;
  article_tags?: string;
  /** 实测序列化为 "True"/"False" 字符串，也可能为 1/0 */
  article_is_popular?: boolean | string | number;
  article_add_time?: string;
  user_nickname?: string;
  article_tag_list?: Array<Record<string, unknown>>;
}

export interface cmsApiArticleList {
  articles: HealthArticle[];
  /** 精选（is_popular）子集；不足 5 条时调用方用 articles 补足 */
  popular: HealthArticle[];
  totalRecords: number;
  totalPages: number;
}

export interface cmsCategory {
  id: string;
  label: string;
}

const ICON_BY_CATEGORY: Array<[string, string]> = [
  ['慢病', '💊'],
  ['膳食', '🥗'],
  ['营养', '🥗'],
  ['科普', '📰']
];

/** 富文本 → 段落数组（剥标签，空段剔除） */
export function stripHtmlParagraphs(html?: string): string[] {
  if (!html) return [];
  return html
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean);
}

/** is_popular 兼容 "True"/true/1 三种形态 */
function isPopular(v: RawArticle['article_is_popular']): boolean {
  if (typeof v === 'string') return v.toLowerCase() === 'true';
  if (typeof v === 'number') return v === 1;
  return v === true;
}

export function mapToHealthArticle(raw: RawArticle, categoryName?: string): HealthArticle {
  const cat = categoryName || '健康资讯';
  const icon = ICON_BY_CATEGORY.find(([kw]) => cat.includes(kw))?.[1] || '📰';
  return {
    id: String(raw.article_id),
    title: raw.article_title || '',
    category: cat,
    readCount: isPopular(raw.article_is_popular) ? '热门' : '',
    date: (raw.article_add_time || '').slice(5, 10),
    coverImage: raw.article_image || '',
    icon,
    author: {
      name: raw.user_nickname || raw.article_name || '平台健康资讯组',
      title: '',
      hospital: '',
      verified: true
    },
    content: stripHtmlParagraphs(raw.article_content || raw.article_excerpt)
  };
}

function toQuery(params: Record<string, any>): string {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
}

/** 资讯列表（上架数据；调用方负责失败时回退 mock） */
export async function apiGetArticles(params: {
  page?: number;
  size?: number;
  categoryId?: number;
}): Promise<cmsApiArticleList> {
  const res = await fetch(`/front/cms/articleBase/list?${toQuery({ page: 1, size: 10, ...params })}`, {
    headers: { Accept: 'application/json' }
  });
  const data: any = await res.json();
  if (data.status !== 200) throw new Error(data.msg || '资讯加载失败');
  const payload = data.data || {};
  const rawItems = (payload.items || []) as RawArticle[];

  // 分类名映射（category_id → name）
  let categoryMap = new Map<number, string>();
  try {
    const cats = await apiGetArticleCategories();
    categoryMap = new Map(cats.map((c) => [Number(c.id), c.label]));
  } catch {
    /* 分类加载失败不阻断 */
  }

  const articles = rawItems.map((r) => mapToHealthArticle(r, categoryMap.get(r.category_id ?? -1)));
  const popular = articles.filter((a) => a.readCount === '热门');
  return {
    articles,
    popular,
    totalRecords: payload.records ?? articles.length,
    totalPages: payload.total ?? 1
  };
}

/** 资讯分类列表 */
export async function apiGetArticleCategories(): Promise<cmsCategory[]> {
  const res = await fetch('/front/cms/articleBase/listCategory?page=1&size=50', {
    headers: { Accept: 'application/json' }
  });
  const data: any = await res.json();
  if (data.status !== 200) return [];
  return ((data.data || {}).items || []).map((c: any) => ({
    id: String(c.category_id),
    label: c.category_name
  }));
}

/** 资讯详情（期 1 详情直接用列表数据，本接口预留） */
export async function apiGetArticleDetail(articleId: number): Promise<HealthArticle | null> {
  const res = await fetch(`/front/cms/articleBase/get?article_id=${articleId}`, {
    headers: { Accept: 'application/json' }
  });
  const data: any = await res.json();
  if (data.status !== 200 || !data.data) return null;
  return mapToHealthArticle(data.data as RawArticle);
}
