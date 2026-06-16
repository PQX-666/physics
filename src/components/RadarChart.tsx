import { useMemo } from 'react'
import { CHAPTERS } from '../types/formula'
import { getWeakChapters } from '../utils/stats'

interface RadarChartProps {
  size?: number
}

export default function RadarChart({ size = 280 }: RadarChartProps) {
  const chapters = useMemo(() => {
    const weak = getWeakChapters()
    const map = new Map(weak.map((c) => [c.chapter, c.avgMastery]))
    return CHAPTERS.map((name) => ({
      name,
      mastery: map.get(name) ?? 0,
    }))
  }, [])

  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.35
  const levels = 5
  const n = chapters.length

  function getPoint(i: number, level: number): [number, number] {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    const r = (radius * level) / levels
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
  }

  const gridPolygons = Array.from({ length: levels }, (_, level) => {
    const points = Array.from({ length: n }, (_, i) => getPoint(i, level + 1).join(','))
    return points.join(' ')
  })

  const dataPoints = chapters.map((ch, i) => getPoint(i, (ch.mastery / 100) * levels))
  const dataPolygon = dataPoints.map((p) => p.join(',')).join(' ')

  // Shorten long chapter names
  const labels = chapters.map((ch) => {
    const name = ch.name
    return name.length > 4 ? name.slice(0, 4) : name
  })

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid */}
        {gridPolygons.map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="var(--border)"
            strokeWidth={i === levels - 1 ? 1.5 : 0.5}
          />
        ))}

        {/* Axis lines */}
        {Array.from({ length: n }, (_, i) => {
          const [x, y] = getPoint(i, levels)
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" strokeWidth={0.5} />
        })}

        {/* Data polygon */}
        <polygon
          points={dataPolygon}
          fill="var(--primary)"
          fillOpacity={0.25}
          stroke="var(--primary)"
          strokeWidth={2}
        />

        {/* Data points */}
        {dataPoints.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3} fill="var(--primary)" />
        ))}

        {/* Labels */}
        {chapters.map((_ch, i) => {
          const [x, y] = getPoint(i, levels)
          // Push labels outward from center
          const dx = x - cx
          const dy = y - cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          const lx = cx + (dx / dist) * (radius + 22)
          const ly = cy + (dy / dist) * (radius + 22)
          const anchor = dx > 5 ? 'start' : dx < -5 ? 'end' : 'middle'
          return (
            <text
              key={i}
              x={lx}
              y={ly}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="text-[11px]"
              fill="var(--text-secondary)"
              style={{ fontFamily: 'system-ui' }}
            >
              {labels[i]}
            </text>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 justify-center">
        {chapters.map((ch, i) => (
          <div key={i} className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
            <div className="w-2 h-2 rounded-full bg-[var(--primary)]" style={{ opacity: ch.mastery > 0 ? 1 : 0.2 }} />
            <span>{ch.name}</span>
            <span className="font-semibold text-[var(--text)]">{ch.mastery}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
