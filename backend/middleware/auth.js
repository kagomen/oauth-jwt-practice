import { jwt } from 'hono/jwt'

export const protectedMiddleware = async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ message: '無効な認証ヘッダーです' }, 401)
  }

  const jwtMiddleware = jwt({
    secret: c.env.JWT_ACCESS_TOKEN_SECRET,
  })
  return jwtMiddleware(c, next)
}
