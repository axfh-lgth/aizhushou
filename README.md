# 研知 · 开发AI助手

对应需求：冰箱柜事业部 / 用户与产品中心 / 海外产品经营体 — **开发Ai助手**（第 15 条）。

本地知识库检索 + **阿里云百炼** 生成回答，不接入公司内部系统。

## 配置百炼

1. 打开 [阿里云百炼](https://bailian.console.aliyun.com/) 获取 API Key  
2. 复制 `.env.example` 为 `.env`：

```bash
copy .env.example .env
```

3. 编辑 `.env`：

```env
DASHSCOPE_API_KEY=你的百炼API密钥
TONGYI_MODEL=qwen-plus
```

可用模型示例：`qwen-turbo` / `qwen-plus` / `qwen-max`

## 本机开发

```bash
npm install
npm run dev
```

打开终端里提示的本地地址（一般是 http://localhost:5173/）。  
修改 `.env` 后需重启 `npm run dev`。

## 部署到 Netlify（推荐，长期固定网址）

项目已配置 `netlify.toml`：静态前端 + `/api/chat`、`/api/review` Functions。

1. 把本仓库推到 GitHub / GitLab / Bitbucket  
2. 打开 [Netlify](https://app.netlify.com/) → **Add new site** → Import from Git  
3. Build settings 会自动读取 `netlify.toml`（Build: `npm run build`，Publish: `dist`）  
4. 在 **Site configuration → Environment variables** 添加：

| 变量 | 说明 |
|------|------|
| `DASHSCOPE_API_KEY` | 百炼 API Key（必填） |
| `TONGYI_MODEL` | 可选，默认 `qwen-plus` |

5. Deploy 完成后即可用 `https://你的站点.netlify.app` 访问  

本地也可先试：`npx netlify dev`（会读本机 `.env`）。

> 不要只上传 `dist` 到纯静态空间——没有 Functions 时对话和设计评审会失败。

## 让其他人也能用（本机 / 服务器）

### 方式一：同一 Wi‑Fi / 局域网（最快）

1. 本机执行 `npm run dev`（已开启局域网访问）
2. 看终端里的 **Network** 地址，例如 `http://192.168.1.23:5173/`
3. 把这个地址发给同一网络下的同事即可

若打不开，检查 Windows 防火墙是否放行 Node，或临时关闭专用网络防火墙试一下。

生产模式（推荐给多人长期用本机当服务器）：

```bash
npm run build
npm start
```

默认监听 `0.0.0.0:4173`，同事访问 `http://你的局域网IP:4173`。

### 方式二：外网临时分享（本机开着，用穿透）

推荐用**生产模式**穿透（比 `npm run dev` 更稳）：

**终端 1**：

```bash
npm run build
npm start
```

**终端 2**：

```bash
npm run tunnel:prod
```

终端会打印类似 `your url is: https://xxxx.loca.lt` 的公网地址，发给同事即可（**不必连你的 Wi‑Fi**）。

首次打开会看到英文提示页：把页面上显示的 IP 原样填进输入框，再点 **Continue**，才会进入研知（每个访客大约 7 天提示一次）。

注意：你的电脑要保持开机，且两个终端都在跑。关掉任一窗口，外网链接就失效。

也可开发模式穿透（需已配置 `allowedHosts`）：`npm run dev` + `npm run tunnel`。

### 方式三：自建 Node 服务器（备选）

任意能跑 Node.js 的机器：

```bash
npm install
# 配置 .env 中的 DASHSCOPE_API_KEY
npm run build
npm start
```

| 变量 | 说明 | 默认 |
|------|------|------|
| `PORT` | 监听端口 | `4173` |
| `HOST` | 监听地址 | `0.0.0.0` |
| `DASHSCOPE_API_KEY` | 百炼 Key | 读 `.env` |
| `TONGYI_MODEL` | 模型名 | `qwen-plus` |
