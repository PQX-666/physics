import { useState, useEffect } from 'react'
import type { FormulaCard as FormulaCardType } from '../types/formula'
import { CHAPTERS } from '../types/formula'
import { getFormulaById } from '../data/formulas'
import { getAllReviewStates, createDefaultReviewState, saveReviewState } from '../utils/storage'
import FormulaList from '../components/FormulaList'
import ProgressBar from '../components/ProgressBar'
import MathRenderer from '../components/MathRenderer'
import TrainingSession from '../components/TrainingSession'

export default function FormulaLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [chapterFilter, setChapterFilter] = useState('')
  const [frequencyFilter, setFrequencyFilter] = useState(0)
  const [bookmarkFilter, setBookmarkFilter] = useState(false)
  const [sortBy, setSortBy] = useState('chapter')
  const [selectedFormula, setSelectedFormula] = useState<FormulaCardType | null>(null)
  const [trainingCardId, setTrainingCardId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fid = sessionStorage.getItem('searchSelectFormula')
    if (fid) {
      sessionStorage.removeItem('searchSelectFormula')
      const f = getFormulaById(fid)
      if (f) setSelectedFormula(f)
    }
  }, [])

  function handleResetFormula(id: string) {
    if (confirm('确定重置这个公式的学习记录？')) {
      saveReviewState(createDefaultReviewState(id))
    }
  }

  function handleMarkMastered(id: string) {
    const state = getAllReviewStates()
    const existing = state[id] || createDefaultReviewState(id)
    existing.masteryLevel = 90
    existing.status = 'mastered'
    saveReviewState(existing)
  }

  if (trainingCardId) {
    return (
      <TrainingSession
        cardIds={[trainingCardId]}
        mode="recall"
        onDone={() => setTrainingCardId(null)}
      />
    )
  }

  const inputBase = "px-3 py-2 bg-[var(--bg)] rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-full"

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[var(--text)]">公式库</h2>

      <div className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] overflow-hidden">
        <div className="p-4 pb-2">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="搜索公式名称、关键词..." className={inputBase} />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between px-4 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          <span>筛选与排序 {chapterFilter || frequencyFilter || bookmarkFilter ? `(已启用)` : ''}</span>
          <span>{showFilters ? '收起 ▲' : '展开 ▼'}</span>
        </button>
        {showFilters && (
          <div className="px-4 pb-4 flex flex-wrap gap-2">
            <select value={chapterFilter} onChange={(e) => setChapterFilter(e.target.value)} className={inputBase + ' w-auto'}>
              <option value="">全部章节</option>
              {CHAPTERS.map((ch) => <option key={ch} value={ch}>{ch}</option>)}
            </select>
            <select value={frequencyFilter} onChange={(e) => setFrequencyFilter(Number(e.target.value))} className={inputBase + ' w-auto'}>
              <option value={0}>全部频率</option>
              <option value={5}>5 核心</option>
              <option value={4}>4 高频</option>
              <option value={3}>3 常见</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={inputBase + ' w-auto'}>
              <option value="chapter">按章节</option>
              <option value="name">按名称</option>
              <option value="frequency">按频率</option>
              <option value="mastery">按掌握度</option>
              <option value="errors">按错误次数</option>
            </select>
            <button
              onClick={() => setBookmarkFilter(!bookmarkFilter)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                bookmarkFilter ? 'bg-yellow-100 text-yellow-700' : 'bg-[var(--bg)] text-[var(--text-secondary)]'
              }`}
            >
              ⭐ 仅收藏
            </button>
          </div>
        )}
      </div>

      <FormulaList searchQuery={searchQuery} chapterFilter={chapterFilter} frequencyFilter={frequencyFilter} bookmarkFilter={bookmarkFilter} sortBy={sortBy} onSelectFormula={(id) => { const f = getFormulaById(id); if (f) setSelectedFormula(f) }} />

      {selectedFormula && (
        <div className="fixed inset-0 bg-black/30 flex items-start justify-center z-50 p-4 pt-16 overflow-y-auto" onClick={() => setSelectedFormula(null)}>
          <div className="bg-[var(--card)] rounded-2xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--text)]">{selectedFormula.name}</h3>
              <button onClick={() => setSelectedFormula(null)} className="text-[var(--text-muted)] hover:text-[var(--text)] text-lg">&times;</button>
            </div>

            <div className="text-2xl font-serif font-bold text-center py-5 bg-[var(--bg)] rounded-2xl mb-4 text-[var(--text)]">
              <MathRenderer latex={selectedFormula.latex} fallback={selectedFormula.formula} displayMode className="text-2xl" />
            </div>

            <p className="text-sm text-[var(--text-secondary)] mb-4">{selectedFormula.meaning}</p>

            <div className="mb-4">
              <div className="text-xs font-semibold text-[var(--text-secondary)] mb-2">变量说明</div>
              <div className="grid grid-cols-2 gap-1.5">
                {selectedFormula.variables.map((v) => (
                  <div key={v.symbol} className="text-sm bg-[var(--bg)] rounded-lg px-3 py-2">
                    <span className="font-mono font-bold text-[var(--primary)]">{v.symbol}</span>
                    <span className="text-[var(--text-secondary)]"> — {v.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm text-[var(--text-secondary)] space-y-1.5 mb-4">
              <div>章节：{selectedFormula.chapter}</div>
              <div>频率：{'★'.repeat(selectedFormula.frequency)}</div>
              <div>适用条件：{selectedFormula.conditions.join('；')}</div>
              <div>触发词：{selectedFormula.triggerKeywords.join('、')}</div>
            </div>

            <div className="border-t border-[var(--border)] pt-4 space-y-2 mb-4">
              {(() => {
                const states = getAllReviewStates()
                const state = states[selectedFormula.id]
                if (!state || state.reviewCount === 0) {
                  return (
                    <>
                      <div className="text-xs font-semibold text-[var(--text-secondary)]">学习状态</div>
                      <span className="text-xs bg-[var(--border)] text-[var(--text-muted)] px-2 py-0.5 rounded-full">未学习</span>
                    </>
                  )
                }
                return (
                  <>
                    <div className="text-xs font-semibold text-[var(--text-secondary)]">学习状态</div>
                    <ProgressBar value={state.masteryLevel} color={state.masteryLevel >= 80 ? 'green' : 'primary'} />
                    <div className="text-xs text-[var(--text-secondary)] grid grid-cols-2 gap-1">
                      <span>复习 {state.reviewCount} 次</span>
                      <span>正确 {state.correctCount} 次</span>
                      <span>错误 {state.wrongCount} 次</span>
                    </div>
                  </>
                )
              })()}
            </div>

            <div className="flex gap-2 pt-4 border-t border-[var(--border)]">
              <button onClick={() => { setTrainingCardId(selectedFormula.id); setSelectedFormula(null) }} className="flex-1 py-2.5 bg-[var(--primary)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">训练</button>
              <button onClick={() => { handleMarkMastered(selectedFormula.id); setSelectedFormula(null) }} className="px-3 py-2.5 bg-[var(--bg)] text-[var(--text-secondary)] rounded-xl text-xs hover:bg-green-50 hover:text-[var(--success)] transition-colors">已掌握</button>
              <button onClick={() => { handleResetFormula(selectedFormula.id); setSelectedFormula(null) }} className="px-3 py-2.5 bg-[var(--bg)] text-[var(--text-muted)] rounded-xl text-xs hover:bg-red-50 hover:text-[var(--danger)] transition-colors">重置</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
