import { compare, hash } from 'bcryptjs'
import { sign, verify } from 'hono/jwt'
import { getCookie, setCookie } from 'hono/cookie'

const createAccessToken = async (c, email) => {
  return await sign(
    {
      email,
      exp: Math.floor(Date.now() / 1000) + 60 * 15, // 15分後に期限切れ
    },
    c.env.JWT_ACCESS_TOKEN_SECRET
  )
}

const createRefreshToken = async (c, email) => {
  return await sign(
    {
      email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7日後に期限切れ
    },
    c.env.JWT_REFRESH_TOKEN_SECRET
  )
}

async function getUser(c, email) {
  return await c.env.KV.get(email, { type: 'json' })
}

async function saveUser(c, email, userData) {
  await c.env.KV.put(email, JSON.stringify(userData))
}

export const signUp = async (c) => {
  // email, passwordのバリデーションチェック
  const { email, password } = c.req.valid('json')

  // KVに既にユーザ登録されていないかを確認
  const user = await getUser(c, email)
  if (user) {
    return c.json({ message: 'すでにそのユーザーは存在しています' }, 401)
  }

  // passwordのハッシュ化
  const hashedPassword = await hash(password, 8)

  // KVに保存
  await saveUser(c, email, { email, password: hashedPassword })

  // access tokenの発行
  const accessToken = await createAccessToken(c, email)

  // refresh tokenの発行
  const refreshToken = await createRefreshToken(c, email)

  // refresh tokenをHTTP Onlyのcookieとして設定
  setCookie(c, 'refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60, // 7日間（秒単位）
    path: '/',
  })

  return c.json({ email, accessToken })
}

export const signIn = async (c) => {
  // email, passwordのバリデーションチェック
  const { email, password } = c.req.valid('json')

  // KVからユーザを確認
  const user = await getUser(c, email)
  if (!user) {
    return c.json({ message: 'そのメールアドレスは登録されていません' }, 401)
  }

  // 入力されたpasswordとKVに保存されたhashedPasswordが同じであるか確認
  const isMatched = await compare(password, user.password)

  if (isMatched) {
    // access tokenの発行
    const accessToken = await createAccessToken(c, email)

    // refresh tokenの発行
    const refreshToken = await createRefreshToken(c, email)

    // refresh tokenをHTTP Onlyのcookieとして設定
    setCookie(c, 'refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60, // 7日間（秒単位）
      path: '/',
    })

    return c.json({ email, accessToken })
  } else {
    return c.json({ message: 'ログインに失敗しました' }, 401)
  }
}

export const reissueAccessToken = async (c) => {
  // refresh token の有無の確認
  const refreshToken = getCookie(c, 'refreshToken')
  if (!refreshToken) {
    return c.json({ message: 'リフレッシュトークンがありません' }, 401)
  }

  try {
    // refresh tokenの照合
    const payload = await verify(refreshToken, c.env.JWT_REFRESH_TOKEN_SECRET)

    const email = payload.email

    // access tokenの発行
    const accessToken = await createAccessToken(c, email)

    return c.json({ email, accessToken })
  } catch (error) {
    return c.json({ message: 'リフレッシュトークンが無効です' }, 401)
  }
}

export const signOut = (c) => {
  setCookie(c, 'refreshToken', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 0,
    path: '/',
  })
  return c.json({ message: 'ログアウトしました' })
}
