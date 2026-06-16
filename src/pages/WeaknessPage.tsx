import { useState } from 'react'
import { ERROR_REASON_LABELS } from '../types/formula'
import { getWeakChapters, getWeakCards, getCommonErrorReasons, getConfusionPairs } from '../utils/stats'
import ProgressBar from '../components/ProgressBar'
import ComparisonView from '../components/ComparisonView'
import MathRenderer from '../components/MathRenderer'

export default function WeaknessPage() {
  const [activeTab, setActiveTab] = useState<'chapters' | 'cards' | 'reasons'>('chapters')
  const [comparePair, setComparePair] = useState<[string, string] | null>(null)

  const weakChapters = getWeakChapters()
  const weakCards = getWeakCards()
  const commonReasons = getCommonErrorReasons()
  const confusionPairs = getConfusionPairs()

  if (comparePair) {
    return <ComparisonView nameA={comparePair[0]} nameB={comparePair[1]} onClose={() => setComparePair(null)} />
  }

  const tabs = [
    { id: 'chapters' as const, label: '薄弱章节', count: weakChapters.length },
    { id: 'cards' as const, label: '易错公式', count: weakCards.filter((c) => c.errorRate > 0).length },
    { id: 'reasons' as const, label: '常见错因', count: commonReasons.length },
  ]

  // Curated list of commonly confused formula pairs
  const builtInPairs: [string, string][] = [
    ['弹簧振子周期', '单摆周期'],
    ['双缝明纹条件', '双缝暗纹条件'],
    ['单缝衍射暗纹', '双缝明纹条件'],
    ['双缝干涉条纹间距', '单缝中央明纹宽度'],
    ['平动动能', '转动动能'],
    ['动量守恒', '角动量守恒'],
    ['动能定理', '机械能守恒'],
    ['匀变速速度公式', '匀变速转动速度公式'],
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
                : 'bg-[var(--card)] text-[var(--text-secondary)] shadow-[var(--shadow-sm)] hover:bg-[var(--bg)]'
            }`}
          >
            {tab.label} {tab.count}
          </button>
        ))}
      </div>

      {activeTab === 'chapters' && (
        <div className="space-y-3">
          {weakChapters.length === 0 && (
            <div className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-8 text-center">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">还没有学习数据</p>
              <p className="text-xs text-[var(--text-muted)]">完成几次复习训练后，这里会显示各章节的掌握情况分析</p>
            </div>
          )}
          {weakChapters.map((ch) => (
            <div key={ch.chapter} className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-4">
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
          {weakCards.filter((c) => c.errorRate > 0).length === 0 && (
            <div className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-8 text-center">
              <div className="text-2xl mb-2">✅</div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">还没有错误记录</p>
              <p className="text-xs text-[var(--text-muted)]">太棒了！继续通过复习训练保持状态</p>
            </div>
          )}
          {weakCards.filter((c) => c.errorRate > 0).map(({ card }) => (
            <div key={card.id} className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-[var(--text)]">{card.name}</h3>
                  <div className="font-mono text-[var(--primary)] text-sm"><MathRenderer latex={card.latex} fallback={card.formula} /></div>
                </div>
                <span className="text-xs text-[var(--text-muted)]">{card.chapter}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reasons' && (
        <div className="space-y-3">
          {commonReasons.length === 0 && (
            <div className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-8 text-center">
              <div className="text-2xl mb-2">🔍</div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">还没有错因记录</p>
              <p className="text-xs text-[var(--text-muted)]">训练时回答错误后选择错因，系统会帮你分析薄弱环节</p>
            </div>
          )}
          {commonReasons.map(({ reason, count }) => (
            <div key={reason} className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[var(--text)]">{ERROR_REASON_LABELS[reason]}</span>
                <span className="text-sm font-semibold text-[var(--text)]">{count} 次</span>
              </div>
              <ProgressBar value={count} max={Math.max(...commonReasons.map((r) => r.count), 1)} size="sm" color="orange" />
            </div>
          ))}

          {confusionPairs.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-[var(--text)] mb-2">你的混淆记录</h3>
              {confusionPairs.map(({ pair, errorCount }) => (
                <button
                  key={pair.join('vs')}
                  onClick={() => setComparePair(pair as [string, string])}
                  className="w-full text-left bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-3 mb-2 hover:shadow-[var(--shadow-md)] transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--primary)] font-medium">{pair[0]} ↔ {pair[1]}</span>
                    <span className="text-xs text-[var(--text-muted)]">{errorCount} 次混淆</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-sm font-semibold text-[var(--text)] mb-2">🔍 易混淆公式对比</h3>
            <p className="text-xs text-[var(--text-muted)] mb-2">点击对比查看两公式的核心区别</p>
            <div className="grid grid-cols-2 gap-2">
              {builtInPairs.map((pair) => (
                <button
                  key={pair.join('vs')}
                  onClick={() => setComparePair(pair)}
                  className="text-left bg-[var(--card)] rounded-xl p-2.5 hover:shadow-[var(--shadow-md)] transition-shadow border border-[var(--border)]"
                >
                  <div className="text-xs text-[var(--text)] leading-tight">
                    <span>{pair[0]}</span>
                    <span className="text-[var(--text-muted)] mx-1">↔</span>
                    <span>{pair[1]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
