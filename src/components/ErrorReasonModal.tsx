import type { ErrorReason } from '../types/formula'
import { ERROR_REASON_LABELS } from '../types/formula'

interface ErrorReasonModalProps {
  onSelect: (reason: ErrorReason) => void
  onSkip: () => void
}

const REASONS = Object.entries(ERROR_REASON_LABELS) as [ErrorReason, string][]

export default function ErrorReasonModal({ onSelect, onSkip }: ErrorReasonModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">为什么没想起来？</h3>
        <p className="text-sm text-gray-500 mb-4">选择原因有助于系统帮你针对性强化</p>

        <div className="space-y-2">
          {REASONS.map(([reason, label]) => (
            <button
              key={reason}
              onClick={() => onSelect(reason)}
              className="w-full text-left px-4 py-2.5 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm text-gray-700 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={onSkip}
          className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 py-2"
        >
          跳过
        </button>
      </div>
    </div>
  )
}
