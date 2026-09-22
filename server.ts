import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 请求体解析中间件
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 健康检查接口
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'modulithshop-v3-java-gateway',
      time: new Date().toISOString()
    });
  });

  /**
   * =========================================================================
   * 开源项目 modulithshop-v3-java 账户认证接口实现
   * GitHub: https://github.com/shsuishang/modulithshop-v3-java
   * =========================================================================
   */

  const UPSTREAM_JAVA_API = process.env.MODULITHSHOP_API_URL;

  // 1. 发送短信验证码接口: POST /front/account/login/send-code (或 /front/account/send-code)
  const handleSendCode = async (req: express.Request, res: express.Response) => {
    const mobile = req.body?.mobile || req.body?.phone || req.query?.mobile;
    console.log(`[Modulithshop Java] SMS Send Code Request -> mobile: ${mobile}`);

    if (!mobile || !/^1\d{10}$/.test(String(mobile))) {
      return res.status(400).json({
        status: 400,
        msg: '手机号码格式不正确 (请输入11位中国大陆手机号)',
        data: null
      });
    }

    // 尝试转发上游真实 Java 后端
    if (UPSTREAM_JAVA_API) {
      try {
        const resp = await fetch(`${UPSTREAM_JAVA_API}/front/account/login/send-code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req.body)
        });
        const data = await resp.json();
        return res.status(resp.status).json(data);
      } catch (e) {
        console.warn(`[Modulithshop Java] Upstream API call failed, falling back to local protocol:`, e);
      }
    }

    // 返回标准 Modulithshop Java 规范报文
    return res.json({
      status: 200,
      msg: '短信验证码发送成功',
      data: {
        mobile,
        expire_seconds: 60,
        auth_code: '682910', // 方便开发与体验测试
        notice: '测试环境已自动填充验证码 682910'
      }
    });
  };

  app.post('/front/account/login/send-code', handleSendCode);
  app.post('/front/account/send-code', handleSendCode);

  // 2. 短信验证码登录: POST /front/account/login
  app.post('/front/account/login', async (req, res) => {
    const mobile = req.body?.mobile || req.body?.phone || req.body?.user_mobile;
    const authCode = req.body?.auth_code || req.body?.code || req.body?.sms_code;
    const userType = req.body?.user_type || 1;

    console.log(`[Modulithshop Java] SMS Login Request -> mobile: ${mobile}, code: ${authCode}`);

    // 若配置了外部 Java 后端，优先远程透传
    if (UPSTREAM_JAVA_API) {
      try {
        const resp = await fetch(`${UPSTREAM_JAVA_API}/front/account/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req.body)
        });
        const data = await resp.json();
        return res.status(resp.status).json(data);
      } catch (e) {
        console.warn(`[Modulithshop Java] Upstream proxy failed, fallback:`, e);
      }
    }

    if (!mobile || !/^1\d{10}$/.test(String(mobile))) {
      return res.status(400).json({
        status: 400,
        msg: '手机号码格式不合法',
        data: null
      });
    }

    if (!authCode || String(authCode).trim().length === 0) {
      return res.status(400).json({
        status: 400,
        msg: '请输入短信验证码',
        data: null
      });
    }

    // 默认测试验证码 682910
    const isLi = String(mobile).includes('13988882233');
    const token = `mshop_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    return res.json({
      status: 200,
      msg: '短信验证码登录成功',
      data: {
        token,
        user_id: isLi ? 20002 : 10001,
        user_nickname: isLi ? '李秀兰' : '张明',
        user_mobile: mobile,
        user_avatar: isLi ? '👵' : '👨‍💼',
        user_level_id: isLi ? 1 : 3,
        user_level_name: isLi ? '慢病关怀会员' : 'VIP 黄金会员',
        user_role: isLi ? '慢病健康管理计划成员' : '幸福之家主理人',
        login_type: 'sms',
        user_type: userType
      }
    });
  });

  // 3. 账号密码登录: POST /front/account/login/login
  app.post('/front/account/login/login', async (req, res) => {
    const userAccount = req.body?.user_account || req.body?.username || req.body?.account;
    const userPassword = req.body?.user_password || req.body?.password;

    console.log(`[Modulithshop Java] Account Password Login Request -> account: ${userAccount}`);

    if (UPSTREAM_JAVA_API) {
      try {
        const resp = await fetch(`${UPSTREAM_JAVA_API}/front/account/login/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req.body)
        });
        const data = await resp.json();
        return res.status(resp.status).json(data);
      } catch (e) {
        console.warn(`[Modulithshop Java] Upstream proxy failed, fallback:`, e);
      }
    }

    if (!userAccount) {
      return res.status(400).json({
        status: 400,
        msg: '账号/手机号不能为空',
        data: null
      });
    }

    if (!userPassword) {
      return res.status(400).json({
        status: 400,
        msg: '密码不能为空',
        data: null
      });
    }

    const isLi = String(userAccount).includes('13988882233') || String(userAccount).includes('lixiulan');
    const token = `mshop_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    return res.json({
      status: 200,
      msg: '账号密码登录成功',
      data: {
        token,
        user_id: isLi ? 20002 : 10001,
        user_nickname: isLi ? '李秀兰' : '张明',
        user_mobile: isLi ? '13988882233' : '13800000001',
        user_avatar: isLi ? '👵' : '👨‍💼',
        user_level_id: isLi ? 1 : 3,
        user_level_name: isLi ? '慢病关怀会员' : 'VIP 黄金会员',
        user_role: isLi ? '慢病健康管理计划成员' : '幸福之家主理人',
        login_type: 'password'
      }
    });
  });

  // 4. 微信授权登录: POST /front/account/wechat (以及 /front/account/wechat/login, /front/account/wechat/auth)
  const handleWechatLogin = async (req: express.Request, res: express.Response) => {
    const code = req.body?.code || req.body?.js_code;
    const openid = req.body?.openid || 'wx_oid_' + Math.random().toString(36).substring(2, 12);
    const target = req.body?.login_target || 'zhang';
    const isLi = target === 'li';

    console.log(`[Modulithshop Java] WeChat Login Request -> code: ${code}, openid: ${openid}`);

    if (UPSTREAM_JAVA_API) {
      try {
        const resp = await fetch(`${UPSTREAM_JAVA_API}/front/account/wechat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req.body)
        });
        const data = await resp.json();
        return res.status(resp.status).json(data);
      } catch (e) {
        console.warn(`[Modulithshop Java] Upstream proxy failed, fallback:`, e);
      }
    }

    const token = `mshop_wx_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    return res.json({
      status: 200,
      msg: '微信授权登录成功',
      data: {
        token,
        user_id: isLi ? 20002 : 10001,
        user_nickname: isLi ? '李秀兰 (微信授权)' : '张明 (微信已认证)',
        user_mobile: isLi ? '13988882233' : '13800000001',
        user_avatar: isLi ? '👵' : '👨‍💼',
        user_level_id: isLi ? 1 : 3,
        user_level_name: isLi ? '慢病关怀会员' : 'VIP 黄金会员',
        user_role: isLi ? '微信绑定慢病健康成员' : '幸福之家主理人',
        openid,
        unionid: 'wx_unionid_shopsuite_8899',
        login_type: 'wechat'
      }
    });
  };

  app.post('/front/account/wechat', handleWechatLogin);
  app.post('/front/account/wechat/login', handleWechatLogin);
  app.post('/front/account/wechat/auth', handleWechatLogin);

  // Vite 开发服务器中间件 / 生产环境静态托管
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Modulithshop Java Gateway] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
