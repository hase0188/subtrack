export interface Subscription {
  id: string
  user_id: string
  name: string
  amount: number
  billing_date: number
  category: string
  memo?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  created_at: string
}