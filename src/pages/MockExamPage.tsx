import { useState, useEffect, useCallback, useRef } from 'react'
import { mcQuestions, tfQuestions, fbQuestions } from '../data/questions'
import { MCQCard, TFCard } from '../components/QuestionCard'
import FillBlankCard from '../components/FillBlankCard'
import { saveExamResult, getExamHistory, type ExamResult } from '../utils/storage'

type QuestionItem =
  | { type: 'mcq'; data: typeof mcQuestions[0]; index: number }
  | { type: 'tf'; data: typeof tfQuestions[0]; index: number }
  | { type: 'fb'; data: typeof fbQuestions[0]; index: number }

function generateExam(): { items: QuestionItem[]; paper: string } {
  const papers = ['A', 'B', 'C'] as const
  const paper = papers[Math.floor(Math.random() * papers.length)]
  const mc = mcQuestions.filter((q) => q.paper === paper)
  const tf = tfQuestions.filter((q) => q.paper === paper)
  const fb = fbQuestions.filter((q) => q.paper === paper)

  const shuffled: QuestionItem[] = [
    ...mc.map((data, i) => ({ type: 'mcq' as const, data, index: i })),
    ...tf.map((data, i) => ({ type: 'tf' as const, data, index: i })),
    ...fb.map((data, i) => ({ type: 'fb' as const, data, index: i })),
  ]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return { items: shuffled, paper }
}

export default function MockExamPage() {
  const [generated, setGenerated] = useState(() => generateExam())
  const [exam, setExam] = useState<QuestionItem[]>(generated.items)
  const [paper, setPaper] = useState(generated.paper)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({})
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(90 * 60)
  const startTimeRef = useRef(0)
  const [history, setHistory] = useState<ExamResult[]>(() => getExamHistory())

  useEffect(() => {
    if (!started || finished) return
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setFinished(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [started, finished])

  // Save result on finish
  useEffect(() => {
    if (!finished || !started) return
    const score = Object.entries(answers).filter(([, v]) => v === true).length
    const timeUsed = 90 * 60 - timeLeft
    const result: ExamResult = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      paper,
      score,
      total: exam.length,
      timeUsed,
    }
    saveExamResult(result)
    setHistory(getExamHistory())
  }, [finished])

  const handleResult = useCallback((correct: boolean) => {
    setAnswers((a) => ({ ...a, [currentIdx]: correct }))
  }, [currentIdx])

  function handleStart() { setStarted(true); startTimeRef.current = Date.now() }
  function handleFinish() { setFinished(true) }
  function handleRestart() {
    const g = generateExam()
    setGenerated(g)
    setExam(g.items)
    setPaper(g.paper)
    setCurrentIdx(0)
    setAnswers({})
    setStarted(false)
    setFinished(false)
    setTimeLeft(90 * 60)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const score = Object.entries(answers).filter(([, v]) => v === true).length
  const totalAnswered = Object.keys(answers).length

  if (!started) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-8">
        <h2 className="text-lg font-bold text-[var(--text)]">模拟考试</h2>
        <div className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-6 space-y-4">
          <div className="text-4xl">⏱️</div>
          <div className="text-sm text-[var(--text-secondary)] leading-relaxed">
            随机抽取A/B/C中一套真题的选择、判断、填空题<br />
            限时 <strong className="text-[var(--danger)]">90分钟</strong> · 共 {exam.length} 题
          </div>
          <div className="text-xs text-[var(--text-muted)]">
            选择题 {exam.filter((q) => q.type === 'mcq').length} 题 · 判断题 {exam.filter((q) => q.type === 'tf').length} 题 · 填空题 {exam.filter((q) => q.type === 'fb').length} 题
          </div>
          <button onClick={handleStart} className="w-full py-3 bg-[var(--primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
            开始考试
          </button>
        </div>

        {history.length > 0 && (
          <div className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-5 mt-4">
            <h3 className="text-sm font-semibold text-[var(--text)] mb-3">📊 历史成绩</h3>
            <div className="space-y-2">
              {history.slice(-5).reverse().map((r) => {
                const pct = Math.round((r.score / r.total) * 100)
                return (
                  <div key={r.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-[var(--bg)] px-2 py-0.5 rounded">{r.paper}卷</span>
                      <span className="text-xs text-[var(--text-muted)]">{new Date(r.date).toLocaleDateString('zh-CN')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-muted)]">{Math.floor(r.timeUsed / 60)}分{r.timeUsed % 60}秒</span>
                      <span className={`text-sm font-bold ${pct >= 60 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                        {r.score}/{r.total}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((score / exam.length) * 100)
    return (
      <div className="max-w-lg mx-auto space-y-4 py-8">
        <h2 className="text-lg font-bold text-[var(--text)] text-center">考试结束</h2>
        <div className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-6 text-center space-y-4">
          <div className="text-5xl font-bold" style={{ color: pct >= 60 ? 'var(--success)' : 'var(--danger)' }}>
            {score}/{exam.length}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">正确率 {pct}%</div>
          <div className={`text-sm font-medium ${pct >= 60 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
            {pct >= 80 ? '🎉 非常优秀！' : pct >= 60 ? '👍 继续努力！' : '💪 还需加油！'}
          </div>
          <button onClick={handleRestart} className="w-full py-3 bg-[var(--primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
            重新考试
          </button>
        </div>
      </div>
    )
  }

  const item = exam[currentIdx]

  return (
    <div className="space-y-4">
      {/* Timer bar */}
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--text)]">
            第 {currentIdx + 1}/{exam.length} 题
          </span>
          <span className={`text-sm font-bold font-mono ${timeLeft < 300 ? 'text-[var(--danger)] animate-pulse' : 'text-[var(--text)]'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] rounded-full transition-all"
            style={{ width: `${((currentIdx + 1) / exam.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      {item.type === 'mcq' ? (
        <MCQCard key={currentIdx} question={item.data} onResult={handleResult} />
      ) : item.type === 'tf' ? (
        <TFCard key={currentIdx} question={item.data} onResult={handleResult} />
      ) : (
        <FillBlankCard key={currentIdx} question={item.data} onResult={handleResult} />
      )}

      {/* Navigation */}
      <div className="max-w-lg mx-auto flex gap-3">
        <button
          onClick={() => setCurrentIdx((i) => i - 1)}
          disabled={currentIdx === 0}
          className="flex-1 py-2.5 bg-[var(--card)] text-[var(--text)] rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-[var(--border)] transition-colors"
        >
          上一题
        </button>
        {currentIdx < exam.length - 1 ? (
          <button
            onClick={() => setCurrentIdx((i) => i + 1)}
            className="flex-1 py-2.5 bg-[var(--primary)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            下一题
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="flex-1 py-2.5 bg-[var(--danger)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            交卷 ({totalAnswered}/{exam.length} 已答)
          </button>
        )}
      </div>

      {/* Question grid */}
      <div className="max-w-lg mx-auto">
        <div className="flex flex-wrap gap-1">
          {exam.map((_q, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                i === currentIdx
                  ? 'bg-[var(--primary)] text-white'
                  : answers[i] === true
                  ? 'bg-green-100 text-[var(--success)]'
                  : answers[i] === false
                  ? 'bg-red-100 text-[var(--danger)]'
                  : 'bg-[var(--card)] text-[var(--text-muted)] border border-[var(--border)]'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
