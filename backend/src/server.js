import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Healthcheck
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Rutas del servicio web
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`✅ Servicio web escuchando en http://localhost:${PORT}`);
});
