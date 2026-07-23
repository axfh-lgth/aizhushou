import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { askTongyi, reviewWithTongyi } from './api/tongyi'
import { getKnowledgeBase } from './data/kbStore'
import { sampleScheme, type ChatAnswer, type ReviewItem } from './data/knowledge'
import KnowledgePanel from './KnowledgePanel'
import './App.css'

type Mode = 'ask' | 'review' | 'kb'

type Message = {
  id: string
  role: 'user' | 'assistant'
  text?: string
  answer?: ChatAnswer
}

const suggestions = [
  '海外机型蒸发器弯径有什么要求？',
  '门封压缩量标准是多少？',
  '压缩机减振垫硬度怎么选？',
  '化霜排水容易出什么问题？',
  '展示柜玻璃门除雾要注意什么？',
  '抽屉导轨卡滞怎么改？',
]

function statusLabel(status: ReviewItem['status']) {
  if (status === 'pass') return '通过'
  if (status === 'risk') return '风险'
  return '缺失'
}

export default function App() {
  const [mode, setMode] = useState<Mode>('ask')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      answer: {
        markdown: `你好，我是研知 —— 海外产品开发知识助手。

有知识库命中时，只按知识库作答并标明出处；未收录时会说明，并仅给出模型解答。也可切换到设计评审。`,
        sources: [],
        images: [],
      },
    },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [scheme, setScheme] = useState(sampleScheme)
  const [reviewItems, setReviewItems] = useState<ReviewItem[] | null>(null)
  const [reviewing, setReviewing] = useState(false)
  const [activeDoc, setActiveDoc] = useState(() => getKnowledgeBase()[0]?.id ?? '')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  async function ask(q: string) {
    const question = q.trim()
    if (!question || thinking) return
    setInput('')
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text: question }])
    setThinking(true)
    try {
      const answer = await askTongyi(question)
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', answer },
      ])
    } catch (e) {
      const msg = e instanceof Error ? e.message : '百炼调用失败'
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          answer: {
            markdown: `调用失败

${msg}

请稍后重试，或联系管理员检查服务配置。`,
            sources: [],
            images: [],
          },
        },
      ])
    } finally {
      setThinking(false)
    }
  }

  async function onReview() {
    if (!scheme.trim() || reviewing) return
    setReviewing(true)
    try {
      setReviewItems(await reviewWithTongyi(scheme))
    } catch {
      setReviewItems(null)
    } finally {
      setReviewing(false)
    }
  }

  const reviewSummary = useMemo(() => {
    if (!reviewItems) return null
    const pass = reviewItems.filter((i) => i.status === 'pass').length
    const risk = reviewItems.filter((i) => i.status === 'risk').length
    const missing = reviewItems.filter((i) => i.status === 'missing').length
    return { pass, risk, missing, total: reviewItems.length }
  }, [reviewItems])

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-brand">
          <div className="logo" aria-hidden>
            <span>研</span>
          </div>
          <div>
            <p className="eyebrow">冰箱柜事业部 · 海外产品经营体</p>
            <h1>研知</h1>
            <p className="tagline">开发 AI 助手 · 知识问答与设计评审</p>
          </div>
        </div>
        <nav className="tabs" aria-label="功能切换">
          <button
            className={mode === 'ask' ? 'tab active' : 'tab'}
            onClick={() => setMode('ask')}
            type="button"
          >
            知识问答
          </button>
          <button
            className={mode === 'review' ? 'tab active' : 'tab'}
            onClick={() => setMode('review')}
            type="button"
          >
            设计评审
          </button>
          <button
            className={mode === 'kb' ? 'tab active' : 'tab'}
            onClick={() => setMode('kb')}
            type="button"
          >
            知识库
          </button>
        </nav>
      </header>

      <main className="stage">
        {mode === 'ask' && (
          <section className="panel chat-panel" aria-label="知识问答">
            <div className="panel-head">
              <h2>对知识库提问</h2>
              <p>有知识库则只引用知识库；没有时才用模型解答。</p>
            </div>
            <div className="messages" ref={listRef}>
              {messages.map((m) => (
                <article
                  key={m.id}
                  className={m.role === 'user' ? 'bubble user' : 'bubble assistant'}
                >
                  {m.role === 'user' ? (
                    <p>{m.text}</p>
                  ) : (
                    <>
                      <div className="md">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            strong: ({ children }) => <span>{children}</span>,
                          }}
                        >
                          {m.answer?.markdown ?? ''}
                        </ReactMarkdown>
                      </div>
                      {!!m.answer?.images.length && (
                        <div className="image-grid">
                          {m.answer.images.map((img) => (
                            <figure key={`${img.from}-${img.caption}`}>
                              <div
                                className="kb-svg"
                                dangerouslySetInnerHTML={{ __html: img.svg }}
                              />
                              <figcaption>
                                {img.caption}
                                <span> · 来源 {img.from}</span>
                              </figcaption>
                            </figure>
                          ))}
                        </div>
                      )}
                      {!!m.answer?.sources.length && (
                        <div className="sources">
                          <h3>出处</h3>
                          <ul>
                            {m.answer.sources.map((s) => (
                              <li key={s.id}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDoc(s.id)
                                    setMode('kb')
                                  }}
                                >
                                  <span className="src-id">{s.id}</span>
                                  <span>{s.title}</span>
                                  <em>{s.category}</em>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </article>
              ))}
              {thinking && (
                <div className="bubble assistant thinking">
                  <span />
                  <span />
                  <span />
                  正在思考中…
                </div>
              )}
            </div>
            <div className="suggest">
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => ask(s)}>
                  {s}
                </button>
              ))}
            </div>
            <form
              className="composer"
              onSubmit={(e) => {
                e.preventDefault()
                ask(input)
              }}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="例如：欧洲机型冷凝器改模有哪些经验？"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    ask(input)
                  }
                }}
              />
              <button type="submit" disabled={!input.trim() || thinking}>
                提问
              </button>
            </form>
          </section>
        )}

        {mode === 'review' && (
          <section className="panel review-panel" aria-label="设计评审">
            <div className="panel-head">
              <h2>总体方案合规核对</h2>
              <p>按评审规则输出需核对条目，用作评审智能体。</p>
            </div>
            <div className="review-grid">
              <div className="scheme-box">
                <label htmlFor="scheme">粘贴总体设计方案</label>
                <textarea
                  id="scheme"
                  value={scheme}
                  onChange={(e) => setScheme(e.target.value)}
                  rows={16}
                />
                <div className="review-actions">
                  <button type="button" className="ghost" onClick={() => setScheme(sampleScheme)}>
                    载入示例方案
                  </button>
                  <button type="button" onClick={onReview} disabled={reviewing || !scheme.trim()}>
                    {reviewing ? '核对中…' : '开始评审'}
                  </button>
                </div>
              </div>
              <div className="review-result">
                {!reviewItems && !reviewing && (
                  <div className="empty">
                    <p>提交方案后，将按 6 项规则输出通过 / 风险 / 缺失清单。</p>
                  </div>
                )}
                {reviewing && <div className="empty shimmer">规则引擎正在扫描方案…</div>}
                {reviewItems && reviewSummary && (
                  <>
                    <div className="summary-cards">
                      <div>
                        <strong>{reviewSummary.pass}</strong>
                        <span>通过</span>
                      </div>
                      <div className="warn">
                        <strong>{reviewSummary.risk}</strong>
                        <span>风险</span>
                      </div>
                      <div className="danger">
                        <strong>{reviewSummary.missing}</strong>
                        <span>缺失</span>
                      </div>
                    </div>
                    <ul className="checklist">
                      {reviewItems.map((item) => (
                        <li key={item.id} className={item.status}>
                          <div className="check-top">
                            <span className="badge">{statusLabel(item.status)}</span>
                            <h3>
                              {item.id} · {item.name}
                            </h3>
                          </div>
                          <p>{item.detail}</p>
                          {!!item.relatedDocs.length && (
                            <p className="related">
                              相关规范：
                              {item.relatedDocs.map((id) => (
                                <button
                                  key={id}
                                  type="button"
                                  onClick={() => {
                                    setActiveDoc(id)
                                    setMode('kb')
                                  }}
                                >
                                  {id}
                                </button>
                              ))}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="md review-md">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {`### 评审结论（MD）
| 条目 | 状态 | 说明 |
| --- | --- | --- |
${reviewItems
  .map((i) => `| ${i.name} | ${statusLabel(i.status)} | ${i.detail} |`)
  .join('\n')}

建议：风险与缺失项在图纸定稿前完成整改，以降低改模与返工。`}
                      </ReactMarkdown>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {mode === 'kb' && (
          <KnowledgePanel activeDocId={activeDoc} onSelect={setActiveDoc} />
        )}
      </main>

      <footer className="foot">
        <span>目标用户：开发人员 · 演示环境</span>
      </footer>
    </div>
  )
}
