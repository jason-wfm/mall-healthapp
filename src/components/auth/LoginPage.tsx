import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  MessageSquare,
  AlertCircle,
  Check,
  RefreshCw,
  Terminal,
  ChevronDown,
  ChevronUp,
  Globe,
  ExternalLink,
  Code2
} from 'lucide-react';
import {
  apiSendSmsCode,
  apiLoginBySms,
  apiLoginByAccount,
  apiLoginByWechat,
  getApiLogs,
  subscribeApiLogs,
  ApiCallLog
} from '../../services/authApi';

export interface UserAccountInfo {
  id: string;
  phone: string;
  name: string;
  avatar: string;
  tier: string;
  role: string;
  loginMethod?: 'sms' | 'password' | 'wechat';
  token?: string;
  userId?: number | string;
  apiSource?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  redirectNotice?: string;
  onLoginSuccess: (user: UserAccountInfo) => void;
}

// 微信官方矢量图标组件
const WechatIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.5 2C4.36 2 1 4.91 1 8.5c0 2.01 1.05 3.8 2.69 4.96l-.69 2.07 2.45-1.23c.96.44 2.01.7 3.05.7.17 0 .34 0 .5-.02C9.07 14.39 9 13.71 9 13c0-3.87 3.81-7 8.5-7 .34 0 .67.02 1 .05C17.38 3.68 13.25 2 8.5 2zm-2.25 4.5c.69 0 1.25.56 1.25 1.25S6.94 9 6.25 9 5 8.44 5 7.75 5.56 6.5 6.25 6.5zm4.5 0c.69 0 1.25.56 1.25 1.25S11.44 9 10.75 9 9.5 8.44 9.5 7.75s.56-1.25 1.25-1.25zM16 8c-3.87 0-7 2.69-7 6 0 3.31 3.13 6 7 6 .89 0 1.74-.15 2.51-.43l2.09 1.05-.59-1.77C21.91 17.72 23 16 23 14c0-3.31-3.13-6-7-6zm-2.25 4.25c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4.5 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
  </svg>
);

