import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { profileRouter } from './routes/profile'
import { planRouter } from './routes/plan'
import { progressRouter } from './routes/progress'


const app = express()
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(cookieParser());
app.use(express.json());

// API routes
app.use('/api/profile', profileRouter)
app.use('/api/plan', planRouter)
app.use('/api/progress', progressRouter)




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})