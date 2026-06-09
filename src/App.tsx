// TODO Day3 でここに追加するもの：
//   const [aiOpen, setAiOpen] = useState(true)
//   → aiOpen を Topbar・AiPanel に渡す

import type { Note } from './Types'
import { Sidebar } from './Components/Sidebar'
import { Topbar } from './Components/Topbar'
import { Editor } from './Components/Editor'
import { AiPanel } from './Components/AiPanel'
import { useCallback, useEffect, useState } from 'react'

// 画面確認用のダミーデータ
const SEED: Note[] = [
  {
    id: '1',
    title: 'JLPT N3 — 文法まとめ',
    content: '〜ているところ：進行中の動作\n例：今、勉強しているところです。',
    tags: [{ label: '日本語', color: 'pink' }],
    stripeColor: '#F2A7B0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'React hooks まとめ',
    content: 'useEffect・useState・useCallback',
    tags: [{ label: '技術', color: 'mint' }, { label: 'ウェブ', color: 'pink' }],
    stripeColor: '#8FD0BA',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes')
    // 選択しているノートを返す　
    return saved ? JSON.parse(saved) as Note[] : SEED
  })
  const [activeId, setActiveId] = useState<string | null>(() => {
    const saved = localStorage.getItem('notes')
    const savedNotes = saved ? JSON.parse(saved) as Note[] : SEED
    // arrayが空の場合は null を返す
    return savedNotes[0]?.id ?? null
  })

  const [aiOpen, setAiOpen] = useState(true)

  const activeNote = notes.find(item => item.id === activeId) ?? null

  // notes を localStorage に保存 & notes が変化したときのみ再実行
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  // 新しいノートを作成するときの処理
  function handleNew() {
    const newNote = {
      id: Date.now().toString(),
      title: '',
      content: '',
      tags: [],
      stripeColor: '#F2A7B0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes([newNote, ...notes])
    setActiveId(newNote.id)
  }

  function handleDelete(id: string) {
    // 確認ダイアログを出す
    if (!window.confirm('このノートを削除しますか？')) return
    // 削除
    const newNotes = notes.filter(note => note.id !== id)
    setNotes(newNotes)
    setActiveId(newNotes[0]?.id ?? null)
  }

  // ノートを更新するときの処理
  // useCallback で memo化する activeId が変化したときのみ再実行
  const handleChange = useCallback((field: Partial<Note>) => {
    setNotes((prevNotes) => {
      // 選択しているノートを探し出し、更新
      const newNotes = prevNotes.map(note => note.id === activeId ? { ...note, ...field, updatedAt: new Date().toISOString() } : note)
      return newNotes
    })
  }, [activeId])

  // Sidebar からノートを選択したときの処理
  function handleSelect(id: string) {
    setActiveId(id)
  }

  return (
    <div className="app">
      <Sidebar
        notes={notes}
        activeId={activeId}
        handleSelect={handleSelect}
        handleNew={handleNew}
      />
      <Topbar
        title={activeNote?.title ?? ''}
        updatedAt={activeNote?.updatedAt ?? ''}
        aiOpen={aiOpen}
        onAiToggle={() => setAiOpen(status => !status)}
        onDelete={() => activeId && handleDelete(activeId)}
        hasNote={activeNote !== null}
      />

      {/* Editor or empty state */}
      {activeNote ? (
        <Editor
          note={activeNote}
          onChange={handleChange}
        />
      ) : (
        <div className="editor-wrap">
          <div className="no-note">
            <div className="no-note-flower">✿</div>
            <p className="no-note-text">
              ノートを選択するか<br />新しいノートを作成してください
            </p>
            <button className="btn-new" style={{ width: 180 }} onClick={handleNew}>
              ＋ 新しいノートを作成
            </button>
          </div>
        </div>
      )}
      {aiOpen &&
        <AiPanel
          content={activeNote?.content ?? ''}
          onClose={() => setAiOpen(false)}
        />
      }
    </div>
  )
}
