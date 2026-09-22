import React, { useState } from 'react';
import { X, CheckCircle2, ChevronRight, Sparkles, RefreshCw, BookOpen, ShoppingBag } from 'lucide-react';
import { CONSTITUTION_QUESTIONS } from '../../data/healthMockData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaveToProfile: (mainType: string, secondaryType: string) => void;
}

export const ConstitutionAssessmentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSaveToProfile
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({ 1: 1, 2: 1 });
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = CONSTITUTION_QUESTIONS[currentIdx];
  const total = CONSTITUTION_QUESTIONS.length;

  const handleSelectOption = (score: number) => {
    const updated = { ...answers, [currentQ.id]: score };
    setAnswers(updated);

    if (currentIdx < total - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setAnswers({});
    setIsFinished(false);
  };

  const handleFinishAndSave = () => {
    onSaveToProfile('平和质', '气虚质 (倾向)');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl relative max-w-[430px] w-full mx-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-teal-50/50">
          <div className="flex items-center gap-2">
            <span className="text-lg">🧑‍⚕️</span>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">
                中医九大体质智能辨识 (TC-001~005)
              </h3>
              <p className="text-[9px] text-slate-500">依据《中医体质分类与判定》标准判定</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
          {!isFinished ? (
            <div className="space-y-4">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-medium">
                  <span>第 {currentIdx + 1} 题 / 共 {total} 题</span>
                  <span>已作答 {Object.keys(answers).length} 题 (断点自动暂存)</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                <span className="text-[10px] text-teal-700 font-bold bg-teal-100/60 px-2 py-0.5 rounded-md">
                  {currentQ.dimension}维度评估
                </span>
                <h4 className="text-sm font-bold text-slate-800 mt-2 leading-relaxed">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {currentQ.options.map((opt, i) => {
                  const isSelected = answers[currentQ.id] === opt.score;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(opt.score)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50 text-teal-900 shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                    </button>
                  );
                })}
              </div>

              {/* Prev / Next controls */}
              <div className="flex justify-between items-center pt-2">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                  className="text-xs text-slate-400 disabled:opacity-30 hover:text-slate-600 px-2 py-1"
                >
                  上一题
                </button>
                <span className="text-[10px] text-slate-400">
                  选择选项将自动跳转下一题
                </span>
              </div>
            </div>
          ) : (
            /* Result View (TC-002) */
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="text-center py-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold">
                  ✓
                </div>
                <div className="text-[10px] text-slate-400">评测计算完成 (TC-002)</div>
                <h3 className="text-base font-black text-slate-800 mt-0.5">
                  主体质：<span className="text-teal-700">平和质</span> · 兼体质：
                  <span className="text-amber-700">气虚质 (倾向)</span>
                </h3>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                  总体脏腑气血运行良好，偶有倦怠乏力。平时宜劳逸结合，多食健脾益气之品，切忌过度熬夜耗伤正气。
                </p>
              </div>

              {/* 调理建议 (TC-003) */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2 text-xs">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>个性化调理与饮食方案</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-teal-800 block mb-1">🍲 宜选食材</span>
                    <span className="text-slate-600">小米、山药、黄芪、莲子、大枣、香菇</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-rose-800 block mb-1">🚫 慎食禁忌</span>
                    <span className="text-slate-600">冷饮生冷、生萝卜、空腹浓茶、过度辛辣</span>
                  </div>
                </div>
              </div>

              {/* 推荐好物与宣教 (TC-003) */}
              <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  <span>按体质推荐健康滋补品</span>
                </div>
                <div className="flex gap-2">
                  <div className="bg-white p-2 rounded-xl border border-amber-200 text-center flex-1">
                    <div className="text-lg">🍵</div>
                    <div className="text-[10px] font-bold text-slate-800 mt-1">黄芪红枣代茶饮</div>
                    <div className="text-[9px] text-rose-600 font-bold">¥39.00</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-amber-200 text-center flex-1">
                    <div className="text-lg">🥣</div>
                    <div className="text-[10px] font-bold text-slate-800 mt-1">怀山药茯苓粉</div>
                    <div className="text-[9px] text-rose-600 font-bold">¥58.00</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>重新测试</span>
                </button>
                <button
                  onClick={handleFinishAndSave}
                  className="flex-2 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/25 active:scale-98 transition-all"
                >
                  保存并同步至健康档案
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
