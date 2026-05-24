import { useState } from 'react'
import { resetState, exportData, importData } from '../utils/storage'
import { getTodayStats, getAccuracy, getTotalLogs } from '../utils/stats'

export default function SettingsPage() {
  const [importMessage, setImportMessage] = useState('')
  const [showImportInput, setShowImportInput] = useState(false)
  const [importJson, setImportJson] = useState('')

  const stats = getTodayStats()
  const accuracy = getAccuracy()
  const totalLogs = getTotalLogs()

  function handleExport() {
    const data = exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `physics-formula-trainer-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport() {
    if (!importJson.trim()) { setImportMessage('请粘贴 JSON 数据'); return }
    const success = importData(importJson.trim())
    if (success) {
      setImportMessage('导入成功，正在刷新...')
      setShowImportInput(false)
      setImportJson('')
      setTimeout(() => window.location.reload(), 1000)
    } else {
      setImportMessage('导入失败：JSON 格式不正确')
    }
  }

  function handleReset() {
    if (confirm('确定重置所有学习数据？此操作不可撤销。')) {
      resetState()
      window.location.reload()
    }
  }

  const sectionClass = "bg-white rounded-2xl shadow-[var(--shadow-sm)] p-4"
  const btnClass = "px-4 py-2 bg-[var(--primary)] text-white rounded-xl text-sm hover:opacity-90 transition-opacity"
  const btnSecondary = "px-4 py-2 bg-[var(--bg)] text-[var(--text)] rounded-xl text-sm hover:bg-[var(--border)] transition-colors"

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[var(--text)]">设置</h2>

      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-[var(--text)] mb-3">学习数据</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-[var(--text-secondary)]">公式总数：</span><span className="font-semibold">{stats.totalFormulas}</span></div>
          <div><span className="text-[var(--text-secondary)]">已掌握：</span><span className="font-semibold">{stats.masteredCount}</span></div>
          <div><span className="text-[var(--text-secondary)]">学习记录：</span><span className="font-semibold">{totalLogs}</span></div>
          <div><span className="text-[var(--text-secondary)]">正确率：</span><span className="font-semibold">{accuracy}%</span></div>
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-[var(--text)] mb-2">导出数据</h3>
        <p className="text-xs text-[var(--text-secondary)] mb-3">将学习记录导出为 JSON 文件用于备份</p>
        <button onClick={handleExport} className={btnClass}>导出 JSON</button>
      </div>

      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-[var(--text)] mb-2">导入数据</h3>
        <p className="text-xs text-[var(--text-secondary)] mb-3">从之前导出的 JSON 文件恢复</p>
        {!showImportInput ? (
          <button onClick={() => setShowImportInput(true)} className={btnSecondary}>导入 JSON</button>
        ) : (
          <div className="space-y-3">
            <textarea value={importJson} onChange={(e) => setImportJson(e.target.value)} placeholder="粘贴 JSON 数据..." className="w-full h-32 px-3 py-2 bg-[var(--bg)] rounded-xl text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
            {importMessage && <p className={`text-xs ${importMessage.includes('成功') ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>{importMessage}</p>}
            <div className="flex gap-2">
              <button onClick={handleImport} className={btnClass}>确认导入</button>
              <button onClick={() => { setShowImportInput(false); setImportJson(''); setImportMessage('') }} className={btnSecondary}>取消</button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-red-50 rounded-2xl border border-red-100 p-4">
        <h3 className="text-sm font-semibold text-[var(--danger)] mb-3">危险操作</h3>
        <p className="text-xs text-red-600 mb-3">删除所有学习数据，恢复初始状态。此操作不可撤销。</p>
        <button onClick={handleReset} className="px-4 py-2 bg-[var(--danger)] text-white rounded-xl text-sm hover:opacity-90 transition-opacity">重置所有数据</button>
      </div>
    </div>
  )
}
