import { useState } from 'react'
import { mcQuestions, tfQuestions, fbQuestions, calcQuestions } from '../data/questions'
import { MCQCard, TFCard } from '../components/QuestionCard'
import FillBlankCard from '../components/FillBlankCard'
import CalcDetailView from '../components/CalcDetailView'

type Paper = 'A' | 'B' | 'C' | 'all'
type QType = 'mcq' | 'tf' | 'fb' | 'calc'

const PAPERS: { value: Paper; label: string }[] = [
  { value: 'all', label: '全部试卷' },
  { value: 'A', label: 'A卷' },
  { value: 'B', label: 'B卷' },
  { value: 'C', label: 'C卷' },
]

const TYPES: { value: QType; label: string; count: number }[] = [
  { value: 'mcq', label: '选择题', count: mcQuestions.length },
  { value: 'tf', label: '判断题', count: tfQuestions.length },
  { value: 'fb', label: '填空题', count: fbQuestions.length },
  { value: 'calc', label: '计算题', count: calcQuestions.length },
]

export default function QuestionsPage() {
  const [paper, setPaper] = useState<Paper>('all')
  const [qtype, setQtype] = useState<QType>('mcq')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedCalc, setSelectedCalc] = useState<string | null>(null)

  const mcqFiltered = paper === 'all' ? mcQuestions : mcQuestions.filter((q) => q.paper === paper)
  const tfFiltered = paper === 'all' ? tfQuestions : tfQuestions.filter((q) => q.paper === paper)
  const fbFiltered = paper === 'all' ? fbQuestions : fbQuestions.filter((q) => q.paper === paper)
  const calcFiltered = paper === 'all' ? calcQuestions : calcQuestions.filter((q) => q.paper === paper)

  const currentList = qtype === 'mcq' ? mcqFiltered : qtype === 'tf' ? tfFiltered : qtype === 'fb' ? fbFiltered : calcFiltered

  function handlePrev() { if (currentIndex > 0) setCurrentIndex((i) => i - 1) }
  function handleNext() { if (currentIndex < currentList.length - 1) setCurrentIndex((i) => i + 1) }

  if (selectedCalc) {
    const cq = calcQuestions.find((q) => q.id === selectedCalc)
    if (cq) return <CalcDetailView question={cq} onBack={() => setSelectedCalc(null)} />
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[var(--text)]">真题题库</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {PAPERS.map((p) => (
          <button
            key={p.value}
            onClick={() => { setPaper(p.value); setCurrentIndex(0) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              paper === p.value
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--card)] text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => { setQtype(t.value); setCurrentIndex(0) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              qtype === t.value
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--card)] text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            {t.label} ({paper === 'all' ? t.count : t.value === 'mcq' ? mcqFiltered.length : t.value === 'tf' ? tfFiltered.length : t.value === 'fb' ? fbFiltered.length : calcFiltered.length})
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <button onClick={handlePrev} disabled={currentIndex === 0} className="text-sm text-[var(--primary)] disabled:text-[var(--text-muted)] disabled:opacity-40">
          &larr; 上一题
        </button>
        <span className="text-xs text-[var(--text-muted)]">{currentIndex + 1} / {currentList.length}</span>
        <button onClick={handleNext} disabled={currentIndex >= currentList.length - 1} className="text-sm text-[var(--primary)] disabled:text-[var(--text-muted)] disabled:opacity-40">
          下一题 &rarr;
        </button>
      </div>

      {/* Content */}
      {currentList.length === 0 ? (
        <div className="text-center py-16 text-sm text-[var(--text-muted)]">该筛选条件下暂无题目</div>
      ) : qtype === 'calc' ? (
        <div className="space-y-3 max-w-lg mx-auto">
          {calcFiltered.map((cq) => (
            <button
              key={cq.id}
              onClick={() => setSelectedCalc(cq.id)}
              className="w-full text-left bg-[var(--card)] rounded-xl p-4 hover:shadow-[var(--shadow-md)] transition-shadow border border-[var(--border)]"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-red-50 text-[var(--danger)] px-1.5 py-0.5 rounded font-bold">{cq.paper}卷</span>
                <span className="text-xs text-[var(--text-muted)]">{cq.pts}</span>
              </div>
              <div className="text-sm font-medium text-[var(--text)]">{cq.title}</div>
            </button>
          ))}
        </div>
      ) : qtype === 'mcq' ? (
        <MCQCard key={`${qtype}-${paper}-${currentIndex}`} question={mcqFiltered[currentIndex] as any} />
      ) : qtype === 'tf' ? (
        <TFCard key={`${qtype}-${paper}-${currentIndex}`} question={tfFiltered[currentIndex] as any} />
      ) : (
        <FillBlankCard key={`${qtype}-${paper}-${currentIndex}`} question={fbFiltered[currentIndex] as any} />
      )}
    </div>
  )
}
