import { useState, useCallback } from 'react'
import type { Rating, StudyLog } from '../types/formula'
import { getFormulaById } from '../data/formulas'
import { loadState, saveReviewState, saveStudyLog, updateStreak } from '../utils/storage'
import { calculateNextReview } from '../utils/reviewAlgorithm'
import FormulaCardView from './FormulaCard'
import SessionSummary from './SessionSummary'

interface TrainingSessionProps {
  cardIds: string[]
  mode: 'recall' | 'speed'
  onDone: () => void
}

export default function TrainingSession({ cardIds, mode, onDone }: TrainingSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [results, setResults] = useState({ correct: 0, wrong: 0, count: 0 })

  const currentCard = getFormulaById(cardIds[currentIndex])

  const handleRate = useCallback(
    (rating: Rating) => {
      if (!currentCard) return

      const isCorrect = rating >= 3
      const state = loadState()
      const currentReviewState = state.reviewStates[currentCard.id] || {
        cardId: currentCard.id, masteryLevel: 0, reviewCount: 0, correctCount: 0, wrongCount: 0,
        lastReviewedAt: null, nextReviewAt: null, intervalDays: 0,
        confidenceHistory: [], errorReasons: [], lapseCount: 0,
        streakCorrect: 0, status: 'new' as const,
      }

      const updates = calculateNextReview(currentReviewState, {
        rating,
        confidence: 'certain',
        isCorrect,
      })
      saveReviewState({ ...currentReviewState, ...updates })

      const log: StudyLog = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        cardId: currentCard.id, mode, rating, confidence: 'certain', reactionTime: 0, isCorrect,
        createdAt: new Date().toISOString(),
      }
      saveStudyLog(log)
      updateStreak()

      setResults((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        wrong: prev.wrong + (isCorrect ? 0 : 1),
        count: prev.count + 1,
      }))

      if (currentIndex + 1 < cardIds.length) {
        setCurrentIndex((i) => i + 1)
      } else {
        setIsDone(true)
      }
    },
    [currentCard, currentIndex, cardIds, mode]
  )

  if (isDone) {
    return (
      <SessionSummary
        total={results.count}
        correct={results.correct}
        wrong={results.wrong}
        onDone={onDone}
      />
    )
  }

  if (!currentCard) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-secondary)]">没有更多卡片</p>
        <button onClick={onDone} className="mt-4 text-[var(--primary)]">返回</button>
      </div>
    )
  }

  return (
    <div>
      <div className="max-w-lg mx-auto mb-4">
        <div className="flex items-center justify-between text-sm text-[var(--text-secondary)] mb-2">
          <span>{currentIndex + 1} / {cardIds.length}</span>
          <span>{mode === 'speed' ? '极速回忆' : '公式回忆'}</span>
        </div>
        <div className="w-full bg-[var(--border)] rounded-full h-1">
          <div
            className="bg-[var(--primary)] h-1 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cardIds.length) * 100}%` }}
          />
        </div>
      </div>
      <FormulaCardView formula={currentCard} mode={mode} onRate={handleRate} />
    </div>
  )
}
