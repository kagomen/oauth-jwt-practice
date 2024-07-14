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
