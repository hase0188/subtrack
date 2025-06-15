import { Subscription } from '@/types'

export const defaultGuestData: Subscription[] = [
  {
    id: 'guest-1',
    user_id: 'guest',
    name: 'Netflix',
    amount: 1490,
    billing_date: 15,
    category: 'エンターテイメント',
    memo: 'プレミアムプラン',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'guest-2',
    user_id: 'guest',
    name: 'Spotify',
    amount: 980,
    billing_date: 3,
    category: 'エンターテイメント',
    memo: '音楽ストリーミング',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'guest-3',
    user_id: 'guest',
    name: 'Adobe Creative Cloud',
    amount: 6552,
    billing_date: 25,
    category: 'ビジネス',
    memo: '年額プランを月額換算',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'guest-4',
    user_id: 'guest',
    name: 'GitHub Pro',
    amount: 500,
    billing_date: 10,
    category: 'ビジネス',
    memo: '開発者向けプラン',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'guest-5',
    user_id: 'guest',
    name: 'Notion Pro',
    amount: 800,
    billing_date: 20,
    category: 'ビジネス',
    memo: 'チームプラン',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  }
]

export const getGuestData = (): Subscription[] => {
  if (typeof window === 'undefined') return defaultGuestData
  
  const stored = localStorage.getItem('guestSubscriptions')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return defaultGuestData
    }
  }
  
  // 初回アクセス時はデフォルトデータを保存
  localStorage.setItem('guestSubscriptions', JSON.stringify(defaultGuestData))
  return defaultGuestData
}

export const saveGuestData = (subscriptions: Subscription[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('guestSubscriptions', JSON.stringify(subscriptions))
  }
}

export const isGuestMode = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('guestMode') === 'true'
}

export const clearGuestMode = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('guestMode')
    localStorage.removeItem('guestSubscriptions')
  }
}

export const generateGuestId = (): string => {
  return `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}