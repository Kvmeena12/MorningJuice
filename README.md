# 🥤 JuiceMorning — Complete Full-Stack App

Mumbai's freshest cold-pressed juice subscription platform with:
- 🛒 Customer portal with weekly schedule builder
- 🛵 Delivery boy app with OTP verification
- 💳 Razorpay payment integration
- 🔒 JWT-based auth (customer + delivery roles)
- ☁️ Vercel-ready deployment

---

## 📁 Project Structure

```
juicemorning/
├── backend/
│   ├── models/
│   │   ├── User.js           ← Customer + Delivery Boy schema
│   │   ├── Subscription.js   ← Plans + weekly schedule
│   │   ├── Order.js          ← Daily delivery orders with OTP
│   │   └── Juice.js          ← Juice menu
│   ├── routes/
│   │   ├── auth.js           ← Register / Login / Me
│   │   ├── juices.js         ← Public juice menu
│   │   ├── subscriptions.js  ← Create / schedule / pause
│   │   ├── payment.js        ← Razorpay create + verify
│   │   ├── orders.js         ← Customer order history
│   │   ├── delivery.js       ← Delivery boy + OTP verify
│   │   └── admin.js          ← Assign orders, stats
│   ├── middleware/
│   │   └── auth.js           ← JWT + role guards
│   ├── server.js             ← Express entry point
│   ├── seed.js               ← Seed juices + admin user
│   ├── .env.example          ← Environment variables template
│   └── package.json
├── frontend/
│   ├── public/               ← Customer website
│   │   ├── index.html        ← Main site + dashboard
│   │   ├── style.css         ← All styles
│   │   └── script.js         ← Juice menu, animations, etc.
│   └── delivery-portal/
│       └── index.html        ← Delivery boy app
├── vercel.json               ← Vercel deployment config
└── README.md
```

---

## 🚀 Local Setup (Step by Step)

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Razorpay account (for payments)

### 1. Clone & Install

```bash
cd backend
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
# Now edit .env with your real values:
```

```env
MONGODB_URI=mongodb://localhost:27017/juicemorning
JWT_SECRET=your_super_secret_key
RAZORPAY_KEY_ID=rzp_test_XXXX
RAZORPAY_KEY_SECRET=XXXX
PORT=5000
```

### 3. Seed Database

```bash
cd backend
node seed.js
```

This creates:
- 8 juice blends in the menu
- Admin account: phone `9000000000`, password `admin123`
- Demo delivery boy: phone `9111111111`, password `delivery123`

### 4. Start Backend

```bash
cd backend
npm run dev   # development (nodemon)
# OR
npm start     # production
```

Backend runs at: `http://localhost:5000`

### 5. Open Frontend

Just open `frontend/public/index.html` in browser.  
Or serve with any static server:

```bash
npx serve frontend/public
```

Delivery portal: `frontend/delivery-portal/index.html`

---

## ☁️ Deploy to Vercel

### Backend (API)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set Root Directory to `backend`
4. Add Environment Variables in Vercel dashboard:
   - `MONGODB_URI` → your MongoDB Atlas URI
   - `JWT_SECRET` → a long random string
   - `RAZORPAY_KEY_ID` → from Razorpay dashboard
   - `RAZORPAY_KEY_SECRET` → from Razorpay dashboard
5. Deploy!

Your API URL: `https://your-project.vercel.app/api`

### Frontend

Update `API` constant in both HTML files:
```js
// Change this in frontend/public/index.html AND delivery-portal/index.html
const API = 'https://your-project.vercel.app/api';
```

Then deploy frontend separately (Vercel, Netlify, or GitHub Pages).

---

## 🔑 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register customer |
| POST | `/api/auth/login` | — | Login (any role) |
| GET | `/api/auth/me` | ✓ | Get profile |
| GET | `/api/juices` | — | Get juice menu |
| POST | `/api/subscriptions` | ✓ | Create subscription |
| GET | `/api/subscriptions/my` | ✓ | My subscriptions |
| PUT | `/api/subscriptions/:id/schedule` | ✓ | Update weekly schedule |
| PATCH | `/api/subscriptions/:id/toggle` | ✓ | Pause / Resume |
| POST | `/api/subscriptions/:id/activate` | ✓ | Activate after payment |
| POST | `/api/payment/create-order` | ✓ | Create Razorpay order |
| POST | `/api/payment/verify` | ✓ | Verify payment + generate orders |
| GET | `/api/orders/my` | ✓ | My order history |
| GET | `/api/orders/upcoming` | ✓ | Next 7 days orders + OTPs |
| GET | `/api/delivery/today` | 🛵 | Today's assigned deliveries |
| GET | `/api/delivery/stats` | 🛵 | Today's stats |
| PATCH | `/api/delivery/order/:id/status` | 🛵 | Update delivery status |
| POST | `/api/delivery/verify-otp` | 🛵 | OTP verify → mark delivered |
| GET | `/api/admin/orders` | 👑 | All orders |
| POST | `/api/admin/assign` | 👑 | Assign order to delivery boy |
| GET | `/api/admin/delivery-boys` | 👑 | List delivery boys |
| POST | `/api/admin/create-delivery-boy` | 👑 | Create delivery boy account |
| GET | `/api/admin/stats` | 👑 | Platform stats |

---

## 💳 Razorpay Setup

1. Sign up at [razorpay.com](https://razorpay.com)
2. Go to Settings → API Keys → Generate Test Key
3. Copy `Key ID` and `Key Secret` into your `.env`
4. For production: complete KYC and use live keys

---

## 🔐 Roles

| Role | Can Access |
|------|-----------|
| `customer` | Subscribe, schedule, view orders, pay |
| `delivery` | View today's orders, update status, verify OTP |
| `admin` | Assign orders, view all, create delivery boys |

---

## 📱 Moving to Custom Domain

When you're ready to move from `*.vercel.app`:

1. In Vercel dashboard → Project → Settings → Domains
2. Add your domain (e.g. `juicemorning.in`)
3. Update DNS at your registrar:
   - `A` record → `76.76.21.21`
   - or `CNAME` → `cname.vercel-dns.com`
4. SSL is automatic via Vercel ✅

---

## 🛠 Tech Stack

- **Backend**: Node.js · Express · MongoDB (Mongoose)
- **Auth**: JWT (30-day tokens)
- **Payments**: Razorpay
- **Frontend**: Vanilla HTML/CSS/JS (no framework needed)
- **Deploy**: Vercel (backend) + Vercel/Netlify (frontend)
