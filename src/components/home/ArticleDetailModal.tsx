import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { HealthArticle } from '../../types/health';

interface Props {
  isOpen: boolean;
  article: HealthArticle | null;
  onClose: () => void;
}

/**
 * [healthmall-ext] 健康资讯详情弹窗（期1：正文段落渲染；富文本图片期2）
 */
export const ArticleDetailModal: React.FC<Props> = ({ isOpen, article, onClose }) => {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white rounded-t-3xl max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部：封面或渐变底 */}
        <div className="relative">
          {article.coverImage ? (
            <img src={article.coverImage} alt={article.title} className="w-full h-44 object-cover rounded-t-3xl" />
          ) : (
            <div className="w-full h-24 rounded-t-3xl bg-gradient-to-r from-teal-700 to-slate-900 flex items-center justify-center">
              <span className="text-4xl">{article.icon}</span>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          <h2 className="text-base font-extrabold text-slate-900 leading-snug">{article.title}</h2>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-2">
            <span className="bg-teal-50 text-teal-700 font-bold px-1.5 py-0.5 rounded">{article.category}</span>
            <span>{article.date}</span>
            {article.readCount && <span className="text-rose-500 font-bold">{article.readCount}</span>}
          </div>

          <div className="flex items-center gap-1.5 mt-3 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-xs font-bold">
              {article.author.name.slice(0, 1)}
            </div>
            <div className="text-[11px]">
              <p className="font-bold text-slate-700 flex items-center gap-1">
                {article.author.name}
                {article.author.verified && <ShieldCheck className="w-3 h-3 text-teal-600" />}
              </p>
              {article.author.hospital && <p className="text-[9px] text-slate-400">{article.author.hospital}</p>}
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {article.content.map((para, index) => (
              <p key={index} className="text-[13px] text-slate-700 leading-relaxed">
                {para}
              </p>
            ))}
            {article.content.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">正文内容加载中...</p>
            )}
          </div>

          {article.recommendForConstitution && (
            <div className="mt-4 px-3 py-2.5 rounded-xl bg-teal-50 text-teal-800 text-[11px]">
              {article.recommendForConstitution}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
