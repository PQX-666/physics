import { useState } from 'react'
import type { TrainingMode } from '../types/formula'
import { formulas } from '../data/formulas'
import { getDueCards, getRecommendedCards } from '../utils/reviewAlgorithm'
import { getAllReviewStates } from '../utils/storage'
import Dashboard from '../components/Dashboard'
import TrainingSession from '../components/TrainingSession'
import SprintPlan from '../components/SprintPlan'
import UsageGuide from '../components/UsageGuide'

interface HomePageProps {
  onNavigate: (page: string) => void
}

type View = 'dashboard' | 'training'

export default function HomePage({ onNavigate }: HomePageProps) {
  const [view, setView] = useState<View>('dashboard')
  const [trainingMode, setTrainingMode] = useState<TrainingMode>('recall')
  const [cardIds, setCardIds] = useState<string[]>([])

  function startReview(mode: TrainingMode) {
    const states = getAllReviewStates()
    const allIds = formulas.map((f) => f.id)

    let ids: string[]
    if (mode === 'sprint') {
      const examHigh = formulas.filter((f) => f.examFrequency >= 4).map((f) => f.id)
      const mistaken = Object.entries(states).filter(([, s]) => s.wrongCount > 0).map(([id]) => id)
      ids = [...new Set([...examHigh, ...mistaken])]
    } else {
      const due = getDueCards(states, allIds)
      ids = due.length > 0 ? due : getRecommendedCards(states, allIds, 20)
    }

    setCardIds(ids)
    setTrainingMode(mode)
    setView('training')
  }

  if (view === 'training') {
    return (
      <TrainingSession
        cardIds={cardIds}
        mode={trainingMode === 'speed' || trainingMode === 'sprint' ? 'speed' : 'recall'}
        onDone={() => setView('dashboard')}
      />
    )
  }

  return (
    <div className="space-y-5">
      <UsageGuide />

      <Dashboard
        onStartReview={() => startReview('recall')}
        onStartSpeed={() => startReview('speed')}
        onNavigate={onNavigate}
      />

      <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-4">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-3">7 天考前冲刺计划</h3>
        <SprintPlan />
      </div>
    </div>
  )
}
