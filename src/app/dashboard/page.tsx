'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Subscription } from '@/types'
import { format, isToday, isTomorrow } from 'date-fns'
import SubscriptionForm from '@/components/SubscriptionForm'
import SubscriptionList from '@/components/SubscriptionList'
import Dashboard from '@/components/Dashboard'
import FeedbackForm from '@/components/FeedbackForm'
import { isGuestMode, getGuestData, saveGuestData, generateGuestId, clearGuestMode } from '@/lib/guestData'

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [guestMode, setGuestMode] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const initializeData = async () => {
      const isGuest = isGuestMode()
      setGuestMode(isGuest)
      
      if (isGuest) {
        setUser({ email: 'ゲストユーザー', id: 'guest' })
        setSubscriptions(getGuestData())
        setLoading(false)
      } else {
        await getUser()
        await getSubscriptions()
      }
    }
    initializeData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ゲストモードでない場合で、ユーザーが認証されていない場合はログインページにリダイレクト
  useEffect(() => {
    if (!loading && !guestMode && !user) {
      router.push('/auth/login')
    }
  }, [loading, guestMode, user, router])

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  const getSubscriptions = async () => {
    if (guestMode) {
      setSubscriptions(getGuestData())
      return
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching subscriptions:', error)
    } else {
      setSubscriptions(data || [])
    }
  }

  const handleLogout = async () => {
    if (guestMode) {
      clearGuestMode()
      router.push('/auth/login')
    } else {
      await supabase.auth.signOut()
      router.push('/auth/login')
    }
  }

  const handleSignUp = () => {
    router.push('/auth/register')
  }

  const handleSubscriptionSubmit = async (subscriptionData: Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (guestMode) {
      const currentData = getGuestData()
      
      if (editingSubscription) {
        const updatedData = currentData.map(sub => 
          sub.id === editingSubscription.id 
            ? { ...sub, ...subscriptionData, updated_at: new Date().toISOString() }
            : sub
        )
        saveGuestData(updatedData)
        setSubscriptions(updatedData)
      } else {
        const newSubscription: Subscription = {
          id: generateGuestId(),
          user_id: 'guest',
          ...subscriptionData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        const updatedData = [...currentData, newSubscription]
        saveGuestData(updatedData)
        setSubscriptions(updatedData)
      }
      
      setEditingSubscription(null)
      setShowForm(false)
      return
    }

    if (editingSubscription) {
      const { error } = await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('id', editingSubscription.id)

      if (!error) {
        getSubscriptions()
        setEditingSubscription(null)
        setShowForm(false)
      }
    } else {
      const { error } = await supabase
        .from('subscriptions')
        .insert([{ ...subscriptionData, user_id: user.id }])

      if (!error) {
        getSubscriptions()
        setShowForm(false)
      }
    }
  }

  const handleDeleteSubscription = async (id: string) => {
    if (guestMode) {
      const currentData = getGuestData()
      const updatedData = currentData.filter(sub => sub.id !== id)
      saveGuestData(updatedData)
      setSubscriptions(updatedData)
      return
    }

    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id)

    if (!error) {
      getSubscriptions()
    }
  }

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription)
    setShowForm(true)
  }

  const getUpcomingReminders = () => {
    const today = new Date()
    const upcomingReminders = subscriptions.filter(sub => {
      const billingDate = new Date(today.getFullYear(), today.getMonth(), sub.billing_date)
      if (billingDate < today) {
        billingDate.setMonth(billingDate.getMonth() + 1)
      }
      return isToday(billingDate) || isTomorrow(billingDate)
    })
    return upcomingReminders
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  const upcomingReminders = getUpcomingReminders()

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-zinc-900">
      <header className="glass backdrop-blur-md border-b border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold gradient-text">SubTrack</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300 bg-white/10 px-4 py-2 rounded-full border border-white/20">{user?.email}</span>
              {guestMode ? (
                <>
                  <button
                    onClick={handleSignUp}
                    className="modern-button text-black px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    サインアップ
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-xl border border-gray-500/30"
                  >
                    ゲスト終了
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-xl border border-red-500/30"
                >
                  ログアウト
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 fade-in">
        {/* Guest Mode Banner */}
        {guestMode && (
          <div className="mb-8 modern-card bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-400/30 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🚀</span>
                <div>
                  <h3 className="text-lg font-semibold text-blue-300">ゲストモードでご利用中</h3>
                  <p className="text-sm text-blue-200">データはブラウザのローカルストレージに保存されます。アカウント作成で永続保存できます。</p>
                </div>
              </div>
              <button
                onClick={handleSignUp}
                className="modern-button text-black px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105"
              >
                アカウント作成
              </button>
            </div>
          </div>
        )}

        {/* Reminders */}
        {upcomingReminders.length > 0 && (
          <div className="mb-8 modern-card bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30 p-6">
            <h3 className="text-lg font-semibold text-amber-300 mb-3 flex items-center">
              <span className="text-2xl mr-2">🔔</span>
              請求予定のリマインド
            </h3>
            <div className="space-y-3">
              {upcomingReminders.map(sub => {
                const today = new Date()
                const billingDate = new Date(today.getFullYear(), today.getMonth(), sub.billing_date)
                if (billingDate < today) {
                  billingDate.setMonth(billingDate.getMonth() + 1)
                }
                const isToday = format(billingDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
                return (
                  <div key={sub.id} className="bg-black/40 backdrop-blur-sm rounded-lg p-3 flex justify-between items-center border border-white/10">
                    <span className="font-medium text-amber-200">{sub.name}</span>
                    <div className="text-right">
                      <div className="font-bold text-amber-300">¥{sub.amount.toLocaleString()}</div>
                      <div className="text-sm text-amber-400">{isToday ? '今日' : '明日'}請求予定</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Dashboard Stats */}
        <Dashboard subscriptions={subscriptions} />

        {/* Action Buttons */}
        <div className="mb-8">
          <button
            onClick={() => {
              setEditingSubscription(null)
              setShowForm(true)
            }}
            className="modern-button flex items-center space-x-2 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg transform transition-all duration-300 hover:scale-105"
          >
            <span className="text-lg">+</span>
            <span>新しいサブスクを追加</span>
          </button>
        </div>

        {/* Subscription Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="modern-card w-full max-w-md mx-auto bg-black/90 backdrop-blur-lg border border-white/20 shadow-2xl">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-6 gradient-text">
                  {editingSubscription ? 'サブスクを編集' : '新しいサブスクを追加'}
                </h3>
                <SubscriptionForm
                  onSubmit={handleSubscriptionSubmit}
                  onCancel={() => {
                    setShowForm(false)
                    setEditingSubscription(null)
                  }}
                  initialData={editingSubscription}
                />
              </div>
            </div>
          </div>
        )}

        {/* Subscription List */}
        <SubscriptionList
          subscriptions={subscriptions}
          onEdit={handleEditSubscription}
          onDelete={handleDeleteSubscription}
        />

        {/* Feedback Form */}
        <div className="mt-16">
          <FeedbackForm />
        </div>
      </main>
    </div>
  )
}