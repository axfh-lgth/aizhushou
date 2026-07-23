import { handleChat } from '../../plugins/tongyiHandlers.mjs'

const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8' }

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: jsonHeaders, body: '' }
  }
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: jsonHeaders,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    }
  }

  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ error: '请求体不是合法 JSON' }),
    }
  }

  const apiKey = process.env.DASHSCOPE_API_KEY || ''
  const model = process.env.TONGYI_MODEL || 'qwen-plus'
  const result = await handleChat({ apiKey, model, body })

  return {
    statusCode: result.status,
    headers: jsonHeaders,
    body: JSON.stringify(result.data),
  }
}
