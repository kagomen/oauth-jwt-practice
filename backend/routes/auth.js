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

auth.post('/sign-up', zValidator('json', userSchema), signUp)

auth.post('/sign-in', zValidator('json', userSchema), signIn)

auth.post('/reissue-access-token', reissueAccessToken)

auth.post('/sign-out', signOut)

auth.get('/google', googleAuthMiddleware, handleGoogleAuth)

export default auth
