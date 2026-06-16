import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react'

interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  toast: (message: string, type?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} })

let nextId = 0
let globalToast: ((message: string, type?: 'success' | 'error' | 'info') => void) | null = null

export function toast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  globalToast?.(message, type)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = nextId++
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2000)
  }, [])

  useEffect(() => {
    globalToast = addToast
    return () => { globalToast = null }
  }, [addToast])

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-gray-800',
  }

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-1.5 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${colors[t.type]} text-white text-xs px-4 py-2 rounded-full shadow-lg animate-bounce-in pointer-events-auto`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
