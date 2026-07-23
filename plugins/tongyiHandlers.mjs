/**
 * 通义百炼 API 处理逻辑（Vite 插件、生产 server、Netlify Functions 共用）
 */

/**
 * @param {import('node:http').IncomingMessage} req
 * @returns {Promise<string>}
 */
export function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

/**
 * @param {import('node:http').ServerResponse} res
 * @param {number} status
 * @param {unknown} data
 */
export function sendJson(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

/**
 * @param {string} apiKey
 * @param {string} model
 * @param {{ role: string, content: string }[]} messages
 */
export async function callTongyi(apiKey, model, messages) {
  const res = await fetch(
    'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.2,
      }),
    },
  )

  const raw = await res.text()
  let data
  try {
    data = JSON.parse(raw)
  } catch {
    throw new Error(`百炼返回非 JSON：${raw.slice(0, 200)}`)
  }

  if (!res.ok) {
    throw new Error(data.error?.message || `百炼请求失败 HTTP ${res.status}`)
  }

  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) throw new Error('百炼返回空内容')
  return content
}

/**
 * @param {{ apiKey: string, model: string, body: Record<string, unknown> }} opts
 * @returns {Promise<{ status: number, data: Record<string, unknown> }>}
 */
export async function handleChat({ apiKey, model, body }) {
  if (!apiKey) {
    return {
      status: 400,
      data: {
        error:
          '未配置 DASHSCOPE_API_KEY。请在本地 .env 或 Netlify 环境变量中填入阿里云百炼 API Key。',
      },
    }
  }

  const question = String(body.question ?? '').trim()
  if (!question) return { status: 400, data: { error: '缺少 question' } }

  const kbHit = Boolean(body.kbHit) && Boolean(String(body.context ?? '').trim())
  const context = kbHit ? String(body.context) : ''

  try {
    const markdown = await callTongyi(apiKey, model, [
      {
        role: 'system',
        content: kbHit
          ? `你是「研知」——冰箱柜海外产品开发知识助手。

【作答规则】（本次已命中知识库）
1. 用 Markdown，结构清晰，面向研发工程师。
2. 只依据下方知识库检索结果作答，并引用编号（如 SPEC-RF-001）。
3. 不要编造知识库中不存在的规范数值。
4. 禁止输出「补充说明」「基于模型能力」等知识库以外的发挥。`
          : `你是「研知」——冰箱柜海外产品开发知识助手。

【作答规则】（本次知识库未命中）
1. 用 Markdown，结构清晰，直接回答用户问题。
2. 开头用一句话说明：「当前知识库未收录该点。」
3. 然后必须用你自身的通用知识与工程经验给出完整、有用的解答（例如价格区间、影响因素、如何查询等），不要只写一句「未收录」就结束。
4. 结尾标注：「供参考，请人工核对后再用于设计。」
5. 禁止引用任何知识库编号，禁止提及蒸发器、门封等与问题无关的规范内容。`,
      },
      {
        role: 'user',
        content: kbHit
          ? `【知识库检索结果】\n${context}\n\n【用户问题】\n${question}`
          : `【知识库状态】未命中相关文档（请勿引用知识库）\n\n【用户问题】\n${question}`,
      },
    ])

    return { status: 200, data: { markdown, model } }
  } catch (e) {
    return {
      status: 500,
      data: { error: e instanceof Error ? e.message : '百炼调用失败' },
    }
  }
}

/**
 * @param {{ apiKey: string, model: string, body: Record<string, unknown> }} opts
 * @returns {Promise<{ status: number, data: Record<string, unknown> }>}
 */
export async function handleReview({ apiKey, model, body }) {
  if (!apiKey) {
    return {
      status: 400,
      data: {
        error:
          '未配置 DASHSCOPE_API_KEY。请在本地 .env 或 Netlify 环境变量中填入阿里云百炼 API Key。',
      },
    }
  }

  const scheme = String(body.scheme ?? '').trim()
  if (!scheme) return { status: 400, data: { error: '缺少 scheme' } }

  try {
    const content = await callTongyi(apiKey, model, [
      {
        role: 'system',
        content: `你是设计评审智能体。根据评审规则与知识库，核对总体设计方案。
只输出 JSON 数组，不要 Markdown，不要其它说明。数组元素格式：
{"id":"R1","name":"条目名","status":"pass|risk|missing","detail":"说明","relatedDocs":["文档ID"]}
status 含义：pass=已满足，risk=提到但不充分，missing=未覆盖。`,
      },
      {
        role: 'user',
        content: `【评审规则】\n${body.rules || ''}\n\n【相关知识库】\n${body.context || ''}\n\n【总体设计方案】\n${scheme}`,
      },
    ])

    const jsonText = content.replace(/^```json\s*|\s*```$/g, '').trim()
    const items = JSON.parse(jsonText)
    return { status: 200, data: { items, model } }
  } catch (e) {
    return {
      status: 500,
      data: { error: e instanceof Error ? e.message : '百炼评审失败' },
    }
  }
}

/**
 * @param {{ apiKey: string, model: string }} opts
 * @returns {(req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse, next: () => void) => Promise<void>}
 */
export function createTongyiMiddleware({ apiKey, model }) {
  return async (req, res, next) => {
    if (req.method !== 'POST') return next()

    const url = req.url?.split('?')[0]

    if (url === '/api/chat') {
      let body
      try {
        body = JSON.parse(await readBody(req))
      } catch {
        return sendJson(res, 400, { error: '请求体不是合法 JSON' })
      }
      const result = await handleChat({ apiKey, model, body })
      return sendJson(res, result.status, result.data)
    }

    if (url === '/api/review') {
      let body
      try {
        body = JSON.parse(await readBody(req))
      } catch {
        return sendJson(res, 400, { error: '请求体不是合法 JSON' })
      }
      const result = await handleReview({ apiKey, model, body })
      return sendJson(res, result.status, result.data)
    }

    return next()
  }
}
