# Stripe Payment Integration Testing Guide

## 🚀 Setup Instructions

### 1. Install Required Dependencies
```bash
cd e:\thadi\-Backend-
npm install stripe
```

### 2. Environment Variables
Add to your `.env` file:
```env
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

> **Note:** Replace the placeholder values with your actual Stripe test keys from your Stripe Dashboard.

### 3. Start Server
```bash
node index.js
```

## 💳 API Endpoints

### Payment Intent Creation
```http
POST http://localhost:2000/api/payments/create-intent
Content-Type: application/json
Cookie: token=your-jwt-token

{
  "amount": 24000,
  "currency": "lkr",
  "saveCard": true
}
```

**Response:**
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx",
  "amount": 24000,
  "currency": "lkr"
}
```

### Payment with Saved Card
```http
POST http://localhost:2000/api/payments/saved-card
Content-Type: application/json
Cookie: token=your-jwt-token

{
  "cardId": "card-id-from-database",
  "amount": 24000,
  "currency": "lkr"
}
```

### Payment History
```http
GET http://localhost:2000/api/payments/history
Cookie: token=your-jwt-token
```

## 🧪 Test Cards for Stripe

### Successful Payments:
- **Visa**: `4242424242424242`
- **Visa (debit)**: `4000056655665556`
- **Mastercard**: `5555555555554444`
- **Mastercard (2-series)**: `2223003122003222`
- **American Express**: `378282246310005`
- **Discover**: `6011111111111117`

### Failed Payments:
- **Generic decline**: `4000000000000002`
- **Insufficient funds**: `4000000000009995`
- **Expired card**: `4000000000000069`
- **Incorrect CVC**: `4000000000000127`

### Test Details:
- **Any future expiry date** (e.g., `12/25`)
- **Any 3-digit CVC** (4 digits for Amex)
- **Any cardholder name**

## 🔄 Complete Payment Flow

### 1. User Authentication
```javascript
// Login first
const loginResponse = await fetch('http://localhost:2000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
```

### 2. Create Payment Intent
```javascript
const intentResponse = await fetch('http://localhost:2000/api/payments/create-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    amount: 24000, // Rs. 24,000
    currency: 'lkr',
    saveCard: true
  })
});

const { clientSecret } = await intentResponse.json();
```

### 3. Frontend Payment Processing
```javascript
// In your React component
const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: {
      name: 'John Doe',
    },
  }
});

if (paymentIntent?.status === 'succeeded') {
  console.log('Payment successful!');
}
```

## 🛠️ Frontend Integration

### Update your checkout component with:

1. **Replace the Stripe publishable key** in your frontend:
```javascript
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here');
```

2. **Create payment intent before payment**:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Create payment intent
  const intentResponse = await fetch('http://localhost:2000/api/payments/create-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      amount: 24000,
      currency: 'lkr',
      saveCard: saveCard
    })
  });
  
  const { clientSecret } = await intentResponse.json();
  
  // Confirm payment
  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardNumberElement,
      billing_details: { name: cardholderName }
    }
  });
  
  if (paymentIntent?.status === 'succeeded') {
    alert('Payment successful!');
  }
};
```

## 📊 Testing Scenarios

### Test Case 1: New Card Payment
1. Login to your app
2. Go to checkout page
3. Enter test card: `4242424242424242`
4. Enter any future expiry (e.g., `12/25`)
5. Enter any 3-digit CVC (e.g., `123`)
6. Click "Pay" button
7. ✅ Should show success message

### Test Case 2: Save Card for Future
1. Check "Save card for future payments"
2. Complete payment with test card
3. Go to saved cards page
4. ✅ Should see the saved card (masked)

### Test Case 3: Pay with Saved Card
1. Select saved card option
2. Choose a previously saved card
3. Click "Pay" button
4. ✅ Should process payment

### Test Case 4: Failed Payment
1. Use decline test card: `4000000000000002`
2. Try to make payment
3. ✅ Should show error message

## 🔍 Debugging

### Check Server Logs
```bash
# Watch for these messages:
✅ Payment routes loaded at /api/payments
💳 Payment intent created for user: user@example.com
🔒 Card saved with encryption
```

### Check Stripe Dashboard
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/payments)
2. Look for test payments
3. Verify payment status and metadata

### Common Issues
1. **401 Unauthorized**: User not logged in
2. **Stripe not configured**: Missing environment variables
3. **CORS errors**: Check origin settings
4. **Card validation**: Ensure Luhn algorithm passes

## 📱 Mobile Testing
- Use Stripe's test card numbers
- Test on different devices
- Verify responsive design
- Check 3D Secure flow

## 🚀 Production Checklist
- [ ] Replace test keys with live keys
- [ ] Set up webhooks for payment confirmations
- [ ] Implement proper error handling
- [ ] Add payment receipt generation
- [ ] Set up payment monitoring
- [ ] Configure fraud detection

Your Stripe integration is now ready for testing! 🎉
