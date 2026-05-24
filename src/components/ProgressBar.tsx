interface ProgressBarProps {
  value: number
  max?: number
  color?: 'primary' | 'green' | 'orange' | 'red'
  size?: 'sm' | 'md'
}

const COLORS: Record<string, string> = {
  primary: 'bg-[var(--primary)]',
  green: 'bg-[var(--success)]',
  orange: 'bg-[var(--warning)]',
  red: 'bg-[var(--danger)]',
}

export default function ProgressBar({ value, max = 100, color = 'primary', size = 'md' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const height = size === 'sm' ? 'h-1' : 'h-2'

  return (
    <div className={`w-full bg-[var(--border)] rounded-full ${height}`}>
      <div
        className={`${height} rounded-full transition-all duration-500 ${COLORS[color]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
