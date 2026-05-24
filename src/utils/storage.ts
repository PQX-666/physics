import type { AppState, ReviewState, StudyLog } from '../types/formula'

const STORAGE_KEY = 'physics-formula-trainer-state'

function getDefaultState(): AppState {
  return {
    reviewStates: {},
    studyLogs: [],
    streakDays: 0,
    lastStudyDate: null,
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultState()
    const parsed = JSON.parse(raw)
    return {
      reviewStates: parsed.reviewStates || {},
      studyLogs: parsed.studyLogs || [],
      streakDays: parsed.streakDays || 0,
      lastStudyDate: parsed.lastStudyDate || null,
    }
  } catch {
    return getDefaultState()
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resetState(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function exportData(): string {
  return JSON.stringify(loadState(), null, 2)
}

export function importData(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr)
    if (data.reviewStates && Array.isArray(data.studyLogs)) {
      saveState(data)
      return true
    }
    return false
  } catch {
    return false
  }
}

export function getReviewState(cardId: string): ReviewState {
  const state = loadState()
  if (state.reviewStates[cardId]) return state.reviewStates[cardId]
  return createDefaultReviewState(cardId)
}

export function createDefaultReviewState(cardId: string): ReviewState {
  return {
    cardId,
    masteryLevel: 0,
    reviewCount: 0,
    correctCount: 0,
    wrongCount: 0,
    lastReviewedAt: null,
    nextReviewAt: null,
    intervalDays: 0,
    confidenceHistory: [],
    errorReasons: [],
    lapseCount: 0,
    streakCorrect: 0,
    status: 'new',
  }
}

export function saveReviewState(reviewState: ReviewState): void {
  const state = loadState()
  state.reviewStates[reviewState.cardId] = reviewState
  saveState(state)
}

export function saveStudyLog(log: StudyLog): void {
  const state = loadState()
  state.studyLogs.push(log)
  saveState(state)
}

export function updateStreak(): void {
  const state = loadState()
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  if (state.lastStudyDate === today) return

  if (state.lastStudyDate === yesterday) {
    state.streakDays += 1
  } else if (state.lastStudyDate !== today) {
    state.streakDays = 1
  }

  state.lastStudyDate = today
  saveState(state)
}

export function getAllReviewStates(): Record<string, ReviewState> {
  return loadState().reviewStates
}

export function getAllStudyLogs(): StudyLog[] {
  return loadState().studyLogs
}
