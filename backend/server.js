import { Hono } from 'hono'
import { compare, hash } from 'bcryptjs'
import { jwt, sign } from 'hono/jwt'
import { zValidator } from '@hono/zod-validator'
import users from './db/users'
import userSchema from './lib/userSchema'
import { setCookie } from 'hono/cookie'

const app = new Hono()

app.get('/', (c) => {
  return c.json({
    message: 'Hello',
  })
})

app.use('*', async (c, next) => {
  // 認証が必要ないpathをスキップ
  // 認証が必要なpathはログインページに遷移

  // jwtの認証

  await next()
})

app.post('/sign-up', zValidator('json', userSchema), async (c) => {
  // email, passwordのバリデーションチェック
  const { email, password } = c.req.valid('json')

  // DBにemailが既に登録されていないか確認
  const user = users.find((user) => user.email === email)
  if (user) {
    return c.json({ msg: 'すでにそのユーザーは存在しています' })
  }

  // passwordのハッシュ化
  const hashedPassword = await hash(password, 8)

  // DBに保存
  users.push({ email, password: hashedPassword })

  // access tokenの発行
  const accessToken = await sign(
    {
      email,
    },
    c.env.JWT_ACCESS_TOKEN_SECRET
  )

  // refresh tokenの発行
  const refreshToken = await sign(
    {
      email,
    },
    c.env.JWT_REFRESH_TOKEN_SECRET
  )

  // refresh tokenをHTTP Onlyのcookieとして設定
  setCookie(c, 'refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60, // 7日間（秒単位）
    path: '/',
  })

  return c.json({ email, accessToken })
})

app.post('/sign-in', async (c) => {
  const { email, password } = await c.req.json()

  // emailを確認
  const user = users.find((user) => user.email === email)
  if (!user) {
    return c.json({ msg: 'そのメールアドレスは登録されていません' })
  }

  // passwordをcompare, 確認
  const isMatched = await compare(password, user.password)
  if (isMatched) {
    // tokenの発行
    // access tokenをlocalStorageに保存

    return c.json({ msg: 'ログインに成功しました' })
  } else {
    return c.json({ msg: 'ログインに失敗しました' })
  }
})

export default app
