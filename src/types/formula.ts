export interface FormulaCard {
  id: string
  name: string
  formula: string
  chapter: string
  frequency: 1 | 2 | 3 | 4 | 5
  examFrequency: 1 | 2 | 3 | 4 | 5
  meaning: string
  variables: VariableDef[]
  conditions: string[]
  triggerKeywords: string[]
  useCases: string[]
  commonMistakes: string[]
  example: string
  similarFormulas: string[]
  relatedFormulas: string[]
  difficulty: 1 | 2 | 3 | 4 | 5
  // 从 HTML 版合并的新字段
  latex?: string        // KaTeX 兼容的 LaTeX 公式
  mnemonic?: string     // 口诀
  scene?: string        // 看到什么用它
  plainExplanation?: string // 大白话解释
  trap?: string         // 最易犯的错误
  sym?: string          // 变量说明（HTML格式）
  tag?: string          // 'five' | 'four' | 'three'
  ex?: string           // 出自哪套卷
  pts?: string          // 分值
}

export interface ExamPattern {
  id: string
  title: string
  chapter: string
  priority: 'S' | 'A' | 'B'
  questionType: '选择题' | '判断题' | '填空题' | '计算题'
  triggerKeywords: string[]
  relatedFormulas: string[]
  solutionStrategy: string[]
  commonTraps: string[]
  sampleQuestion: string
  answerExplanation: string
  distractors?: string[]
  correctAnswer?: string
  isTrue?: boolean
}

export interface CalculationPattern {
  id: string
  title: string
  scenario: string
  steps: string[]
  keyFormulas: string[]
  conservationLaw: string[]
  commonMistakes: string[]
  miniExample: string
}

export interface VariableDef {
  symbol: string
  name: string
  unit?: string
}

export interface ReviewState {
  cardId: string
  masteryLevel: number // 0-100
  reviewCount: number
  correctCount: number
  wrongCount: number
  lastReviewedAt: string | null
  nextReviewAt: string | null
  intervalDays: number
  confidenceHistory: Confidence[]
  errorReasons: ErrorReason[]
  lapseCount: number
  streakCorrect: number
  status: 'new' | 'learning' | 'reviewing' | 'mastered'
}

export type Confidence = 'certain' | 'uncertain' | 'guess'

export type ErrorReason =
  | 'forgot_formula'
  | 'dont_understand'
  | 'dont_know_when'
  | 'variable_confusion'
  | 'unit_error'
  | 'similar_formula_confusion'
  | 'question_type_error'
  | 'careless'

export const ERROR_REASON_LABELS: Record<ErrorReason, string> = {
  forgot_formula: '忘记公式',
  dont_understand: '不理解含义',
  dont_know_when: '不知道什么时候用',
  variable_confusion: '变量混淆',
  unit_error: '单位错误',
  similar_formula_confusion: '和相似公式混淆',
  question_type_error: '题型识别错误',
  careless: '粗心',
}

export interface StudyLog {
  id: string
  cardId: string
  mode: 'recall' | 'speed' | 'trigger' | 'compare' | 'sprint'
  rating: 1 | 2 | 3 | 4 | 5
  confidence: Confidence
  reactionTime: number
  isCorrect: boolean
  errorReason?: ErrorReason
  createdAt: string
}

export type TrainingMode = 'recall' | 'speed' | 'trigger' | 'compare' | 'sprint'

export type Rating = 1 | 2 | 3 | 4 | 5

export const RATING_LABELS: Record<Rating, string> = {
  1: '完全不会',
  2: '模糊',
  3: '会但不熟',
  4: '熟练',
  5: '秒答',
}

export const CONFIDENCE_LABELS: Record<Confidence, string> = {
  certain: '很确定',
  uncertain: '有点不确定',
  guess: '猜的',
}

export interface AppState {
  reviewStates: Record<string, ReviewState>
  studyLogs: StudyLog[]
  streakDays: number
  lastStudyDate: string | null
}

export const CHAPTERS = [
  '运动学',
  '牛顿运动定律',
  '动量与冲量',
  '曲线运动',
  '刚体转动',
  '能量守恒',
  '简谐振动',
  '机械波',
  '波动光学',
]

// ==================== 从 HTML 版迁移的新类型 ====================

export interface FormulaMeta {
  id: string
  n: string           // 名称
  tag: 'five' | 'four' | 'three'  // 重要度
  tex?: string        // KaTeX LaTeX 公式
  latex: string       // HTML 公式字符串
  expl: string        // 大白话解释
  scene: string       // 看到什么用它
  mn: string          // 口诀
  trap: string        // 易错点
  sym: string         // 变量说明
  ex?: string         // 出自哪套卷
  pts?: string        // 分值
}

export interface ThinkingFramework {
  how: string   // 怎么做（解题路径）
  why: string   // 为什么（深层原理）
  know: string  // 用了什么知识
  mem: string   // 辅助记忆
}

export interface CalcQuestion {
  id: string
  paper: string        // A卷/B卷/C卷
  num: number
  pts: string
  title: string
  fw: ThinkingFramework
  q: string
  think: string
  steps: { s: string; e: string }[]
  traps: string[]
  fids: string[]
}

export interface MCQuestion {
  paper: string
  num: number
  q: string
  opts: string[]
  ans: number          // 正确答案索引 0-3
  oe?: string[]        // 逐选项解释
  e?: string           // 总解析
}

export interface TFQuestion {
  paper: string
  num: number
  q: string
  a: string            // '正确' | '错误'
  e: string            // 解析
}

export interface FBQuestion {
  paper: string
  num: number
  q: string
  a: string            // 答案
  e: string            // 详细解析（含公式族总结）
  fam?: string         // 公式族名称
}

export interface PredQuestion {
  q: string
  opts?: string[]
  ans?: number
  a?: string
  e: string
  title?: string
  steps?: { s: string; e: string }[]
  fids?: string[]
}

export interface SprintPlanDay {
  day: number
  t: string
  task: string
  icon: string
  tip: string
  nav: string
}