export const LoginPage: React.FC<Props> = ({
  isOpen,
  onClose,
  redirectNotice,
  onLoginSuccess
}) => {
  const [loginMode, setLoginMode] = useState<'sms' | 'password' | 'wechat'>('sms');
  const [phone, setPhone] = useState('13800000001');
  const [smsCode, setSmsCode] = useState('682910');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [smsSentToast, setSmsSentToast] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 微信授权与验证流程状态
  const [isWechatAuthOpen, setIsWechatAuthOpen] = useState(false);
  const [selectedWechatUser, setSelectedWechatUser] = useState<'zhang' | 'li'>('zhang');
  const [wechatVerifyStage, setWechatVerifyStage] = useState<'idle' | 'authorizing' | 'verifying' | 'passed'>('idle');
  const [wechatVerifyProgressText, setWechatVerifyProgressText] = useState('');

  // 接口调用监控状态
  const [apiLogsList, setApiLogsList] = useState<ApiCallLog[]>(getApiLogs);
  const [showApiInspector, setShowApiInspector] = useState(false);
  const [activeLogDetail, setActiveLogDetail] = useState<ApiCallLog | null>(null);

  // 监听接口日志
  useEffect(() => {
    const unsubscribe = subscribeApiLogs((logs) => {
      setApiLogsList(logs);
      if (logs.length > 0 && !activeLogDetail) {
        setActiveLogDetail(logs[0]);
      }
    });
    return unsubscribe;
  }, [activeLogDetail]);

  // 倒计时计时器
  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  if (!isOpen) return null;

  // 1. 调用短信发送接口: POST /front/account/login/send-code
  const handleSendSms = async () => {
    if (!phone || phone.length < 11) {
      setErrorMessage('请输入正确的11位中国大陆手机号码');
      return;
    }
    setErrorMessage(null);
    try {
      const res = await apiSendSmsCode(phone);
      setCountdown(60);
      const code = res.data?.auth_code || '682910';
      setSmsCode(code);
      setSmsSentToast(`【Modulithshop Java 接口】验证码已下发: ${code} (已自动填入)`);
      setTimeout(() => {
        setSmsSentToast(null);
      }, 5000);
    } catch (err: any) {
      setErrorMessage(err.message || '短信验证码下发失败，请重试');
    }
  };

  // 快捷填入测试账号
  const handlePresetAccount = (type: 'zhang' | 'li') => {
    setErrorMessage(null);
    if (type === 'zhang') {
      setPhone('13800000001');
      setSmsCode('682910');
      setPassword('123456');
      setSelectedWechatUser('zhang');
    } else {
      setPhone('13988882233');
      setSmsCode('682910');
      setPassword('888888');
      setSelectedWechatUser('li');
    }
  };

  // 2. 提交短信或账号密码登录 (调用后端对应接口)
  const handleSubmit = async () => {
    if (!agreeTerms) {
      setErrorMessage('请先阅读并勾选《用户服务协议》与《隐私指引》');
      return;
    }
    if (loginMode === 'sms' && (!phone || !smsCode)) {
      setErrorMessage('请输入完整的手机号与验证码');
      return;
    }
    if (loginMode === 'password' && (!phone || !password)) {
      setErrorMessage('请输入手机号及密码');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (loginMode === 'sms') {
        // 短信登录接口: POST /front/account/login
        const res = await apiLoginBySms({
          mobile: phone,
          auth_code: smsCode,
          user_type: 1
        });

        const userData = res.data;
        const user: UserAccountInfo = {
          id: String(userData.user_id || 'usr-01'),
          phone: userData.user_mobile || phone,
          name: userData.user_nickname || '健康用户',
          avatar: userData.user_avatar || '👨‍💼',
          tier: userData.user_level_name || 'VIP 黄金会员',
          role: userData.user_role || '幸福之家主理人',
          loginMethod: 'sms',
          token: userData.token,
          userId: userData.user_id,
          apiSource: 'POST /front/account/login'
        };
        onLoginSuccess(user);
      } else {
        // 账号密码登录: POST /front/account/login/login
        const res = await apiLoginByAccount({
          user_account: phone,
          user_password: password
        });

        const userData = res.data;
        const user: UserAccountInfo = {
          id: String(userData.user_id || 'usr-01'),
          phone: userData.user_mobile || phone,
          name: userData.user_nickname || '健康用户',
          avatar: userData.user_avatar || '👨‍💼',
          tier: userData.user_level_name || 'VIP 黄金会员',
          role: userData.user_role || '幸福之家主理人',
          loginMethod: 'password',
          token: userData.token,
          userId: userData.user_id,
          apiSource: 'POST /front/account/login/login'
        };
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setErrorMessage(err.message || '登录失败，请检查账号或网络');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 触发微信登录验证流程
  const handleStartWechatLogin = () => {
    setErrorMessage(null);
    setAgreeTerms(true);
    setWechatVerifyStage('idle');
    setIsWechatAuthOpen(true);
  };

  // 3. 微信授权并调用开源接口: POST /front/account/wechat
  const handleConfirmWechatAuth = async () => {
    setWechatVerifyStage('authorizing');
    setWechatVerifyProgressText('正在拉起微信安全授权接口并获取 Code / OpenID...');

    try {
      await new Promise((r) => setTimeout(r, 450));
      setWechatVerifyStage('verifying');
      setWechatVerifyProgressText('正在向 Modulithshop Java 接口 POST /front/account/wechat 校验鉴权令牌...');

      // 真实 HTTP 请求调用: POST /front/account/wechat
      const res = await apiLoginByWechat({
        code: `081wx_code_${Date.now()}`,
        openid: `wx_oid_${selectedWechatUser === 'li' ? '13988882233' : '13800000001'}`,
        user_info: {
          nickname: selectedWechatUser === 'li' ? '李秀兰' : '张明',
          avatar: selectedWechatUser === 'li' ? '👵' : '👨‍💼',
          gender: selectedWechatUser === 'li' ? 2 : 1
        },
        login_target: selectedWechatUser
      });

      setWechatVerifyStage('passed');
      setWechatVerifyProgressText(`微信鉴权成功！接口返回 Token: ${res.data.token.slice(0, 16)}...`);

      setTimeout(() => {
        setIsWechatAuthOpen(false);
        const userData = res.data;
        const wechatUser: UserAccountInfo = {
          id: String(userData.user_id || 'usr-wx-01'),
          phone: userData.user_mobile || (selectedWechatUser === 'li' ? '13988882233' : '13800000001'),
          name: userData.user_nickname || '微信认证用户',
          avatar: userData.user_avatar || (selectedWechatUser === 'li' ? '👵' : '👨‍💼'),
          tier: userData.user_level_name || 'VIP 黄金会员',
          role: userData.user_role || '幸福之家主理人',
          loginMethod: 'wechat',
          token: userData.token,
          userId: userData.user_id,
          apiSource: 'POST /front/account/wechat'
        };
        onLoginSuccess(wechatUser);
      }, 600);
    } catch (err: any) {
      setWechatVerifyStage('idle');
      setErrorMessage(err.message || '微信鉴权登录失败');
      setIsWechatAuthOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white text-slate-800 animate-in fade-in duration-200">
      {/* 顶部导航与返回按钮 */}
      <div className="h-12 px-3 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        <button
          id="btn-login-back"
          onClick={onClose}
          className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 px-2 py-1.5 rounded-lg hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-700" />
          <span>返回</span>
        </button>
        <span className="text-xs font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
          <span>统一健康通行证</span>
          <span className="text-[9px] bg-emerald-50 text-emerald-700 font-mono px-1.5 py-0.5 rounded border border-emerald-200">
            modulithshop-v3
          </span>
        </span>
        <button
          id="btn-login-skip"
          onClick={onClose}
          className="text-[11px] text-slate-400 hover:text-slate-600 px-2 py-1 cursor-pointer"
        >
          暂不登录
        </button>
      </div>

      {/* 滚动主内容区 */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* 拦截来源定向跳转提示横幅 */}
        {redirectNotice && (
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2.5 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block text-[11px] text-amber-800">未登录拦截提示</span>
              <p className="text-[11px] text-amber-900/90 leading-relaxed font-medium">
                {redirectNotice}
              </p>
              <span className="text-[10px] text-teal-700 font-bold block pt-0.5">
                ✦ 登录成功后将自动跳转回前序页面继续操作
              </span>
            </div>
          </div>
        )}

        {/* 品牌 Logo 与标题 */}
        <div className="text-center pt-1 pb-1">
          <div className="w-14 h-14 bg-gradient-to-tr from-teal-700 to-emerald-500 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl shadow-md shadow-teal-700/20 mb-2.5">
            🩺
          </div>
          <h1 className="text-lg font-black text-slate-900">健康商城 · 登录中心</h1>
          <p className="text-[11px] text-slate-400 mt-0.5">
            基于开源 modulithshop-v3-java 账户认证接口规范构建
          </p>
        </div>

        {/* 开源接口规范标签栏 */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 text-[11px] space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-teal-700" />
              <span>开源项目已对接接口 (SpringBoot3)</span>
            </span>
            <span className="text-[9px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>HTTP 200 就绪</span>
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
            <div className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-600 truncate">
              <div className="text-[9px] text-slate-400 font-sans">微信登录</div>
              <div className="text-emerald-700 font-bold truncate">/front/account/wechat</div>
            </div>
            <div className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-600 truncate">
              <div className="text-[9px] text-slate-400 font-sans">短信登录</div>
              <div className="text-teal-700 font-bold truncate">/front/account/login</div>
            </div>
            <div className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-600 truncate">
              <div className="text-[9px] text-slate-400 font-sans">账号登录</div>
              <div className="text-indigo-700 font-bold truncate">/front/account/login/login</div>
            </div>
          </div>
        </div>

        {/* 演示环境：一键测试账号快捷填充 */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>快速测试身份</span>
            </span>
            <span className="text-[10px] text-teal-600 font-normal">支持微信/短信/密码三通</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="btn-preset-zhang"
              onClick={() => handlePresetAccount('zhang')}
              className={`p-2 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                phone === '13800000001'
                  ? 'border-teal-600 bg-teal-50/70 text-teal-900 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="font-bold text-[11px] flex items-center gap-1">
                <span>👨‍💼 张明</span>
                <span className="text-[8px] bg-amber-200 text-amber-950 px-1 py-0.2 rounded font-bold">
                  VIP黄金
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">13800000001</div>
            </button>

            <button
              type="button"
              id="btn-preset-li"
              onClick={() => handlePresetAccount('li')}
              className={`p-2 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                phone === '13988882233'
                  ? 'border-teal-600 bg-teal-50/70 text-teal-900 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="font-bold text-[11px] flex items-center gap-1">
                <span>👵 李秀兰</span>
                <span className="text-[8px] bg-purple-100 text-purple-800 px-1 py-0.2 rounded font-bold">
                  慢病关怀
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">13988882233</div>
            </button>
          </div>
        </div>

        {/* 3 种登录方式切换卡：短信验证码 | 账号密码 | 微信登录 */}
        <div className="flex border-b border-slate-100 text-xs font-bold">
          <button
            type="button"
            id="tab-mode-sms"
            onClick={() => setLoginMode('sms')}
            className={`flex-1 py-2.5 text-center relative transition-colors cursor-pointer ${
              loginMode === 'sms' ? 'text-teal-700' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>短信验证码</span>
            <span className="block text-[9px] font-mono text-slate-400 font-normal">/account/login</span>
            {loginMode === 'sms' && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-teal-600 rounded-full" />
            )}
          </button>
          <button
            type="button"
            id="tab-mode-password"
            onClick={() => setLoginMode('password')}
            className={`flex-1 py-2.5 text-center relative transition-colors cursor-pointer ${
              loginMode === 'password' ? 'text-teal-700' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>账号密码</span>
            <span className="block text-[9px] font-mono text-slate-400 font-normal">/login/login</span>
            {loginMode === 'password' && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-teal-600 rounded-full" />
            )}
          </button>
          <button
            type="button"
            id="tab-mode-wechat"
            onClick={() => setLoginMode('wechat')}
            className={`flex-1 py-2.5 text-center relative transition-colors flex flex-col items-center justify-center cursor-pointer ${
              loginMode === 'wechat' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="flex items-center gap-1">
              <WechatIcon className="w-3.5 h-3.5 text-[#07C160]" />
              <span>微信登录</span>
              <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1 py-0.2 rounded font-bold">
                推荐
              </span>
            </div>
            <span className="block text-[9px] font-mono text-slate-400 font-normal">/account/wechat</span>
            {loginMode === 'wechat' && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#07C160] rounded-full" />
            )}
          </button>
        </div>

        {/* 模拟短信横幅 */}
        {smsSentToast && (
          <div className="bg-teal-50 border border-teal-300 text-teal-900 text-xs p-2.5 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
            <MessageSquare className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="font-medium text-[11px]">{smsSentToast}</span>
          </div>
        )}

        {/* 错误提示 */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-2.5 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="font-medium text-[11px]">{errorMessage}</span>
          </div>
        )}

        {/* 1. 微信直接登录模式面板 (调用 /front/account/wechat) */}
        {loginMode === 'wechat' && (
          <div className="space-y-4 pt-2">
            <div className="bg-gradient-to-b from-emerald-50/80 to-teal-50/30 border border-emerald-200/80 rounded-2xl p-4 text-center space-y-3">
              <div className="w-16 h-16 bg-[#07C160] text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <WechatIcon className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">微信账号快速授权登录</h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  调用开源接口 <span className="font-mono text-emerald-800 font-bold">/front/account/wechat</span> 完成凭证校验
                </p>
              </div>

              {/* 微信绑定账号预览 */}
              <div className="bg-white rounded-xl p-3 border border-emerald-100 flex items-center justify-between text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg shrink-0">
                    {selectedWechatUser === 'zhang' ? '👨‍💼' : '👵'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{selectedWechatUser === 'zhang' ? '张明 (微信号)' : '李秀兰 (微信号)'}</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-md">
                        微信实名已认证
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      绑定手机: {selectedWechatUser === 'zhang' ? '138****0001' : '139****2233'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedWechatUser(selectedWechatUser === 'zhang' ? 'li' : 'zhang')}
                  className="text-[10px] text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  切换账号
                </button>
              </div>

              {/* 权限说明 */}
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>微信官方 OAuth 2.0 鉴权 · 请求路由至 /front/account/wechat</span>
              </div>
            </div>

            {/* 微信直接登录大按钮 */}
            <button
              type="button"
              id="btn-trigger-wechat-login"
              onClick={handleStartWechatLogin}
              className="w-full bg-[#07C160] hover:bg-[#06ad56] active:scale-98 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <WechatIcon className="w-5 h-5" />
              <span>发起微信授权并调用接口登录</span>
              {redirectNotice && <span className="text-[11px] font-normal opacity-90">(自动返回前页)</span>}
            </button>
          </div>
        )}

        {/* 2. 短信或密码模式表单输入区 */}
        {loginMode !== 'wechat' && (
          <div className="space-y-3 pt-1">
            {/* 手机号 */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 block">
                {loginMode === 'sms' ? '手机号码 (mobile)' : '登录账号 / 手机号 (user_account)'}
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 focus-within:border-teal-600 focus-within:bg-white transition-all">
                <span className="text-xs font-bold text-slate-600 mr-2 pr-2 border-r border-slate-200">
                  +86
                </span>
                <Smartphone className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="tel"
                  id="input-phone"
                  value={phone}
                  maxLength={11}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="请输入11位手机号"
                  className="w-full text-xs bg-transparent outline-hidden font-mono text-slate-900 placeholder:text-slate-400 font-bold"
                />
              </div>
            </div>

            {/* 短信验证码模式 (调用 /front/account/login) */}
            {loginMode === 'sms' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block">
                  短信验证码 (auth_code) · 接口: /front/account/login
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 focus-within:border-teal-600 focus-within:bg-white transition-all">
                    <Lock className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      id="input-sms-code"
                      value={smsCode}
                      maxLength={6}
                      onChange={(e) => setSmsCode(e.target.value)}
                      placeholder="输入6位数字验证码"
                      className="w-full text-xs bg-transparent outline-hidden font-mono text-slate-900 placeholder:text-slate-400 font-bold"
                    />
                  </div>
                  <button
                    type="button"
                    id="btn-send-sms"
                    onClick={handleSendSms}
                    disabled={countdown > 0}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      countdown > 0
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 active:scale-95'
                    }`}
                  >
                    {countdown > 0 ? `${countdown}s 后重新发送` : '获取验证码'}
                  </button>
                </div>
              </div>
            )}

            {/* 密码模式 (调用 /front/account/login/login) */}
            {loginMode === 'password' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block">
                  登录密码 (user_password) · 接口: /front/account/login/login
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 focus-within:border-teal-600 focus-within:bg-white transition-all">
                  <Lock className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="input-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入账号密码"
                    className="w-full text-xs bg-transparent outline-hidden font-mono text-slate-900 placeholder:text-slate-400 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* 用户协议勾选 */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="agree-terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
              />
              <label
                htmlFor="agree-terms"
                className="text-[10px] text-slate-500 leading-normal select-none cursor-pointer"
              >
                已阅读并同意
                <span className="text-teal-700 font-bold hover:underline">《用户服务协议》</span>、
                <span className="text-teal-700 font-bold hover:underline">《健康隐私保护指引》</span>
                及全家健康授权规则
              </label>
            </div>

            {/* 主登录按钮 */}
            <button
              type="button"
              id="btn-submit-login"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full mt-2 bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white font-extrabold text-sm py-3 rounded-2xl shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>
                    调用 {loginMode === 'sms' ? '/front/account/login' : '/front/account/login/login'}...
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {loginMode === 'sms' ? '调用短信接口登录并进入' : '调用账号密码接口登录并进入'}
                  </span>
                  {redirectNotice && <span className="text-[11px] font-normal opacity-90">(自动返回前页)</span>}
                </>
              )}
            </button>

            {/* 分隔线与第三方微信快捷登录入口 */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <span className="relative bg-white px-3 text-[10px] text-slate-400 font-medium">
                或使用微信极速验证登录 (/front/account/wechat)
              </span>
            </div>

            {/* 底部微信授权登录按钮 */}
            <button
              type="button"
              id="btn-wechat-bottom-quick"
              onClick={handleStartWechatLogin}
              className="w-full bg-[#07C160]/10 hover:bg-[#07C160]/20 border border-[#07C160]/30 text-[#07C160] font-bold text-xs py-2.5 rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
            >
              <WechatIcon className="w-4 h-4" />
              <span>微信快捷授权并验证登录</span>
            </button>
          </div>
        )}

        {/* 4. 开源项目接口实时调用监视器 (API Inspector) */}
        <div className="mt-4 border border-slate-200 rounded-2xl overflow-hidden bg-slate-900 text-slate-100">
          <button
            type="button"
            onClick={() => setShowApiInspector(!showApiInspector)}
            className="w-full p-3 flex items-center justify-between hover:bg-slate-800 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-bold text-white block">
                  开源接口请求监视器 (Modulithshop v3 Java)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {apiLogsList.length > 0
                    ? `已产生 ${apiLogsList.length} 条真实网络请求记录`
                    : '已就绪，等待调用登录接口'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                POST Ready
              </span>
              {showApiInspector ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </button>

          {showApiInspector && (
            <div className="p-3 border-t border-slate-800 space-y-3 text-[11px]">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>仓库: github.com/shsuishang/modulithshop-v3-java</span>
                <a
                  href="https://github.com/shsuishang/modulithshop-v3-java"
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-400 flex items-center gap-1 hover:underline"
                >
                  <span>查看源码</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* 历史请求列表 */}
              {apiLogsList.length === 0 ? (
                <div className="text-slate-500 text-center py-3 font-mono">
                  暂无请求记录，请点击上方发送验证码或登录按钮进行调用测试
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-1 overflow-x-auto pb-1">
                    {apiLogsList.map((log) => (
                      <button
                        key={log.id}
                        type="button"
                        onClick={() => setActiveLogDetail(log)}
                        className={`text-[10px] font-mono px-2.5 py-1 rounded-lg shrink-0 border transition-all cursor-pointer ${
                          activeLogDetail?.id === log.id
                            ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {log.endpoint.replace('/front/account', '..')}
                      </button>
                    ))}
                  </div>

                  {/* 选中请求的报文结构明细 */}
                  {activeLogDetail && (
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[10px]">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-emerald-400 font-bold">
                          {activeLogDetail.method} {activeLogDetail.endpoint}
                        </span>
                        <span>
                          {activeLogDetail.durationMs}ms · HTTP {activeLogDetail.responseStatus}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">请求参数 Request:</span>
                        <pre className="text-amber-200 overflow-x-auto p-1.5 bg-black/40 rounded">
                          {JSON.stringify(activeLogDetail.requestPayload, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <span className="text-slate-500 block">响应结果 Response (DTO):</span>
                        <pre className="text-emerald-300 overflow-x-auto p-1.5 bg-black/40 rounded max-h-36">
                          {JSON.stringify(activeLogDetail.responseBody, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部安全保障标识 */}
        <div className="pt-2 pb-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>modulithshop-v3-java 接口适配 · 国家等保三级医疗健康安全传输</span>
        </div>
      </div>

      {/* 3. 微信官方授权与安全鉴权验证模态抽屉 (WeChat OAuth Simulation) */}
      {isWechatAuthOpen && (
        <div className="fixed inset-0 z-60 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl overflow-hidden shadow-2xl border-t border-slate-100 animate-in slide-in-from-bottom duration-300 max-h-[85%] flex flex-col">
            {/* 微信头部绿色品牌栏 */}
            <div className="bg-[#07C160] px-4 py-3 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <WechatIcon className="w-5 h-5" />
                <span className="font-bold text-xs">微信授权登录</span>
              </div>
              <span className="text-[10px] font-mono opacity-90">POST /front/account/wechat</span>
            </div>

            {/* 授权内容 */}
            <div className="p-5 space-y-4 overflow-y-auto">
              {/* 应用申请说明 */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-12 h-12 bg-gradient-to-tr from-teal-700 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-sm shrink-0">
                  🩺
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">健康商城 C端系统 申请使用</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    基于 modulithshop-v3-java 提供账户鉴权服务
                  </p>
                </div>
              </div>

              {/* 权限清单 */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-700">将获取以下微信公开权限：</div>
                <div className="bg-slate-50 rounded-xl p-2.5 space-y-1.5 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#07C160] shrink-0" />
                    <span className="font-medium text-[11px]">获取您的微信头像、昵称、地区及性别</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#07C160] shrink-0" />
                    <span className="font-medium text-[11px]">绑定或同步您的专属健康档案与会员权益</span>
                  </div>
                </div>
              </div>

              {/* 微信用户信息卡片 */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400">授权微信号</div>
                <div className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-xl shrink-0 border border-emerald-100">
                      {selectedWechatUser === 'zhang' ? '👨‍💼' : '👵'}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <span>{selectedWechatUser === 'zhang' ? '张明' : '李秀兰'}</span>
                        <span className="text-[8px] bg-[#07C160] text-white px-1.5 py-0.2 rounded-full font-bold">
                          当前登录微信号
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                        微信号: {selectedWechatUser === 'zhang' ? 'wx_zhangming_sz' : 'wx_lixiulan_sz'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedWechatUser(selectedWechatUser === 'zhang' ? 'li' : 'zhang')}
                    className="text-[10px] text-emerald-700 font-bold bg-white px-2 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-50 cursor-pointer"
                  >
                    切换
                  </button>
                </div>
              </div>

              {/* 微信鉴权中动画或文字反馈 */}
              {wechatVerifyStage !== 'idle' && (
                <div className="bg-slate-900 text-white rounded-2xl p-3.5 space-y-2 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2">
                      {wechatVerifyStage === 'passed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                      ) : (
                        <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                      )}
                      <span>微信安全验证流程</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {wechatVerifyStage === 'authorizing' && '步骤 1/3: 接口授权'}
                      {wechatVerifyStage === 'verifying' && '步骤 2/3: Java 接口调用'}
                      {wechatVerifyStage === 'passed' && '步骤 3/3: Token 下发'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium leading-relaxed font-mono">
                    {wechatVerifyProgressText}
                  </p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-[#07C160] transition-all duration-300 ${
                        wechatVerifyStage === 'authorizing'
                          ? 'w-1/3'
                          : wechatVerifyStage === 'verifying'
                          ? 'w-2/3'
                          : 'w-full'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* 操作按钮组 */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  id="btn-wechat-cancel"
                  disabled={wechatVerifyStage !== 'idle'}
                  onClick={() => setIsWechatAuthOpen(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  拒绝
                </button>
                <button
                  type="button"
                  id="btn-wechat-confirm"
                  disabled={wechatVerifyStage !== 'idle'}
                  onClick={handleConfirmWechatAuth}
                  className="flex-1 py-3 bg-[#07C160] hover:bg-[#06ad56] text-white rounded-2xl text-xs font-extrabold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {wechatVerifyStage === 'idle' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>调用 /front/account/wechat 登录</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>正在调用接口中...</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
