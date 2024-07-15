```
root/
│
├── src/
│ ├── app.js # エントリーポイント
│ ├── routes/
│ │ ├── auth.js # 認証関連のルート
│ │ ├── user.js # ユーザー関連のルート
│ │ └── protected.js # 保護されたルート
│ ├── middleware/
│ │ ├── auth.js # 認証ミドルウェア
│ │ └── index.js # ミドルウェアのエクスポート
│ ├── controllers/
│ │ ├── auth.js # 認証関連のコントローラー
│ │ └── user.js # ユーザー関連のコントローラー
│ ├── services/
│ │ └── auth.js # 認証関連のサービス（トークン生成など）
│ ├── models/
│ │ └── user.js # ユーザーモデル
│ └── utils/
│ └── validation.js # バリデーションスキーマ
│
├── db/
│ └── users.js # ユーザーデータ（実際のプロジェクトではデータベースを使用）
│
└── package.json
```
