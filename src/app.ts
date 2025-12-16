import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(express.json())

const MONGODB_URI = process.env.MONGODB_URI

mongoose
	.connect(MONGODB_URI as string)
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.error('MongoDB connection error:', err))

app.get('/', (req, res) => {
	res.send('Hello from TypeScript + Express!')
})

export default app
