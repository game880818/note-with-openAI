// ── Day 1: Editor コンポーネント（静的構造のみ）────────────────────────────
// TODO Day2: props で note・onChange を受け取る
// TODO Day2: タグの追加・削除ロジックを実装する
// TODO Day2: 字数カウントを動的にする
import { Note } from '../Types';
import { useState } from 'react';

interface EditorProps {
  note: Note
  // Partial<Note> は Note の一部を更新できるようにする
  // 例えば、title を更新する場合は、{ title: '新しいタイトル' } を渡す
  onChange: (field: Partial<Note>) => void
}

export function Editor({ note, onChange }: EditorProps) {
  const [tagInput, setTagInput] = useState('')
  const textCount = note.content.replace(/\s/g, '').length

  function addTag(label: string) {
    // 入力されたタグをトリミングする
    const trimmedTag = label.trim()

    // 1.空文字の場合、何もしない
    // 2.既に存在するタグの場合、何もしない
    if (!trimmedTag) return
    if (note.tags.some(tag => tag.label === trimmedTag)) return

    // タグの色を周期的に割り当てる
    const COLOR_CYCLE = ['pink', 'mint', 'blue', 'lemon', 'lavender'] as const
    const nextColorIndex = note.tags.length
    const color = COLOR_CYCLE[nextColorIndex % COLOR_CYCLE.length]

    // タグを追加する
    onChange({ tags: [...note.tags, { label: trimmedTag, color }] })
    // タグ入力欄をクリアする
    setTagInput('')
  }
  return (
    <div className="editor-wrap">

      {/* ── タグ編集行 ── */}
      <div className="tags-row">
        <span className="tags-row-label">タグ :</span>

        {note.tags.map(tag => (
          <span className={`edit-tag ${tag.color ? `color-${tag.color}` : ''}`} key={tag.label}>
            {tag.label}
            {/* クリックでタグを削除できるようにする */}
            <button
              className="tag-remove-btn"
              onClick={() => onChange({ tags: note.tags.filter(t => t.label !== tag.label) })}
            >×</button>
          </span>
        ))}

        <input
          className="tag-add-input"
          name="tag"
          placeholder="+ 追加..."
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            // Enter キーでタグを追加する
            if (e.key === 'Enter') {
              e.preventDefault()
              addTag(tagInput)
            }
            // Backspace インプットに、空文字の場合のみ最後のタグを削除する
            if (e.key === 'Backspace' && !tagInput) {
              onChange({ tags: note.tags.slice(0, -1) })
            }
          }}
        />
      </div>

      {/* ── タイトル入力 ── */}
      <input
        className="title-input"
        name="title"
        value={note.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="タイトルを入力..."
      />

      {/* タイトル下のアクセントライン */}
      <div className="title-underline" />

      {/* ── 本文エリア ── */}
      <div className="content-scroll">
        <textarea
          className="content-textarea"
          name="content"
          value={note.content}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="ここにメモを入力してください..."
        />
      </div>

      {/* ── ステータスバー ── */}
      <div className="statusbar">
        <span className="stat-item">◌ {textCount} 文字</span>
        <div className="kbd-hint">
          <kbd>Enter</kbd>
          <span>でタグを追加</span>
        </div>
      </div>

    </div>
  )
}
