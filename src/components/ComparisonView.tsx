import { formulas } from '../data/formulas'
import MathRenderer from './MathRenderer'

interface ComparisonViewProps {
  nameA: string
  nameB: string
  onClose: () => void
}

export default function ComparisonView({ nameA, nameB, onClose }: ComparisonViewProps) {
  const fa = formulas.find((f) => f.name === nameA)
  const fb = formulas.find((f) => f.name === nameB)

  if (!fa || !fb) {
    return (
      <div className="bg-[var(--card)] rounded-2xl p-6 text-center text-sm text-[var(--text-muted)]">
        未找到对应公式
        <button onClick={onClose} className="block mx-auto mt-3 text-[var(--primary)] text-xs">&larr; 返回</button>
      </div>
    )
  }

  function renderField(label: string, valueA: string | undefined, valueB: string | undefined) {
    return (
      <div className="mb-3">
        <div className="text-xs font-semibold text-[var(--text-secondary)] mb-1">{label}</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-red-50 text-sm text-[var(--text)] min-h-[2rem]">
            {valueA || '—'}
          </div>
          <div className="p-2 rounded-lg bg-blue-50 text-sm text-[var(--text)] min-h-[2rem]">
            {valueB || '—'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <button onClick={onClose} className="text-sm text-[var(--primary)]">&larr; 返回</button>

      <div className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] overflow-hidden">
        {/* Headers */}
        <div className="grid grid-cols-2">
          <div className="p-4 bg-red-50 text-center border-r border-red-100">
            <div className="text-sm font-bold text-[var(--danger)]">{fa.name}</div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">{fa.chapter}</div>
          </div>
          <div className="p-4 bg-blue-50 text-center">
            <div className="text-sm font-bold text-[var(--primary)]">{fb.name}</div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">{fb.chapter}</div>
          </div>
        </div>

        <div className="p-4 space-y-1">
          {/* Formula */}
          <div className="mb-3">
            <div className="text-xs font-semibold text-[var(--text-secondary)] mb-1">公式</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-red-50 text-center font-serif font-bold text-[var(--text)]">
                {fa.latex ? <MathRenderer latex={fa.latex} /> : fa.formula}
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-center font-serif font-bold text-[var(--text)]">
                {fb.latex ? <MathRenderer latex={fb.latex} /> : fb.formula}
              </div>
            </div>
          </div>

          {/* Meaning */}
          {renderField('含义', fa.plainExplanation || fa.meaning, fb.plainExplanation || fb.meaning)}

          {/* Scene */}
          {renderField('看到什么用它', fa.scene, fb.scene)}

          {/* Trap */}
          {renderField('⚠️ 易错点', fa.trap || fa.commonMistakes.join('；'), fb.trap || fb.commonMistakes.join('；'))}

          {/* Mnemonic */}
          {renderField('🧠 口诀', fa.mnemonic, fb.mnemonic)}

          {/* Key difference */}
          <div className="mt-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
            <div className="text-xs font-bold text-[var(--warning)] mb-1">🔑 核心区别</div>
            <div className="text-xs text-[var(--text)] leading-relaxed">
              {fa.chapter !== fb.chapter && (
                <span className="inline-block mr-2 mb-1 bg-yellow-100 px-1.5 py-0.5 rounded">不同章节：{fa.chapter} vs {fb.chapter}</span>
              )}
              <span>关键看题目给的物理量——</span>
              {fa.triggerKeywords.some((k) => fb.triggerKeywords.includes(k))
                ? '两公式触发词有重叠，需根据具体条件（' + fa.conditions.join('、') + ' vs ' + fb.conditions.join('、') + '）判断'
                : '触发词不同，不会混淆'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
