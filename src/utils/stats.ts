import type { FormulaCard, ReviewState, ErrorReason } from '../types/formula'
import { formulas } from '../data/formulas'
import { getAllReviewStates, getAllStudyLogs } from './storage'

export function getTodayStats() {
  const state = getAllReviewStates()
  const logs = getAllStudyLogs()
  const today = new Date().toISOString().split('T')[0]
  const todayLogs = logs.filter((l) => l.createdAt.startsWith(today))

  const totalFormulas = formulas.length
  const masteredCount = Object.values(state).filter((s) => s.status === 'mastered').length
  const reviewedToday = todayLogs.length
  const newCount = totalFormulas - Object.keys(state).length

  const dueCount = Object.values(state).filter((s) => {
    if (!s.nextReviewAt) return true
    return new Date(s.nextReviewAt).getTime() <= Date.now()
  }).length + newCount

  return {
    totalFormulas,
    dueCount,
    newCount,
    masteredCount,
    reviewedToday,
    todayLogs,
  }
}

export function getAccuracy(): number {
  const logs = getAllStudyLogs()
  if (logs.length === 0) return 0
  const correct = logs.filter((l) => l.isCorrect).length
  return Math.round((correct / logs.length) * 100)
}

export function getStreakDays(): number {
  const { streakDays } = (() => {
    try {
      const raw = localStorage.getItem('physics-formula-trainer-state')
      if (!raw) return { streakDays: 0 }
      return JSON.parse(raw)
    } catch {
      return { streakDays: 0 }
    }
  })()
  return streakDays
}

export function getWeakChapters(): { chapter: string; errorCount: number; formulaCount: number; avgMastery: number }[] {
  const states = getAllReviewStates()
  const chapterMap: Record<string, { errorCount: number; masterySum: number; count: number; formulaCount: number }> = {}

  for (const f of formulas) {
    if (!chapterMap[f.chapter]) {
      chapterMap[f.chapter] = { errorCount: 0, masterySum: 0, count: 0, formulaCount: 0 }
    }
    chapterMap[f.chapter].formulaCount++
    const state = states[f.id]
    if (state) {
      chapterMap[f.chapter].errorCount += state.wrongCount
      chapterMap[f.chapter].masterySum += state.masteryLevel
      chapterMap[f.chapter].count++
    }
  }

  return Object.entries(chapterMap)
    .map(([chapter, data]) => ({
      chapter,
      errorCount: data.errorCount,
      formulaCount: data.formulaCount,
      avgMastery: data.count > 0 ? Math.round(data.masterySum / data.count) : 0,
    }))
    .sort((a, b) => b.errorCount - a.errorCount)
}

export function getWeakCards(): { card: FormulaCard; state: ReviewState | null; errorRate: number }[] {
  const states = getAllReviewStates()
  return formulas
    .map((f) => {
      const state = states[f.id]
      const total = (state?.correctCount || 0) + (state?.wrongCount || 0)
      const errorRate = total > 0 ? (state?.wrongCount || 0) / total : 1
      return { card: f, state: state || null, errorRate }
    })
    .sort((a, b) => b.errorRate - a.errorRate)
    .slice(0, 10)
}

export function getConfusionPairs(): { pair: string[]; errorCount: number }[] {
  const logs = getAllStudyLogs()
  const confusionMap: Record<string, number> = {}

  for (const log of logs) {
    if (log.errorReason === 'similar_formula_confusion' && log.cardId) {
      const card = formulas.find((f) => f.id === log.cardId)
      if (card) {
        for (const sim of card.similarFormulas) {
          const key = [card.name, sim].sort().join(' vs ')
          confusionMap[key] = (confusionMap[key] || 0) + 1
        }
      }
    }
  }

  return Object.entries(confusionMap)
    .map(([pair, count]) => ({ pair: pair.split(' vs '), errorCount: count }))
    .sort((a, b) => b.errorCount - a.errorCount)
    .slice(0, 10)
}

export function getCommonErrorReasons(): { reason: ErrorReason; count: number }[] {
  const logs = getAllStudyLogs()
  const reasonMap: Record<string, number> = {}

  for (const log of logs) {
    if (log.errorReason) {
      reasonMap[log.errorReason] = (reasonMap[log.errorReason] || 0) + 1
    }
  }

  return Object.entries(reasonMap)
    .map(([reason, count]) => ({ reason: reason as ErrorReason, count }))
    .sort((a, b) => b.count - a.count)
}

export function getTotalLogs(): number {
  return getAllStudyLogs().length
}
