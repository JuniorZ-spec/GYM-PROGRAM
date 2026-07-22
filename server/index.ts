import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { profileRouter } from './routes/profile'
import { planRouter } from './routes/plan'
import { progressRouter } from './routes/progress'


const app = express()
const PORT = process.env.PORT || 3001;

// Origines autorisées: liste explicite via CORS_ORIGIN (+ previews Vercel du projet).
// Si CORS_ORIGIN est vide (dev local), tout est autorisé.
const allowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: allowedOrigins.length === 0
        ? true
        : (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(new URL(origin).hostname)) {
                return callback(null, true);
            }
            callback(new Error(`Origin not allowed by CORS: ${origin}`));
        },
}));
app.use(cookieParser());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api/profile', profileRouter)
app.use('/api/plan', planRouter)
app.use('/api/progress', progressRouter)




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})