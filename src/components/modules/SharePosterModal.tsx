import React, { useState } from 'react';
import { X, Download, Share2, Copy, Check, Sparkles, QrCode } from 'lucide-react';

interface Props {
  title: string;
  desc: string;
  image: string;
  onClose: () => void;
}

export const SharePosterModal: React.FC<Props> = ({ title, desc, image, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(
      `https://shopsuite.io/share?ref=SUITE-8869&item=${encodeURIComponent(title)}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Poster Visual Container (750rpx social card style) */}
        <div className="p-4 bg-gradient-to-b from-rose-50 to-white">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-rose-100 flex flex-col">
            {/* Header / Brand */}
            <div className="px-3.5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-white text-rose-600 font-black text-xs flex items-center justify-center">
                  S
                </div>
                <span className="font-bold text-xs">ShopSuite 社交电商优选</span>
              </div>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                官方严选正品
              </span>
            </div>

            {/* Product Image */}
            <div className="w-full h-48 bg-slate-100 relative">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2 bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                限时特惠 · 拼团裂变
              </div>
            </div>

            {/* Poster Info */}
            <div className="p-3.5 space-y-2">
              <h3 className="font-bold text-slate-800 text-xs line-clamp-2 leading-snug">
                {title}
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {desc}
              </p>

              {/* Inviter & QR Code Footer */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"
                    alt="推荐官"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-rose-400"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-[10px] font-bold text-slate-800">
                      晨风 推荐给你
                    </div>
                    <div className="text-[9px] text-rose-600 font-mono">
                      专属码: SUITE-8869
                    </div>
                  </div>
                </div>

                {/* Simulated Mini Program QR Code */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-900 rounded-lg p-1 flex items-center justify-center text-white">
                    <QrCode className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-[8px] text-slate-400 mt-0.5">
                    长按小程序码
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-slate-100 space-y-2">
          {downloadSuccess && (
            <div className="p-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl text-center border border-emerald-200">
              海报已成功生成并保存至本地相册！
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-1.5 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold text-xs py-2.5 rounded-xl shadow-md shadow-rose-500/25 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>保存海报</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>已复制链接</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>复制推广链接</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
