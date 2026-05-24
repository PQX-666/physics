import { useState } from 'react'
import { ERROR_REASON_LABELS } from '../types/formula'
import { getWeakChapters, getWeakCards, getCommonErrorReasons, getConfusionPairs } from '../utils/stats'
import ProgressBar from '../components/ProgressBar'

export default function WeaknessPage() {
  const [activeTab, setActiveTab] = useState<'chapters' | 'cards' | 'reasons'>('chapters')

  const weakChapters = getWeakChapters()
  const weakCards = getWeakCards()
  const commonReasons = getCommonErrorReasons()
  const confusionPairs = getConfusionPairs()

  const tabs = [
    { id: 'chapters' as const, label: '薄弱章节', count: weakChapters.length },
    { id: 'cards' as const, label: '易错公式', count: weakCards.filter((c) => c.errorRate > 0).length },
    { id: 'reasons' as const, label: '常见错因', count: commonReasons.length },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[var(--text)]">薄弱分析</h2>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[var(--primary)] text-white'
                : 'bg-white text-[var(--text-secondary)] shadow-[var(--shadow-sm)] hover:bg-[var(--bg)]'
            }`}
          >
            {tab.label} {tab.count}
          </button>
        ))}
      </div>

      {activeTab === 'chapters' && (
        <div className="space-y-3">
          {weakChapters.length === 0 && <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-8 text-center text-[var(--text-muted)]">还没有学习数据</div>}
          {weakChapters.map((ch) => (
            <div key={ch.chapter} className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-[var(--text)]">{ch.chapter}</h3>
                <span className="text-xs text-[var(--text-secondary)]">{ch.formulaCount} 公式 · 错误 {ch.errorCount} 次</span>
              </div>
              <ProgressBar value={ch.avgMastery} color={ch.avgMastery < 30 ? 'red' : ch.avgMastery < 60 ? 'orange' : 'primary'} />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'cards' && (
        <div className="space-y-1.5">
          {weakCards.filter((c) => c.errorRate > 0).length === 0 && <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-8 text-center text-[var(--text-muted)]">还没有错误记录</div>}
          {weakCards.filter((c) => c.errorRate > 0).map(({ card }) => (
            <div key={card.id} className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-[var(--text)]">{card.name}</h3>
                  <div className="font-mono text-[var(--primary)] text-sm">{card.formula}</div>
                </div>
                <span className="text-xs text-[var(--text-muted)]">{card.chapter}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reasons' && (
        <div className="space-y-3">
          {commonReasons.length === 0 && <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-8 text-center text-[var(--text-muted)]">还没有错因记录</div>}
          {commonReasons.map(({ reason, count }) => (
            <div key={reason} className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[var(--text)]">{ERROR_REASON_LABELS[reason]}</span>
                <span className="text-sm font-semibold text-[var(--text)]">{count} 次</span>
              </div>
              <ProgressBar value={count} max={Math.max(...commonReasons.map((r) => r.count), 1)} size="sm" color="orange" />
            </div>
          ))}

          {confusionPairs.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-[var(--text)] mb-2">容易混淆的公式组</h3>
              {confusionPairs.map(({ pair, errorCount }) => (
                <div key={pair.join('vs')} className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-3 mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--primary)] font-medium">{pair[0]} &harr; {pair[1]}</span>
                    <span className="text-xs text-[var(--text-muted)]">{errorCount} 次混淆</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
