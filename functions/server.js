import { Hono } from 'hono'
import { compare, hash } from 'bcryptjs'
import users from './db/users'

const app = new Hono()

app.get('/', (c) => {
  return c.json({
    message: 'Hello',
  })
})

app.use('*', async (c, next) => {
  // jwtの認証
  await next()
})

app.post('/sign-up', async (c) => {
  const { email, password } = await c.req.json()

  // DBにemailが既に登録されていないか確認

  // email, passwordのバリデーションチェック

  // passwordのハッシュ化
  const hashedPassword = await hash(password, 8)

  // DBに保存

  // tokenを発行

  // access tokenをlocalStorageに保存

  // refresh tokenをcookieに保存
  return c.json({ email, hashedPassword })
})

app.post('/sign-in', async (c) => {
  const { email, password } = await c.req.json()

  // emailを確認
  const user = users.find((user) => user.email === email)
  if (!user) {
    return c.json({ msg: 'そのメールアドレスは登録されていません' })
  }

  // passwordをcompare, 確認
  const hashedPassword = user.password
  const isMatched = await compare(password, hashedPassword)
  if (isMatched) {
    return c.json({ msg: 'ログインに成功しました' })
  } else {
    return c.json({ msg: 'ログインに失敗しました' })
  }
})

export default app
