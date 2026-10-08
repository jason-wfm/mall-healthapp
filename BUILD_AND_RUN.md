# 健康商城 C 端移动端系统 — 打包与启动说明

> 本文档基于对 `E:\workspace\mallshop\healthmall\mall-healthapp` 的实际执行验证结果编写（非推测）。
> 验证环境：Windows / Node v22.22.2 / npm 10.9.7

---

## 一、结论速览

| 项目 | 结论 |
| --- | --- |
| 项目类型 | **纯前端静态 SPA**（Vite + React 19 + TypeScript + Tailwind v4） |
| 构建方式 | `vite build` → 输出静态目录 `dist/` |
| 是否需后端 | **不需要**。全项目无 `fetch` / 无 API 调用，数据全部来自 `src/data/*.ts` 的 mock |
| 启动方式 | 开发：`npm run dev`；预览构建产物：`npm run preview`；生产：Nginx / 静态托管 `dist/` |
| 阻塞问题 | `npm install` 会因依赖冲突失败，**必须**加 `--legacy-peer-deps`（详见第四节） |
| 构建产物 | `dist/index.html` + `dist/assets/*.js` + `dist/assets/*.css`，gzip 后约 **127 KB** |

---

## 二、技术栈与环境要求

**运行时要求**

- Node.js：**≥ 20.19 或 ≥ 22.12**（Vite 8 的要求），实测 v22.22.2 通过
- 包管理器：npm（实测 10.9.7）
- 无需数据库、无需环境变量、无需 API Key

**核心依赖（来自 `package.json`）**

| 类别 | 包 | 版本 |
| --- | --- | --- |
| 框架 | react / react-dom | ^19.0.1 |
| 构建 | vite | ^8.3.0 |
| 构建插件 | @vitejs/plugin-react / @tailwindcss/vite | ^6.1.1 / ^4.3.3 |
| 样式 | tailwindcss | ^4.3.3 |
| 动效 | motion | ^12.23.24 |
| 图标 | lucide-react | ^0.546.0 |
| 语言 | typescript | ^7.0.2 |

> 注：`express`、`dotenv`、`@google/genai`、`esbuild` 虽在 `package.json` 中，但**代码中未被引用**（全项目搜索无 `GoogleGenAI` / `process.env` / `/api/` 任何命中）。
> 配合 `metadata.json` 中的 `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` 与 `npm run clean` 里的 `server.js`，可判定：该项目是从 AI Studio 模板派生的，**原模板的 Gemini 服务端（`server.ts`）已被删除**，现在是一个纯静态原型。因此当前版本不需要配置 `GEMINI_API_KEY`。

---

## 三、关键文件说明

```
mall-healthapp/
├── index.html              # SPA 入口，挂载 #root，title/description 已中文化
├── package.json            # 脚本与依赖定义
├── vite.config.ts          # 插件、@ 别名、HMR 开关
├── tsconfig.json           # TS 配置（noEmit，仅类型检查）
├── metadata.json           # 应用元信息（名称/描述/摄像头权限声明）
├── .env.example            # 模板残留，当前无代码读取，可忽略
├── README.md               # AI Studio 模板原始说明（与实际不符，见第九节）
├── src/
│   ├── main.tsx            # React 挂载入口（StrictMode）
│   ├── App.tsx             # 根组件：Tab 切换 + 全部弹窗状态编排
│   ├── index.css           # Tailwind 入口 + 自定义工具类（no-scrollbar/retina 细线等）
│   ├── components/         # 按业务域分包：adaptation / common / health / home / mall / mine / order / services / modules
│   ├── data/               # mockData.ts + healthMockData.ts（全部业务数据来源）
│   └── types/              # index.ts + health.ts（类型定义）
└── dist/                   # 构建产物（执行 build 后生成）
```

---

## 四、⚠️ 已知阻塞点：npm install 依赖冲突（重要）

### 问题现象

直接执行 `npm install` 会失败：

```
npm error ERESOLVE could not resolve
npm error While resolving: vite@8.3.0
npm error Found: esbuild@0.25.12
npm error   dev esbuild@"^0.25.0" from the root project
npm error Could not resolve dependency:
npm error peerOptional esbuild@"^0.27.0 || ^0.28.0" from vite@8.3.0
```

### 根因

