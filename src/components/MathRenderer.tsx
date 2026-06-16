import { useEffect, useRef } from 'react'
import katex from 'katex'

interface MathRendererProps {
  latex?: string
  html?: string
  fallback?: string
  displayMode?: boolean
  className?: string
}

export default function MathRenderer({ latex, html, fallback, displayMode = false, className }: MathRendererProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    if (latex) {
      try {
        katex.render(latex, ref.current, { displayMode, throwOnError: false, trust: true })
      } catch {
        ref.current.textContent = fallback || latex
      }
    } else if (html) {
      ref.current.innerHTML = html
    } else if (fallback) {
      ref.current.textContent = fallback
    }
  }, [latex, html, fallback, displayMode])

  return <span ref={ref} className={className} />
}
