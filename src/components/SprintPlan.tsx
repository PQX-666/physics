import { useState } from 'react'
import { getFormulaById } from '../data/formulas'
import { getExamPatternsByPriority } from '../data/examPatterns'

interface DayPlan {
  day: number
  title: string
  focus: string
  chapters: string[]
  formulas: string[]
  patterns: string[]
  tips: string[]
  mode: string
}

const SPRINT_PLAN: DayPlan[] = [
  { day: 1, title: '运动学 + 曲线运动', focus: 'at、an、a(t)积分、a(x)求速度', chapters: ['运动学', '曲线运动'], formulas: ['acceleration', 'tangential_acceleration', 'normal_acceleration', 'total_acceleration', 'uniform_velocity', 'uniform_displacement', 'velocity_displacement', 'velocity'], patterns: ['ep1', 'ep2', 'ep3', 'ep4'], tips: ['切向加速度改变速度大小，法向加速度改变速度方向', 'a(x)求速度用 a=v·dv/dx', '非匀速圆周运动既有at也有an'], mode: 'recall' },
  { day: 2, title: '刚体转动', focus: 'M=Jβ、转动惯量、转动动能、细杆/圆盘', chapters: ['刚体转动'], formulas: ['torque', 'rotational_newton', 'moment_of_inertia', 'rotational_ke', 'linear_angular_velocity', 'tangential_angular', 'normal_angular', 'angular_velocity', 'angular_acceleration'], patterns: ['ep6', 'ep7', 'ep8'], tips: ['圆盘J=½MR²，细杆绕端点J=⅓ML²', '边缘线加速度at=βR', '重力力矩作用点在质心'], mode: 'speed' },
  { day: 3, title: '动量、角动量、碰撞', focus: '子弹打摆球、子弹打杆、收绳圆周运动', chapters: ['动量与冲量', '刚体转动'], formulas: ['momentum', 'momentum_conservation', 'angular_momentum', 'rigid_angular_momentum', 'angular_momentum_conservation', 'impulse_theorem'], patterns: ['ep10', 'ep11', 'ep12'], tips: ['碰撞瞬间不能机械能守恒', '子弹打杆要用角动量守恒', '收绳：角动量守恒，机械能不守恒'], mode: 'recall' },
  { day: 4, title: '简谐振动 + 机械波', focus: '弹簧、单摆、波方程、波形图写波函数', chapters: ['简谐振动', '机械波'], formulas: ['hooke_law', 'shm_equation', 'spring_period', 'pendulum_period', 'spring_omega', 'wave_function', 'wave_speed', 'wave_number', 'angular_frequency', 'frequency_period'], patterns: ['ep13', 'ep14', 'ep15', 'ep16'], tips: ['弹簧切成n段 k\'=nk', '波方程中 ωt-kx 为+x方向', '从波形图读A、λ求ω、k'], mode: 'speed' },
  { day: 5, title: '波动光学', focus: '双缝、单缝、劈尖、牛顿环、光栅', chapters: ['波动光学'], formulas: ['double_slit_fringe', 'double_slit_bright', 'double_slit_dark', 'single_slit_dark', 'single_slit_central', 'grating'], patterns: ['ep17', 'ep18', 'ep19'], tips: ['双缝Δx=λD/d，单缝Δx=2fλ/a', '放入水中λ变短，条纹变窄', '劈尖越靠近棱边级数越低'], mode: 'speed' },
  { day: 6, title: '偏振 + 综合易错题', focus: '马吕斯定律、布儒斯特角、概念判断', chapters: ['波动光学', '能量守恒'], formulas: ['malus_law', 'brewster_angle', 'mechanical_energy_conservation', 'work_energy_theorem'], patterns: ['ep20', 'ep21', 'ep5'], tips: ['自然光过第一片偏振片I=I₀/2', '布儒斯特角tan iB=n₂/n₁', '反射光为完全偏振光'], mode: 'speed' },
  { day: 7, title: '全真模拟复盘', focus: '错题、薄弱公式、S级考点、计算题步骤', chapters: ['全部'], formulas: [], patterns: [], tips: ['复盘所有错题', '重点回顾S级考点', '重做计算题步骤卡', '检查薄弱公式是否已掌握'], mode: 'sprint' },
]

export default function SprintPlan() {
  const [activeDay, setActiveDay] = useState(0)
  const plan = SPRINT_PLAN[activeDay]

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {SPRINT_PLAN.map((d, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeDay === i ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
            }`}
          >
            Day {d.day}
          </button>
        ))}
      </div>

      <div className="bg-[var(--bg)] rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl font-bold text-[var(--primary)]">Day {plan.day}</span>
          <div>
            <h3 className="font-semibold text-[var(--text)]">{plan.title}</h3>
            <p className="text-xs text-[var(--text-secondary)]">{plan.focus}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold text-[var(--text-secondary)] mb-1">今日目标</div>
            <p className="text-sm text-[var(--text)]">复习 {plan.chapters.join('、')}</p>
          </div>

          <div>
            <div className="text-xs font-semibold text-[var(--text-secondary)] mb-1">推荐模式</div>
            <span className="text-xs bg-[var(--primary-light)] text-[var(--primary)] px-2.5 py-1 rounded-full">
              {plan.mode === 'speed' ? '极速回忆' : plan.mode === 'sprint' ? '高频冲刺' : '公式回忆'}
            </span>
          </div>

          {plan.formulas.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-[var(--text-secondary)] mb-1">必刷公式</div>
              <div className="flex flex-wrap gap-1">
                {plan.formulas.filter(Boolean).map((fid) => {
                  const f = getFormulaById(fid)
                  return f ? <span key={fid} className="text-xs bg-white text-[var(--text)] px-2 py-0.5 rounded-lg">{f.name}</span> : null
                })}
              </div>
            </div>
          )}

          {plan.patterns.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-[var(--text-secondary)] mb-1">必刷题型</div>
              <div className="flex flex-wrap gap-1">
                {plan.patterns.filter(Boolean).map((pid) => {
                  const patterns = getExamPatternsByPriority('S').concat(getExamPatternsByPriority('A'))
                  const p = patterns.find((x) => x.id === pid)
                  return p ? <span key={pid} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-lg">{p.title}</span> : null
                })}
              </div>
            </div>
          )}

          <div>
            <div className="text-xs font-semibold text-[var(--warning)] mb-1">易错提醒</div>
            <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-0.5">
              {plan.tips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