`package.json` 的 `devDependencies` 把 esbuild 锁在 `^0.25.0`，而 `vite@8.3.0` 要求 `esbuild` 为 `^0.27.0 || ^0.28.0`，两者不兼容。属于模板升级 Vite 大版本时遗留的版本漂移，**不是代码问题**。

### 解决方案（二选一）

**方案 A：加参数安装（零文件改动，已实测通过 ✅）**

```bash
npm install --legacy-peer-deps
```

**方案 B：修正版本（推荐作为长期方案，需改一行）**

将 `package.json` 中 `devDependencies.esbuild` 从 `^0.25.0` 改为 `^0.28.0`：

```diff
   "devDependencies": {
     "@types/node": "^22.14.0",
     ...
-    "esbuild": "^0.25.0",
+    "esbuild": "^0.28.0",
```

之后普通 `npm install` 即可正常执行。
（因代码中未直接引用 esbuild，此改动不影响构建产物。）

**方案 C：固化配置**

在项目根目录新建 `.npmrc`，写入：

```
legacy-peer-deps=true
```

之后所有 npm 命令自动兼容，无需每次加参数。

---

## 五、完整打包步骤（首次构建）

```bash
# 1. 进入项目目录
cd /e/workspace/mallshop/healthmall/mall-healthapp
#   PowerShell 用户：cd E:\workspace\mallshop\healthmall\mall-healthapp

# 2. 安装依赖（关键：必须带 --legacy-peer-deps）
npm install --legacy-peer-deps

# 3. （可选）类型检查，当前项目 0 错误
npm run lint

# 4. 生产构建，产出 dist/
npm run build

# 5. 本地验证构建产物
npm run preview -- --port 4173
#   浏览器访问 http://localhost:4173
```

### 实测构建输出（Vite 8.3.0，耗时约 5.7s，1685 个模块）

```
dist/index.html                   1.18 kB │ gzip:   0.59 kB
dist/assets/index-f_B_5-0_.css   89.37 kB │ gzip:  12.83 kB
dist/assets/index-B9-F1jkL.js   408.39 kB │ gzip: 113.75 kB
✓ built in 5.73s
```

> 构建时会出现一条**非阻塞告警**：`vite.config.ts` 中的 `__dirname` 在 Vite 未来的 `configLoader: 'native'` 下不被支持，建议改为 `import.meta.dirname`。当前版本可忽略；也可设置环境变量 `VITE_CONFIG_NATIVE_IGNORE_WARNING=true` 屏蔽。

### 日常迭代构建

```bash
npm run build     # 覆盖生成 dist/
```

如需清理产物：

```bash
rm -rf dist       # Git Bash
```
> ⚠️ 项目自带的 `npm run clean` 内部是 `rm -rf dist server.js`，在 **Windows cmd/PowerShell 下不可用**，请在 Git Bash 中执行或手动删除 `dist` 目录。另外该脚本残留的 `server.js` 在项目里并不存在。

---

## 六、启动方式

### 方式 1：开发模式（带 HMR 热更新）

```bash
npm run dev
```
实际执行的命令是 `vite --port=3000 --host=0.0.0.0`。

- 访问地址：`http://localhost:3000`
- `--host=0.0.0.0` 表示监听全部网卡，**同一局域网内的手机可直接访问** `http://<本机IP>:3000`，便于移动端真机验收（本项目为 750rpx 适配的移动端原型，强烈建议用真机或浏览器设备模拟器查看）。

**⚠️ 端口冲突（本机实际情况）**：验证时发现 **3000 端口已被同级的 `mall-app` 项目占用**，Vite 自动顺延到 **3001**：

```
Port 3000 is in use, trying another one...
➜  Local:   http://localhost:3001/
```

如需固定端口，显式指定：

```bash
npm run dev -- --port=3100
```

**HMR 开关**：`vite.config.ts` 支持通过环境变量控制。设置 `DISABLE_HMR=true` 会关闭热更新**并同时关闭文件监听**（AI Studio 为避免编辑器反复写文件导致页面闪烁而设）：

```bash
DISABLE_HMR=true npm run dev
```

### 方式 2：预览生产构建（最接近线上效果）

```bash
npm run preview -- --port 4173 --host 127.0.0.1
```
实测 `http://127.0.0.1:4173/` 返回 200，`/assets/index-B9-F1jkL.js`（408 KB）返回 200，静态资源路径正确。

