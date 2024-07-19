import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import userSchema from '../lib/userSchema'
import {
  handleGoogleAuth,
  reissueAccessToken,
  signIn,
  signOut,
  signUp,
} from '../controllers/auth'
import { googleAuthMiddleware } from '../middleware/googleAuth'

const auth = new Hono()

auth.post(
  '/sign-up',
  zValidator('json', userSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          message: '正しい形式でメールアドレスとパスワードを入力してください',
        },
        400
      )
    }
  }),
  signUp
)

auth.post(
  '/sign-in',
  zValidator('json', userSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          message: '正しい形式でメールアドレスとパスワードを入力してください',
        },
        400
      )
    }
  }),
  signIn
)

auth.post('/reissue-access-token', reissueAccessToken)

auth.post('/sign-out', signOut)

auth.post('/google', googleAuthMiddleware, handleGoogleAuth)

export default auth
