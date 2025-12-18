import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'

dotenv.config()

const app = express()

app.use(cookieParser())
app.use(express.json())

declare module 'express-session' {
	interface SessionData {
		userId: string
	}
}

const sessionConfig: session.SessionOptions = {
	secret: process.env.SESSION_SECRET || 'your-very-secure-secret-here',
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: 7 * 24 * 60 * 60 * 10000,
		sameSite: 'lax',
	},
}

app.use(session(sessionConfig))

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/')

app.use('/api/auth', authRoutes);

export default app
