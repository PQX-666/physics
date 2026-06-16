import { useState, useRef, useEffect } from 'react'

const API_KEY_STORAGE = 'physics-ai-key'
const API_PROVIDER_STORAGE = 'physics-ai-provider'

interface ProviderConfig { name: string; endpoint: string; model: string }
const PROVIDERS: Record<string, ProviderConfig> = {
  deepseek: { name: 'DeepSeek', endpoint: 'https://api.deepseek.com/chat/completions', model: 'deepseek-chat' },
  openai: { name: 'OpenAI 兼容', endpoint: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o-mini' },
  custom: { name: '自定义', endpoint: '', model: '' },
}

function getApiKey(): string {
  try { return localStorage.getItem(API_KEY_STORAGE) || '' } catch { return '' }
}
function getProvider(): string {
  try { return localStorage.getItem(API_PROVIDER_STORAGE) || 'deepseek' } catch { return 'deepseek' }
}

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
}

const WELCOME_ID = 'welcome'

const WELCOME_MSG: Message = {
  id: WELCOME_ID,
  role: 'ai',
  content: '你好！我是物理AI助教，熟悉这3套真题和39个核心公式。\n\n哪里卡住了告诉我——可以直接粘贴题目，我会帮你一步步理清楚。',
}

export default function AIHelper() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState(getApiKey)
  const [showKeyInput, setShowKeyInput] = useState(!getApiKey())
  const [provider, setProvider] = useState(getProvider)
  const [customEndpoint, setCustomEndpoint] = useState('')
  const [customModel, setCustomModel] = useState('')
  const msgsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [messages, loading])

  function handleSetKey() {
    localStorage.setItem(API_KEY_STORAGE, apiKey)
    setShowKeyInput(false)
  }

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    const key = getApiKey()
    if (!key) { setShowKeyInput(true); return }

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)

    const prov = PROVIDERS[provider]
    const endpoint = provider === 'custom' ? customEndpoint : prov.endpoint
    const model = provider === 'custom' ? customModel : prov.model

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: '你是大学物理C1助教。学生正在复习期末考试，基于3套真题（A/B/C卷）。你熟悉：运动学、牛顿定律、动量冲量、曲线运动、刚体转动、能量守恒、简谐振动、机械波、波动光学。你帮助理解公式含义、解题思路、易错点。用中文回答，尽量简洁，配合学生的复习节奏。用口语化、鼓励的语气。',
            },
            ...messages.filter((m) => m.id !== WELCOME_ID).map((m) => ({
              role: m.role === 'ai' ? 'assistant' : 'user',
              content: m.content,
            })),
            { role: 'user', content: text },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      })

      const data = await response.json()
      const reply = data.choices?.[0]?.message?.content || '抱歉，我暂时无法回答，请稍后再试。'
      setMessages((m) => [...m, { id: Date.now().toString(), role: 'ai', content: reply }])
    } catch {
      setMessages((m) => [...m, { id: Date.now().toString(), role: 'ai', content: '网络请求失败，请检查网络和API Key是否正确。' }])
    } finally {
      setLoading(false)
    }
  }

  function handlePaste() {
    navigator.clipboard.readText().then((text) => {
      setInput(text)
    }).catch(() => {})
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl transition-transform hover:scale-110"
        style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
        title="AI 物理助教"
      >
        🐱
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white animate-pulse" />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-32 right-4 md:bottom-20 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-[360px] max-h-[480px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[var(--border)]">
          {/* Header */}
          <div className="px-4 py-3 text-white font-semibold text-sm flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
            🐱 AI 物理助教
            <button onClick={() => { setOpen(false); setShowKeyInput(false) }} className="ml-auto text-white/80 hover:text-white text-lg leading-none">&times;</button>
          </div>

          {/* Settings bar */}
          <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="text-[10px] text-[var(--primary)] hover:underline"
            >
              {getApiKey() ? '已配置Key ✓' : '设置API Key'}
            </button>
            <select
              value={provider}
              onChange={(e) => { setProvider(e.target.value); localStorage.setItem(API_PROVIDER_STORAGE, e.target.value) }}
              className="text-[10px] bg-white rounded px-1 py-0.5 border border-gray-200"
            >
              {Object.entries(PROVIDERS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
            </select>
          </div>

          {/* API Key input */}
          {showKeyInput && (
            <div className="px-3 py-2 bg-yellow-50 border-b border-yellow-100 space-y-1.5">
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="输入 API Key"
                  className="flex-1 px-2 py-1 text-xs rounded-lg border border-yellow-200 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleSetKey()}
                />
                <button onClick={handleSetKey} className="px-3 py-1 bg-[var(--primary)] text-white rounded-lg text-xs font-medium">
                  保存
                </button>
              </div>
              {provider === 'custom' && (
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={customEndpoint}
                    onChange={(e) => setCustomEndpoint(e.target.value)}
                    placeholder="API Endpoint URL"
                    className="flex-1 px-2 py-1 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                  <input
                    type="text"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    placeholder="Model name"
                    className="w-28 px-2 py-1 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          <div ref={msgsRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[160px] max-h-[260px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[88%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'ai'
                    ? 'bg-gray-100 self-start rounded-bl-md text-[#2D3748]'
                    : 'bg-[#E2E8F0] self-end rounded-br-md text-[#2D3748] ml-auto'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="flex gap-1 px-3 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 border-t border-[var(--border)] bg-gray-50">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="哪里不懂？直接问，或粘贴题目..."
              className="flex-1 px-3 py-2 text-sm rounded-xl border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] bg-white"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
            >
              ➤
            </button>
          </div>
          <div className="px-3 pb-3 bg-gray-50">
            <button onClick={handlePaste} className="w-full py-2 border-2 border-dashed border-[var(--primary)] text-[var(--primary)] rounded-xl text-xs hover:bg-purple-50 transition-colors">
              📋 粘贴题目到这里
            </button>
          </div>
        </div>
      )}
    </>
  )
}
