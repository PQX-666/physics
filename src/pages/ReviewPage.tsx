import { useState } from 'react'
import type { TrainingMode } from '../types/formula'
import { formulas } from '../data/formulas'
import { getDueCards, getRecommendedCards } from '../utils/reviewAlgorithm'
import { getAllReviewStates } from '../utils/storage'
import TrainingSession from '../components/TrainingSession'

type View = 'mode_select' | 'training'

export default function ReviewPage() {
  const [view, setView] = useState<View>('mode_select')
  const [trainingMode, setTrainingMode] = useState<TrainingMode>('recall')
  const [cardIds, setCardIds] = useState<string[]>([])

  function startReview(mode: TrainingMode) {
    const states = getAllReviewStates()
    const allIds = formulas.map((f) => f.id)
    const due = getDueCards(states, allIds)
    const ids = due.length > 0 ? due : getRecommendedCards(states, allIds, 20)
    setCardIds(ids)
    setTrainingMode(mode)
    setView('training')
  }

  if (view === 'training') {
    return (
      <div>
        <button onClick={() => setView('mode_select')} className="text-sm text-[var(--primary)] mb-4 inline-block">
          &larr; 返回
        </button>
        <TrainingSession
          cardIds={cardIds}
          mode={trainingMode === 'speed' ? 'speed' : 'recall'}
          onDone={() => setView('mode_select')}
        />
      </div>
    )
  }

  const states = getAllReviewStates()
  const allIds = formulas.map((f) => f.id)
  const dueCount = getDueCards(states, allIds).length

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-6">
        <h2 className="text-lg font-bold text-[var(--text)] mb-1">今日复习</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          {dueCount > 0 ? `你有 ${dueCount} 张卡片等待复习` : '今日没有到期卡片，可以自由复习'}
        </p>
      </div>

      <div className="grid gap-2">
        {[
          { mode: 'recall' as TrainingMode, title: '公式回忆', desc: '看到名称，回忆公式内容' },
          { mode: 'speed' as TrainingMode, title: '极速回忆', desc: '计时训练，建立条件反射' },
          { mode: 'sprint' as TrainingMode, title: '高频冲刺', desc: '只刷高频和易错公式' },
        ].map((m) => (
          <button
            key={m.mode}
            onClick={() => startReview(m.mode)}
            className="w-full text-left bg-white rounded-2xl shadow-[var(--shadow-sm)] p-4 hover:shadow-[var(--shadow-md)] transition-shadow"
          >
            <h3 className="font-semibold text-[var(--text)]">{m.title}</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{m.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
