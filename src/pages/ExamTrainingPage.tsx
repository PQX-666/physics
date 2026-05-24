import { useState } from 'react'
import { examPatterns, getSPatterns } from '../data/examPatterns'
import { calculationPatterns } from '../data/calculationPatterns'
import { getExamCards } from '../utils/reviewAlgorithm'
import CalculationStepCard from '../components/CalculationStepCard'
import TrapCard from '../components/TrapCard'
import ExamQuestion from '../components/ExamQuestion'
import TrainingSession from '../components/TrainingSession'

type SubMode = 'mcq_tf' | 'fill' | 'calc_steps' | 'traps' | null

export default function ExamTrainingPage() {
  const [mode, setMode] = useState<SubMode>(null)
  const [currentCalcIndex, setCurrentCalcIndex] = useState(0)
  const [currentMcqIndex, setCurrentMcqIndex] = useState(0)
  const [showTraps, setShowTraps] = useState(false)
  const [showTraining, setShowTraining] = useState(false)
  const [trainingMode, setTrainingMode] = useState<'recall' | 'speed'>('speed')

  const sPatterns = getSPatterns()
  const aPatterns = examPatterns.filter((p) => p.priority === 'A')

  function handleStartTraining(mode: 'recall' | 'speed') {
    setTrainingMode(mode)
    setShowTraining(true)
    setMode(null)
  }

  if (showTraining) {
    const examCardIds = getExamCards(4)
    return (
      <TrainingSession cardIds={examCardIds} mode={trainingMode} onDone={() => setShowTraining(false)} />
    )
  }

  if (showTraps) {
    return (
      <div>
        <button onClick={() => setShowTraps(false)} className="text-sm text-[var(--primary)] mb-4 inline-block">&larr; 返回</button>
        <TrapCard onDone={() => setShowTraps(false)} />
      </div>
    )
  }

  if (mode === 'calc_steps' && currentCalcIndex < calculationPatterns.length) {
    return (
      <div>
        <button onClick={() => setMode(null)} className="text-sm text-[var(--primary)] mb-4 inline-block">&larr; 返回</button>
        <CalculationStepCard
          pattern={calculationPatterns[currentCalcIndex]}
          onDone={() => {
            if (currentCalcIndex + 1 < calculationPatterns.length) {
              setCurrentCalcIndex((i) => i + 1)
            } else {
              setMode(null)
              setCurrentCalcIndex(0)
            }
          }}
        />
      </div>
    )
  }

  if (mode === 'mcq_tf' && currentMcqIndex < examPatterns.length) {
    const pattern = examPatterns[currentMcqIndex]
    const qMode = pattern.questionType === '判断题' ? 'tf' : 'mcq'

    return (
      <div>
        <div className="flex items-center justify-between max-w-lg mx-auto mb-4">
          <button onClick={() => { setMode(null); setCurrentMcqIndex(0) }} className="text-sm text-[var(--primary)]">&larr; 返回</button>
          <span className="text-xs text-[var(--text-muted)]">{currentMcqIndex + 1} / {examPatterns.length}</span>
        </div>
        <ExamQuestion
          pattern={pattern}
          mode={qMode}
          onResult={() => {}}
        />
        <div className="max-w-lg mx-auto mt-4 flex gap-3">
          {currentMcqIndex > 0 && (
            <button
              onClick={() => setCurrentMcqIndex((i) => i - 1)}
              className="flex-1 py-2.5 bg-[var(--bg)] text-[var(--text)] rounded-xl text-sm hover:bg-[var(--border)] transition-colors"
            >
              上一题
            </button>
          )}
          {currentMcqIndex < examPatterns.length - 1 ? (
            <button
              onClick={() => setCurrentMcqIndex((i) => i + 1)}
              className="flex-1 py-2.5 bg-[var(--primary)] text-white rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              下一题
            </button>
          ) : (
            <button
              onClick={() => { setMode(null); setCurrentMcqIndex(0) }}
              className="flex-1 py-2.5 bg-[var(--success)] text-white rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              完成
            </button>
          )}
        </div>
      </div>
    )
  }

  const cardClass = "bg-white rounded-2xl shadow-[var(--shadow-sm)] p-5 text-left hover:shadow-[var(--shadow-md)] transition-shadow"

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-[var(--text)]">期末靶向训练</h2>

      <div className="bg-red-50 rounded-2xl p-4">
        <h3 className="font-semibold text-[var(--danger)] mb-2">S 级考点（三套卷反复出现）</h3>
        <div className="flex flex-wrap gap-1.5">
          {sPatterns.map((p) => (
            <span key={p.id} className="text-xs bg-white text-[var(--danger)] px-2 py-1 rounded-lg">{p.title}</span>
          ))}
        </div>
      </div>

      <div className="bg-orange-50 rounded-2xl p-4">
        <h3 className="font-semibold text-[var(--warning)] mb-2">A 级考点</h3>
        <div className="flex flex-wrap gap-1.5">
          {aPatterns.map((p) => (
            <span key={p.id} className="text-xs bg-white text-[var(--warning)] px-2 py-1 rounded-lg">{p.title}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button onClick={() => { setMode('mcq_tf'); setCurrentMcqIndex(0) }} className={cardClass}>
          <h3 className="font-semibold text-[var(--text)]">选择判断速刷</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">概念辨析：运动学、能量、光学、振动</p>
          <span className="text-xs text-[var(--primary)] mt-2 inline-block">{examPatterns.length} 题可用</span>
        </button>

        <button onClick={() => handleStartTraining('speed')} className={cardClass}>
          <h3 className="font-semibold text-[var(--text)]">S级公式极速回忆</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">只刷三套卷高频公式，计时训练</p>
          <span className="text-xs text-[var(--primary)] mt-2 inline-block">{getExamCards(4).length} 公式</span>
        </button>

        <button onClick={() => { setMode('calc_steps'); setCurrentCalcIndex(0) }} className={cardClass}>
          <h3 className="font-semibold text-[var(--text)]">大题步骤训练</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">逐步拆解计算题解题流程</p>
          <span className="text-xs text-[var(--primary)] mt-2 inline-block">{calculationPatterns.length} 道大题</span>
        </button>

        <button onClick={() => setShowTraps(true)} className={cardClass}>
          <h3 className="font-semibold text-[var(--text)]">高频陷阱训练</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">判断题形式，训练常见易错概念</p>
          <span className="text-xs text-[var(--primary)] mt-2 inline-block">10 道陷阱题</span>
        </button>
      </div>
    </div>
  )
}
