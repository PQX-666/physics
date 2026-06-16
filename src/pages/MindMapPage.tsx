import { useState } from 'react'
import { formulas } from '../data/formulas'
import { CHAPTERS } from '../types/formula'
import MathRenderer from '../components/MathRenderer'

interface ChapterNode {
  chapter: string
  formulas: typeof formulas
}

function buildChapterMap(): ChapterNode[] {
  return CHAPTERS
    .map((ch) => ({
      chapter: ch,
      formulas: formulas.filter((f) => f.chapter === ch),
    }))
    .filter((n) => n.formulas.length > 0)
}

const BASE = import.meta.env.BASE_URL

const MIND_MAPS = [
  { src: `${BASE}mindmaps/new/理解标准波的方程.png`, title: '理解标准波的方程' },
  { src: `${BASE}mindmaps/new/双缝干涉核心.png`, title: '双缝干涉核心' },
  { src: `${BASE}mindmaps/new/单缝衍射核心.png`, title: '单缝衍射核心' },
  { src: `${BASE}mindmaps/new/夫琅禾费单缝衍射.png`, title: '夫琅禾费单缝衍射' },
  { src: `${BASE}mindmaps/new/光栅核心.png`, title: '光栅核心' },
  { src: `${BASE}mindmaps/new/物理光栅题目保姆讲解.png`, title: '光栅题目讲解' },
  { src: `${BASE}mindmaps/new/劈尖干涉.png`, title: '劈尖干涉' },
  { src: `${BASE}mindmaps/new/劈尖牛顿环核心.png`, title: '劈尖与牛顿环核心' },
  { src: `${BASE}mindmaps/new/偏振片与马吕斯定律.png`, title: '偏振片与马吕斯定律' },
  { src: `${BASE}mindmaps/new/偏振本质.png`, title: '偏振本质' },
]

const CHAPTER_COLORS = [
  'border-l-[var(--danger)]',
  'border-l-[var(--warning)]',
  'border-l-[var(--primary)]',
  'border-l-[var(--success)]',
  'border-l-purple-400',
  'border-l-cyan-400',
  'border-l-pink-400',
  'border-l-indigo-400',
  'border-l-teal-400',
]

export default function MindMapPage() {
  const chapterMap = buildChapterMap()
  const [expanded, setExpanded] = useState<Set<string>>(new Set(CHAPTERS))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeImgIdx, setActiveImgIdx] = useState<number | null>(null)

  function toggle(chapter: string) {
    const next = new Set(expanded)
    if (next.has(chapter)) next.delete(chapter); else next.add(chapter)
    setExpanded(next)
  }

  return (
    <div className="space-y-5">
      {/* ====== Image Gallery ====== */}
      <div>
        <h2 className="text-lg font-bold text-[var(--text)] mb-3">思维导图图库</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MIND_MAPS.map((item, i) => (
            <button
              key={item.src}
              onClick={() => setActiveImgIdx(i)}
              className="bg-[var(--card)] rounded-xl shadow-[var(--shadow-sm)] p-2 text-left hover:shadow-[var(--shadow-md)] transition-shadow"
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full aspect-[4/3] object-cover rounded-lg"
                loading="lazy"
              />
              <p className="text-xs text-[var(--text-secondary)] mt-1.5 text-center truncate px-1">
                {item.title}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen viewer */}
      {activeImgIdx !== null && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setActiveImgIdx(null)}>
          <button onClick={() => setActiveImgIdx(null)} className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl w-10 h-10 flex items-center justify-center">&times;</button>
          <span className="absolute top-4 left-4 text-white/80 text-sm">
            {activeImgIdx + 1} / {MIND_MAPS.length} — {MIND_MAPS[activeImgIdx].title}
          </span>
          {activeImgIdx > 0 && (
            <button onClick={(e) => { e.stopPropagation(); setActiveImgIdx(activeImgIdx - 1) }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl w-10 h-10 flex items-center justify-center">&lsaquo;</button>
          )}
          <img src={MIND_MAPS[activeImgIdx].src} alt={MIND_MAPS[activeImgIdx].title} className="max-w-full max-h-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
          {activeImgIdx < MIND_MAPS.length - 1 && (
            <button onClick={(e) => { e.stopPropagation(); setActiveImgIdx(activeImgIdx + 1) }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl w-10 h-10 flex items-center justify-center">&rsaquo;</button>
          )}
        </div>
      )}

      {/* ====== Text-based interactive tree ====== */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[var(--text)]">章节知识树</h2>
          <div className="flex gap-1">
            <button onClick={() => setExpanded(new Set(CHAPTERS))} className="text-xs text-[var(--primary)] hover:underline">全部展开</button>
            <button onClick={() => setExpanded(new Set())} className="text-xs text-[var(--text-muted)] hover:underline">全部收起</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {chapterMap.map((node, ci) => {
            const isOpen = expanded.has(node.chapter)
            const highFreq = node.formulas.filter((f) => f.examFrequency >= 4).length
            return (
              <div key={node.chapter} className={`bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] border-l-4 ${CHAPTER_COLORS[ci % CHAPTER_COLORS.length]} overflow-hidden`}>
                <button onClick={() => toggle(node.chapter)} className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--bg)] transition-colors">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                    <h3 className="font-semibold text-sm text-[var(--text)]">{node.chapter}</h3>
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">
                    {node.formulas.length} 公式
                    {highFreq > 0 && <span className="ml-1 text-[var(--danger)]">({highFreq} 高频)</span>}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-3 space-y-1.5 border-t border-[var(--border)] pt-3">
                    {node.formulas.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedId(selectedId === f.id ? null : f.id)}
                        className={`w-full text-left rounded-xl p-3 transition-colors ${
                          selectedId === f.id ? 'bg-[var(--primary-light)] ring-1 ring-[var(--primary)]' : 'hover:bg-[var(--bg)]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-sm font-medium text-[var(--text)]">{f.name}</span>
                          <span className="text-[10px] text-[var(--text-muted)]">{'★'.repeat(f.examFrequency)}</span>
                        </div>
                        {f.latex && (
                          <div className="text-xs font-mono text-[var(--primary)]">
                            <MathRenderer latex={f.latex} />
                          </div>
                        )}

                        {selectedId === f.id && (
                          <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-1.5 text-xs">
                            {f.plainExplanation && <p className="text-[var(--text-secondary)]">{f.plainExplanation}</p>}
                            {f.scene && <p className="text-[var(--primary)]"><span className="font-medium">触发：</span>{f.scene}</p>}
                            {f.mnemonic && <p className="text-[var(--warning)]"><span className="font-medium">口诀：</span>{f.mnemonic}</p>}
                            {f.trap && <p className="text-[var(--danger)]"><span className="font-medium">易错：</span>{f.trap}</p>}
                            <div className="flex flex-wrap gap-1 pt-1">
                              {f.triggerKeywords.slice(0, 4).map((kw) => (
                                <span key={kw} className="text-[10px] bg-[var(--bg)] text-[var(--text-muted)] px-1.5 py-0.5 rounded">{kw}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
