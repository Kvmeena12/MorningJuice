import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import scheduleRoutes from './routes/schedule.js';
import authRoutes         from './routes/auth.js';
import juiceRoutes        from './routes/juices.js';
import subscriptionRoutes from './routes/subscriptions.js';
import paymentRoutes      from './routes/payment.js';
import orderRoutes        from './routes/orders.js';
import deliveryRoutes     from './routes/delivery.js';
import adminRoutes        from './routes/admin.js';
import settingsRoutes     from './routes/settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.static(path.join(__dirname, '../frontend/public')));

// ── Middleware ────────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    // Allow: no origin (curl/Postman), localhost on any port, file:// protocol
    const allowed = !origin
      || origin.startsWith('http://localhost')
      || origin.startsWith('http://127.0.0.1')
      || origin === 'null'   // file:// sends origin: "null"
      || (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL);
    callback(null, allowed);
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/juices',        juiceRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payment',       paymentRoutes);
app.use('/api/orders',        orderRoutes);
app.use('/api/delivery',      deliveryRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/settings',      settingsRoutes);
app.use('/api/schedule',      scheduleRoutes);

// ── Frontend ────────────────────────────────────────
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// ── Health check ──────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'OK', ts: new Date() }));
app.get('/', (req, res) => {
  res.send("MorningJuice API is running 🚀");
});

// ── 404 ───────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ── DB + Start ────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
