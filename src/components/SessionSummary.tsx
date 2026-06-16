import { getFormulaById } from '../data/formulas'

interface ResultEntry { cardId: string; rating: number; isCorrect: boolean }

interface SessionSummaryProps {
  total: number
  correct: number
  wrong: number
  resultEntries?: ResultEntry[]
  onDone: () => void
  onRetryWrong?: () => void
}

export default function SessionSummary({ total, correct, wrong, resultEntries = [], onDone, onRetryWrong }: SessionSummaryProps) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
  const wrongEntries = resultEntries.filter((e) => !e.isCorrect)
  const weakEntries = resultEntries.filter((e) => e.rating <= 2)

  const suggestion = accuracy >= 80
    ? { emoji: '🎉', title: '表现很好！', tip: '已形成条件反射，可以挑战极速模式进一步提升速度', color: 'text-[var(--success)]' }
    : accuracy >= 60
    ? { emoji: '👍', title: '还不错', tip: '再练一轮巩固记忆，重点关注标红的薄弱公式', color: 'text-[var(--warning)]' }
    : { emoji: '💪', title: '继续加油', tip: '建议立即再练一轮，重点关注错误公式的适用条件和易错点', color: 'text-[var(--danger)]' }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-6 text-center">
        <div className="text-3xl mb-2">{suggestion.emoji}</div>
        <h2 className={`text-xl font-bold mb-1 ${suggestion.color}`}>{suggestion.title}</h2>
        <p className="text-sm text-[var(--text-secondary)]">{suggestion.tip}</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { v: total, l: '训练数', c: 'text-[var(--primary)]' },
          { v: correct, l: '正确', c: 'text-[var(--success)]' },
          { v: wrong, l: '错误', c: 'text-[var(--danger)]' },
          { v: `${accuracy}%`, l: '正确率', c: 'text-[var(--primary)]' },
        ].map((s) => (
          <div key={s.l} className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] py-3 text-center">
            <div className={`text-xl font-bold ${s.c}`}>{s.v}</div>
            <div className="text-xs text-[var(--text-secondary)] mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      {resultEntries.length > 0 && (
        <div className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-4">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-3">逐题回顾</h3>
          <div className="space-y-1">
            {resultEntries.map((entry, i) => {
              const card = getFormulaById(entry.cardId)
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm ${
                    !entry.isCorrect ? 'bg-red-50' : entry.rating <= 2 ? 'bg-orange-50' : 'bg-[var(--bg)]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-xs font-bold w-4 ${entry.isCorrect ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                      {entry.isCorrect ? '✓' : '✗'}
                    </span>
                    <span className="text-[var(--text)] truncate">{card?.name || entry.cardId}</span>
                  </div>
                  <span className={`text-xs font-medium ml-2 ${
                    entry.rating >= 4 ? 'text-[var(--success)]' : entry.rating === 3 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'
                  }`}>
                    {entry.rating}分
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {weakEntries.length > 0 && (
        <div className="bg-orange-50 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-[var(--warning)] mb-2">薄弱公式 ({weakEntries.length})</h3>
          <div className="flex flex-wrap gap-1.5">
            {weakEntries.map((e, i) => {
              const card = getFormulaById(e.cardId)
              return (
                <span key={i} className="text-xs bg-white text-[var(--warning)] px-2 py-1 rounded-lg border border-orange-200">
                  {card?.name || e.cardId}
                </span>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {wrongEntries.length > 0 && onRetryWrong && (
          <button
            onClick={onRetryWrong}
            className="flex-1 py-3 bg-[var(--danger)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            重练 {wrongEntries.length} 道错题
          </button>
        )}
        <button
          onClick={onDone}
          className="flex-1 py-3 bg-[var(--primary)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          返回
        </button>
      </div>
    </div>
  )
}
