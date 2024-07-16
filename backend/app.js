import { Hono } from 'hono'
import authRoutes from './routes/auth'
import userRoutes from './routes/user'
import protectRoutes from './routes/protect'

const app = new Hono()

app.get('/', (c) => c.json({ message: 'Hello' }))

app.route('/auth', authRoutes)
app.route('/user', userRoutes)
app.route('/protect', protectRoutes)

export default app
