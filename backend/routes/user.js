import { Hono } from 'hono'
import { authMiddleware } from '../middleware'
import { getUserProfile } from '../controllers/user'

const user = new Hono()

// ユーザー固有のエンドポイント
user.get('/:userName', authMiddleware, getUserProfile)

export default user
