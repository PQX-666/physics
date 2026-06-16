import { useState, useEffect, useRef, useMemo } from 'react'
import { formulas } from '../data/formulas'
import { mcQuestions, tfQuestions, fbQuestions } from '../data/questions'
import MathRenderer from './MathRenderer'

interface GlobalSearchProps {
  onNavigate: (page: string) => void
}

interface FormulaResult {
  type: 'formula'
  id: string
  name: string
  formula: string
  latex?: string
  chapter: string
  meaning: string
}

interface QuestionResult {
  type: 'question'
  qtype: string
  paper: string
  num: number
  text: string
}

type SearchResult = FormulaResult | QuestionResult

export default function GlobalSearch({ onNavigate }: GlobalSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    function handleOpen() { setOpen(true) }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('open-global-search', handleOpen)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-global-search', handleOpen)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const results = useMemo((): SearchResult[] => {
    if (!query.trim()) return []
    const q = query.toLowerCase()

    const formulaResults: FormulaResult[] = []
    for (const f of formulas) {
      const haystack = [f.name, f.formula, f.meaning, ...f.triggerKeywords].join(' ').toLowerCase()
      if (haystack.includes(q)) {
        formulaResults.push({
          type: 'formula', id: f.id, name: f.name,
          formula: f.formula, latex: f.latex, chapter: f.chapter, meaning: f.meaning,
        })
      }
      if (formulaResults.length >= 8) break
    }

    const questionResults: QuestionResult[] = []
    const allQ = [
      ...mcQuestions.map((q) => ({ qtype: '选择题', paper: q.paper, num: q.num, text: q.q + ' ' + (q.opts || []).join(' ') })),
      ...tfQuestions.map((q) => ({ qtype: '判断题', paper: q.paper, num: q.num, text: q.q })),
      ...fbQuestions.map((q) => ({ qtype: '填空题', paper: q.paper, num: q.num, text: q.q })),
    ]
    for (const item of allQ) {
      if (item.text.toLowerCase().includes(q)) {
        questionResults.push({ type: 'question', ...item })
      }
      if (questionResults.length >= 8) break
    }

    return [...formulaResults, ...questionResults]
  }, [query])

  const selected = results[selectedIdx]

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selected) handleSelect(selected)
    }
  }

  function handleSelect(r: SearchResult) {
    setOpen(false)
    if (r.type === 'formula') {
      sessionStorage.setItem('searchSelectFormula', r.id)
      onNavigate('library')
    } else {
      onNavigate('questions')
    }
  }

  useEffect(() => {
    setSelectedIdx(0)
  }, [results.length])

  const formulaCount = results.filter((r) => r.type === 'formula').length

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex items-start justify-center z-50 p-4 pt-[15vh]" onClick={() => setOpen(false)}>
      <div
        className="bg-[var(--card)] rounded-2xl shadow-xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-[var(--border)]">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索公式、题目... (Ctrl+K 打开)"
            className="w-full px-3 py-2 bg-[var(--bg)] rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        <div ref={listRef} className="max-h-[60vh] overflow-y-auto">
          {!query.trim() && (
            <div className="p-8 text-center">
              <div className="text-2xl mb-2">🔍</div>
              <p className="text-sm text-[var(--text-secondary)]">输入关键词搜索公式和题目</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">支持搜索公式名、关键词、题目内容</p>
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-[var(--text-muted)]">没有找到匹配的结果</p>
            </div>
          )}

          {results.length > 0 && (
            <div>
              {formulaCount > 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg)]">
                    公式 ({formulaCount})
                  </div>
                  {results.slice(0, formulaCount).map((r, i) => (
                    <button
                      key={r.type + (r as FormulaResult).id}
                      onClick={() => handleSelect(r)}
                      className={`w-full text-left px-4 py-3 hover:bg-[var(--bg)] transition-colors border-b border-[var(--border)] last:border-b-0 ${i === selectedIdx ? 'bg-[var(--primary-light)]' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[var(--text)]">{(r as FormulaResult).name}</span>
                        <span className="text-xs text-[var(--text-muted)]">{(r as FormulaResult).chapter}</span>
                      </div>
                      <div className="font-mono text-xs text-[var(--primary)] mt-0.5"><MathRenderer latex={(r as FormulaResult).latex} fallback={(r as FormulaResult).formula} /></div>
                    </button>
                  ))}
                </>
              )}

              {formulaCount < results.length && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg)]">
                    题目 ({results.length - formulaCount})
                  </div>
                  {results.slice(formulaCount).map((r, i) => {
                    const idx = formulaCount + i
                    const qr = r as QuestionResult
                    return (
                      <button
                        key={r.type + qr.paper + qr.num}
                        onClick={() => handleSelect(r)}
                        className={`w-full text-left px-4 py-3 hover:bg-[var(--bg)] transition-colors border-b border-[var(--border)] last:border-b-0 ${idx === selectedIdx ? 'bg-[var(--primary-light)]' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-[var(--border)] text-[var(--text-secondary)] px-1.5 py-0.5 rounded">{qr.qtype}</span>
                          <span className="text-xs text-[var(--text-muted)]">{qr.paper}卷 #{qr.num}</span>
                        </div>
                        <div className="text-sm text-[var(--text)] mt-0.5 line-clamp-2" dangerouslySetInnerHTML={{ __html: qr.text }} />
                      </button>
                    )
                  })}
                </>
              )}
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="px-4 py-2 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>↑↓ 导航 · Enter 打开</span>
            <span>Esc 关闭</span>
          </div>
        )}
      </div>
    </div>
  )
}