### 方式 3：生产静态托管（推荐）

`dist/` 是纯静态文件，任意 Web 服务器托管即可，**且无需配置 SPA 回退重写**（本项目无 react-router，所有页面切换均为 React 内部 state，不存在深层 URL）。

**Nginx 示例**

```nginx
server {
    listen       80;
    server_name  health.example.com;

    root   /var/www/mall-healthapp/dist;
    index  index.html;

    # 带 hash 的静态资源，长缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 入口文件不缓存，保证发版即时生效
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**子路径部署需要注意 base**

当前构建产物中资源引用是**绝对路径**：

```html
<script type="module" crossorigin src="/assets/index-B9-F1jkL.js"></script>
<link rel="stylesheet" crossorigin href="/assets/index-f_B_5-0_.css">
```

因此若部署在子路径（如 `https://host/healthmall/`），必须修改 `vite.config.ts` 增加 `base`，否则会 404：

```ts
export default defineConfig(() => {
  return {
    base: './',        // 或 base: '/healthmall/'
    plugins: [react(), tailwindcss()],
    // ...
  };
});
```

**Docker 示例**

```dockerfile
# ---------- 构建阶段 ----------
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# ---------- 运行阶段 ----------
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

构建并运行：

```bash
docker build -t mall-healthapp .
docker run -d -p 8080:80 --name mall-healthapp mall-healthapp
```

---

## 七、网络依赖提醒

界面中大量商品图 / 头像使用的是 **Unsplash 外链 CDN**（如 `https://images.unsplash.com/photo-...`），共约 25+ 处，集中在 `src/data/mockData.ts`。

- 联网环境：正常显示
- 内网 / 离线环境：图片会全部裂图（页面结构与交互不受影响）

若需要完全离线演示，建议先把这些图片下载到 `public/images/` 并替换为本地相对路径引用（`public/` 目录下的文件会被原样拷贝进 `dist/`）。

---

## 八、常见问题排查

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| `npm error ERESOLVE` | esbuild 版本冲突 | 见第四节，加 `--legacy-peer-deps` 或升级 esbuild |
| 3000 端口被占，实际跑在 3001 | 同级 `mall-app` 项目占用了 3000 | 用提示的实际端口，或 `npm run dev -- --port=3100` |
| `npm run clean` 报错 | 脚本用了 `rm -rf`，Windows 原生 shell 不支持 | 改用 Git Bash 或手动删 `dist` |
| 部署到子路径后页面白屏、控制台报 404 | 资源是绝对路径 `/assets/...` | 配置 `base: './'` 后重新构建 |
| 打开页面图片全是占位/裂图 | Unsplash 外链被墙或断网 | 改本地图片，见第七节 |
| `vite.config.ts` 的 `__dirname` 告警 | Vite 未来将默认使用 native config loader | 可忽略，或改为 `import.meta.dirname` |
| 找不到 `GEMINI_API_KEY` 相关报错线索 | 当前代码完全没有调用 AI 接口 | 正常，无需配置任何 Key |

---

## 九、与 `README.md` 的差异说明

项目内 `README.md` 是 AI Studio 模板原文，**与当前实际状态不符**，建议更新：

| README 描述 | 实际情况 |
| --- | --- |
| "Set the `GEMINI_API_KEY` in `.env.local`" | 代码中无任何 Gemini 调用，无需配置；`.env*` 已被 `.gitignore` 忽略 |
| 依赖仅 "Node.js" | 需 Node ≥ 20.19 / ≥ 22.12（Vite 8 要求），且安装必须处理 esbuild 冲突 |
| `npm run dev` 即可 | 可用，但需注意端口可能顺延到 3001 |
| 指向 `https://ai.studio/apps/...` | 本项目已本地化为「健康商城 C 端移动端系统」 |

---

## 十、命令速查表

```bash
# 环境
node -v                # 需 ≥ 22.12

# 安装（首次）
npm install --legacy-peer-deps

# 开发
npm run dev            # http://localhost:3000（被占用时自动顺延）

# 类型检查
npm run lint           # tsc --noEmit

# 生产构建
npm run build          # → dist/

# 预览构建产物
npm run preview -- --port 4173

# 清理
rm -rf dist
```
