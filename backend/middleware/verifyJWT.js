import { verify } from 'hono/jwt'

// JWTを検証するミドルウェア
export async function verifyJWT(c, next) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader) {
    return c.json({ message: '認証が必要です' }, 401)
  } // リダイレクトの方が良い？

  const token = authHeader.split(' ')[1]
  try {
    const payload = await verify(token, c.env.JWT_ACCESS_TOKEN_SECRET)
    c.set('user', payload)
    await next()
  } catch (error) {
    return c.json({ message: 'トークンが無効です' }, 401)
  }
}
