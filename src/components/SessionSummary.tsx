interface SessionSummaryProps {
  total: number
  correct: number
  wrong: number
  onDone: () => void
}

export default function SessionSummary({ total, correct, wrong, onDone }: SessionSummaryProps) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-8 text-center">
        <h2 className="text-xl font-bold text-[var(--text)] mb-1">训练完成</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-8">
          {accuracy >= 80 ? '表现很好，继续保持' : accuracy >= 60 ? '还不错，再多练练' : '需要加强薄弱公式'}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { v: total, l: '训练数', c: 'bg-[var(--primary-light)] text-[var(--primary)]' },
            { v: correct, l: '正确', c: 'bg-green-50 text-[var(--success)]' },
            { v: wrong, l: '错误', c: 'bg-red-50 text-[var(--danger)]' },
            { v: `${accuracy}%`, l: '正确率', c: 'bg-purple-50 text-purple-600' },
          ].map((s) => (
            <div key={s.l} className={`${s.c} rounded-2xl py-4`}>
              <div className="text-2xl font-bold">{s.v}</div>
              <div className="text-xs opacity-70 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>

        <button onClick={onDone} className="w-full py-3.5 bg-[var(--primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
          完成
        </button>
      </div>
    </div>
  )
}
