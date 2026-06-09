
// TODO Day3: runAiAction() を呼び出して結果を表示する

import { useState } from 'react'
import type { AiResult } from '../Types'
import type { AiActionType } from '../utils/ai'
import { getAiResponse, AI_ACTION_META } from '../utils/ai'
import { formalFullTimeJa } from '../utils/formalTime'

import ReactMarkdown from 'react-markdown'

interface AiPanelProps {
  content: string, // 現在のノートの本文
  onClose: () => void
}

// アクションボタン群のキー
const ACTION_KEYS: AiActionType[] = [
  'translate-jp',
  'translate-en',
  'summerize',
  'grammer',
]

export function AiPanel({ content, onClose }: AiPanelProps) {
  // 状態管理
  // 処理中のアクション
  const [loading, setLoading] = useState<boolean>(false)
  // エラーメッセージ（null = エラーなし）
  const [error, setError] = useState<string | null>(null)

  // 過去の結果一覧
  const [result, setResult] = useState<AiResult[]>([])

  // 現在のノートに内容が存在するかどうか
  const hasContent = content.trim().length > 0

  async function handleAiAction(action: AiActionType) {

    if (loading) return
    setLoading(true)
    setError(null)

    try {
      // AI の結果を取得
      const response = await getAiResponse(action, content)
      // 結果を格納
      const claudeAiResult = {
        action: action,
        content: response,
        dotColor: AI_ACTION_META[action].dotColor,
        timestamp: formalFullTimeJa(new Date().toISOString())
      }
      // 一番前の5件の結果を表示
      setResult(prev => [claudeAiResult, ...prev].slice(0, 5))
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }
  return (
    <aside className="ai-panel">

      {/* ── ヘッダー ── */}
      <div className="ai-head">
        <div className="ai-title">
          <span>✦</span>
          AIアシスタント
        </div>
        {/* onClick で AI パネルを閉じる */}
        <button className="icon-btn" aria-label="閉じる" onClick={onClose}>✕</button>
      </div>

      {/* ── アクションボタン群 ── */}
      {/* onClick で getAiResponse() を呼び出す */}
      <div className="ai-actions">
        <div className="ai-section-label">機能を選択</div>

        {ACTION_KEYS.map(key => {
          const meta = AI_ACTION_META[key]
          return (
            <button
              key={key}
              className="ai-action-btn"
              onClick={() => handleAiAction(key)}
              disabled={loading || !hasContent}
            >
              <span className="ai-btn-icon">{meta.icon}</span>
              {meta.label}
              <span className="ai-badge">{loading ? '処理中...' : meta.badge}</span>
            </button>)
        })}

        {!hasContent && (
          <p style={{ fontSize: 11, color: 'var(--ink-4)', lineHeight: 1.7, marginTop: 4 }}>
            ノートに内容を入力すると<br />AI機能が使えます ✿
          </p>
        )}
      </div>



      {/* ── 結果エリア ── */}
      <div className="ai-results">

        {/* ローディング */}
        {loading && (
          <div style={{ display: 'flex', gap: 5, padding: '12px 4px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} className="l-dot" style={{
                width: 5, height: 5, borderRadius: '50%',
                background: i === 0 ? '#F2A7B0' : i === 1 ? '#8FD0BA' : '#97BEF0',
                animation: `bounce-dot 1.1s ease-in-out ${i * 0.15}s infinite`,
              }} />
            ))}
          </div>
        )}

        {/* エラー */}
        {error && (
          <div style={{
            fontSize: 12, color: '#C0622A', background: '#FBF0E8',
            border: '1px solid rgba(192,98,42,0.25)',
            borderRadius: 10, padding: '9px 11px', lineHeight: 1.7,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* 空の状態 */}
        {result.length === 0 && !loading && !error && (
          <div className="ai-empty">
            <div className="ai-empty-icon">✨</div>
            <p className="ai-empty-text">
              ボタンをクリックすると<br />結果がここに表示されます
            </p>
          </div>
        )}

        {/* 結果カード */}
        {result.map((res, index) => (
          <div key={index} className="ai-card">
            <div className="ai-card-top">
              <div className="ai-card-dot" style={{ background: res.dotColor }} />
              {AI_ACTION_META[res.action].label}
              <span className="ai-card-timestamp" style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--ink-4)' }}>
                {res.timestamp}
              </span>
            </div>
            <div className="ai-card-body">
              <ReactMarkdown>{res.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

    </aside>
  )
}
