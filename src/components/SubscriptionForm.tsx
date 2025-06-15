'use client'

import { useState, useEffect } from 'react'
import { Subscription } from '@/types'

interface SubscriptionFormProps {
  onSubmit: (data: Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
  onCancel: () => void
  initialData?: Subscription | null
}

const categories = [
  'エンターテイメント',
  'ビジネス',
  'ヘルス・フィットネス',
  '教育',
  'ユーティリティ',
  'その他'
]

export default function SubscriptionForm({ onSubmit, onCancel, initialData }: SubscriptionFormProps) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [billingDate, setBillingDate] = useState('')
  const [category, setCategory] = useState('')
  const [memo, setMemo] = useState('')
  const [loading, setLoading] = useState(false)
  const [pricingType, setPricingType] = useState<'monthly' | 'yearly'>('monthly')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      // 編集時は常に月額として表示（データベースに保存されているのは月額）
      setAmount(initialData.amount.toString())
      setBillingDate(initialData.billing_date.toString())
      setCategory(initialData.category)
      setMemo(initialData.memo || '')
      setPricingType('monthly') // 編集時は月額で表示
    } else {
      // 新規作成時はフォームをリセット
      setName('')
      setAmount('')
      setBillingDate('')
      setCategory('')
      setMemo('')
      setPricingType('monthly')
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 年額の場合は月額に変換（年額 ÷ 12）
    const monthlyAmount = pricingType === 'yearly' 
      ? parseFloat(amount) / 12 
      : parseFloat(amount)

    const subscriptionData = {
      name,
      amount: monthlyAmount,
      billing_date: parseInt(billingDate),
      category,
      memo,
    }

    await onSubmit(subscriptionData)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
          サービス名 *
        </label>
        <input
          type="text"
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="modern-input block w-full text-gray-900 placeholder-gray-500"
          placeholder="例: Netflix"
        />
      </div>

      <div>
        <label htmlFor="pricingType" className="block text-sm font-medium text-gray-300">
          料金タイプ *
        </label>
        <select
          id="pricingType"
          value={pricingType}
          onChange={(e) => setPricingType(e.target.value as 'monthly' | 'yearly')}
          className="modern-input block w-full text-gray-900 placeholder-gray-500"
        >
          <option value="monthly">月額</option>
          <option value="yearly">年額</option>
        </select>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
          {pricingType === 'monthly' ? '月額料金' : '年額料金'} (円) *
        </label>
        <input
          type="number"
          id="amount"
          required
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="modern-input block w-full text-gray-900 placeholder-gray-500"
          placeholder={pricingType === 'monthly' ? '例: 1490' : '例: 17880'}
        />
        {pricingType === 'yearly' && amount && (
          <p className="mt-1 text-sm text-gray-400">
            月額換算: ¥{Math.round(parseFloat(amount) / 12).toLocaleString()}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="billingDate" className="block text-sm font-medium text-gray-300">
          請求日 *
        </label>
        <select
          id="billingDate"
          required
          value={billingDate}
          onChange={(e) => setBillingDate(e.target.value)}
          className="modern-input block w-full text-gray-900 placeholder-gray-500"
        >
          <option value="">請求日を選択</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
            <option key={day} value={day}>
              {day}日
            </option>
          ))}
        </select>
        {pricingType === 'yearly' && (
          <p className="mt-1 text-sm text-gray-400">
            ※年額の場合も月単位で管理されます（年額÷12の金額で毎月計算）
          </p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-300">
          カテゴリ *
        </label>
        <select
          id="category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="modern-input block w-full text-gray-900 placeholder-gray-500"
        >
          <option value="">カテゴリを選択</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="memo" className="block text-sm font-medium text-gray-300">
          メモ
        </label>
        <textarea
          id="memo"
          rows={3}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="modern-input block w-full text-gray-900 placeholder-gray-500"
          placeholder="追加の情報があれば記入してください"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 border border-gray-500 hover:bg-gray-500 text-gray-300 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading}
          className="modern-button text-white px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-70 disabled:cursor-not-allowed transform transition-all duration-300"
        >
          {loading ? '保存中...' : (initialData ? '更新' : '追加')}
        </button>
      </div>
    </form>
  )
}