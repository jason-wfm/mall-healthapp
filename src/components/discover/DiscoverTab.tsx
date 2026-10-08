import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Newspaper, ChevronDown } from 'lucide-react';
import { HealthArticle } from '../../types/health';
import { apiGetArticles, apiGetArticleCategories } from '../../services/cmsApi';

interface Props {
  onBack: () => void;
  onOpenArticle: (article: HealthArticle) => void;
}

const PAGE_SIZE = 10;

/**
 * [healthmall-ext] 期2：发现页 · 全量健康资讯（分类筛选 + 滚动分页）
 * 数据源：GET /front/cms/articleBase/list（后端强制上架过滤，精选置顶）
 */
export const DiscoverTab: React.FC<Props> = ({ onBack, onOpenArticle }) => {
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [articles, setArticles] = useState<HealthArticle[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const categoryId = activeCategory === 'all' ? undefined : Number(activeCategory);

  // 分类（失败回退空 → 仅「全部」tab）
  useEffect(() => {
    apiGetArticleCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  // 首屏 / 切换分类：重置加载第一页
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setArticles([]);
    setPage(1);
    apiGetArticles({ page: 1, size: PAGE_SIZE, categoryId })
      .then((res) => {
        if (cancelled) return;
        setArticles(res.articles);
        setTotalPages(res.totalPages || 1);
      })
      .catch(() => {
        if (!cancelled) setArticles([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    const next = page + 1;
    apiGetArticles({ page: next, size: PAGE_SIZE, categoryId })
      .then((res) => {
        setArticles((prev) => {
          const seen = new Set(prev.map((a) => a.id));
          return [...prev, ...res.articles.filter((a) => !seen.has(a.id))];
        });
        setPage(next);
        setTotalPages(res.totalPages || totalPages);
      })
      .catch(() => undefined)
      .finally(() => setLoadingMore(false));
  }, [activeCategory, loading, loadingMore, page, totalPages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 160) {
      loadMore();
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50/70 text-slate-800">
      {/* 导航栏 */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-teal-800 to-slate-900 text-white px-3 py-3 flex items-center gap-2">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-white/10">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="font-bold text-sm">健康发现 · 全部资讯</span>
      </div>

      {/* 分类 tabs */}
      <div className="px-3 py-2 bg-white border-b border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
        {[{ id: 'all', label: '全部' }, ...categories.map((c) => ({ id: c.id, label: c.label }))].map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
              activeCategory === c.id
                ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 列表 */}
      <div ref={containerRef} className="flex-1 overflow-y-auto no-scrollbar px-3 py-3 space-y-2.5" onScroll={(e) => {
        const el = e.currentTarget;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 120) loadMore();
      }}>
        {loading && <p className="text-xs text-slate-400 text-center py-8">加载中...</p>}
        {!loading && articles.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-8">暂无资讯</p>
        )}
        {articles.map((article) => (
          <div
            key={article.id}
            onClick={() => onOpenArticle(article)}
            className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs flex gap-3 cursor-pointer hover:border-teal-200 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-xl shrink-0">
              {article.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">{article.title}</h4>
              <div className="flex items-center gap-2 text-[9px] text-slate-400 mt-1">
                <span>{article.category}</span>
                <span>·</span>
                <span>{article.date}</span>
                {article.readCount && (
                  <span className="text-rose-500 font-bold">{article.readCount}</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                {article.author.name}
                <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
              </p>
            </div>
          </div>
        ))}
        {!loading && page >= totalPages && articles.length > 0 && (
          <p className="text-[10px] text-slate-300 text-center py-3">— 没有更多了 —</p>
        )}
        {loadingMore && <p className="text-[10px] text-slate-400 text-center py-2">加载更多...</p>}
      </div>

      {/* 返回顶部浮标（页面较长时便捷回顶） */}
      <button
        onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-24 right-4 z-30 w-9 h-9 rounded-full bg-white/90 border border-slate-200 text-teal-700 shadow-md flex items-center justify-center"
        title="返回顶部"
      >
        <Newspaper className="w-4 h-4" />
      </button>
    </div>
  );
};
