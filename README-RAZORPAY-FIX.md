# 🔧 Razorpay Payment — Fix Guide

## Step 1: Razorpay Keys correctly set karo

Backend folder mein `.env` file open karo (`.env.example` se copy karo agar nahi hai):

```env
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
```

### Keys kahan se milenge?
1. https://dashboard.razorpay.com login karo
2. Left menu → **Settings** → **API Keys**
3. **Generate Test Key** click karo
4. Key ID aur Secret copy karo

> ⚠️ Test mode mein `rzp_test_` se shuru hoga  
> ⚠️ Live mode mein `rzp_live_` se shuru hoga

---

## Step 2: Backend sahi se start karo

```bash
cd backend

# .env file check karo
cat .env

# Dependencies install hain?
npm install

# Start
npm run dev
```

Terminal mein yeh dikhna chahiye:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
```

---

## Step 3: Test karo ki backend chal raha hai

Browser mein open karo: http://localhost:5000/health

Agar yeh dikhe toh backend chal raha hai:
```json
{"status":"OK","ts":"2026-..."}
```

---

## Step 4: .env file sahi format mein hai?

```env
# WRONG — spaces around = sign
RAZORPAY_KEY_ID = rzp_test_abc123

# CORRECT — no spaces
RAZORPAY_KEY_ID=rzp_test_abc123
```

---

## Step 5: Frontend file kaise open kar rahe ho?

### ❌ Wrong — File directly double-click se open karna
`file:///C:/Users/xyz/juicemorning/frontend/public/index.html`

### ✅ Sahi — Local server se serve karo

Option A (npx):
```bash
cd frontend/public
npx serve .
# Opens at http://localhost:3000
```

Option B (VS Code Live Server extension):
- VS Code mein `index.html` open karo
- Bottom bar mein "Go Live" click karo

Option C (Python):
```bash
cd frontend/public
python -m http.server 8080
# Opens at http://localhost:8080
```

---

## Common Errors aur Solutions

| Error | Cause | Fix |
|-------|-------|-----|
| `Razorpay key missing` | `.env` mein key nahi | Step 1 follow karo |
| `Payment initiation failed` | Backend nahi chal raha | Step 2 follow karo |
| `Network error: Failed to fetch` | CORS ya backend down | Backend restart karo |
| `Payment signature mismatch` | Wrong Key Secret | Key Secret dobara copy karo |
| `Subscription not found` | MongoDB connection issue | MongoDB chal raha hai check karo |

---

## Test Card (Razorpay Test Mode)

Payment popup mein yeh test card use karo:

| Field | Value |
|-------|-------|
| Card Number | `4111 1111 1111 1111` |
| Expiry | Any future date (e.g. `12/26`) |
| CVV | Any 3 digits (e.g. `123`) |
| Name | Any name |
| OTP | `1234` (Razorpay test OTP) |

---

## UPI Test (Razorpay Test Mode)

UPI ID: `success@razorpay`
