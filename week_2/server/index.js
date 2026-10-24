import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import toursRouter from './routes/tours.js';
import authRouter from './routes/auth.js';

// Fail immediately if the secret is missing, instead of crashing later at login.
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is missing in server/.env');
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());  // reads JSON request bodies into req.body
app.use(cookieParser());  // reads cookies into req.cookies

app.use('/api/tours', toursRouter);
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});