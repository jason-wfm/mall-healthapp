import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 健康检查接口
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'modulithshop-v3-java-gateway',
      time: new Date().toISOString()
    });
  });

  // Vite 开发服务器中间件 / 生产环境静态托管
  // /front/* 账户认证请求不在此处 mock，由 vite.config.ts 的 server.proxy 转发到
  // mall-backend (SpringBoot, 默认 http://localhost:8080，可用 MODULITHSHOP_API_URL 覆盖)
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
