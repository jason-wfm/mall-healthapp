import React, { useState } from 'react';
import { X, Camera, RefreshCw, CheckCircle, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenTongueDiagnostic: () => void;
}

export const AIFaceDiagnosticModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenTongueDiagnostic
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  if (!isOpen) return null;

  const handleCapture = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setHasResult(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative max-w-[430px] w-full mx-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-teal-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">😊</span>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">AI 智能观气色面诊 (TD)</h3>
              <p className="text-[9px] text-slate-500">拍面部 · 观气色智能辨析阴阳气血</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-3.5">
          {!hasResult ? (
            <div className="space-y-4 text-center">
              {/* Camera Simulation Frame */}
              <div className="relative h-64 bg-slate-900 rounded-3xl overflow-hidden flex flex-col items-center justify-center border-2 border-slate-700 shadow-inner">
                {/* Face Alignment Oval */}
                <div className="w-40 h-52 border-2 border-dashed border-teal-400 rounded-[50%] flex flex-col items-center justify-center relative">
                  <span className="text-4xl select-none opacity-80">👤</span>
                  <div className="absolute inset-x-0 bottom-3 text-center text-[9px] text-teal-300 font-bold bg-black/40 py-0.5 rounded-full mx-4">
                    对准参考椭圆区域
                  </div>
                </div>

                {/* Light prompt */}
                <div className="absolute top-3 inset-x-0 text-center text-[9px] text-slate-300">
                  自然光充足 · 素颜无遮挡 · 正对镜头
                </div>
              </div>

              {/* Capture Trigger */}
              <button
                disabled={analyzing}
                onClick={handleCapture}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-teal-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI 深度面容特征提取分析中...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>开始智能面诊分析</span>
                  </>
                )}
              </button>

              <div className="text-[9px] text-slate-400 leading-normal">
                ⚠️ 本服务依托《中医望诊数字化分析规范》，分析结果仅供健康调理参考，不作为临床医疗诊断依据。
              </div>
            </div>
          ) : (
            /* Result Panel (P15) */
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-teal-700 font-bold">气血综合倾向分析</span>
                  <h4 className="text-base font-black text-slate-900 mt-0.5">
                    整体特征：<span className="text-amber-600">气血微虚 · 气色稍逊</span>
                  </h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                  88%
                </div>
              </div>

              {/* Specific features */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">面色光泽</span>
                  <span className="font-bold text-amber-700">微黄少泽 (气虚倾向)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">唇色深浅</span>
                  <span className="font-bold text-amber-700">淡白无华</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">眼睑结膜</span>
                  <span className="font-bold text-emerald-700">淡红健康</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">印堂与鼻额</span>
                  <span className="font-bold text-slate-800">平滑无晦暗</span>
                </div>
              </div>

              {/* Health Advice */}
              <div className="bg-white border border-slate-200 rounded-2xl p-3 space-y-1.5 text-xs">
                <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>调摄建议</span>
                </h5>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  面色偏黄且唇色偏淡，提示近来思虑较多或睡眠不足耗伤气血。建议睡前温水泡脚，多食红枣、枸杞、龙眼肉等补益气血之物。
                </p>
              </div>

              {/* Tongue synergy prompt */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-900">想更精准？继续做 AI 舌诊</div>
                  <div className="text-[10px] text-amber-700 mt-0.5">面色 + 舌象联合辨识，体质吻合度达 95%</div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenTongueDiagnostic();
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shrink-0 flex items-center gap-1 shadow-xs"
                >
                  <span>拍舌象</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Reset */}
              <button
                onClick={() => setHasResult(false)}
                className="w-full py-2 text-center text-xs text-slate-400 hover:text-slate-600"
              >
                重新拍照检测
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
