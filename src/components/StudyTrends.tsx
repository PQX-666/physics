import { useMemo } from 'react'
import { getAllStudyLogs } from '../utils/storage'

interface DayData {
  date: string
  label: string
  count: number
  correct: number
}

export default function StudyTrends() {
  const days = useMemo((): DayData[] => {
    const logs = getAllStudyLogs()
    const map: Record<string, { count: number; correct: number }> = {}

    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000)
      const key = d.toISOString().split('T')[0]
      map[key] = { count: 0, correct: 0 }
    }

    for (const log of logs) {
      const key = log.createdAt.split('T')[0]
      if (map[key]) {
        map[key].count++
        if (log.isCorrect) map[key].correct++
      }
    }

    return Object.entries(map).map(([date, data]) => {
      const d = new Date(date)
      return {
        date,
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        count: data.count,
        correct: data.correct,
      }
    })
  }, [])

  const maxCount = Math.max(...days.map((d) => d.count), 1)

  return (
    <div className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-4">
      <h3 className="text-sm font-semibold text-[var(--text)] mb-4">14 天学习趋势</h3>

      {maxCount === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-[var(--text-muted)]">还没有学习记录</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">完成训练后这里会显示学习趋势</p>
        </div>
      ) : (
        <svg width="100%" height="180" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">
          {/* Y axis gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = 160 - ratio * 140
            return (
              <g key={ratio}>
                <line x1={40} y1={y} x2={390} y2={y} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3,3" />
                <text x={36} y={y + 4} textAnchor="end" className="text-[10px]" fill="var(--text-muted)">
                  {Math.round(ratio * maxCount)}
                </text>
              </g>
            )
          })}

          {/* Bars */}
          {days.map((d, i) => {
            const barW = 18
            const gap = (350 - days.length * barW) / (days.length - 1)
            const x = 42 + i * (barW + gap)
            const h = d.count > 0 ? (d.count / maxCount) * 140 : 0
            const y = 160 - h
            const isToday = d.date === new Date().toISOString().split('T')[0]
            return (
              <g key={d.date}>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={h}
                  rx={3}
                  fill={isToday ? 'var(--primary)' : 'var(--primary)'}
                  fillOpacity={isToday ? 0.9 : 0.4}
                />
                {/* Accuracy indicator for days with activity */}
                {d.count > 0 && (
                  <circle
                    cx={x + barW / 2}
                    cy={y - 8}
                    r={4}
                    fill={d.correct / d.count >= 0.7 ? 'var(--success)' : d.correct / d.count >= 0.4 ? 'var(--warning)' : 'var(--danger)'}
                  />
                )}
                <text x={x + barW / 2} y={175} textAnchor="middle" className="text-[10px]" fill="var(--text-muted)">{d.label}</text>
                {d.count > 0 && (
                  <text x={x + barW / 2} y={y - 14} textAnchor="middle" className="text-[10px] font-semibold" fill="var(--text-secondary)">
                    {d.count}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      )}

      <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-muted)] justify-center">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[var(--primary)] opacity-40" />
          <span>复习量</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--success)]" />
          <span>≥70% 正确率</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--warning)]" />
          <span>40-70%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--danger)]" />
          <span>&lt;40%</span>
        </div>
      </div>
    </div>
  )
}
