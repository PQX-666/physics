import { getTodayStats, getAccuracy, getStreakDays, getWeakChapters, getWeakCards } from '../utils/stats'
import ProgressBar from './ProgressBar'

interface DashboardProps {
  onStartReview: () => void
  onStartSpeed: () => void
  onNavigate: (page: string) => void
}

export default function Dashboard({ onStartReview, onStartSpeed, onNavigate }: DashboardProps) {
  const stats = getTodayStats()
  const accuracy = getAccuracy()
  const streak = getStreakDays()
  const weakChapters = getWeakChapters()
  const weakCards = getWeakCards()

  const hasDueCards = stats.dueCount > 0
  const hasMistakes = weakCards.some((c) => c.errorRate > 0.5)

  function getSuggestion(): string {
    if (hasDueCards && stats.dueCount >= 5) return '建议先完成今日复习，巩固即将遗忘的公式。'
    if (hasMistakes && weakChapters.length > 0) return `「${weakChapters[0].chapter}」错误较多，建议针对性训练。`
    if (stats.masteredCount > stats.totalFormulas * 0.7) return '掌握度很高，可以针对剩余薄弱公式进行强化。'
    return '坚持每天复习，建立公式条件反射。'
  }

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { v: stats.dueCount, l: '待复习', c: 'text-[var(--danger)]' },
          { v: stats.masteredCount, l: '已掌握', c: 'text-[var(--success)]' },
          { v: `${accuracy}%`, l: '正确率', c: 'text-[var(--primary)]' },
          { v: streak, l: '连续天', c: 'text-[var(--warning)]' },
        ].map((s) => (
          <div key={s.l} className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] py-3 text-center">
            <div className={`text-xl font-bold ${s.c}`}>{s.v}</div>
            <div className="text-xs text-[var(--text-secondary)] mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Search trigger */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('open-global-search'))}
        className="w-full bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-3 flex items-center gap-3 text-left hover:shadow-[var(--shadow-md)] transition-shadow"
      >
        <span className="text-lg">🔍</span>
        <div className="flex-1">
          <div className="text-sm text-[var(--text-secondary)]">搜索公式或题目</div>
          <div className="text-xs text-[var(--text-muted)] mt-0.5">按名称、关键词查找</div>
        </div>
        <span className="text-xs bg-[var(--border)] text-[var(--text-muted)] px-2 py-1 rounded">Ctrl+K</span>
      </button>

      {/* Suggestion */}
      <div className="bg-[var(--primary-light)] rounded-2xl p-4 text-sm text-[var(--primary)] leading-relaxed">
        {getSuggestion()}
      </div>

      {/* Main actions */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={onStartReview} className="bg-[var(--primary)] text-white rounded-2xl p-4 hover:opacity-90 transition-opacity">
          <div className="font-semibold">今日复习</div>
          <div className="text-xs opacity-70 mt-0.5">{stats.dueCount > 0 ? `${stats.dueCount} 张待复习` : '已完成'}</div>
        </button>
        <button onClick={onStartSpeed} className="bg-[var(--primary-dark)] text-white rounded-2xl p-4 hover:opacity-90 transition-opacity">
          <div className="font-semibold">极速回忆</div>
          <div className="text-xs opacity-70 mt-0.5">训练触发速度</div>
        </button>
        <button onClick={() => onNavigate('exam')} className="bg-[var(--danger)] text-white rounded-2xl p-4 hover:opacity-90 transition-opacity">
          <div className="font-semibold">期末靶向</div>
          <div className="text-xs opacity-70 mt-0.5">高频考点冲刺</div>
        </button>
        <button onClick={() => onNavigate('library')} className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-4 hover:shadow-[var(--shadow-md)] transition-shadow">
          <div className="font-semibold text-[var(--text)]">公式库</div>
          <div className="text-xs text-[var(--text-secondary)] mt-0.5">浏览全部公式</div>
        </button>
      </div>

      {/* Weak chapters */}
      {weakChapters.length > 0 && (
        <div className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-4">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-3">薄弱章节</h3>
          <div className="space-y-3">
            {weakChapters.slice(0, 3).map((ch) => (
              <div key={ch.chapter}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[var(--text)]">{ch.chapter}</span>
                  <span className="text-[var(--text-secondary)]">{ch.avgMastery}%</span>
                </div>
                <ProgressBar value={ch.avgMastery} size="sm" color={ch.avgMastery < 40 ? 'red' : 'orange'} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
