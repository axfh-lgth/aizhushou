/**
 * 生产服务器：托管 dist 静态资源 + /api/chat、/api/review
 * 用法：npm run build && npm start
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createTongyiMiddleware } from './plugins/tongyiHandlers.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, 'dist')
const PORT = Number(process.env.PORT) || 4173
const HOST = process.env.HOST || '0.0.0.0'

/** 从 .env 加载到 process.env（不覆盖已有环境变量） */
function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return
  const text = fs.readFileSync(filePath, 'utf8')
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = val
  }
}

loadDotEnv(path.join(__dirname, '.env'))

const apiKey = process.env.DASHSCOPE_API_KEY || ''
const model = process.env.TONGYI_MODEL || 'qwen-plus'
const apiHandler = createTongyiMiddleware({ apiKey, model })

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
}

function safeJoin(root, reqPath) {
  const decoded = decodeURIComponent(reqPath.split('?')[0])
  const cleaned = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '')
  const full = path.join(root, cleaned)
  if (!full.startsWith(root)) return null
  return full
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase()
  res.statusCode = 200
  res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream')
  fs.createReadStream(filePath).pipe(res)
}

function serveStatic(req, res) {
  if (!fs.existsSync(DIST)) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('未找到 dist 目录，请先执行 npm run build')
    return
  }

  const urlPath = req.url?.split('?')[0] || '/'
  let filePath = safeJoin(DIST, urlPath === '/' ? '/index.html' : urlPath)
  if (!filePath) {
    res.statusCode = 403
    res.end('Forbidden')
    return
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return sendFile(res, filePath)
  }

  // SPA fallback
  const index = path.join(DIST, 'index.html')
  if (fs.existsSync(index)) return sendFile(res, index)

  res.statusCode = 404
  res.end('Not Found')
}

const server = http.createServer((req, res) => {
  void apiHandler(req, res, () => serveStatic(req, res))
})

server.listen(PORT, HOST, () => {
  const lanHint =
    HOST === '0.0.0.0' || HOST === '::'
      ? `本机 http://127.0.0.1:${PORT}  |  局域网用本机 IP:${PORT}`
      : `http://${HOST}:${PORT}`
  console.log(`研知已启动 → ${lanHint}`)
  if (!apiKey) {
    console.warn('警告：未配置 DASHSCOPE_API_KEY，对话接口将不可用')
  }
})
