import { useState } from 'react'
import type { CalculationPattern } from '../types/formula'

interface CalculationStepCardProps {
  pattern: CalculationPattern
  onDone: () => void
}

export default function CalculationStepCard({ pattern, onDone }: CalculationStepCardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = pattern.steps.length

  return (
    <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-6 md:p-8 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-[var(--text)]">{pattern.title}</h3>
        <span className="text-xs text-[var(--text-muted)]">{currentStep + 1}/{totalSteps}</span>
      </div>

      <p className="text-sm text-[var(--text-secondary)] mb-4 bg-[var(--bg)] rounded-xl p-3">{pattern.scenario}</p>

      <div className="w-full bg-[var(--border)] rounded-full h-1.5 mb-6">
        <div className="bg-[var(--primary)] h-1.5 rounded-full transition-all duration-500" style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }} />
      </div>

      <div className="bg-[var(--primary-light)] rounded-2xl p-5 mb-4">
        <div className="text-xs text-[var(--primary)] font-semibold mb-1">第 {currentStep + 1} 步</div>
        <p className="text-sm text-[var(--text)] font-medium leading-relaxed">{pattern.steps[currentStep]}</p>
      </div>

      <div className="flex gap-3">
        {currentStep > 0 && (
          <button onClick={() => setCurrentStep((s) => s - 1)} className="flex-1 py-2.5 bg-[var(--bg)] text-[var(--text)] rounded-xl text-sm hover:bg-[var(--border)] transition-colors">
            &larr; 上一步
          </button>
        )}
        {currentStep < totalSteps - 1 ? (
          <button onClick={() => setCurrentStep((s) => s + 1)} className="flex-1 py-2.5 bg-[var(--primary)] text-white rounded-xl text-sm hover:opacity-90 transition-opacity">
            下一步 &rarr;
          </button>
        ) : (
          <button onClick={onDone} className="flex-1 py-2.5 bg-[var(--success)] text-white rounded-xl text-sm hover:opacity-90 transition-opacity">
            完成
          </button>
        )}
      </div>

      {currentStep === totalSteps - 1 && (
        <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-4">
          <div>
            <div className="text-xs font-semibold text-[var(--text-secondary)] mb-1">守恒定律</div>
            <ul className="list-disc list-inside text-sm text-[var(--text-secondary)]">
              {pattern.conservationLaw.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--warning)] mb-1">易错点</div>
            <ul className="list-disc list-inside text-sm text-[var(--text-secondary)]">
              {pattern.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </div>
          {pattern.miniExample && (
            <div className="bg-green-50 rounded-xl p-3">
              <div className="text-xs font-semibold text-[var(--success)] mb-1">示例</div>
              <p className="text-sm text-[var(--text)] font-mono">{pattern.miniExample}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
