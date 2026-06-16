import { formulas } from '../data/formulas'
import { getAllReviewStates, isBookmarked, toggleBookmark } from '../utils/storage'
import { toast } from './Toast'
import ProgressBar from './ProgressBar'
import MathRenderer from './MathRenderer'

interface FormulaListProps {
  searchQuery: string
  chapterFilter: string
  frequencyFilter: number
  bookmarkFilter: boolean
  sortBy: string
  onSelectFormula: (id: string) => void
}

export default function FormulaList({ searchQuery, chapterFilter, frequencyFilter, bookmarkFilter, sortBy, onSelectFormula }: FormulaListProps) {
  const reviewStates = getAllReviewStates()

  let filtered = formulas.filter((f) => {
    if (bookmarkFilter && !isBookmarked(f.id)) return false
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

  function handleBookmark(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    const added = toggleBookmark(id)
    toast(added ? '已收藏' : '已取消收藏', added ? 'success' : 'info')
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
        const bookmarked = isBookmarked(f.id)

        return (
          <button
            key={f.id}
            onClick={() => onSelectFormula(f.id)}
            className="w-full text-left bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-4 hover:shadow-[var(--shadow-md)] transition-shadow relative"
          >
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-[var(--text)]">{f.name}</h3>
                  {bookmarked && <span className="text-yellow-500 text-xs">⭐</span>}
                </div>
                <div className="font-mono text-[var(--primary)] text-sm mt-0.5"><MathRenderer latex={f.latex} fallback={f.formula} /></div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ml-2 shrink-0 ${statusStyle[status]}`}>{statusLabel[status]}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
              <span>{f.chapter}</span>
              {state && <span>复习 {state.reviewCount} 次</span>}
              {state?.wrongCount ? <span>错 {state.wrongCount} 次</span> : null}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1">
                <ProgressBar value={mastery} size="sm" color={mastery >= 80 ? 'green' : mastery >= 40 ? 'primary' : 'orange'} />
              </div>
              <span
                onClick={(e) => handleBookmark(e, f.id)}
                className={`text-sm cursor-pointer flex-shrink-0 hover:scale-110 transition-transform ${bookmarked ? 'text-yellow-500' : 'text-[var(--text-muted)]'}`}
              >
                {bookmarked ? '⭐' : '☆'}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
