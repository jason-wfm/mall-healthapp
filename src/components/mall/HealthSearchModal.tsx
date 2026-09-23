import React, { useState } from 'react';
import { X, Search, Trash2, ArrowRight, Tag } from 'lucide-react';
import { MOCK_HEALTH_PRODUCTS, MOCK_HEALTH_ARTICLES } from '../../data/healthMockData';
import { HealthProduct } from '../../types/health';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: HealthProduct) => void;
}

export const HealthSearchModal: React.FC<Props> = ({ isOpen, onClose, onSelectProduct }) => {
  const [keyword, setKeyword] = useState('');
  const [history, setHistory] = useState(['智能血压计', '气虚质', '上门采血', '黄芪']);
  const [activeTab, setActiveTab] = useState<'all' | 'product' | 'service' | 'article'>('all');

  if (!isOpen) return null;

  const hotKeywords = ['智能血压计', '空腹血糖仪', '气虚体质调养', '到店推拿', '上门护士采血', '体检解读'];

  const results = MOCK_HEALTH_PRODUCTS.filter((p) => {
    if (!keyword.trim()) return false;
    const match =
      p.title.toLowerCase().includes(keyword.toLowerCase()) ||
      p.healthTags.some((t) => t.toLowerCase().includes(keyword.toLowerCase()));
    if (!match) return false;
    if (activeTab === 'product') return p.type === 'product';
    if (activeTab === 'service') return p.type !== 'product';
    return true;
  });

  const handleSearch = (word: string) => {
    setKeyword(word);
    if (word && !history.includes(word)) {
      setHistory([word, ...history.slice(0, 5)]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 sm:p-3 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-[440px] h-full sm:h-[92vh] sm:rounded-3xl bg-white flex flex-col overflow-hidden shadow-2xl relative">
        {/* Top Search Bar (P20) */}
      <div className="p-3 border-b border-slate-100 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl text-xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索商品、服务、药膳、中医体质..."
            className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
          />
          {keyword && (
            <button onClick={() => setKeyword('')} className="text-slate-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button onClick={onClose} className="text-xs font-bold text-slate-600 px-2">
          取消
        </button>
      </div>

      {/* Filter Tabs when keyword is typed */}
      {keyword && (
        <div className="flex border-b border-slate-100 text-xs font-bold text-slate-500 bg-slate-50/50">
          {[
            { id: 'all', label: '综合' },
            { id: 'product', label: '健康商品' },
            { id: 'service', label: '到店/上门服务' },
            { id: 'article', label: '健康科普' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 py-2 text-center border-b-2 transition-all ${
                activeTab === t.id
                  ? 'border-teal-600 text-teal-700 bg-white'
                  : 'border-transparent text-slate-500'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {!keyword ? (
          <>
            {/* History Tags */}
            {history.length > 0 && (
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-2">
                  <span>历史搜索</span>
                  <button onClick={() => setHistory([])} className="text-slate-400 hover:text-slate-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {history.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(h)}
                      className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg hover:bg-slate-200"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hot Searches (P20) */}
            <div>
              <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1">
                <span>🔥 热门搜索榜</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {hotKeywords.map((hw, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(hw)}
                    className="p-2 bg-slate-50 hover:bg-teal-50/50 rounded-xl text-left text-xs text-slate-700 flex items-center gap-2 border border-slate-100"
                  >
                    <span
                      className={`text-[10px] font-bold w-4 h-4 rounded flex items-center justify-center ${
                        i < 3 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="truncate">{hw}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Search Results */
          <div className="space-y-2.5">
            <div className="text-[10px] text-slate-400">
              找到关于“{keyword}”的相关结果 {results.length} 个
            </div>

            {results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onClose();
                  onSelectProduct(product);
                }}
                className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 flex gap-3 cursor-pointer hover:border-teal-400 transition-colors"
              >
                <img
                  src={product.coverImage}
                  alt={product.title}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 truncate">{product.title}</h4>
                    <div className="flex gap-1 mt-1">
                      {product.healthTags.map((t, i) => (
                        <span key={i} className="text-[8px] bg-teal-50 text-teal-800 px-1.5 py-0.2 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-black text-rose-600 font-mono">
                      ¥{product.price}
                    </span>
                    <span className="text-[10px] text-teal-600 font-bold">查看 ›</span>
                  </div>
                </div>
              </div>
            ))}

            {results.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">
                没有找到完全匹配的商品或服务，试试换个词吧
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
