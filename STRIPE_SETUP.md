# 🔧 Setup Instructions for Stripe Payment System

## ⚠️ Important Security Note
This repository removes hardcoded Stripe API keys to comply with GitHub's security policies. You need to configure your own keys for the system to work.

## 🚀 Quick Setup

### 1. Configure Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your actual Stripe keys:
   ```env
   # Get these from https://dashboard.stripe.com/test/apikeys
   STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
   STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
   ```

### 2. Update Test Files
Replace placeholder keys in test files with your actual Stripe publishable key:

**Files to update:**
- `test-proper-card-saving.html`
- `test-payment-complete.html` 
- `test-improved-saved-cards.html`
- `test-fixed-saved-cards.html`
- `test-card-saving-debug.html`
- `improved-checkout.tsx`

**Find and replace:**
```javascript
// Replace this line:
const stripe = Stripe('pk_test_your_stripe_publishable_key_here');

// With your actual key:
const stripe = Stripe('pk_test_51YourActualPublishableKeyHere...');
```

### 3. Get Your Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy the **Publishable key** (starts with `pk_test_`)
3. Copy the **Secret key** (starts with `sk_test_`)
4. Update your `.env` file and test files

### 4. Verify Setup
1. Start the server: `npm start`
2. Open any test file in your browser
3. Try making a test payment

## 🔐 Security Best Practices
- ✅ Keep `.env` file local (never commit it)
- ✅ Use test keys for development
- ✅ Use environment variables in production
- ❌ Never hardcode API keys in source code
- ❌ Never commit real API keys to git

## 📝 Test Card Numbers
Use these test card numbers for testing:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **3D Secure:** 4000 0000 0000 3220

Any future expiry date and any 3-digit CVC.

## 🆘 Troubleshooting
- If payments fail, check your `.env` file has correct keys
- If test files don't load Stripe, update the publishable key
- Make sure your Stripe account is in test mode
