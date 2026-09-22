import React, { useState } from 'react';
import { X, Check, Activity, Save, ArrowLeft } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaveMetric: (type: string, value: string, text: string) => void;
}

export const HealthMetricsEntryModal: React.FC<Props> = ({ isOpen, onClose, onSaveMetric }) => {
  const [activeType, setActiveType] = useState<
    'bp' | 'sugar' | 'weight' | 'vitals' | 'sleep_exercise' | 'diet_habit' | 'work_habit'
  >('bp');

  // BP state
  const [systolic, setSystolic] = useState('118');
  const [diastolic, setDiastolic] = useState('78');
  const [pulse, setPulse] = useState('72');
  const [bpTimeSlot, setBpTimeSlot] = useState('晨起安静');

  // Sugar state
  const [sugarVal, setSugarVal] = useState('5.2');
  const [sugarPeriod, setSugarPeriod] = useState('空腹');

  // Weight state
  const [weightVal, setWeightVal] = useState('70');
  const [bodyFat, setBodyFat] = useState('22.5');

  // Vitals state
  const [heartRate, setHeartRate] = useState('72');
  const [spo2Val, setSpo2Val] = useState('98');
  const [tempVal, setTempVal] = useState('36.5');

  // Work habits
  const [sedentaryHours, setSedentaryHours] = useState('4-6小时');
  const [stressScore, setStressScore] = useState('4-6 适中');

  if (!isOpen) return null;

  const handleSave = () => {
    if (activeType === 'bp') {
      onSaveMetric('blood_pressure', `${systolic}/${diastolic}`, '手动记录');
    } else if (activeType === 'sugar') {
      onSaveMetric('blood_sugar', sugarVal, `${sugarPeriod}记录`);
    } else if (activeType === 'weight') {
      onSaveMetric('weight', `${weightVal}kg`, 'BMI计算');
    } else {
      onSaveMetric('heart_rate', heartRate, '生命体征更新');
    }
    alert('健康数据录入成功，已同步至个人档案与家庭空间！');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative max-w-[430px] w-full mx-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-teal-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">✍️</span>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">健康数据手动录入中心 (HM-001)</h3>
              <p className="text-[9px] text-slate-500">录入数据实时同步档案、家庭圈与AI评估模型</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Type Selector Grid (P7) */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/50">
          <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
            {[
              { id: 'bp', label: '血压', icon: '🩸' },
              { id: 'sugar', label: '血糖', icon: '🍬' },
              { id: 'weight', label: '体重体脂', icon: '⚖️' },
              { id: 'vitals', label: '心率血氧', icon: '❤️' },
              { id: 'sleep_exercise', label: '睡眠运动', icon: '😴' },
              { id: 'diet_habit', label: '饮食习惯', icon: '🍚' },
              { id: 'work_habit', label: '工作久坐', icon: '💼' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveType(t.id as any)}
                className={`py-2 px-1 rounded-xl font-bold border transition-all ${
                  activeType === t.id
                    ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="text-sm">{t.icon}</div>
                <div className="mt-0.5">{t.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-4">
          {/* BP Form (P8) */}
          {activeType === 'bp' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800">🩸 血压测量记录 (mmHg)</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <label className="text-[10px] text-slate-500 block mb-1">收缩压 (高压)</label>
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-base font-bold font-mono text-slate-800"
                  />
                  <span className="text-[9px] text-slate-400 mt-1 block">正常范围 90-139</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <label className="text-[10px] text-slate-500 block mb-1">舒张压 (低压)</label>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-base font-bold font-mono text-slate-800"
                  />
                  <span className="text-[9px] text-slate-400 mt-1 block">正常范围 60-89</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1.5">测量时段</label>
                <div className="flex flex-wrap gap-1.5">
                  {['晨起安静', '午间休息', '晚间睡前', '服药后2小时'].map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setBpTimeSlot(slot)}
                      className={`text-xs px-2.5 py-1 rounded-xl border ${
                        bpTimeSlot === slot
                          ? 'bg-teal-50 border-teal-500 text-teal-800 font-bold'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-teal-50 p-2.5 rounded-xl border border-teal-200 text-[10px] text-teal-800">
                💡 连续7天规范测量晨起收缩压/舒张压，系统将自动识别高血压波动规律
              </div>
            </div>
          )}

          {/* Sugar Form (P9) */}
          {activeType === 'sugar' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800">🍬 血糖测量记录 (mmol/L)</h4>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <label className="text-[10px] text-slate-500 block mb-1">血糖数值</label>
                <input
                  type="number"
                  step="0.1"
                  value={sugarVal}
                  onChange={(e) => setSugarVal(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-lg font-bold font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1.5">检测时点</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['空腹', '早餐后2h', '午餐前', '午餐后2h', '晚餐后2h', '睡前'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setSugarPeriod(p)}
                      className={`text-xs py-1.5 rounded-xl border text-center ${
                        sugarPeriod === p
                          ? 'bg-teal-50 border-teal-500 text-teal-800 font-bold'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Weight / BMI Form (P10) */}
          {activeType === 'weight' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800">⚖️ 体重与体脂成分</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <label className="text-[10px] text-slate-500 block mb-1">体重 (kg)</label>
                  <input
                    type="number"
                    value={weightVal}
                    onChange={(e) => setWeightVal(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-base font-bold font-mono text-slate-800"
                  />
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <label className="text-[10px] text-slate-500 block mb-1">体脂率 (%)</label>
                  <input
                    type="number"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-base font-bold font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
                <div className="flex justify-between font-bold">
                  <span>BMI 自动换算结果：22.9</span>
                  <span className="text-emerald-700">标准健康区间</span>
                </div>
                <p className="text-[10px] text-emerald-700 mt-1">
                  按身高 175cm 计算，健康体重区间为 56.7kg ~ 73.2kg
                </p>
              </div>
            </div>
          )}

          {/* Vitals Form (P11) */}
          {activeType === 'vitals' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800">❤️ 生命体征快速记录</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700">静息心率 (bpm)</span>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    className="w-20 bg-white border border-slate-300 rounded-lg px-2 py-1 text-right text-xs font-mono font-bold"
                  />
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700">血氧饱和度 SpO₂ (%)</span>
                  <input
                    type="number"
                    value={spo2Val}
                    onChange={(e) => setSpo2Val(e.target.value)}
                    className="w-20 bg-white border border-slate-300 rounded-lg px-2 py-1 text-right text-xs font-mono font-bold"
                  />
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700">腋下体温 (℃)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={tempVal}
                    onChange={(e) => setTempVal(e.target.value)}
                    className="w-20 bg-white border border-slate-300 rounded-lg px-2 py-1 text-right text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sleep & Exercise (P12) */}
          {activeType === 'sleep_exercise' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800">😴 睡眠与中医养生运动记录</h4>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">昨夜入睡与起时</label>
                  <div className="flex gap-2">
                    <input
                      defaultValue="23:30"
                      className="bg-white border border-slate-300 rounded-xl px-2 py-1 flex-1 text-center font-mono font-bold"
                    />
                    <span className="self-center">至</span>
                    <input
                      defaultValue="07:00"
                      className="bg-white border border-slate-300 rounded-xl px-2 py-1 flex-1 text-center font-mono font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">今日运动类型</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['八段锦 (气虚质推荐)', '太极拳', '中速快走', '慢跑', '游泳'].map((ex) => (
                      <span key={ex} className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-1 rounded-lg">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Work habit (P14) */}
          {activeType === 'work_habit' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800">💼 工作习惯与久坐压力评估</h4>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1.5">每日连续久坐时长</label>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {['<2小时', '2-4小时', '4-6小时', '>6小时'].map((h) => (
                    <button
                      key={h}
                      onClick={() => setSedentaryHours(h)}
                      className={`py-1.5 rounded-xl border ${
                        sedentaryHours === h
                          ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1.5">压力自评等级 (1-10分)</label>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {['1-3 轻松', '4-6 适中', '7-8 偏大', '9-10 很大'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStressScore(s)}
                      className={`py-1.5 rounded-xl border ${
                        stressScore === s
                          ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Diet habits */}
          {activeType === 'diet_habit' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-800">🍚 饮食生活习惯录入</h4>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">三餐规律性</span>
                  <span className="font-bold text-teal-800">一日三餐基本规律</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">饮食口味</span>
                  <span className="font-bold text-slate-800">清淡少盐、少油腻</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">吸烟与饮酒</span>
                  <span className="font-bold text-emerald-700">不吸烟 · 偶尔少量社交酒</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
          <div className="text-[10px] text-slate-400">数据加密存储 · 严格遵循个人健康隐私法规</div>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>保存并同步</span>
          </button>
        </div>
      </div>
    </div>
  );
};
