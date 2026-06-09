import type { AiActionType } from '../utils/ai'

export type TagColor = 'pink' | 'mint' | 'blue' | 'lemon' | 'lavender'

export interface Tag {
  label: string
  color: TagColor
}

export interface Note {
  id: string
  title: string
  content: string
  tags: Tag[]
  stripeColor: string  // サイドバーの左カラーライン
  createdAt: string    // ISO string
  updatedAt: string    // ISO string
}

// 結果カードの型
export interface AiResult {
  action: AiActionType
  content: string
  dotColor: string
  timestamp: string
}