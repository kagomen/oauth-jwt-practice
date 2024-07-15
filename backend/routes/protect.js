import { Hono } from 'hono'
import { authMiddleware } from '../middleware'

const protect = new Hono()

// 保護されたルートの例
protect.use('/', authMiddleware)
protect.get('/', (c) => {
  const payload = c.get('jwtPayload')
  return c.json({ message: `${payload.email}でログイン中です` })
})

export default protect
