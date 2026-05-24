import { useState } from 'react'

export default function UsageGuide() {
  const [show, setShow] = useState(true)

  if (!show) return null

  return (
    <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-5 text-sm leading-relaxed">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[var(--text)]">使用指南</h3>
        <button onClick={() => setShow(false)} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)]">关闭</button>
      </div>

      <div className="space-y-4 text-[var(--text-secondary)]">
        <section>
          <h4 className="text-xs font-semibold text-[var(--text)] mb-1">项目简介</h4>
          <p>本系统专为大学物理 C 期末考试设计，将<strong className="text-[var(--text)]">公式记忆从被动翻看变为主动训练</strong>。不同于公式手册类 App，我们的核心理念是：考试时没有时间翻书，公式必须在看到题目条件时瞬间触发。</p>
        </section>

        <section>
          <h4 className="text-xs font-semibold text-[var(--text)] mb-1">与市面其他软件的区别</h4>
          <ul className="list-disc list-inside space-y-1">
            <li><strong className="text-[var(--text)]">真题驱动而非泛化背诵</strong>：基于三套模拟卷（A、B、C卷）提取 21 种高频题型和 6 道计算步骤卡，训练内容精准对齐考试</li>
            <li><strong className="text-[var(--text)]">神经反射训练而非公式浏览</strong>：强调「条件→公式」的快速映射，适合考试中看到题目就能写出公式的场景</li>
            <li><strong className="text-[var(--text)]">智能间隔重复</strong>：根据你的掌握程度自动安排复习时间，避免遗忘曲线</li>
            <li><strong className="text-[var(--text)]">键盘操作</strong>：复习时按 Space 显示答案，按 1-5 评分，高效流畅</li>
          </ul>
        </section>

        <section>
          <h4 className="text-xs font-semibold text-[var(--text)] mb-1">三套模拟卷说明</h4>
          <p>系统分析了 A、B、C 三套期末模拟卷的考点分布，提取出 <strong className="text-[var(--text)]">S/A/B 三级优先级</strong>：</p>
          <ul className="list-disc list-inside space-y-0.5 mt-1">
            <li><span className="text-[var(--danger)] font-medium">S 级</span>：三套卷反复出现，必须秒答</li>
            <li><span className="text-[var(--warning)] font-medium">A 级</span>：至少两套卷涉及</li>
            <li><span className="text-[var(--text-muted)] font-medium">B 级</span>：仅一套卷涉及</li>
          </ul>
        </section>

        <section>
          <h4 className="text-xs font-semibold text-[var(--text)] mb-1">五种训练模式</h4>
          <div className="space-y-1.5">
            <p><strong className="text-[var(--text)]">公式回忆</strong> — 看公式名称，回忆公式内容。打基础用。</p>
            <p><strong className="text-[var(--text)]">极速回忆</strong> — 训练神经触发速度，目标是看到条件就写出公式。</p>
            <p><strong className="text-[var(--text)]">条件触发</strong> — 看题目条件选公式，训练题型识别能力。</p>
            <p><strong className="text-[var(--text)]">相似对比</strong> — 对比易混淆公式，解决「记混」问题。</p>
            <p><strong className="text-[var(--text)]">高频冲刺</strong> — 只刷三套卷高频公式和易错卡片，适合考前集中突击。</p>
          </div>
        </section>

        <section>
          <h4 className="text-xs font-semibold text-[var(--text)] mb-1">7 天冲刺计划</h4>
          <p>首页的冲刺计划按章节拆分，每天聚焦 1-2 个章节，搭配推荐模式和必刷公式。Day 1-6 分章训练，Day 7 全真复盘。</p>
        </section>

        <section>
          <h4 className="text-xs font-semibold text-[var(--text)] mb-1">最优使用流程</h4>
          <div className="bg-[var(--bg)] rounded-xl p-3 space-y-1">
            <p><strong>每天</strong>：完成待复习卡片（首页「今日复习」）→ 防止遗忘</p>
            <p><strong>然后</strong>：进行一次极速回忆训练 → 强化条件反射</p>
            <p><strong>考前</strong>：使用期末靶向训练刷题型 + 陷阱训练查缺补漏</p>
            <p><strong>薄弱</strong>：定期查看薄弱分析，针对性补强</p>
          </div>
        </section>
      </div>
    </div>
  )
}
