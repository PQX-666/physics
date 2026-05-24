import type { CalculationPattern } from '../types/formula'

export const calculationPatterns: CalculationPattern[] = [
  {
    id: 'calc1',
    title: '子弹打摆球',
    scenario: '子弹射入静止摆球并嵌入其中，求碰后速度、动能损失、绳张力',
    steps: [
      '第一步：碰撞瞬间动量守恒 → mv = (M+m)V，求共同速度 V',
      '第二步：求碰撞动能损失 → ΔEk = ½mv² - ½(M+m)V²',
      '第三步（如需）：碰后最低点向心力方程 → T - (M+m)g = (M+m)V²/L',
      '第四步（如需）：碰后上摆机械能守恒 → ½(M+m)V² = (M+m)g·L(1-cosθ)',
    ],
    keyFormulas: ['momentum_conservation', 'translational_ke', 'newton_second', 'mechanical_energy_conservation'],
    conservationLaw: [
      '碰撞瞬间：动量守恒（外力冲量可忽略）',
      '碰撞瞬间：机械能不守恒（非弹性碰撞）',
      '碰后上摆：机械能守恒（只有重力做功）',
    ],
    commonMistakes: [
      '碰撞过程用机械能守恒',
      '张力计算漏掉向心力 mv²/L',
      '质量单位 g 没有换成 kg',
    ],
    miniExample: 'm=20g, v=400m/s, M=980g, L=2m → V=8m/s, ΔEk=1568J, T=42N',
  },
  {
    id: 'calc2',
    title: '子弹打细杆',
    scenario: '子弹水平射入竖直悬挂细杆下端并停留，求碰后角速度、最大摆角',
    steps: [
      '第一步：碰撞瞬间对转轴角动量守恒 → mvL = J总·ω',
      '第二步：求总转动惯量 → J总 = ⅓ML² + mL²（杆绕端点 + 子弹绕端点）',
      '第三步：求碰后角速度 → ω = mvL / J总',
      '第四步：上摆过程机械能守恒 → ½J总ω² = Mg·(L/2)(1-cosθ) + mg·L(1-cosθ)',
      '第五步：解出 cosθ → 求最大偏角',
    ],
    keyFormulas: ['angular_momentum_conservation', 'moment_of_inertia', 'rotational_ke', 'mechanical_energy_conservation'],
    conservationLaw: [
      '碰撞瞬间：角动量守恒（轴约束力力矩为零）',
      '碰撞瞬间：线动量不守恒（轴有约束力）',
      '碰后上摆：机械能守恒',
    ],
    commonMistakes: [
      '碰撞瞬间用线动量守恒（轴有约束力）',
      '漏掉子弹绕轴的转动惯量 mL²',
      '杆质心上升高度取错（是 L/2，不是 L）',
    ],
    miniExample: 'm, M=3m, L=0.5m, v=5m/s → J总=0.5m, ω=5rad/s',
  },
  {
    id: 'calc3',
    title: '滑轮带重物下落',
    scenario: '重物通过轻绳带动滑轮转动，不计摩擦，求滑轮转动动能',
    steps: [
      '第一步：写机械能守恒 → mgh = ½mv² + ½Jω²',
      '第二步：用 v = ωR 关联 → ω = v/R',
      '第三步：代入消元 → mgh = ½mv² + ½J(v/R)²',
      '第四步：解出 v² → v² = 2mgh / (m + J/R²)',
      '第五步：滑轮转动动能 → ½Jω² = ½J(v/R)²',
    ],
    keyFormulas: ['mechanical_energy_conservation', 'translational_ke', 'rotational_ke', 'linear_angular_velocity'],
    conservationLaw: [
      '全过程：机械能守恒（无摩擦，绳与滑轮无滑动）',
      '动能 = 重物平动动能 + 滑轮转动动能',
    ],
    commonMistakes: [
      '漏掉重物平动动能',
      '漏掉滑轮转动动能',
      '把 v = ωR 写反成 ω = vR',
    ],
    miniExample: '结果：滑轮转动动能 = mgh · J/(mR²+J)',
  },
  {
    id: 'calc4',
    title: '收绳圆周运动',
    scenario: '小球在光滑水平面绕孔做圆周运动，拉力收绳，求末速度和拉力做功',
    steps: [
      '第一步：判断拉力始终过圆心 → 对孔力矩为零',
      '第二步：角动量守恒 → mr₁²ω₁ = mr₂²ω₂ 或 mr₁v₁ = mr₂v₂',
      '第三步：求末速度 → v₂ = v₁·r₁/r₂ 或 ω₂ = ω₁·(r₁/r₂)²',
      '第四步：拉力做功 = 动能增量 → W = ½mv₂² - ½mv₁²',
    ],
    keyFormulas: ['angular_momentum_conservation', 'angular_momentum', 'translational_ke', 'work_energy_theorem'],
    conservationLaw: [
      '全过程：角动量守恒（拉力对孔力矩为零）',
      '机械能不守恒（拉力做正功）',
      '拉力做功 = 动能增加',
    ],
    commonMistakes: [
      '误以为机械能守恒',
      '忘记拉力做正功（绳拉力方向与小球运动方向有夹角时的分量做功）',
      '角动量公式写成 mrω 而非 mr²ω',
    ],
    miniExample: 'r₁=2m, v₁=3m/s, r₂=1m → v₂=6m/s, W=½m(36-9)=13.5m J',
  },
  {
    id: 'calc5',
    title: '波形图写波方程',
    scenario: '已知某时刻波形图和传播方向，写出波函数（余弦形式）',
    steps: [
      '第一步：从图读振幅 A（最大位移）',
      '第二步：从图读波长 λ（相邻同相位点间距）',
      '第三步：由波速 u 求周期 → T = λ/u',
      '第四步：求 ω = 2π/T 和 k = 2π/λ',
      '第五步：根据传播方向确定符号 → +x方向用减号(ωt-kx)，-x方向用加号(ωt+kx)',
      '第六步：代入已知点的 (x,t,y) 求初相 φ',
    ],
    keyFormulas: ['wave_function', 'wave_speed', 'wave_number', 'angular_frequency'],
    conservationLaw: [
      '波速 u = λ/T = ω/k',
      'k = 2π/λ, ω = 2π/T',
    ],
    commonMistakes: [
      '传播方向符号写反',
      '初相求错（要代对 x 和 t）',
      '没按题目要求用余弦函数',
    ],
    miniExample: 'u=4m/s, +x方向, t=0波形→读A,λ→y=Acos(ωt-kx+φ)',
  },
  {
    id: 'calc6',
    title: '多偏振片光强',
    scenario: '自然光依次通过多片偏振片，求最终透射光强',
    steps: [
      '第一步：自然光过第一片 → I₁ = I₀/2',
      '第二步：过第二片 → I₂ = I₁·cos²θ₁₂（θ₁₂为第一、二片夹角）',
      '第三步：过第三片 → I₃ = I₂·cos²θ₂₃（θ₂₃为第二、三片夹角）',
      '第四步：每片继续乘 cos² 夹角',
    ],
    keyFormulas: ['malus_law'],
    conservationLaw: [
      '自然光通过理想偏振片后光强减半',
      '线偏振光通过偏振片后光强：I = I入·cos²θ',
    ],
    commonMistakes: [
      '忘记第一片后 I₀ 变 I₀/2',
      '夹角取的是两偏振片的偏振化方向夹角（不是入射角）',
      '直接用 I₀cos²θ₁cos²θ₂ 漏掉 1/2',
    ],
    miniExample: 'I₀, P1∥P3, P1与P2夹角π/8 → I = I₀/2·cos²(π/8)·cos²(π/8) = I₀/2·cos⁴(π/8)',
  },
]

export function getCalcPatternById(id: string): CalculationPattern | undefined {
  return calculationPatterns.find((p) => p.id === id)
}
