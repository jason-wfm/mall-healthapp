import React, { useState } from 'react';
import { HealthProfile, HealthMetricRecord, TrendPoint, FamilyMember } from '../../types/health';
import { BP_TREND_DATA, DEFAULT_METRICS, MOCK_FAMILY_MEMBERS } from '../../data/healthMockData';
import { Download, PlusCircle, Activity, Heart, ShieldAlert, Sparkles, CheckCircle2, ChevronRight, UserCheck } from 'lucide-react';

interface Props {
  profile: HealthProfile;
  onOpenConstitution: () => void;
  onOpenMetricsEntry: () => void;
  onOpenMedicalReport: () => void;
  onOpenFamilyCircle: () => void;
  onOpenFaceDiagnostic: () => void;
}

export const HealthHubTab: React.FC<Props> = ({
  profile,
  onOpenConstitution,
  onOpenMetricsEntry,
  onOpenMedicalReport,
  onOpenFamilyCircle,
  onOpenFaceDiagnostic
}) => {
  const [selectedMember, setSelectedMember] = useState<FamilyMember>(MOCK_FAMILY_MEMBERS[0]);
  const [activeDimension, setActiveDimension] = useState<
    'metrics' | 'self_test' | 'reports' | 'history' | 'profile'
  >('metrics');
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  return (
    <div className="pb-24 space-y-3 bg-slate-50/70 min-h-screen text-slate-800">
      {/* Top Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
            <span>健康档案与中枢</span>
            <span className="text-[10px] text-teal-600 font-normal bg-teal-50 px-1.5 py-0.2 rounded-md">
              HR-001~009
            </span>
          </h2>
        </div>
        <button
          onClick={() => alert('健康档案 PDF 已生成，正调取微信文件传输助手')}
          className="flex items-center gap-1 text-[11px] text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-xl font-medium transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>导出PDF</span>
        </button>
      </div>

      {/* 家庭成员切换栏 (FM-005 只读共享) */}
      <div className="px-3">
        <div className="bg-white p-2 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {MOCK_FAMILY_MEMBERS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMember(m)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedMember.id === m.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{m.avatar}</span> {m.name}
              </button>
            ))}
          </div>
          <button
            onClick={onOpenFamilyCircle}
            className="text-[10px] text-teal-600 hover:text-teal-800 font-medium shrink-0 ml-2"
          >
            空间管理 ›
          </button>
        </div>
      </div>

      {/* 综合健康评分卡片 (85分，良好) */}
      <div className="px-3">
        <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 text-white rounded-2xl p-4 shadow-md relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-teal-100 font-medium">综合健康指数评分</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black tracking-tight">{profile.healthScore}</span>
                <span className="text-xs text-teal-100 font-normal">/ 100 良好</span>
              </div>
              <p className="text-[10px] text-teal-200 mt-1">
                较上周上升 ↑3分 · 血压达标率 96%
              </p>
            </div>

            <div className="text-right">
              <button
                onClick={onOpenMetricsEntry}
                className="bg-white text-teal-800 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
                <span>录入数据</span>
              </button>
              <div className="text-[9px] text-teal-100 mt-1.5">支持8项指标与习惯</div>
            </div>
          </div>

          <div className="mt-3.5 bg-black/20 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-300 h-full rounded-full transition-all duration-700"
              style={{ width: `${profile.healthScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* 五维导航 Tab */}
      <div className="px-3">
        <div className="flex bg-white rounded-2xl p-1 border border-slate-100 text-xs text-slate-500 font-medium">
          {[
            { id: 'metrics', label: '检测数据' },
            { id: 'self_test', label: '自测结果' },
            { id: 'reports', label: '体检报告' },
            { id: 'history', label: '病史用药' },
            { id: 'profile', label: '基本信息' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDimension(tab.id as any)}
              className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold text-center transition-all ${
                activeDimension === tab.id
                  ? 'bg-teal-50 text-teal-700 shadow-2xs'
                  : 'hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: 检测数据 (指标网格 + 折线走势) */}
      {activeDimension === 'metrics' && (
        <div className="px-3 space-y-3">
          {/* 指标卡片网格 */}
          <div className="grid grid-cols-2 gap-2.5">
            {DEFAULT_METRICS.map((m) => (
              <div
                key={m.id}
                onClick={onOpenMetricsEntry}
                className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs cursor-pointer hover:border-teal-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[10px]">
                    {m.type === 'blood_pressure'
                      ? '血压 (收缩/舒张)'
                      : m.type === 'blood_sugar'
                      ? '空腹血糖'
                      : m.type === 'heart_rate'
                      ? '静息心率'
                      : '血氧饱和度'}
                  </span>
                  <span
                    className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                      m.status === 'ok'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {m.statusText}
                  </span>
                </div>

                <div className="text-lg font-black text-slate-800 mt-1 font-mono">
                  {m.value} <span className="text-[10px] font-normal text-slate-400">{m.unit}</span>
                </div>

                <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1">
                  <span>{m.source}</span>
                  <span>{m.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 血压走势折线图 (SVG) */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-teal-600" />
                <h4 className="font-bold text-xs text-slate-800">血压 7 日监测趋势</h4>
              </div>
              <div className="flex items-center gap-2 text-[9px]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-0.5 bg-teal-600 rounded-full inline-block" />
                  收缩压
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-0.5 bg-emerald-500 rounded-full inline-block" />
                  舒张压
                </span>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="h-32 w-full pt-2">
              <svg viewBox="0 0 320 90" className="w-full h-full overflow-visible">
                {/* Reference Grid lines */}
                <line x1="0" y1="20" x2="320" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="50" x2="320" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="75" x2="320" y2="75" stroke="#f1f5f9" strokeWidth="1" />

                {/* Systolic Line (收缩压) */}
                <polyline
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="20,40 65,48 115,36 165,52 215,44 265,58 305,58"
                />

                {/* Diastolic Line (舒张压) */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                  strokeLinecap="round"
                  points="20,60 65,64 115,58 165,68 215,62 265,68 305,68"
                />

                {/* Dots */}
                {[
                  { cx: 20, cy: 40, val: '128' },
                  { cx: 65, cy: 48, val: '122' },
                  { cx: 115, cy: 36, val: '130' },
                  { cx: 165, cy: 52, val: '120' },
                  { cx: 215, cy: 44, val: '124' },
                  { cx: 265, cy: 58, val: '118' },
                  { cx: 305, cy: 58, val: '118' }
                ].map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.cx} cy={pt.cy} r="3" fill="#0d9488" />
                    <text
                      x={pt.cx}
                      y={pt.cy - 6}
                      fontSize="7"
                      fill="#0d9488"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {pt.val}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="flex justify-between text-[8px] text-slate-400 mt-1 px-1">
                {BP_TREND_DATA.map((d, i) => (
                  <span key={i}>{d.date}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 自测结果 (体质辨识 + 360画像) */}
      {activeDimension === 'self_test' && (
        <div className="px-3 space-y-3">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800">🌿 中医体质辨识结果</span>
              <button
                onClick={onOpenConstitution}
                className="text-[10px] text-teal-600 font-bold hover:underline"
              >
                重新辨识 ›
              </button>
            </div>

            <div className="mt-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                  主体质：{profile.constitution.main}
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg">
                  兼体质：{profile.constitution.secondary}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                {profile.constitution.advice}
              </p>
            </div>
          </div>

          {/* 360 画像 */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 mb-2">📌 360健康画像标签 (HS-006)</h4>
            <div className="flex flex-wrap gap-1.5">
              {profile.portraitTags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-teal-50 text-teal-800 border border-teal-200/80 text-[10px] px-2 py-1 rounded-xl font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: 体检报告解读 */}
      {activeDimension === 'reports' && (
        <div className="px-3 space-y-3">
          <div
            onClick={onOpenMedicalReport}
            className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs cursor-pointer hover:border-teal-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">2026年度深度体检报告</span>
              <span className="text-[9px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded">
                2项异常待复查
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              深圳市南山人民医院健康管理中心 · AI深度解读完成
            </p>

            <div className="mt-2.5 p-2.5 bg-slate-50 rounded-xl text-[10px] text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>空腹血糖 (GLU)</span>
                <span className="text-amber-600 font-bold">6.8 mmol/L (偏高)</span>
              </div>
              <div className="flex justify-between">
                <span>血清总胆固醇 (TC)</span>
                <span className="text-amber-600 font-bold">5.6 mmol/L (偏高)</span>
              </div>
            </div>

            <div className="mt-2.5 text-right text-[10px] text-teal-600 font-bold">
              查看完整AI解读与三甲专家咨询 ›
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: 既往病史与用药 (含青霉素过敏红标警示) */}
      {activeDimension === 'history' && (
        <div className="px-3 space-y-3">
          {/* 过敏警示红牌 */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-900">过敏警示 (HR-003)</h4>
              <p className="text-[11px] text-rose-700 mt-0.5 font-medium leading-relaxed">
                {profile.allergies[0]}
              </p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-2.5 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block">长期慢病史</span>
              <span className="font-bold text-slate-800">{profile.chronicDiseases[0]}</span>
            </div>
            <div className="border-t border-slate-100 pt-2">
              <span className="text-slate-400 text-[10px] block">长期用药</span>
              <span className="font-bold text-slate-800">{profile.medications[0]}</span>
            </div>
            <div className="border-t border-slate-100 pt-2">
              <span className="text-slate-400 text-[10px] block">家族史</span>
              <span className="font-bold text-slate-800">{profile.familyHistory.join(' · ')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: 基本信息 */}
      {activeDimension === 'profile' && (
        <div className="px-3">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">姓名 / 性别</span>
              <span className="font-bold">{profile.name} ({profile.gender})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">年龄 / 出生日期</span>
              <span className="font-bold">{profile.age}岁 ({profile.birthDate})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">身高 / 体重 / BMI</span>
              <span className="font-bold">{profile.height}cm / {profile.weight}kg (BMI {profile.bmi})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">血型 / 婚育</span>
              <span className="font-bold">{profile.bloodType} · {profile.maritalStatus}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">紧急联系人</span>
              <span className="font-bold text-teal-700">
                {profile.emergencyContact.name} ({profile.emergencyContact.relation}) {profile.emergencyContact.phone}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 数据来源公示卡片 (HR-005) */}
      <div className="px-3">
        <div className="bg-white p-3 rounded-2xl border border-slate-100 text-[10px] text-slate-500">
          <div className="font-bold text-slate-700 mb-1">数据来源与同步状态 (HR-005)</div>
          <div className="grid grid-cols-3 gap-1 text-center py-1">
            <div className="bg-slate-50 py-1 rounded">智能设备同步 86%</div>
            <div className="bg-slate-50 py-1 rounded">康养平台调取 10%</div>
            <div className="bg-slate-50 py-1 rounded">手动录入 4%</div>
          </div>
          <div className="text-[9px] text-slate-400 mt-1">
            🟢 蓝牙已连接：智能血压计 Pro · 最后同步今天 08:30
          </div>
        </div>
      </div>
    </div>
  );
};
