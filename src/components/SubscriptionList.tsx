'use client'

import { Subscription } from '@/types'

interface SubscriptionListProps {
  subscriptions: Subscription[]
  onEdit: (subscription: Subscription) => void
  onDelete: (id: string) => void
}

export default function SubscriptionList({ subscriptions, onEdit, onDelete }: SubscriptionListProps) {
  const handleDelete = (subscription: Subscription) => {
    if (window.confirm(`${subscription.name}を削除しますか？`)) {
      onDelete(subscription.id)
    }
  }

  if (subscriptions.length === 0) {
    return (
      <div className="modern-card bg-gradient-to-br from-gray-900/80 to-blue-900/30 p-8 text-center border border-gray-600/50">
        <div className="text-6xl mb-4">📄</div>
        <p className="text-gray-300 font-medium text-lg">まだサブスクリプションが登録されていません。</p>
        <p className="text-gray-500 mt-3">「新しいサブスクを追加」ボタンから登録してください。</p>
      </div>
    )
  }

  return (
    <div className="modern-card bg-gradient-to-br from-gray-900/80 to-black/80 overflow-hidden border border-gray-600/50">
      <div className="px-6 py-8 sm:p-8">
        <h3 className="text-xl font-bold text-white mb-6 gradient-text">サブスクリプション一覧</h3>
        
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  サービス名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  月額料金
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  請求日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{subscription.name}</div>
                    {subscription.memo && (
                      <div className="text-sm text-gray-500">{subscription.memo}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ¥{subscription.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subscription.billing_date}日
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {subscription.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => onEdit(subscription)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(subscription)}
                      className="text-red-600 hover:text-red-900"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-medium text-gray-900">{subscription.name}</h4>
                <span className="text-lg font-semibold text-gray-900">
                  ¥{subscription.amount.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <span>請求日: {subscription.billing_date}日</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {subscription.category}
                </span>
              </div>
              
              {subscription.memo && (
                <p className="text-sm text-gray-600 mb-3">{subscription.memo}</p>
              )}
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => onEdit(subscription)}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-sm font-medium hover:bg-indigo-200"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(subscription)}
                  className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-medium hover:bg-red-200"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}