import { seedKnowledgeBase, type KnowledgeDoc } from './knowledge'

const STORAGE_KEY = 'yanzhi-kb-v2'

type Listener = (docs: KnowledgeDoc[]) => void

let cache: KnowledgeDoc[] | null = null
const listeners = new Set<Listener>()

function cloneSeed(): KnowledgeDoc[] {
  return structuredClone(seedKnowledgeBase)
}

function readStorage(): KnowledgeDoc[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as KnowledgeDoc[]
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

function writeStorage(docs: KnowledgeDoc[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
}

function emit() {
  const docs = getKnowledgeBase()
  listeners.forEach((fn) => fn(docs))
}

export function getKnowledgeBase(): KnowledgeDoc[] {
  if (!cache) {
    cache = readStorage() ?? cloneSeed()
  }
  return cache
}

export function setKnowledgeBase(docs: KnowledgeDoc[]) {
  cache = docs
  writeStorage(docs)
  emit()
}

export function upsertDoc(doc: KnowledgeDoc) {
  const list = [...getKnowledgeBase()]
  const idx = list.findIndex((d) => d.id === doc.id)
  if (idx >= 0) list[idx] = doc
  else list.unshift(doc)
  setKnowledgeBase(list)
}

export function removeDoc(id: string) {
  setKnowledgeBase(getKnowledgeBase().filter((d) => d.id !== id))
}

export function resetKnowledgeBase() {
  setKnowledgeBase(cloneSeed())
}

export function subscribeKnowledgeBase(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function makeDocId(): string {
  const n = Date.now().toString(36).toUpperCase()
  return `DOC-${n.slice(-6)}`
}
