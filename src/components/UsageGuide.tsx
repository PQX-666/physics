import { useState } from 'react'

export default function UsageGuide() {
  const [show, setShow] = useState(false)

  return (
    <div className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] overflow-hidden">
      <button
        onClick={() => setShow(!show)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--bg)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">📖</span>
          <h3 className="text-sm font-semibold text-[var(--text)]">使用指南 · 从入门到满绩（以及保命指南）</h3>
        </div>
        <span className={`text-xs text-[var(--text-muted)] transition-transform ${show ? 'rotate-180' : ''}`}>
          {show ? '收起 ▲' : '展开 ▼'}
        </span>
      </button>

      {show && (
        <div className="px-4 pb-4 text-sm leading-relaxed border-t border-[var(--border)] pt-4 space-y-5 text-[var(--text-secondary)]">

          {/* 开篇 */}
          <div className="bg-[var(--primary-light)] rounded-xl p-4 text-[var(--primary)] text-center">
            <p className="font-bold text-base mb-1">🎯 这不是一本公式手册，这是一台物理条件反射训练器。</p>
            <p className="text-xs">看见"匀变速"→ 手自动写出三个公式；看见"子弹打摆球"→ 动量守恒直接弹出来。</p>
            <p className="text-xs mt-1">考场上没有"让我想想"，只有"手比脑子快"。</p>
          </div>

          {/* 科学原理 */}
          <section>
            <h4 className="text-xs font-semibold text-[var(--text)] mb-2">🧠 为什么这玩意儿有用？（科学撑腰版）</h4>
            <div className="bg-[var(--bg)] rounded-xl p-3 space-y-2 text-xs">
              {[
                { color: 'var(--danger)', title: '真题驱动', body: '只练 A/B/C 三套卷提取的 39 个核心公式 + 83 道真题。不练废题，每一分钟都花在刀刃上。' },
                { color: 'var(--warning)', title: '间隔重复', body: '懂的公式少出现，不会的追着你跑，像个记仇的教练，专戳你的软肋，直到你记住为止。' },
                { color: 'var(--primary)', title: '主动回忆', body: '看到名称→脑中检索→翻答案验证。比反复翻书有效 3 倍（认知科学说的，不服找他们）。' },
                { color: 'var(--success)', title: '短板定位', body: '哪个章节最菜、哪个公式总搞混、错误是粗心还是真不会——系统全帮你记着，想抵赖都不行。' },
              ].map((item) => (
                <div key={item.title} className="flex gap-2">
                  <span className="font-bold whitespace-nowrap" style={{ color: item.color }}>{item.title}</span>
                  <span>{item.body}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 各板块 */}
          <section>
            <h4 className="text-xs font-semibold text-[var(--text)] mb-2">🗺️ 各板块说明书（按推荐食用顺序）</h4>

            <div className="space-y-3">

              <details className="bg-[var(--bg)] rounded-xl p-3">
                <summary className="font-medium text-[var(--text)] cursor-pointer text-xs flex items-center gap-1.5">
                  <span>🏠</span> 首页仪表盘 <span className="text-[var(--text-muted)] font-normal">— 你的物理体检中心</span>
                </summary>
                <div className="mt-2 text-xs space-y-1 pl-6">
                  <p>· <strong>四个数字卡片</strong>：待复习 / 已掌握 / 正确率 / 连续天数。正确率低于 60% 会变红——跟体检报告的红字一样令人紧张，请自觉反省。</p>
                  <p>· <strong>今日复习</strong>：自动算出今天该复习什么，按优先级排好。不用纠结，点就完事了。</p>
                  <p>· <strong>极速回忆</strong>：每题 10 秒倒计时，超时不等人。跟考试一样残酷，但这个可以重来。</p>
                  <p>· <strong>智能建议</strong>：系统根据数据告诉你"该补薄弱章节"还是"你很稳了去冲刺吧"。</p>
                  <p>· <strong>7 天冲刺计划</strong>：懒人福音，考前每天该干什么写好了，照做就行。</p>
                </div>
              </details>

              <details className="bg-[var(--bg)] rounded-xl p-3">
                <summary className="font-medium text-[var(--text)] cursor-pointer text-xs flex items-center gap-1.5">
                  <span>🎯</span> 期末靶向冲刺 <span className="text-[var(--text-muted)] font-normal">— 考什么练什么</span>
                </summary>
                <div className="mt-2 text-xs space-y-1 pl-6">
                  <p>· <span className="text-[var(--danger)] font-medium">S 级考点</span>：三套卷全有。送分题，送分题丢分就等于送命。</p>
                  <p>· <span className="text-[var(--warning)] font-medium">A 级考点</span>：两套卷有，必须稳。</p>
                  <p>· <strong>选择判断速刷</strong>：专治"AB 好像都对"的幻觉，30+ 道概念辨析题等着你。</p>
                  <p>· <strong>大题步骤训练</strong>：子弹打摆球、细杆、滑轮、收绳……一步一步拆，比直接看答案有用一百倍。</p>
                  <p>· <strong>高频陷阱</strong>：15 个判断题，挖好坑等你跳，踩过一次终身难忘。</p>
                  <p>· <strong>真题题库</strong>：A/B/C 三套卷 83 道题，选择的判断填空计算都有。</p>
                </div>
              </details>

              <details className="bg-[var(--bg)] rounded-xl p-3">
                <summary className="font-medium text-[var(--text)] cursor-pointer text-xs flex items-center gap-1.5">
                  <span>⏱️</span> 模拟考试 <span className="text-[var(--text-muted)] font-normal">— 体验真实的窒息感</span>
                </summary>
                <div className="mt-2 text-xs space-y-1 pl-6">
                  <p>· 随机抽一套真题，限时 <strong>90 分钟</strong>。右上角倒计时最后 5 分钟变红闪烁——心跳直接拉满。</p>
                  <p>· 自动评分 + 成绩历史。第一次模考大概率做不完，别慌，第二次就好了。</p>
                  <p>· <strong>忠告</strong>：考前至少模考 2 次。第一次你会怀疑人生，第二次你会感谢第一次的自己。</p>
                </div>
              </details>

              <details className="bg-[var(--bg)] rounded-xl p-3">
                <summary className="font-medium text-[var(--text)] cursor-pointer text-xs flex items-center gap-1.5">
                  <span>🚀</span> 考前速查 <span className="text-[var(--text-muted)] font-normal">— 进考场前最后一口气</span>
                </summary>
                <div className="mt-2 text-xs space-y-1 pl-6">
                  <p>· <strong>翻牌卡片</strong>：正面→公式名+使用场景，背面→完整公式+口诀+易错点。3D 翻转，手感拉满。</p>
                  <p>· 按 S/A/B 等级筛选，考前 1 小时只刷 S 级就够了。</p>
                  <p>· "全部展开"直接背，"全部收起"自测——<strong>自测效果远好于背诵</strong>。</p>
                </div>
              </details>

              <details className="bg-[var(--bg)] rounded-xl p-3">
                <summary className="font-medium text-[var(--text)] cursor-pointer text-xs flex items-center gap-1.5">
                  <span>🔄</span> 公式复习 <span className="text-[var(--text-muted)] font-normal">— 每天 15 分钟的仪式感</span>
                </summary>
                <div className="mt-2 text-xs space-y-1 pl-6">
                  <p>· <strong>公式回忆</strong>：看名称→脑中想公式→Space 翻答案→1-5 评分。<strong>请诚实打分</strong>，骗系统就是骗期末成绩。</p>
                  <p>· <strong>极速回忆</strong>：10 秒倒计时模式，逼出你的极限速度。超时自动翻答案，没有拖延的机会。</p>
                  <p>· <strong>高频冲刺</strong>：只刷高频+易错，考前突击专用。</p>
                  <p>· 练完有<strong>逐题回顾</strong> + <strong>薄弱项高亮</strong> + <strong>"重练错题"按钮</strong>。趁热打铁，错了马上再练，别等忘了再回头。</p>
                </div>
              </details>

              <details className="bg-[var(--bg)] rounded-xl p-3">
                <summary className="font-medium text-[var(--text)] cursor-pointer text-xs flex items-center gap-1.5">
                  <span>📚</span> 公式库 <span className="text-[var(--text-muted)] font-normal">— 物理版新华字典</span>
                </summary>
                <div className="mt-2 text-xs space-y-1 pl-6">
                  <p>· 39 个公式随便查：搜名字、筛章节、筛频率、⭐ 收藏。</p>
                  <p>· 点进去看 LaTeX 公式 + 变量说明 + 适用条件 + 触发关键词 + 易错点 + 口诀。</p>
                  <p>· 可以标记"已掌握"——虽然你大概率会骗自己。</p>
                </div>
              </details>

              <details className="bg-[var(--bg)] rounded-xl p-3">
                <summary className="font-medium text-[var(--text)] cursor-pointer text-xs flex items-center gap-1.5">
                  <span>🧠</span> 知识导图 <span className="text-[var(--text-muted)] font-normal">— 双倍快乐</span>
                </summary>
                <div className="mt-2 text-xs space-y-1 pl-6">
                  <p>· <strong>上方图库</strong>：光学专题手写导图（干涉、衍射、光栅、劈尖、偏振…），点击放大，左右翻页浏览。</p>
                  <p>· <strong>下方知识树</strong>：9 个章节交互式公式树，展开→点公式→看口诀和易错点。可全部展开/收起，适合系统性回顾。</p>
                </div>
              </details>

              <details className="bg-[var(--bg)] rounded-xl p-3">
                <summary className="font-medium text-[var(--text)] cursor-pointer text-xs flex items-center gap-1.5">
                  <span>📊</span> 薄弱分析 <span className="text-[var(--text-muted)] font-normal">— 直面惨淡的人生</span>
                </summary>
                <div className="mt-2 text-xs space-y-1 pl-6">
                  <p>· <strong>薄弱章节</strong>：柱状图，红色 = 危，快补。绿色 = 稳，保持。</p>
                  <p>· <strong>易错公式 TOP 10</strong>：按错误率自动排名，你的专属黑名单。</p>
                  <p>· <strong>常见错因统计</strong>：忘记公式？不理解？变量搞混？粗心？系统帮你算得明明白白。</p>
                  <p>· <strong>易混淆公式对</strong>：弹簧振子 vs 单摆、平动动能 vs 转动动能、双缝明纹 vs 暗纹……点击直接对比，从此不再犯浑。</p>
                </div>
              </details>

              <details className="bg-[var(--bg)] rounded-xl p-3">
                <summary className="font-medium text-[var(--text)] cursor-pointer text-xs flex items-center gap-1.5">
                  <span>🔧</span> 隐藏小工具
                </summary>
                <div className="mt-2 text-xs space-y-1 pl-6">
                  <p>· <strong>🐱 AI 物理助教</strong>（右下角紫色猫头）：接 DeepSeek / OpenAI，不懂的题直接粘贴问它。不是抄答案——是让 AI 讲到你懂为止。支持自定义 API，换个模型也一样用。</p>
                  <p>· <strong>🔍 全局搜索</strong>（Ctrl+K）：搜公式名或题目内容，秒定位，比翻书快 100 倍。</p>
                  <p>· <strong>🌙 深色模式</strong>：夜间复习不刺眼，保护你的熬夜眼（但还是建议你早点睡）。</p>
                  <p>· <strong>📥 数据导出</strong>（设置页）：换设备？导出 JSON → 新设备导入，学习记录无缝迁移。</p>
                </div>
              </details>
            </div>
          </section>

          {/* 快捷键 */}
          <section>
            <h4 className="text-xs font-semibold text-[var(--text)] mb-2">⌨️ 键盘快捷键（告别鼠标，效率翻倍）</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { key: 'Space / Enter', action: '翻看答案' },
                { key: '1 - 5', action: '自信度评分' },
                { key: 'Ctrl + K', action: '全局搜索' },
                { key: 'Esc', action: '关闭弹窗 / 搜索' },
                { key: '← →', action: '导图翻页' },
                { key: '↑ ↓', action: '搜索结果导航' },
              ].map((s) => (
                <div key={s.key} className="bg-white rounded-lg px-3 py-2 flex items-center justify-between">
                  <span className="font-mono font-bold text-[var(--primary)] text-[11px]">{s.key}</span>
                  <span className="text-[var(--text-secondary)]">{s.action}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 使用节奏 */}
          <section>
            <h4 className="text-xs font-semibold text-[var(--text)] mb-2">📋 推荐使用节奏（照做就行版）</h4>
            <div className="bg-[var(--bg)] rounded-xl p-3 space-y-3 text-xs">
              {[
                { icon: '🌅', title: '距离考试 > 2 周', desc: '今日复习 → 极速回忆来一轮', time: '每天 15 分钟' },
                { icon: '🔥', title: '考前 7 天', desc: '7 天冲刺计划 + 期末靶向训练 + 薄弱分析查缺补漏', time: '每天 30-45 分钟' },
                { icon: '💀', title: '考前 24 小时', desc: '模考 ×2 → 速查 S 级刷一遍 → 导图浏览 → AI 助教最后答疑 → 睡觉', time: '3-4 小时' },
                { icon: '⚡', title: '进考场前 10 分钟', desc: '手机打开速查页，S 级扫一遍口诀，深呼吸，冲', time: '10 分钟' },
              ].map((stage) => (
                <div key={stage.title} className="flex items-start gap-2">
                  <span className="text-base mt-0.5">{stage.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-[var(--text)]">{stage.title}</p>
                    <p>{stage.desc}</p>
                  </div>
                  <span className="text-[var(--primary)] font-medium whitespace-nowrap">{stage.time}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 温馨提示 + 用户要求加的话 */}
          <div className="bg-orange-50 rounded-xl p-4 space-y-3 text-xs">
            <div>
              <p className="font-bold text-[var(--warning)] mb-1">⚠️ 友情提醒（不客气的实话版）</p>
              <ul className="space-y-0.5 text-[var(--warning)]">
                <li>· <strong>评分请诚实。</strong>选"秒答"但实际不会 → 系统以为你掌握了 → 不再给你练 → 考试就挂了。</li>
                <li>· <strong>考前 1 天才开始用？</strong>效果大打折扣。间隔重复需要时间腌入味，建议至少提前 2 周。</li>
                <li>· <strong>公式不是背的，是理解的。</strong>右下角 AI 猫头随时等着你问"为什么"。</li>
                <li>· <strong>模考做不完很正常。</strong>第一次能做 40/83 就算优秀。练多了速度自然上去。</li>
                <li>· <strong>每天 15 分钟，坚持 2 周，比你考前通宵 8 小时有用。</strong>这是科学，不是鸡汤。</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-3 text-[var(--text-secondary)] leading-relaxed">
              💡 <strong>坦诚地说——</strong>这里面的题目比较基础，如果你的考试难度比较大，请额外再练几套你们学校的模拟题。但把这个系统里的 39 个公式全部搞懂吃透，<strong className="text-[var(--text)]">及格是稳的</strong>，剩下的分靠你自己了。
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
