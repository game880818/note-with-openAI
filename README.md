# 📝 note.ai — AI アシスト付きノートアプリ

> **Claude AI API** を活用したスマートノート SPA。  
> メモを書きながら翻訳・要約・文法チェックなどの AI 機能をその場で呼び出せます。

---

## 🔗 リンク

| | |
|---|---|
| 🌐 **Live Demo** | [https://note-with-claude-ai.vercel.app](https://note-with-claude-ai.vercel.app) |
| 💻 **GitHub** | [https://github.com/game880818/note-with-ClaudeAI](https://github.com/game880818/note-with-ClaudeAI) |

---

## 📸 スクリーンショット
![メイン画面](https://github.com/user-attachments/assets/fda552c7-4bed-4379-8121-72e542d37eca)

![AIパネル](https://github.com/user-attachments/assets/1c71b46e-6212-42c3-8de5-084d2c98b290)

![タグ絞り込み](https://github.com/user-attachments/assets/c6a24e8e-988f-4db8-8f29-9f7c997ee6c9)

![デモ](https://github.com/user-attachments/assets/1c71b46e-6212-42c3-8de5-084d2c98b290)

---

## ✨ 主な機能

- 📄 **ノート管理** — 作成・編集・削除・テキスト検索（タイトル・本文）
- 🏷️ **タグシステム** — カラー付きタグの追加・タグによる絞り込み
- 🤖 **AI パネル**（Claude API 搭載）
  - 🇯🇵 日本語翻訳
  - 🇺🇸 英語翻訳
  - 📋 ノート内容の要約
  - ✏️ 文法チェック
- 🕓 **AI 実行履歴** — 直近 5 件の結果をパネルに表示
- 💾 **自動保存** — `localStorage` によるデータ永続化

---

## 🛠️ 使用技術

| カテゴリ | 技術 |
|---|---|
| フロントエンド | React 18 / TypeScript / Vite |
| UI ライブラリ | react-markdown |
| HTTP クライアント | Axios |
| AI | Anthropic Claude API（`claude-sonnet-4-6`）|
| データ永続化 | localStorage |
| デプロイ | Vercel |

---

## 🏗️ ディレクトリ構成

```
src/
├── Components/
│   ├── Sidebar.tsx      # ノート一覧・検索・タグフィルター
│   ├── Topbar.tsx       # タイトル入力・タグ管理
│   ├── Editor.tsx       # ノート本文エディター
│   └── AiPanel.tsx      # AI 機能パネル・実行履歴
├── utils/
│   ├── ai.ts            # Claude API 連携処理
│   └── formalTime.tsx   # 日時フォーマット処理
├── Types/
│   └── index.ts         # Note / Tag / AiResult 型定義
└── App.tsx              # ルート状態管理
```

---

## 💡 技術的な工夫

- **`useCallback` によるメモ化** — Editor コンポーネントへの不要な再レンダリングを防止
- **AI 通信のローディング制御・エラーハンドリング** — リクエスト中はボタンを無効化し、アニメーションインジケーターとエラーメッセージを表示
- **責務ごとのコンポーネント分割** — 各コンポーネントが単一の責務を持ち、App を状態の唯一の源（Single Source of Truth）とした設計
- **TypeScript による厳密な型管理** — `Note` / `Tag` / `AiResult` の独自型を定義し、API レスポンスから UI まで一貫した型安全性を確保
- **AI 結果履歴の上限管理** — 新しい結果を先頭に追加し `.slice(0, 5)` で最新 5 件に制限
- **タグカラーの自動循環** — モジュロ演算（`COLOR_CYCLE[tags.length % COLOR_CYCLE.length]`）で色を自動割り当て

---

## 🚀 ローカル環境での実行手順

### 事前準備

- Node.js v18 以上
- [Anthropic API キー](https://console.anthropic.com/)

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/game880818/note-with-ClaudeAI.git
cd note-with-ClaudeAI

# 依存パッケージをインストール
npm install

# 環境変数を設定
echo "VITE_ANTHROPIC_API_KEY=your_api_key_here" > .env

# 開発サーバーを起動
npm run dev
```

---

## 🔮 今後の改善予定

- [ ] バックエンド・DB 連携による複数端末同期
- [ ] ユーザー認証（マルチユーザー対応）
- [ ] AI レスポンスのストリーミング表示
- [ ] ノートの Markdown / PDF エクスポート
- [ ] AI による自動タグ提案
- [ ] API キーのバックエンド移行（セキュリティ強化）

---
