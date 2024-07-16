import { googleAuth } from '@hono/oauth-providers/google'

export const googleAuthMiddleware = (c, next) => {
  const temp = googleAuth({
    client_id: c.env.GOOGLE_CLIENT_ID,
    client_secret: c.env.GOOGLE_CLIENT_SECRET,
    scope: ['email'],
  })
  return temp(c, next)
}
