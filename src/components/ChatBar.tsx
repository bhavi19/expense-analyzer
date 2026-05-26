import { Loader2, Send } from 'lucide-react'
import { useState } from 'react'
import { answerQuestion } from '../lib/chat'
import type { ChatMessage, ExpenseAnalysis } from '../lib/types'

interface ChatBarProps {
  analysis: ExpenseAnalysis | null
}

const SUGGESTIONS = [
  'How can I save ₹3000 this month?',
  'Where am I overspending?',
  'How does my 50/30/20 split look?',
]

export function ChatBar({ analysis }: ChatBarProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  function sendMessage(text: string) {
    if (!text.trim() || !analysis) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: answerQuestion(text, analysis),
      }
      setMessages((prev) => [...prev, reply])
      setLoading(false)
    }, 400)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="mb-1 text-lg font-medium text-white">Ask about your finances</h3>
      <p className="mb-4 text-sm text-gray-500">
        Follow-up questions about savings, overspending, and budget rules
      </p>

      {messages.length > 0 && (
        <div className="mb-4 max-h-48 space-y-3 overflow-y-auto rounded-xl border border-white/5 bg-black/20 p-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`text-sm whitespace-pre-line ${
                message.role === 'user' ? 'text-emerald-300' : 'text-gray-300'
              }`}
            >
              <span className="font-medium">{message.role === 'user' ? 'You: ' : 'AI: '}</span>
              {message.content}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking...
            </div>
          )}
        </div>
      )}

      <div className="mb-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            disabled={!analysis}
            onClick={() => sendMessage(suggestion)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400 transition hover:border-emerald-500/30 hover:text-emerald-300 disabled:opacity-40"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={analysis ? 'Ask anything about your expenses...' : 'Analyze expenses first...'}
          disabled={!analysis}
          className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-emerald-500/40 disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={!analysis || !input.trim() || loading}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
          Ask
        </button>
      </form>
    </div>
  )
}
