import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dbConnect from '../src/Config/dbConfig.js';
import admin from '../src/Routes/admin.routes.js';
import user from '../src/Routes/employee.routes.js';
import { swaggerSpec } from '../src/swagger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = 3000;

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,https://whistle-space.vercel.app').split(',').map((origin) => origin.trim());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true
}));
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: 'draft-8', legacyHeaders: false }));
app.use(express.json({ limit: '20kb' }));

app.get('/', (req, res) => {
  res.json({
    name: 'WhistleSpace API',
    version: '1.0.0',
    docs: '/api-docs',
    routes: {
      admin: '/api/admin',
      user: '/api/user'
    }
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: 'WhistleSpace API Docs'
}));

app.use('/api/admin/', admin);
app.use('/api/user/', user);

await dbConnect();

if (!process.env.VERCEL) {
  app.listen(port, () => console.log(`API listening on port ${port}`));
}

export default app;
