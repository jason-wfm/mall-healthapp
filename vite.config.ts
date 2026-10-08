import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyÃ¢file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // 将 /front 请求代理到 mall-backend (SpringBoot, 默认 8100 端口)
      // 可通过环境变量 MODULITHSHOP_API_URL 覆盖后端地址
      proxy: {
        '/front': {
          target: process.env.MODULITHSHOP_API_URL || 'http://localhost:8100',
          changeOrigin: true,
        },
      },
    },
  };
});
