'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('ログインに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = () => {
    // ゲストモードフラグをローカルストレージに保存
    localStorage.setItem('guestMode', 'true')
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-zinc-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-4xl font-bold gradient-text">
          SubTrack
        </h2>
        <p className="mt-3 text-center text-base text-gray-300 font-medium">
          サブスクリプション管理アプリ
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="modern-card py-10 px-8 shadow-2xl backdrop-blur-lg bg-black/80 border border-white/20">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                メールアドレス
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="modern-input block w-full text-gray-900 placeholder-gray-500 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                パスワード
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center font-medium">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="modern-button w-full flex justify-center text-white font-semibold disabled:opacity-70 disabled:cursor-not-allowed transform transition-all duration-300"
              >
                {loading ? 'ログイン中...' : 'ログイン'}
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black/80 text-gray-400">または</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full flex justify-center py-3 px-4 border border-gray-600 rounded-xl shadow-sm text-sm font-semibold text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105"
              >
                🚀 ゲストとして始める
              </button>

              <div className="text-center">
                <Link
                  href="/auth/register"
                  className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors duration-200 hover:underline"
                >
                  アカウントをお持ちでない方はこちら
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}