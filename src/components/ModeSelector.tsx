import type { TrainingMode } from '../types/formula'

interface ModeOption {
  mode: TrainingMode
  title: string
  description: string
}

const MODES: ModeOption[] = [
  { mode: 'recall', title: '公式回忆', description: '看到公式名称，回忆公式内容' },
  { mode: 'speed', title: '极速回忆', description: '计时训练，建立神经条件反射' },
  { mode: 'trigger', title: '条件触发', description: '看题目条件选公式' },
  { mode: 'compare', title: '相似对比', description: '对比容易混淆的公式' },
  { mode: 'sprint', title: '高频冲刺', description: '只刷高频和易错公式' },
]

interface ModeSelectorProps {
  onSelect: (mode: TrainingMode) => void
  enabledModes?: TrainingMode[]
}

export default function ModeSelector({ onSelect, enabledModes }: ModeSelectorProps) {
  const modes = enabledModes ? MODES.filter((m) => enabledModes.includes(m.mode)) : MODES

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {modes.map((m) => (
        <button
          key={m.mode}
          onClick={() => onSelect(m.mode)}
          className="text-left bg-white rounded-2xl border border-[var(--border)] p-4 hover:border-[var(--primary)] hover:shadow-[var(--shadow-sm)] transition-all"
        >
          <h3 className="font-semibold text-[var(--text)]">{m.title}</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{m.description}</p>
        </button>
      ))}
    </div>
  )
}
