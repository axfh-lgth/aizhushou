import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { KnowledgeDoc } from './data/knowledge'
import {
  getKnowledgeBase,
  makeDocId,
  removeDoc,
  resetKnowledgeBase,
  subscribeKnowledgeBase,
  today,
  upsertDoc,
} from './data/kbStore'

type FormState = {
  id: string
  title: string
  category: string
  tags: string
  summary: string
  content: string
}

const emptyForm = (): FormState => ({
  id: makeDocId(),
  title: '',
  category: '设计规范',
  tags: '',
  summary: '',
  content: '',
})

function toForm(doc: KnowledgeDoc): FormState {
  return {
    id: doc.id,
    title: doc.title,
    category: doc.category,
    tags: doc.tags.join('、'),
    summary: doc.summary,
    content: doc.content,
  }
}

type Props = {
  activeDocId: string
  onSelect: (id: string) => void
}

export default function KnowledgePanel({ activeDocId, onSelect }: Props) {
  const [docs, setDocs] = useState<KnowledgeDoc[]>(() => getKnowledgeBase())
  const [editing, setEditing] = useState(false)
  const [isNew, setIsNew] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => subscribeKnowledgeBase(setDocs), [])

  const doc = useMemo(
    () => docs.find((d) => d.id === activeDocId) ?? docs[0],
    [docs, activeDocId],
  )

  useEffect(() => {
    if (!docs.length) return
    if (!docs.some((d) => d.id === activeDocId)) {
      onSelect(docs[0].id)
    }
  }, [docs, activeDocId, onSelect])

  function startCreate() {
    setIsNew(true)
    setEditing(true)
    setError('')
    setForm(emptyForm())
  }

  function startEdit() {
    if (!doc) return
    setIsNew(false)
    setEditing(true)
    setError('')
    setForm(toForm(doc))
  }

  function cancelEdit() {
    setEditing(false)
    setError('')
  }

  function save() {
    const title = form.title.trim()
    const id = form.id.trim()
    const content = form.content.trim()
    if (!id || !title || !content) {
      setError('编号、标题、正文为必填项')
      return
    }
    if (isNew && docs.some((d) => d.id === id)) {
      setError(`编号 ${id} 已存在，请更换`)
      return
    }
    if (!isNew && form.id !== doc?.id && docs.some((d) => d.id === id)) {
      setError(`编号 ${id} 已存在，请更换`)
      return
    }

    const next: KnowledgeDoc = {
      id,
      title,
      category: form.category.trim() || '未分类',
      tags: form.tags
        .split(/[,，、\s]+/)
        .map((t) => t.trim())
        .filter(Boolean),
      summary: form.summary.trim() || title,
      content,
      updatedAt: today(),
      images: !isNew && doc?.id === id ? doc.images : undefined,
    }

    // 若改了旧文档编号，先删旧再写新
    if (!isNew && doc && doc.id !== id) {
      removeDoc(doc.id)
    }
    upsertDoc(next)
    onSelect(next.id)
    setEditing(false)
    setError('')
  }

  function onDelete() {
    if (!doc) return
    if (!window.confirm(`确认删除「${doc.title}」？`)) return
    const rest = docs.filter((d) => d.id !== doc.id)
    removeDoc(doc.id)
    if (rest[0]) onSelect(rest[0].id)
  }

  function onReset() {
    if (!window.confirm('恢复为内置示例知识库？当前自定义内容会被覆盖。')) return
    resetKnowledgeBase()
    const list = getKnowledgeBase()
    if (list[0]) onSelect(list[0].id)
    setEditing(false)
  }

  return (
    <section className="panel kb-panel" aria-label="知识库">
      <div className="panel-head kb-head">
        <div>
          <h2>知识库管理</h2>
          <p>可新增 / 编辑 / 删除，保存在本机浏览器（localStorage）</p>
        </div>
        <div className="kb-toolbar">
          <button type="button" className="ghost" onClick={onReset}>
            恢复示例
          </button>
          <button type="button" onClick={startCreate}>
            新增文档
          </button>
        </div>
      </div>

      <div className="kb-layout">
        <aside>
          {docs.length === 0 && (
            <p className="kb-empty-hint">知识库为空，请点击「新增文档」</p>
          )}
          {docs.map((d) => (
            <button
              key={d.id}
              type="button"
              className={d.id === doc?.id ? 'kb-item active' : 'kb-item'}
              onClick={() => {
                onSelect(d.id)
                setEditing(false)
              }}
            >
              <span className="cat">{d.category}</span>
              <strong>{d.title}</strong>
              <em>{d.id}</em>
            </button>
          ))}
        </aside>

        {editing ? (
          <form
            className="kb-form"
            onSubmit={(e) => {
              e.preventDefault()
              save()
            }}
          >
            <div className="kb-form-grid">
              <label>
                编号
                <input
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  placeholder="如 SPEC-RF-020"
                />
              </label>
              <label>
                分类
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option>设计规范</option>
                  <option>项目经验</option>
                  <option>评审规则</option>
                  <option>其他</option>
                </select>
              </label>
            </div>
            <label>
              标题
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="文档标题"
              />
            </label>
            <label>
              标签（顿号或逗号分隔）
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="蒸发器、管路、海外"
              />
            </label>
            <label>
              摘要
              <input
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                placeholder="一句话说明"
              />
            </label>
            <label>
              正文（支持 Markdown）
              <textarea
                rows={14}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="写入规范条款、经验复盘等内容…"
              />
            </label>
            {error && <p className="kb-form-error">{error}</p>}
            <div className="kb-form-actions">
              <button type="button" className="ghost" onClick={cancelEdit}>
                取消
              </button>
              <button type="submit">{isNew ? '创建' : '保存修改'}</button>
            </div>
          </form>
        ) : doc ? (
          <article className="kb-detail">
            <header>
              <div className="kb-detail-actions">
                <button type="button" className="ghost" onClick={startEdit}>
                  编辑
                </button>
                <button type="button" className="danger-btn" onClick={onDelete}>
                  删除
                </button>
              </div>
              <p className="meta">
                {doc.category} · 更新于 {doc.updatedAt}
              </p>
              <h3>{doc.title}</h3>
              <p className="summary">{doc.summary}</p>
              <div className="tags">
                {doc.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </header>
            <div className="md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.content}</ReactMarkdown>
            </div>
            {!!doc.images?.length && (
              <div className="image-grid">
                {doc.images.map((img) => (
                  <figure key={img.caption}>
                    <div
                      className="kb-svg"
                      dangerouslySetInnerHTML={{ __html: img.svg }}
                    />
                    <figcaption>{img.caption}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </article>
        ) : (
          <div className="kb-detail empty-doc">暂无文档</div>
        )}
      </div>
    </section>
  )
}
