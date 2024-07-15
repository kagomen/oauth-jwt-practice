import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import userSchema from '../lib/userSchema'
import {
  reissueAccessToken,
  signIn,
  signOut,
  signUp,
} from '../controllers/auth'

const auth = new Hono()

auth.post('/sign-up', zValidator('json', userSchema), signUp)

auth.post('/sign-in', zValidator('json', userSchema), signIn)

auth.post('/reissue-access-token', reissueAccessToken)

auth.post('/sign-out', signOut)

export default auth
