import React, { useState } from 'react';
import { X, Camera, RefreshCw, CheckCircle, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AITongueDiagnosticModal: React.FC<Props> = ({ isOpen, onClose }) => {
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
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-teal-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">👅</span>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">AI 舌象智能辨析 (TD)</h3>
              <p className="text-[9px] text-slate-500">拍舌象 · 识别舌质、舌苔与脏腑寒热虚实</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-3.5">
          {!hasResult ? (
            <div className="space-y-4 text-center">
              <div className="relative h-60 bg-slate-900 rounded-3xl overflow-hidden flex flex-col items-center justify-center border-2 border-slate-700 shadow-inner">
                <div className="w-32 h-40 border-2 border-dashed border-teal-400 rounded-2xl flex flex-col items-center justify-center">
                  <span className="text-4xl opacity-80">👅</span>
                  <div className="text-[9px] text-teal-300 font-bold mt-2 bg-black/40 px-2 py-0.5 rounded-full">
                    自然伸舌对准框内
                  </div>
                </div>
                <div className="absolute top-3 inset-x-0 text-center text-[9px] text-slate-300">
                  自然伸舌平展 · 勿用力卷舌 · 饭后或饮茶后半小时测
                </div>
              </div>

              <button
                disabled={analyzing}
                onClick={handleCapture}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-teal-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI 舌象纹理分割与辨析中...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>拍摄并识别舌象</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-teal-700 font-bold">舌象分析结果</span>
                  <h4 className="text-base font-black text-slate-900 mt-0.5">
                    舌体淡红 · 舌苔薄白 · <span className="text-amber-600">舌边轻度齿痕</span>
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">
                    置信度 91%
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">舌色与舌形</span>
                  <span className="font-bold text-slate-800">淡红质 · 舌体稍胖大</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">舌苔厚薄润燥</span>
                  <span className="font-bold text-slate-800">苔薄白微润</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">特殊特征</span>
                  <span className="font-bold text-amber-700">舌边有轻度齿痕 (脾虚湿困)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">中医体质印证</span>
                  <span className="font-bold text-teal-800">印证气虚质 / 兼痰湿倾向</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-3 space-y-1 text-xs">
                <h5 className="font-bold text-slate-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>联合辨识结论</span>
                </h5>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  舌边齿痕多由脾虚水湿不化、舌体受牙齿压迫所致。建议适当健脾祛湿，如茯苓山药粥或白扁豆陈皮水。
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                完成并将舌象记录同步至档案
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
