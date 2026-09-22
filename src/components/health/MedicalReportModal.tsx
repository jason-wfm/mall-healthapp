import React, { useState } from 'react';
import { X, FileText, Upload, AlertTriangle, CheckCircle, QrCode, Sparkles, MessageSquare } from 'lucide-react';
import { MOCK_MEDICAL_REPORTS } from '../../data/healthMockData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MedicalReportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedReportId, setSelectedReportId] = useState('rep-2026');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const currentReport =
    MOCK_MEDICAL_REPORTS.find((r) => r.id === selectedReportId) || MOCK_MEDICAL_REPORTS[0];

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      alert('体检报告 OCR 上传识别成功，AI 已完成指标提取与解读！');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl relative max-w-[430px] w-full mx-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-teal-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">体检报告与 AI 深度解读 (PE)</h3>
              <p className="text-[9px] text-slate-500">康养平台调取 / OCR 上传 · 异常预警与三甲专家直通</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-3.5">
          {/* Report Switcher & Upload */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {MOCK_MEDICAL_REPORTS.map((rep) => (
                <button
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap border transition-all ${
                    selectedReportId === rep.id
                      ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {rep.date.slice(0, 4)}年度报告
                </button>
              ))}
            </div>

            <button
              onClick={handleSimulateUpload}
              disabled={isUploading}
              className="flex items-center gap-1 text-[11px] text-teal-700 bg-teal-50 hover:bg-teal-100 font-bold px-2.5 py-1.5 rounded-xl shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'OCR识别中...' : '上传新报告'}</span>
            </button>
          </div>

          {/* Institution & Overview */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800">{currentReport.title}</span>
              <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                {currentReport.abnormalCount} 项指标异常
              </span>
            </div>
            <div className="text-[10px] text-slate-400">{currentReport.institution}</div>
          </div>

          {/* Key Indicators Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 text-[10px] font-bold text-slate-500 flex justify-between">
              <span>检查项目 / 参考范围</span>
              <span>检验数值 / 判定</span>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {currentReport.indicators.map((ind, i) => (
                <div key={i} className="px-3 py-2 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 text-[11px]">{ind.name}</div>
                    <div className="text-[9px] text-slate-400">参考: {ind.reference}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-800">{ind.value}</div>
                    <span
                      className={`text-[8px] font-bold px-1.5 py-0.2 rounded inline-block mt-0.5 ${
                        ind.isAbnormal
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {ind.statusTag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis Summary */}
          <div className="bg-gradient-to-tr from-purple-50 to-indigo-50 border border-purple-200/80 rounded-2xl p-3.5 space-y-1.5 text-xs text-purple-950">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>🤖 AI 综合解读结论与干预建议</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-700">
              {currentReport.aiSummary}
            </p>
          </div>

          {/* Expert Card (PE-004) */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 text-center space-y-2">
            <div className="text-xs font-bold text-amber-950">
              三甲特聘专家 · 专属报告一对一精读 (PE-004)
            </div>
            <div className="text-[10px] text-slate-600">
              {currentReport.expert.name} · {currentReport.expert.title} ({currentReport.expert.hospital})
            </div>
            <div className="w-24 h-24 bg-white p-2 rounded-xl border border-amber-300 mx-auto flex items-center justify-center shadow-xs">
              <div className="w-full h-full bg-slate-900 rounded flex flex-col items-center justify-center text-white text-[8px] font-mono">
                <span>[企业微信]</span>
                <span>扫码直连</span>
              </div>
            </div>
            <button
              onClick={() => alert('已发起专家企业微信会话申请')}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-1.5 rounded-xl shadow-xs"
            >
              直接添加专家微信咨询
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
