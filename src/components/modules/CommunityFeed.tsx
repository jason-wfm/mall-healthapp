import React, { useState } from 'react';
import { CommunityPost, Product } from '../../types';
import { MOCK_COMMUNITY_POSTS, MOCK_PRODUCTS } from '../../data/mockData';
import { Heart, MessageCircle, ShoppingBag, Sparkles, Tag, ArrowRight } from 'lucide-react';

interface Props {
  onSelectProduct: (product: Product, defaultMode?: 'normal' | 'group' | 'bargain' | 'seckill') => void;
}

export const CommunityFeed: React.FC<Props> = ({ onSelectProduct }) => {
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((item) => {
        if (item.id === postId) {
          const isLiked = !item.isLiked;
          return {
            ...item,
            isLiked,
            likes: isLiked ? item.likes + 1 : item.likes - 1
          };
        }
        return item;
      })
    );
  };

  const handleBuyRelated = (relatedProductId: string) => {
    const prod = MOCK_PRODUCTS.find((p) => p.id === relatedProductId);
    if (prod) {
      onSelectProduct(prod);
    }
  };

  return (
    <div className="pb-20 space-y-3">
      {/* Community Feed Header */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white p-4 mx-3 mt-2 rounded-2xl shadow-md shadow-pink-500/15 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-xs text-pink-100 font-semibold mb-1">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>种草圈 · 买家实拍秀</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">看真实分享 · 买同款好物</h2>
          <p className="text-xs text-pink-100/90 mt-0.5">
            带货分享有佣金 · 拼团晒单领红包
          </p>
        </div>
      </div>

      {/* Posts Feed Waterfall */}
      <div className="px-3 space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs"
          >
            {/* Author Header */}
            <div className="p-3 flex items-center justify-between border-b border-slate-50">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-rose-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <span>{post.author.name}</span>
                    {post.author.badge && (
                      <span className="text-[9px] bg-rose-50 text-rose-600 px-1 rounded font-medium">
                        {post.author.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] text-slate-400">来自广东 · 2小时前发布</div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {post.tags.slice(0, 2).map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Post Media with Floating Product Tag */}
            <div className="relative w-full h-52 bg-slate-100">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Floating Product Tag (同款好物气泡) */}
              <div
                onClick={() => handleBuyRelated(post.relatedProduct.id)}
                className="absolute bottom-3 left-3 bg-black/75 hover:bg-black/90 active:scale-95 backdrop-blur-md text-white p-1.5 pr-2.5 rounded-full flex items-center gap-2 text-xs shadow-lg cursor-pointer transition-all border border-white/20"
              >
                <img
                  src={post.relatedProduct.coverImage}
                  alt={post.relatedProduct.title}
                  className="w-6 h-6 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <div className="text-[10px] font-bold text-amber-300">
                    同款好物
                  </div>
                  <div className="text-[10px] text-white/90 font-mono">
                    {post.relatedProduct.typeText}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-white/70" />
              </div>
            </div>

            {/* Post Content */}
            <div className="p-3">
              <h3 className="font-bold text-slate-800 text-xs leading-snug">
                {post.title}
              </h3>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                {post.content}
              </p>

              {/* Interaction Bar */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      post.isLiked ? 'text-rose-600 font-bold' : 'hover:text-rose-500'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        post.isLiked ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                    <span className="text-[11px] font-mono">{post.likes}</span>
                  </button>

                  <button className="flex items-center gap-1.5 hover:text-slate-800">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-[11px] font-mono">{post.commentsCount}</span>
                  </button>
                </div>

                <button
                  onClick={() => handleBuyRelated(post.relatedProduct.id)}
                  className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold text-[11px]"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>购买同款</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
