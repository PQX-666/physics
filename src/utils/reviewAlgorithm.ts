import type { Confidence, ErrorReason, Rating, ReviewState } from '../types/formula'
import { formulas, getFormulaById } from '../data/formulas'

interface ReviewParams {
  rating: Rating
  confidence: Confidence
  isCorrect: boolean
  errorReason?: ErrorReason
}

// 基础间隔映射（天数）
const BASE_INTERVALS: Record<Rating, number> = {
  1: 0.0069,  // ~10 分钟
  2: 1,       // 1 天
  3: 3,       // 3 天
  4: 7,       // 7 天
  5: 15,      // 15 天
}

// 置信度修正系数
function getConfidenceMultiplier(confidence: Confidence): number {
  switch (confidence) {
    case 'certain': return 1.1
    case 'uncertain': return 0.8
    case 'guess': return 0.5
  }
}

export function calculateNextReview(
  currentState: ReviewState,
  params: ReviewParams
): Partial<ReviewState> {
  const { rating, confidence, isCorrect, errorReason } = params

  let baseInterval = BASE_INTERVALS[rating]

  // 连续秒答奖励
  const newStreakCorrect = rating === 5 ? currentState.streakCorrect + 1 : (isCorrect ? currentState.streakCorrect + 1 : 0)
  if (newStreakCorrect >= 3) {
    baseInterval = 30
  }

  // 置信度修正
  const confMultiplier = getConfidenceMultiplier(confidence)

  let interval = baseInterval * confMultiplier

  // 错误修正
  if (!isCorrect) {
    interval = Math.min(interval, 1)
  }

  // 掌握度变化
  let masteryDelta = 0
  switch (rating) {
    case 1: masteryDelta = -15; break
    case 2: masteryDelta = -3; break
    case 3: masteryDelta = 5; break
    case 4: masteryDelta = 10; break
    case 5: masteryDelta = 15; break
  }

  let newMastery = Math.max(0, Math.min(100, currentState.masteryLevel + masteryDelta))

  const now = new Date().toISOString()
  const nextReview = new Date(Date.now() + interval * 86400000).toISOString()

  // 确定状态
  let status: ReviewState['status'] = currentState.status
  if (newMastery >= 80 && currentState.reviewCount >= 3) status = 'mastered'
  else if (newMastery >= 40) status = 'reviewing'
  else if (currentState.reviewCount > 0) status = 'learning'

  const newErrorReasons = [...currentState.errorReasons]
  if (errorReason && !newErrorReasons.includes(errorReason)) {
    newErrorReasons.push(errorReason)
  }

  const newConfidenceHistory = [...currentState.confidenceHistory, confidence]
  // 只保留最近 20 条
  if (newConfidenceHistory.length > 20) {
    newConfidenceHistory.splice(0, newConfidenceHistory.length - 20)
  }

  return {
    masteryLevel: Math.round(newMastery),
    reviewCount: currentState.reviewCount + 1,
    correctCount: isCorrect ? currentState.correctCount + 1 : currentState.correctCount,
    wrongCount: isCorrect ? currentState.wrongCount : currentState.wrongCount + 1,
    lastReviewedAt: now,
    nextReviewAt: nextReview,
    intervalDays: Math.round(interval * 100) / 100,
    confidenceHistory: newConfidenceHistory,
    errorReasons: newErrorReasons,
    lapseCount: isCorrect ? currentState.lapseCount : currentState.lapseCount + 1,
    streakCorrect: newStreakCorrect,
    status,
  }
}

function getExamBonus(formulaId: string): number {
  const f = getFormulaById(formulaId)
  if (!f) return 0
  if (f.examFrequency === 5) return 15
  if (f.examFrequency === 4) return 10
  if (f.examFrequency === 3) return 5
  return 0
}

export function getDueCards(
  reviewStates: Record<string, ReviewState>,
  cardIds: string[]
): string[] {
  const now = Date.now()
  const due: { id: string; priority: number }[] = []

  for (const id of cardIds) {
    const state = reviewStates[id]
    if (!state) {
      // 新卡片，优先级最高
      due.push({ id, priority: 100 })
      continue
    }

    if (state.nextReviewAt && new Date(state.nextReviewAt).getTime() <= now) {
      // 到期复习，计算优先级
      let priority = 80

      // 过期越久优先级越高
      const overdueDays = (now - new Date(state.nextReviewAt).getTime()) / 86400000
      priority += Math.min(overdueDays * 2, 20)

      // 错误次数多优先级高
      priority += Math.min(state.wrongCount * 2, 10)

      // 掌握度低优先级高
      priority += (100 - state.masteryLevel) / 10

      // 考试权重
      priority += getExamBonus(id)

      due.push({ id, priority })
    }
  }

  due.sort((a, b) => b.priority - a.priority)
  return due.map((d) => d.id)
}

export function getRecommendedCards(
  reviewStates: Record<string, ReviewState>,
  cardIds: string[],
  limit: number = 20
): string[] {
  const now = Date.now()
  const scored: { id: string; score: number }[] = []

  for (const id of cardIds) {
    const state = reviewStates[id]
    if (!state) {
      scored.push({ id, score: 100 })
      continue
    }

    let score = 0

    // 到期加权
    if (state.nextReviewAt) {
      const overdue = (now - new Date(state.nextReviewAt).getTime()) / 86400000
      if (overdue > 0) score += Math.min(overdue * 3, 30)
    } else {
      score += 20
    }

    // 错误多
    score += state.wrongCount * 3

    // 置信度低
    const recentConf = state.confidenceHistory.slice(-5)
    const lowConfCount = recentConf.filter((c) => c === 'guess' || c === 'uncertain').length
    score += lowConfCount * 4

    // 很久没复习
    if (state.lastReviewedAt) {
      const daysSinceReview = (now - new Date(state.lastReviewedAt).getTime()) / 86400000
      if (daysSinceReview > 30) score += 15
      else if (daysSinceReview > 14) score += 8
    }

    // 掌握度低
    score += (100 - state.masteryLevel) / 10

    // 考试权重
    score += getExamBonus(id)

    scored.push({ id, score })
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((s) => s.id)
}

export function getExamCards(minExamFreq: number = 4): string[] {
  return formulas
    .filter((f) => f.examFrequency >= minExamFreq)
    .sort((a, b) => b.examFrequency - a.examFrequency)
    .map((f) => f.id)
}

export function applyHighFrequencyConstraint(
  reviewState: ReviewState,
  frequency: number
): void {
  if (frequency === 5 && reviewState.intervalDays > 30) {
    reviewState.intervalDays = 30
    reviewState.nextReviewAt = new Date(Date.now() + 30 * 86400000).toISOString()
  }
  if (frequency === 4 && reviewState.intervalDays > 45) {
    reviewState.intervalDays = 45
    reviewState.nextReviewAt = new Date(Date.now() + 45 * 86400000).toISOString()
  }
}
