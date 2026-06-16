import { useState } from 'react'
import type { TrainingMode } from '../types/formula'
import { formulas } from '../data/formulas'
import { getDueCards, getRecommendedCards } from '../utils/reviewAlgorithm'
import { getAllReviewStates } from '../utils/storage'
import Dashboard from '../components/Dashboard'
import TrainingSession from '../components/TrainingSession'
import SprintPlan from '../components/SprintPlan'
import UsageGuide from '../components/UsageGuide'
import RadarChart from '../components/RadarChart'
import StudyTrends from '../components/StudyTrends'

interface HomePageProps {
  onNavigate: (page: string) => void
}

type View = 'dashboard' | 'training'

export default function HomePage({ onNavigate }: HomePageProps) {
  const [view, setView] = useState<View>('dashboard')
  const [trainingMode, setTrainingMode] = useState<TrainingMode>('recall')
  const [cardIds, setCardIds] = useState<string[]>([])
  const [showSprintPlan, setShowSprintPlan] = useState(false)

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

      <RadarChart />

      <StudyTrends />

      <div className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] overflow-hidden">
        <button
          onClick={() => setShowSprintPlan(!showSprintPlan)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--bg)] transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">📅</span>
            <h3 className="text-sm font-semibold text-[var(--text)]">7 天考前冲刺计划</h3>
          </div>
          <span className={`text-xs text-[var(--text-muted)] transition-transform ${showSprintPlan ? 'rotate-180' : ''}`}>
            {showSprintPlan ? '收起 ▲' : '展开 ▼'}
          </span>
        </button>
        {showSprintPlan && (
          <div className="px-4 pb-4 border-t border-[var(--border)] pt-4">
            <SprintPlan />
          </div>
        )}
      </div>
    </div>
  )
}
