import { Hono } from 'hono'
import authRoutes from './routes/auth'
import userRoutes from './routes/user'
import protectRoutes from './routes/protect'
import { authMiddleware } from './middleware'

const app = new Hono()

app.get('/', (c) => c.json({ message: 'Hello' }))

app.route('/auth', authRoutes)
app.route('/user', userRoutes)
app.route('/protect', protectRoutes)

// app.use('*', authMiddleware)

export default app
