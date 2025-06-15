'use client'

import React from 'react'
import { Subscription } from '@/types'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface DashboardProps {
  subscriptions: Subscription[]
}

export default function Dashboard({ subscriptions }: DashboardProps) {
  const totalAmount = subscriptions.reduce((sum, sub) => sum + sub.amount, 0)
  
  // カテゴリ別の集計
  const categoryData = subscriptions.reduce((acc, sub) => {
    acc[sub.category] = (acc[sub.category] || 0) + sub.amount
    return acc
  }, {} as Record<string, number>)

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          '#60A5FA', // Light Blue
          '#F87171', // Light Red  
          '#34D399', // Light Green
          '#FBBF24', // Light Yellow
          '#A78BFA', // Light Purple
          '#22D3EE', // Light Cyan
        ],
        borderWidth: 3,
        borderColor: '#1f1f1f',
        hoverBorderColor: '#d4af37',
        hoverBorderWidth: 4,
      },
    ],
  }

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
            weight: 600,
          },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'カテゴリ別支出',
        color: '#d4af37',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
        padding: {
          bottom: 20,
        },
      },
    },
  }

  // 月別請求スケジュール（今月の請求予定）
  const monthlySchedule = Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
    const daySubscriptions = subscriptions.filter(sub => sub.billing_date === day)
    return {
      day,
      amount: daySubscriptions.reduce((sum, sub) => sum + sub.amount, 0),
      count: daySubscriptions.length,
    }
  }).filter(item => item.count > 0)

  const barData = {
    labels: monthlySchedule.map(item => `${item.day}日`),
    datasets: [
      {
        label: '請求予定額 (円)',
        data: monthlySchedule.map(item => item.amount),
        backgroundColor: 'rgba(212, 175, 55, 0.8)',
        borderColor: '#d4af37',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(212, 175, 55, 1)',
        hoverBorderColor: '#ffd700',
        borderRadius: 8,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
            weight: 600,
          },
        },
      },
      title: {
        display: true,
        text: '今月の請求スケジュール',
        color: '#d4af37',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
        padding: {
          bottom: 20,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#e5e5e5',
          font: {
            size: 11,
            weight: 500,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#e5e5e5',
          font: {
            size: 11,
            weight: 500,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: function(value: any) {
            return '¥' + Number(value).toLocaleString()
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="modern-card overflow-hidden bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-400/30">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">¥</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-300 truncate">
                    月額合計
                  </dt>
                  <dd className="text-2xl font-bold text-white mt-1">
                    ¥{totalAmount.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="modern-card overflow-hidden bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-400/30">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">#</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-300 truncate">
                    サブスク数
                  </dt>
                  <dd className="text-2xl font-bold text-white mt-1">
                    {subscriptions.length}件
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="modern-card overflow-hidden bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-400/30">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">~</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-300 truncate">
                    平均単価
                  </dt>
                  <dd className="text-2xl font-bold text-white mt-1">
                    ¥{subscriptions.length > 0 ? Math.round(totalAmount / subscriptions.length).toLocaleString() : 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {subscriptions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Pie Chart */}
          <div className="modern-card p-8 bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-600/30">
            <div className="h-80">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>

          {/* Monthly Schedule Bar Chart */}
          <div className="modern-card p-8 bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-600/30">
            <div className="h-80">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}