import type { Plugin } from 'vite'
import { loadEnv } from 'vite'
import { createTongyiMiddleware } from './tongyiHandlers.mjs'

function attachApi(
  // Vite Connect server
  middlewares: { use: (fn: (...args: unknown[]) => void) => void },
  root: string,
  mode: string,
) {
  const env = loadEnv(mode, root, '')
  const apiKey = env.DASHSCOPE_API_KEY || ''
  const model = env.TONGYI_MODEL || 'qwen-plus'
  const handler = createTongyiMiddleware({ apiKey, model })
  middlewares.use((req, res, next) => {
    void handler(req as never, res as never, next as never)
  })
}

export function tongyiApiPlugin(): Plugin {
  return {
    name: 'tongyi-api',
    configureServer(server) {
      attachApi(server.middlewares, server.config.root, server.config.mode)
    },
    configurePreviewServer(server) {
      attachApi(server.middlewares, server.config.root, server.config.mode)
    },
  }
}
