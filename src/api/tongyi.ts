import {
  buildRagContext,
  docsToAnswerMeta,
  retrieveDocs,
  reviewRulesText,
  runDesignReview,
  type ChatAnswer,
  type ReviewItem,
} from '../data/knowledge'

export async function askTongyi(question: string): Promise<ChatAnswer> {
  const docs = retrieveDocs(question)
  const hit = docs.length > 0
  const meta = hit ? docsToAnswerMeta(docs) : { sources: [], images: [] }

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      context: hit ? buildRagContext(docs) : '',
      kbHit: hit,
    }),
  })

  const data = (await res.json()) as { markdown?: string; error?: string; model?: string }
  if (!res.ok || data.error) {
    throw new Error(data.error || `请求失败 HTTP ${res.status}`)
  }

  const footer = data.model
    ? `\n\n---\n*由阿里云百炼（\`${data.model}\`）生成。*`
    : ''

  return {
    markdown: `${data.markdown ?? ''}${footer}`,
    sources: meta.sources,
    images: meta.images,
  }
}

export async function reviewWithTongyi(scheme: string): Promise<ReviewItem[]> {
  const docs = retrieveDocs(scheme, 4)
  const res = await fetch('/api/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      scheme,
      rules: reviewRulesText(),
      context: buildRagContext(docs),
    }),
  })

  const data = (await res.json()) as {
    items?: ReviewItem[]
    error?: string
  }

  if (!res.ok || data.error) {
    // 百炼失败时回退本地规则评审
    console.warn('百炼评审失败，回退本地规则:', data.error)
    return runDesignReview(scheme)
  }

  if (!Array.isArray(data.items) || data.items.length === 0) {
    return runDesignReview(scheme)
  }

  return data.items.map((item) => ({
    id: item.id,
    name: item.name,
    status: (['pass', 'risk', 'missing'].includes(item.status)
      ? item.status
      : 'risk') as ReviewItem['status'],
    detail: item.detail || '',
    relatedDocs: Array.isArray(item.relatedDocs) ? item.relatedDocs : [],
  }))
}
