# SubTrack

サブスクリプション管理アプリ - 複数のサブスクの契約情報を一元管理し、無駄な出費を可視化するWebアプリケーションです。

## 🚀 主な機能

- **ユーザー認証**: 安全なユーザー登録・ログイン機能
- **サブスク管理**: サービス名、月額料金、請求日、カテゴリの登録・編集・削除
- **データ可視化**: 月額合計額とカテゴリ別支出をグラフで表示
- **請求リマインド**: 今日・明日が請求日のサブスクをダッシュボードで通知
- **レスポンシブ対応**: モバイル・タブレット・デスクトップ対応
- **セキュリティ**: Row Level Security (RLS) により他のユーザーのデータは見えない

## 🛠 技術スタック

- **フロントエンド**: Next.js 15, React, TypeScript, Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL, Authentication, Real-time)
- **データ可視化**: Chart.js, React Chart.js 2
- **認証**: Supabase Auth with SSR
- **スタイリング**: Tailwind CSS

## 📋 セットアップ手順

### 1. プロジェクトのクローン

```bash
git clone <repository-url>
cd subtrack
npm install
```

### 2. Supabaseプロジェクトの設定

1. [Supabase](https://supabase.com)でアカウント作成・プロジェクト作成
2. 「Settings」→「API」からProject URLとAnon Keyを取得
3. `.env.local`ファイルを作成し、以下の値を設定:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. データベース設定

1. SupabaseのSQL Editorで`supabase-schema.sql`の内容を実行
2. Row Level Security (RLS) が自動で有効化されます

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリを確認してください。

## 📱 使い方

### 1. アカウント作成・ログイン
- 初回利用時はアカウント作成が必要です
- メールアドレスとパスワードでログインできます

### 2. サブスクリプション登録
- 「新しいサブスクを追加」ボタンから登録
- サービス名、月額料金、請求日、カテゴリを入力

### 3. ダッシュボード
- 月額合計額とサブスク数、平均単価を確認
- カテゴリ別支出の円グラフ
- 今月の請求スケジュールの棒グラフ
- 今日・明日が請求日のサブスクにはリマインド表示

### 4. 管理機能
- 各サブスクの編集・削除が可能
- 一覧表示でデスクトップは表形式、モバイルはカード形式

## 🔒 セキュリティ機能

- **認証必須**: 全ページでログインが必要
- **Row Level Security**: ユーザーは自分のデータのみアクセス可能
- **セッション管理**: Supabase Auth による安全なセッション管理
- **CSRF保護**: Supabase SSR による保護

## 🎨 レスポンシブ対応

- **モバイル**: 320px〜 (カード型表示)
- **タブレット**: 768px〜 (2カラムレイアウト)
- **デスクトップ**: 1024px〜 (表形式、サイドバー等)

## 📊 データ構造

### subscriptions テーブル
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to auth.users)
- name: VARCHAR(255) - サービス名
- amount: DECIMAL(10,2) - 月額料金
- billing_date: INTEGER (1-31) - 請求日
- category: VARCHAR(100) - カテゴリ
- memo: TEXT - メモ (任意)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## 🚀 デプロイ

詳細なデプロイ手順は [DEPLOYMENT.md](./DEPLOYMENT.md) を参照してください。

### 推奨: Vercel + Supabase

1. [Vercel](https://vercel.com)でプロジェクトをインポート
2. 環境変数を設定:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. 自動デプロイが設定されます

### その他のホスティング

- Netlify, AWS Amplify, Railway等でも動作します
- Node.js 18+が必要です
- 設定ファイル: `vercel.json`, `.env.example`

## 🤝 貢献

1. フォークを作成
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. Pull Requestを作成

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🆘 サポート

質問やバグ報告は [Issues](../../issues) でお願いします。
