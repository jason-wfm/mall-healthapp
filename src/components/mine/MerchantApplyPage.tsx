import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowLeft as BackIcon, Camera, CheckCircle2, Clock,
  XCircle, PartyPopper, RefreshCw, Wallet, X
} from 'lucide-react';
import {
  apiGetApplyProgress,
  apiOcrBusinessLicense,
  apiSubmitMerchantApply,
  apiUploadImage,
  type OcrResult,
} from '../../services/merchantApi';
import type { MerchantApplyProgress } from '../../types/merchant';

interface Props {
  token?: string | null;
  onClose: () => void;
  onEnterFinance: () => void;
}

const CATEGORIES = ['医药零售', '医疗服务', '社区服务', '食品', '康养器械'];

type Phase = 'loading' | 'form' | 'inflight' | 'success' | 'pending';

/**
 * [healthmall-ext] H5 页面化：商家入驻 · 提交资料页（原型 MR-001~003 单页表单）
 * 三态：空表单 / 在途进度（10/20）/ 驳回预填（30）；提交后按自动审核结果切换 成功/审核中 态
 */
export const MerchantApplyPage: React.FC<Props> = ({ token, onClose, onEnterFinance }) => {
  const [phase, setPhase] = useState<Phase>('loading');
  const [progress, setProgress] = useState<MerchantApplyProgress | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [ocr, setOcr] = useState<OcrResult | null>(null);
  const [ocrRunning, setOcrRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    merchant_name: '',
    credit_code: '',
    category: '',
    legal_name: '',
    id_card: '',
    gender: 10,
    age: undefined as number | undefined,
    city: '',
    contact_phone: '',
    business_license: '',
    qualification_urls: '',
    intro: ''
  });

  const setField = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await apiGetApplyProgress(token);
        const p = res.data;
        setProgress(p);
        if (p && (p.status === 10 || p.status === 20)) {
          setPhase('inflight');
        } else if (p && p.status === 30) {
          prefillFromSnapshot(p);
          setPhase('form');
        } else {
          setPhase('form');
        }
      } catch {
        setPhase('form');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const prefillFromSnapshot = (p: MerchantApplyProgress) => {
    try {
      const snap = JSON.parse(p.snapshot_json || '{}');
      const base = snap.base || {};
      const legal = snap.legal || {};
      const license = snap.license || {};
      setForm((prev) => ({
        ...prev,
        merchant_name: base.merchant_name || '',
        credit_code: legal.credit_code || '',
        category: base.category || '',
        contact_phone: base.contact_phone || p.audit_remark ? base.contact_phone || '' : '',
        business_license: license.business_license || '',
        qualification_urls: license.qualification_urls || '',
        intro: base.intro || '',
        legal_name: legal.legal_name || '',
        id_card: legal.id_card || '',
        gender: legal.gender || 10,
        age: legal.age || undefined,
        city: base.city || ''
      }));
    } catch {
      /* 快照解析失败按空表单 */
    }
  };

  const parseIdCard = (id: string) => {
    if (!/^\d{17}[\dXx]$/.test(id)) return false;
    const birth = `${id.slice(6, 10)}-${id.slice(10, 12)}-${id.slice(12, 14)}`;
    const birthDate = new Date(birth);
    if (isNaN(birthDate.getTime())) return false;
    const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 3600 * 1000));
    setField('age', age);
    setField('gender', Number(id[16]) % 2 === 1 ? 10 : 20);
    return true;
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    setOcr(null);
    let url = '';
    try {
      url = await apiUploadImage(file);
      setField('business_license', url);
    } catch (err: any) {
      setError(err.message || '上传失败，可手动粘贴影像URL');
      return;
    } finally {
      setUploading(false);
    }

    // [healthmall-ext] P2.5c：上传成功即触发 OCR；识别成功自动回填商家名称，失败/未配置降级人工填写
    if (!token || !url) return;
    setOcrRunning(true);
    try {
      const res = await apiOcrBusinessLicense(url, token);
      const result = res.data;
      setOcr(result || { recognized: false, message: 'OCR 无返回' });
      if (result?.recognized && result.merchant_name) {
        setField('merchant_name', result.merchant_name);
      }
      if (result?.recognized && result.credit_code) {
        setField('credit_code', result.credit_code);
      }
    } catch (err: any) {
      setOcr({ recognized: false, message: err.message || 'OCR 服务暂不可用' });
    } finally {
      setOcrRunning(false);
    }
  };

  const validate = (): string | null => {
    if (!form.merchant_name) return '商家名称为必填项';
    if (!form.contact_phone || !/^1\d{10}$/.test(form.contact_phone)) return '请填写 11 位手机号';
    if (!form.legal_name) return '法人姓名为必填项';
    if (!form.id_card || !/^\d{17}[\dXx]$/.test(form.id_card)) return '身份证号格式不正确';
    if (!form.city) return '经营城市为必填项';
    if (!form.category) return '请选择经营类目';
    if (!form.business_license) return '请上传营业执照影像';
    if (form.credit_code && !/^[0-9A-HJ-NPQRTUWXY]{18}$/.test(form.credit_code)) {
      return '统一社会信用代码应为 18 位数字或大写字母';
    }
    return null;
  };

  const submit = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    if (!token) {
      setError('登录状态失效，请重新登录');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await apiSubmitMerchantApply(
        {
          merchant_name: form.merchant_name,
          category: form.category,
          intro: form.intro || undefined,
          contact_name: form.legal_name,
          contact_phone: form.contact_phone,
          business_license: form.business_license,
          qualification_urls: form.qualification_urls || undefined,
          legal_name: form.legal_name,
          id_card: form.id_card,
          gender: form.gender,
          age: form.age,
          city: form.city,
          credit_code: form.credit_code || undefined
        },
        token
      );
      const res = await apiGetApplyProgress(token);
      setProgress(res.data);
      setPhase(res.data?.status === 20 ? 'success' : 'pending');
    } catch (err: any) {
      setError(err.message || '提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const refreshProgress = async () => {
    if (!token) return;
    const res = await apiGetApplyProgress(token);
    setProgress(res.data);
    if (res.data?.status === 30) {
      prefillFromSnapshot(res.data);
      setPhase('form');
    } else if (res.data?.status === 20) {
      setPhase('success');
    }
  };

  const inputCls =
    'w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-teal-600';
  const labelCls = 'text-xs font-bold text-slate-500';

  const stepIndex = progress?.status === 20 ? 2 : 1;
  const FLOW = ['提交申请', '平台审核', '开通商家'];

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-slate-50/70 text-slate-800 pb-24">
      {/* 导航栏 */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-teal-800 to-slate-900 text-white px-3 py-3 flex items-center gap-2">
        <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="font-bold text-sm">商家入驻 · 提交资料</span>
      </div>

      <div className="px-3 pt-3">
        {/* 顶部提示条（对齐原型） */}
        <div className="px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed mb-3">
          提交后系统将自动审核并即时开通店铺；平台可后置复核/清退。带 * 为必填项。
        </div>

        {phase === 'loading' && <p className="text-sm text-slate-400 py-8 text-center">加载中...</p>}

        {/* 在途：进度态 */}
        {phase === 'inflight' && progress && (
          <div className="space-y-4">
            <div className="flex items-center">
              {FLOW.map((label, index) => (
                <React.Fragment key={label}>
                  <div
                    className={`flex-1 text-center text-[10px] font-bold py-1.5 rounded-lg ${
                      index <= (progress.status === 20 ? 2 : 1) && progress.status !== 30
                        ? 'bg-teal-700 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {label}
                  </div>
                  {index < FLOW.length - 1 && <div className="w-3 border-t border-slate-200" />}
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-start gap-2 px-3 py-3 rounded-xl bg-white border border-slate-100 text-sm">
              {progress.status === 20 ? (
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              ) : (
                <Clock className="w-5 h-5 text-amber-500 shrink-0" />
              )}
              <div className="text-xs leading-relaxed text-slate-700">
                {progress.status === 20 ? (
                  <>
                    <p className="font-bold">审核已通过，商家已开通</p>
                    <p className="mt-1 text-slate-500">初始密码已通过站内消息下发；返回「我的」进入商家资金中心。</p>
                  </>
                ) : (
                  <p>申请审核中（申请编号 {progress.apply_id}），平台人工审核 48 小时内处理。</p>
                )}
              </div>
            </div>
            {progress.status === 20 && (
              <button
                onClick={onEnterFinance}
                className="w-full py-2.5 rounded-xl bg-teal-700 text-white text-sm font-bold flex items-center justify-center gap-1.5"
              >
                <Wallet className="w-4 h-4" /> 进入商家资金中心
              </button>
            )}
            {progress.status === 10 && (
              <button
                onClick={refreshProgress}
                className="w-full py-2.5 rounded-xl border border-teal-700 text-teal-800 text-sm font-bold flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" /> 刷新审核状态
              </button>
            )}
          </div>
        )}

        {/* 开通成功态 */}
        {phase === 'success' && (
          <div className="bg-white rounded-2xl border border-teal-100 p-6 text-center space-y-3">
            <PartyPopper className="w-10 h-10 text-amber-500 mx-auto" />
            <p className="font-extrabold text-base">开通成功！</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              商家「{progress?.merchant_name || form.merchant_name}」已自动审核开通（MR-012），
              初始密码已站内消息下发，请及时登录管理后台修改。
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold"
              >
                完成
              </button>
              <button
                onClick={onEnterFinance}
                className="flex-1 py-2.5 rounded-xl bg-teal-700 text-white text-sm font-bold flex items-center justify-center gap-1.5"
              >
                <Wallet className="w-4 h-4" /> 资金中心
              </button>
            </div>
          </div>
        )}

        {/* 审核中态 */}
        {phase === 'pending' && (
          <div className="bg-white rounded-2xl border border-amber-100 p-6 text-center space-y-3">
            <Clock className="w-10 h-10 text-amber-500 mx-auto" />
            <p className="font-extrabold text-base">申请已提交，审核中</p>
            <p className="text-xs text-slate-500">平台人工审核（MR-012 关闭自动审核时 48 小时内处理），可稍后刷新状态。</p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold"
              >
                完成
              </button>
              <button
                onClick={refreshProgress}
                className="flex-1 py-2.5 rounded-xl bg-teal-700 text-white text-sm font-bold flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" /> 刷新状态
              </button>
            </div>
          </div>
        )}

        {/* 表单态 */}
        {phase === 'form' && (
          <div className="space-y-3">
            {progress?.status === 30 && (
              <div className="px-3 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-700 leading-relaxed">
                <p className="font-bold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> 申请被驳回：{progress.audit_remark || '-'}
                </p>
                <p className="mt-0.5">已为您回填上次资料，修改后重新提交。</p>
              </div>
            )}

            {/* 法人信息 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4 space-y-3">
              <p className="font-extrabold text-sm flex items-center gap-1.5">
                <BackIcon className="w-4 h-4 text-teal-700 rotate-180" /> 法人信息
              </p>
              <div>
                <label className={labelCls}>法人姓名 *</label>
                <input className={inputCls} value={form.legal_name} onChange={(e) => setField('legal_name', e.target.value)} placeholder="与营业执照一致" />
              </div>
              <div>
                <label className={labelCls}>身份证号 *（自动解析性别/年龄）</label>
                <input
                  className={inputCls}
                  value={form.id_card}
                  maxLength={18}
                  onChange={(e) => {
                    setField('id_card', e.target.value);
                    parseIdCard(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className={labelCls}>性别</label>
                  <div className="flex gap-2 mt-1">
                    {[{ v: 10, l: '男' }, { v: 20, l: '女' }].map((g) => (
                      <button
                        key={g.v}
                        onClick={() => setField('gender', g.v)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold border ${
                          form.gender === g.v ? 'bg-teal-700 text-white border-teal-700' : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {g.l}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-24">
                  <label className={labelCls}>年龄</label>
                  <input
                    className={inputCls}
                    type="number"
                    value={form.age ?? ''}
                    onChange={(e) => setField('age', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>手机号 *（作为商家管理端登录账号）</label>
                <input className={inputCls} value={form.contact_phone} onChange={(e) => setField('contact_phone', e.target.value)} maxLength={11} placeholder="11位手机号" />
              </div>
            </div>

            {/* 商家信息 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4 space-y-3">
              <p className="font-extrabold text-sm">商家信息</p>
              <div>
                <label className={labelCls}>营业执照 *（拍照上传，自动OCR核验）</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading || ocrRunning}
                  className={`w-full py-4 rounded-xl border border-dashed text-xs font-bold flex items-center justify-center gap-1.5 ${
                    form.business_license
                      ? 'border-teal-300 bg-teal-50 text-teal-800'
                      : 'border-slate-300 bg-slate-50 text-slate-500'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  {uploading
                    ? '上传中...'
                    : ocrRunning
                    ? 'OCR 识别中...'
                    : form.business_license
                    ? '✓ 已上传，点击更换'
                    : '点击上传营业执照（必填，自动OCR核验）'}
                </button>
                {/* [healthmall-ext] P2.5c：OCR 识别结果反馈 */}
                {ocr && (
                  ocr.recognized ? (
                    <p className="text-[11px] text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-2.5 py-1.5">
                      ✓ 已识别：{ocr.merchant_name}
                      {ocr.credit_code ? ` · 统一社会信用代码 ${ocr.credit_code}` : ''}
                      （已自动回填，可修改）
                    </p>
                  ) : (
                    <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                      {ocr.message || 'OCR 未识别，请人工填写'}（不影响提交）
                    </p>
                  )
                )}
              </div>
              <div>
                <label className={labelCls}>商家名称 *</label>
                <input className={inputCls} value={form.merchant_name} onChange={(e) => setField('merchant_name', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>统一社会信用代码（OCR 识别自动填写，可修改）</label>
                <input
                  className={inputCls}
                  value={form.credit_code}
                  maxLength={18}
                  onChange={(e) => setField('credit_code', e.target.value.toUpperCase())}
                  placeholder="18 位，选填；识别成功后自动回填"
                />
              </div>
              <div>
                <label className={labelCls}>类目 *</label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setField('category', cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                        form.category === cat ? 'bg-teal-700 text-white border-teal-700' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls}>城市 *</label>
                <input className={inputCls} value={form.city} onChange={(e) => setField('city', e.target.value)} placeholder="经营所在城市" />
              </div>
              <div>
                <label className={labelCls}>备注</label>
                <textarea className={inputCls} rows={2} value={form.intro} onChange={(e) => setField('intro', e.target.value)} placeholder="主营范围等，选填" />
              </div>
            </div>

            {error && <p className="text-xs text-red-500 px-1">{error}</p>}

            <button
              onClick={submit}
              disabled={submitting || uploading}
              className="w-full py-3 rounded-xl bg-teal-700 text-white text-sm font-extrabold disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {submitting ? '提交中...' : '提交入驻资料'}
              {!submitting && <X className="w-0 h-0" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
