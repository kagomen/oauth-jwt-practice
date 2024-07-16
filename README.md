## withCredentials

サーバーサイドと Cookie のやりとりをする場合、axios で option が必要

```js
async function reissueAccessToken() {
  const res = await axios.post(
    '/api/reissue-access-token',
    {}, // 第2引数はリクエストボディ
    { withCredentials: true } // 第3引数にoption
  )
}
```

もしくは以下のように設定しても良い

```js
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

// 使用する際は api.post('reissue-access-token', ...) とする
```

開発環境で option の指定をしなくても Cookie のやりとりができているのは、`vite.config.js`にて proxy 設定をしているから？

## JWT の無効化リスト

本来であれば、リフレッシュトークンを再発行したら、古いリフレッシュトークンを無効化するべき。  
無効化の方法としては、DB に無効化リストを作成し、リフレッシュトークン再発行時に古いリフレッシュトークンを無効化リストに入れる。  
アクセストークン再発行時に、ユーザの Cookie にあるリフレッシュトークンが無効化リストに存在しないかを確認したのちに、再発行の手続きに入る。  
また、無効化リストはそのままでは増加する一方なので、定期的に、トークンの期限が切れていたら無効化リストから削除する操作を行うこと。

## Bearer 認証

- トークンベースの認証で、トークンを持っている人＝認証された人という考え方。JWT はこれ
- 形式: `Authorization: Bearer <token>`

## Basic 認証

- 平文のパスワードを認証で使う
- HTTP 通信で通信すると傍受されて終わりなので、HTTPS 通信用
- 形式: `Authorization: Basic <username:password>`

## Digest 認証

- ハッシュ化したパスワードを認証で使う
- ハッシュ化に使用されている MD5 というハッシュ関数は解析可能な古いアルゴリズムなので安全ではない

## ハッシュ関数の種類

- MD5
  - 安全ではない
- SHA-1
  - 安全ではない
- SHA-2
  - SHA-224, SHA-256, SHA-384, SHA-512, SHA-512/224, SHA-512/256 の 6 つのバリエーションがある
  - SHA-512 が最も安全性が高く、SHA-256 が最も利用されている
- SHA-3
  - 2015 年に正式版が公表された最新のハッシュ関数

## Cloudflare KV

- プレビュー環境が欲しい場合

  - 本番環境はデプロイしないと動かない
  - とは言ってもプレビュー環境も KV に値が保存されるわけではない

  ```
  npx wrangler kv:namespace create KV
  npx wrangler kv:namespace create KV --preview  // KVはbinding名
  ```

  - ターミナルに表示されたものを、wrangler.toml に記述

  ```
  [[kv_namespaces]]
  binding = "KV"
  id = "XXXXXXXXXXX"  // こっちは本番環境用, プレビュー環境だけ設定するとエラーが出るので指定する
  preview_id = "XXXXXXXXXXXXXX"
  ```
