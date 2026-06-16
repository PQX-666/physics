import { useState } from 'react'
import type { ThinkingFramework as ThinkingFrameworkType } from '../types/formula'

interface ThinkingFrameworkProps {
  fw: ThinkingFrameworkType
}

export default function ThinkingFramework({ fw }: ThinkingFrameworkProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-2 border-[var(--warning)] rounded-xl overflow-hidden bg-[var(--card)] my-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 text-left font-bold text-[var(--warning)] flex items-center gap-2 hover:bg-orange-50 transition-colors"
      >
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--warning)] animate-pulse" />
        {open ? '收起解题思路 ▲' : '点我看解题思路 ▼'}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          <div className="p-3 rounded-lg bg-red-50 border-l-3 border-[var(--danger)]">
            <div className="text-xs font-bold text-[var(--danger)] mb-1">📍 怎么做</div>
            <div className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">{fw.how}</div>
          </div>
          <div className="p-3 rounded-lg bg-orange-50 border-l-3 border-[var(--warning)]">
            <div className="text-xs font-bold text-[var(--warning)] mb-1">💡 为什么</div>
            <div className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">{fw.why}</div>
          </div>
          <div className="p-3 rounded-lg bg-green-50 border-l-3 border-[var(--success)]">
            <div className="text-xs font-bold text-[var(--success)] mb-1">📚 用了什么</div>
            <div className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">{fw.know}</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 border-l-3 border-[var(--primary)]">
            <div className="text-xs font-bold text-[var(--primary)] mb-1">🧠 怎么记</div>
            <div className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">{fw.mem}</div>
          </div>
        </div>
      )}
    </div>
  )
}
