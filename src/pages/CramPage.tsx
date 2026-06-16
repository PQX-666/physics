import { useState } from 'react'
import { formulas } from '../data/formulas'
import MathRenderer from '../components/MathRenderer'

export default function CramPage() {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set())
  const [tagFilter, setTagFilter] = useState<'five' | 'four' | 'three' | 'all'>('five')

  const filtered = formulas
    .filter((f) => f.tag && (tagFilter === 'all' || f.tag === tagFilter))
    .sort((a, b) => {
      const order = { five: 0, four: 1, three: 2 }
      return (order[a.tag as keyof typeof order] || 3) - (order[b.tag as keyof typeof order] || 3)
    })

  function toggleReveal(id: string) {
    const next = new Set(revealedIds)
    if (next.has(id)) next.delete(id); else next.add(id)
    setRevealedIds(next)
  }

  function revealAll() { setRevealedIds(new Set(filtered.map((f) => f.id))) }
  function hideAll() { setRevealedIds(new Set()) }

  const tagLabel = { five: '五星核心', four: '四星重点', three: '三星了解' }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--text)]">考前速查</h2>
        <div className="flex gap-1">
          <button onClick={revealAll} className="text-xs text-[var(--primary)] hover:underline">全部展开</button>
          <button onClick={hideAll} className="text-xs text-[var(--text-muted)] hover:underline">全部收起</button>
        </div>
      </div>

      <p className="text-xs text-[var(--text-muted)]">考前1小时冲刺 — 点击卡片翻转查看公式</p>

      <div className="flex gap-2">
        {(['five', 'four', 'three', 'all'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTagFilter(t); setRevealedIds(new Set()) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              tagFilter === t
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--card)] text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            {t === 'all' ? '全部' : tagLabel[t]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((f) => {
          const revealed = revealedIds.has(f.id)
          return (
            <div
              key={f.id}
              className="cursor-pointer"
              style={{ perspective: '800px' }}
              onClick={() => toggleReveal(f.id)}
            >
              <div
                className="relative w-full transition-transform duration-500"
                style={{
                  minHeight: '120px',
                  transformStyle: 'preserve-3d',
                  transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 bg-[var(--card)] rounded-xl border-2 border-[var(--border)] hover:border-[var(--primary)] p-4 flex flex-col justify-center"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-[var(--text)]">{f.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      f.tag === 'five' ? 'bg-red-50 text-[var(--danger)]' :
                      f.tag === 'four' ? 'bg-orange-50 text-[var(--warning)]' :
                      'bg-blue-50 text-[var(--primary)]'
                    }`}>
                      {f.tag === 'five' ? 'S' : f.tag === 'four' ? 'A' : 'B'}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-2">
                    {f.scene || '点击翻转查看公式'}
                  </div>
                </div>

                {/* Back */}
                <div
                  className="bg-[var(--card)] rounded-xl border-2 border-[var(--success)] p-4 space-y-2"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-[var(--text)]">{f.name}</span>
                    <span className="text-[10px] text-[var(--success)]">已翻转</span>
                  </div>
                  {f.latex && (
                    <div className="text-center py-2 px-2 bg-[var(--bg)] rounded-lg">
                      <MathRenderer latex={f.latex} className="text-base font-serif" />
                    </div>
                  )}
                  {f.plainExplanation && (
                    <div className="text-xs text-[var(--text-secondary)]">{f.plainExplanation}</div>
                  )}
                  {f.scene && (
                    <div className="text-xs text-[var(--primary)]">
                      <span className="font-medium">看到什么用它：</span>{f.scene}
                    </div>
                  )}
                  {f.mnemonic && (
                    <div className="text-xs text-[var(--warning)]">
                      <span className="font-medium">口诀：</span>{f.mnemonic}
                    </div>
                  )}
                  {f.trap && (
                    <div className="text-xs text-[var(--danger)]">
                      <span className="font-medium">⚠️ </span>{f.trap}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-sm text-[var(--text-muted)]">暂无该级别的公式</div>
      )}
    </div>
  )
}
