'use client'

import { useState } from 'react'

const feedbackTypes = [
  'バグ報告',
  '新機能の要望',
  'UI/UXの改善',
  'パフォーマンスの改善',
  'その他'
]

export default function FeedbackForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // 実際の実装では、ここでAPIエンドポイントに送信するか、
      // 外部サービス（GitHub Issues、Google Forms等）に送信します
      
      // デモ用の処理（実際の送信は行わない）
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage('フィードバックをありがとうございます！改善の参考にさせていただきます。')
      
      // フォームをリセット
      setFeedbackType('')
      setTitle('')
      setDescription('')
      setEmail('')
      
      // 3秒後にメッセージをクリア
      setTimeout(() => {
        setMessage('')
        setIsOpen(false)
      }, 3000)
      
    } catch {
      setMessage('送信に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modern-card bg-gradient-to-br from-white to-blue-50/30 border border-blue-200/30 p-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">📝 改善要望・フィードバック</h3>
          <p className="text-sm text-gray-600 mt-1">
            SubTrackをより良いアプリにするため、ご意見をお聞かせください
          </p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
            isOpen
              ? 'bg-gray-600 border border-gray-500 text-gray-300 hover:bg-gray-500 shadow-md'
              : 'modern-button text-white shadow-lg'
          }`}
        >
          {isOpen ? '閉じる' : 'フィードバックを送信'}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="space-y-6 border-t border-gray-200/50 pt-6">
          <div>
            <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-300">
              種類 *
            </label>
            <select
              id="feedbackType"
              required
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              className="modern-input block w-full text-gray-900 placeholder-gray-500"
            >
              <option value="">フィードバックの種類を選択</option>
              {feedbackTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              タイトル *
            </label>
            <input
              type="text"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="modern-input block w-full text-gray-900 placeholder-gray-500"
              placeholder="例: カテゴリの追加機能が欲しい"
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              詳細説明 *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="modern-input block w-full text-gray-900 placeholder-gray-500"
              placeholder="具体的な内容や改善案をお聞かせください..."
              maxLength={500}
            />
            <p className="mt-1 text-sm text-gray-400">
              {description.length}/500文字
            </p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              メールアドレス（任意）
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="modern-input block w-full text-gray-900 placeholder-gray-500"
              placeholder="返信が必要な場合はご記入ください"
            />
            <p className="mt-1 text-sm text-gray-400">
              返信が必要な場合のみご記入ください
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.includes('失敗') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-gray-600 border border-gray-500 hover:bg-gray-500 text-gray-300 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="modern-button text-white px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-70 disabled:cursor-not-allowed transform transition-all duration-300"
            >
              {loading ? '送信中...' : '送信'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}