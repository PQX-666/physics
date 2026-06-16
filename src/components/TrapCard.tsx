import { useState } from 'react'

interface Trap {
  statement: string
  isTrue: boolean
  explanation: string
  chapter: string
}

const TRAPS: Trap[] = [
  { statement: '碰撞过程（无论弹性还是非弹性）中，碰撞瞬间可以用机械能守恒求解。', isTrue: false, explanation: '碰撞瞬间只有完全弹性碰撞才满足机械能守恒。非弹性碰撞中，机械能有损失（转化为内能）。一般碰撞过程应使用动量守恒。', chapter: '动量与冲量' },
  { statement: '子弹射入竖直悬挂的细杆并停留在杆中，碰撞瞬间应当使用线动量守恒。', isTrue: false, explanation: '子弹打杆时，杆的上端有轴约束力（外力），所以系统线动量不守恒。应当对转轴使用角动量守恒（轴约束力力矩为零）。', chapter: '刚体转动' },
  { statement: '自然光通过第一个偏振片后，光强变为原来的一半。', isTrue: true, explanation: '自然光中各个方向的偏振分量均匀分布，通过理想偏振片后，只有沿偏振化方向的分量通过，光强变为 I₀/2。', chapter: '波动光学' },
  { statement: '光从空气进入水中后，频率不变，波长变短。', isTrue: true, explanation: '频率由光源决定，不随介质改变。v = c/n，λ = λ₀/n，所以水中波长变短。这会导致水中干涉条纹变窄。', chapter: '波动光学' },
  { statement: '切向加速度改变速度大小，法向加速度改变速度方向。', isTrue: true, explanation: '切向加速度沿切线方向，只改变速率大小。法向加速度指向圆心，只改变速度方向。', chapter: '曲线运动' },
  { statement: '简谐振子的动能和势能做同频率、同相位的简谐振动。', isTrue: false, explanation: '动能和势能同频率，但相位差 π/2（反相）。当动能为零时势能最大，反之亦然。两者之和（总机械能）守恒。', chapter: '简谐振动' },
  { statement: '收绳过程中，小球做圆周运动的半径减小，拉力做功使动能增加，但角动量守恒。', isTrue: true, explanation: '拉力始终过圆心，对圆心力矩为零，角动量守恒。拉力方向与小球运动方向有夹角，拉力做正功。机械能不守恒。', chapter: '刚体转动' },
  { statement: '劈尖干涉中，越靠近棱边的条纹对应的光程差越大。', isTrue: false, explanation: '劈尖靠近棱边处膜厚最小（趋近于零），光程差最小。越远离棱边膜越厚，光程差越大。所以靠近棱边是低级次条纹。', chapter: '波动光学' },
  { statement: '弹簧切成 n 等段后，每段的劲度系数变为原来的 1/n。', isTrue: false, explanation: '弹簧切短后劲度系数变大。切成 n 段，每段 k\' = nk（变为原来的 n 倍）。因为同样的力下形变量只有原来的 1/n。', chapter: '简谐振动' },
  { statement: '在匀变速转动中，角位移公式 θ = ω₀t + ½βt² 与匀变速直线运动位移公式形式完全对应。', isTrue: true, explanation: '平动与转动的运动学公式有完美的数学对应：x↔θ, v↔ω, a↔β, m↔J, F↔M。', chapter: '刚体转动' },
]

interface TrapCardProps {
  onDone: () => void
}

export default function TrapCard({ onDone }: TrapCardProps) {
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null)
  const [correct, setCorrect] = useState(0)
  const [total, setTotal] = useState(0)

  const trap = TRAPS[index]

  function handleAnswer(value: boolean) {
    setUserAnswer(value)
    setAnswered(true)
    setTotal((t) => t + 1)
    if (value === trap.isTrue) setCorrect((c) => c + 1)
  }

  function handleNext() {
    if (index + 1 < TRAPS.length) {
      setIndex((i) => i + 1)
      setAnswered(false)
      setUserAnswer(null)
    } else {
      onDone()
    }
  }

  if (index >= TRAPS.length) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-secondary)]">没有更多陷阱题了</p>
        <button onClick={onDone} className="mt-4 text-[var(--primary)]">返回</button>
      </div>
    )
  }

  return (
    <div className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-6 md:p-8 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">陷阱训练</span>
        <span className="text-xs text-[var(--text-muted)]">{index + 1}/{TRAPS.length}</span>
      </div>

      <div className="text-xs text-[var(--text-muted)] mb-3">{trap.chapter}</div>

      <div className="bg-[var(--bg)] rounded-2xl p-5 mb-6">
        <p className="text-sm text-[var(--text)] leading-relaxed">{trap.statement}</p>
      </div>

      <p className="text-xs text-[var(--text-muted)] mb-4 text-center">这个说法正确吗？</p>

      {!answered && (
        <div className="flex gap-3">
          <button onClick={() => handleAnswer(true)} className="flex-1 py-3 bg-green-50 text-[var(--success)] rounded-xl font-medium hover:bg-green-100 transition-colors">正确</button>
          <button onClick={() => handleAnswer(false)} className="flex-1 py-3 bg-red-50 text-[var(--danger)] rounded-xl font-medium hover:bg-red-100 transition-colors">错误</button>
        </div>
      )}

      {answered && (
        <div className="space-y-4">
          <div className={`rounded-2xl p-4 ${userAnswer === trap.isTrue ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className="text-sm font-semibold mb-1">{userAnswer === trap.isTrue ? '你答对了' : '你答错了'}</p>
            <p className="text-sm text-[var(--text-secondary)]">{trap.explanation}</p>
          </div>

          <div className="text-xs text-[var(--text-muted)]">正确率：{correct}/{total}（{total > 0 ? Math.round(correct / total * 100) : 0}%）</div>

          <button onClick={handleNext} className="w-full py-3 bg-[var(--primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
            {index + 1 < TRAPS.length ? '下一题' : '完成'}
          </button>
        </div>
      )}
    </div>
  )
}
