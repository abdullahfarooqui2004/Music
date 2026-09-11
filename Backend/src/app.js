import express from 'express'
import authRouter from './routes/register.routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/api', authRouter)

export default app;