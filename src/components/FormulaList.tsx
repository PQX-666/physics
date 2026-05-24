import { formulas } from '../data/formulas'
import { getAllReviewStates } from '../utils/storage'
import ProgressBar from './ProgressBar'

interface FormulaListProps {
  searchQuery: string
  chapterFilter: string
  frequencyFilter: number
  sortBy: string
  onSelectFormula: (id: string) => void
}

export default function FormulaList({ searchQuery, chapterFilter, frequencyFilter, sortBy, onSelectFormula }: FormulaListProps) {
  const reviewStates = getAllReviewStates()

  let filtered = formulas.filter((f) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!f.name.includes(q) && !f.triggerKeywords.some((k) => k.includes(q)) && !f.formula.toLowerCase().includes(q)) return false
    }
    if (chapterFilter && f.chapter !== chapterFilter) return false
    if (f.frequency < frequencyFilter) return false
    return true
  })

  switch (sortBy) {
    case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name, 'zh')); break
    case 'frequency': filtered.sort((a, b) => b.frequency - a.frequency); break
    case 'mastery': filtered.sort((a, b) => (reviewStates[a.id]?.masteryLevel || 0) - (reviewStates[b.id]?.masteryLevel || 0)); break
    case 'errors': filtered.sort((a, b) => (reviewStates[b.id]?.wrongCount || 0) - (reviewStates[a.id]?.wrongCount || 0)); break
  }

  return (
    <div className="space-y-1.5">
      {filtered.length === 0 && <p className="text-center text-[var(--text-muted)] py-12">没有匹配的公式</p>}
      {filtered.map((f) => {
        const state = reviewStates[f.id]
        const mastery = state?.masteryLevel || 0
        const status = state?.status || 'new'
        const statusStyle: Record<string, string> = {
          new: 'bg-[var(--border)] text-[var(--text-secondary)]',
          learning: 'bg-orange-100 text-orange-700',
          reviewing: 'bg-[var(--primary-light)] text-[var(--primary)]',
          mastered: 'bg-green-100 text-[var(--success)]',
        }
        const statusLabel: Record<string, string> = { new: '新', learning: '学习中', reviewing: '复习中', mastered: '已掌握' }

        return (
          <button
            key={f.id}
            onClick={() => onSelectFormula(f.id)}
            className="w-full text-left bg-white rounded-2xl shadow-[var(--shadow-sm)] p-4 hover:shadow-[var(--shadow-md)] transition-shadow"
          >
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[var(--text)]">{f.name}</h3>
                <div className="font-mono text-[var(--primary)] text-sm mt-0.5">{f.formula}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ml-2 shrink-0 ${statusStyle[status]}`}>{statusLabel[status]}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
              <span>{f.chapter}</span>
              {state && <span>复习 {state.reviewCount} 次</span>}
              {state?.wrongCount ? <span>错 {state.wrongCount} 次</span> : null}
            </div>
            <div className="mt-2">
              <ProgressBar value={mastery} size="sm" color={mastery >= 80 ? 'green' : mastery >= 40 ? 'primary' : 'orange'} />
            </div>
          </button>
        )
      })}
    </div>
  )
}
