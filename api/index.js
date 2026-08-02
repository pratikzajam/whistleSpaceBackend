import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import dbConnect from '../src/Config/dbConfig.js';
import admin from '../src/Routes/admin.routes.js';
import user from '../src/Routes/employee.routes.js';

const app = express();
const port = 3000;

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((origin) => origin.trim());
app.use(helmet());
app.use(cors({ origin: allowedOrigins, methods: ['GET', 'POST', 'DELETE'] }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: 'draft-8', legacyHeaders: false }));
app.use(express.json({ limit: '20kb' }));


app.use("/api/admin/", admin);
app.use("/api/user/", user);


await dbConnect();

if (!process.env.VERCEL) {
  app.listen(port, () => console.log(`API listening on port ${port}`));
}

export default app;
