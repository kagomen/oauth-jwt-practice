import { jwtVerify, createRemoteJWKSet } from 'jose'

export const googleAuthMiddleware = async (c, next) => {
  const { credential } = await c.req.json()
  if (!credential) {
    return c.json({ message: 'Credentialが提供されていません。' }, 400)
  }

  try {
    const JWKS = createRemoteJWKSet(
      new URL('https://www.googleapis.com/oauth2/v3/certs')
    )

    const { payload } = await jwtVerify(credential, JWKS, {
      audience: c.env.GOOGLE_CLIENT_ID,
      issuer: 'https://accounts.google.com',
    })

    c.set('user-google', payload)
    return next()
  } catch (error) {
    console.error('Google認証エラー:', error)
    return c.json({ message: 'Google認証に失敗しました。' }, 401)
  }
}

// 以下は、認可コードフローで処理する場合の実装
// アクセストークンとリフレッシュトークンを取得可能
// import { googleAuth } from '@hono/oauth-providers/google'

// export const googleAuthMiddleware = (c, next) => {
//   const temp = googleAuth({
//     client_id: c.env.GOOGLE_CLIENT_ID,
//     client_secret: c.env.GOOGLE_CLIENT_SECRET,
//     scope: ['openid', 'email'],
//   })
//   return temp(c, next)
// }
