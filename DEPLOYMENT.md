# SubTrack デプロイガイド

## Vercelでのデプロイ手順（推奨）

### 1. 前提条件
- GitHubリポジトリにコードがプッシュされていること
- Supabaseプロジェクトが作成済みであること
- Vercelアカウントを所有していること

### 2. Vercelでのセットアップ

1. [Vercel](https://vercel.com)にログイン
2. "New Project"をクリック
3. GitHubリポジトリを選択
4. フレームワーク: Next.js（自動検出）
5. "Deploy"をクリック

### 3. 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. ドメイン設定（オプション）

- Vercelダッシュボードの"Domains"タブでカスタムドメインを設定可能
- 無料プランでは `your-project.vercel.app` が提供される

### 5. 自動デプロイ

- GitHubの `main` ブランチへのプッシュで自動デプロイが実行される
- プレビューデプロイは他のブランチでも利用可能

## 他のデプロイオプション

### Netlify
- Static Site Generationに適している
- 設定ファイル: `netlify.toml`

### Railway
- フルスタックアプリケーションに適している
- PostgreSQLも同時にホスト可能

### AWS Amplify
- AWSエコシステムを利用する場合
- より複雑な設定が必要

## トラブルシューティング

### よくあるエラー
1. **Environment variables not found**: 環境変数が正しく設定されているか確認
2. **Build failed**: `npm run build` がローカルで成功するか確認
3. **Supabase connection error**: URLとキーが正しいか確認

### デバッグ手順
1. Vercelの"Functions"タブでサーバーログを確認
2. ブラウザの開発者ツールでクライアントエラーを確認
3. Supabaseダッシュボードでクエリログを確認

## セキュリティ注意事項

- `NEXT_PUBLIC_` プレフィックスの環境変数はクライアントサイドで公開される
- 秘密鍵は `NEXT_PUBLIC_` を使用しない
- Supabase RLSが適切に設定されていることを確認