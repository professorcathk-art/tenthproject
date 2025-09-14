# Stripe Connect Integration

This document provides a comprehensive guide to the Stripe Connect integration implemented in your TenthProject application.

## 🚀 Overview

The Stripe Connect integration allows mentors to:
- Create connected accounts for receiving payments
- Onboard through Stripe's Express dashboard
- Create and manage products
- Process payments with automatic fee collection (8.5% platform fee)

## 📁 File Structure

```
src/
├── lib/
│   └── stripe.ts                           # Stripe configuration and utilities
├── app/
│   ├── api/stripe/
│   │   ├── accounts/
│   │   │   ├── create/route.ts             # Create connected accounts
│   │   │   └── [accountId]/
│   │   │       ├── status/route.ts         # Get account status
│   │   │       └── onboard/route.ts        # Onboarding and dashboard access
│   │   ├── products/route.ts               # Create and list products
│   │   └── checkout/
│   │       └── create-session/route.ts     # Create checkout sessions
│   └── stripe/
│       ├── accounts/page.tsx               # Account management UI
│       ├── products/page.tsx               # Product management UI
│       ├── store/page.tsx                  # Customer storefront
│       ├── success/page.tsx                # Payment success page
│       ├── cancel/page.tsx                 # Payment cancellation page
│       └── onboard/
│           ├── refresh/page.tsx            # Onboarding refresh
│           └── success/page.tsx            # Onboarding success
```

## 🔧 Setup Instructions

### 1. Environment Variables

Add the following to your `.env` file:

```bash
# Stripe Connect Integration
STRIPE_SECRET_KEY="sk_test_..." # Your Stripe secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..." # Your publishable key
```

### 2. Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)
3. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
4. Add them to your `.env` file

### 3. Install Dependencies

The Stripe package is already installed. If you need to reinstall:

```bash
npm install stripe
```

## 🏗️ Architecture

### Connected Accounts

The integration uses Stripe's **controller-based approach** for connected accounts:

```javascript
stripe.accounts.create({
  controller: {
    fees: {
      payer: 'application' // Platform controls pricing and fees
    },
    losses: {
      payments: 'application' // Platform handles refunds/chargebacks
    },
    stripe_dashboard: {
      type: 'express' // Express dashboard access
    }
  }
});
```

**Key Benefits:**
- Platform controls all pricing and fee collection
- Platform handles disputes and chargebacks
- Connected accounts get Express dashboard access
- Simplified onboarding process

### Payment Flow

1. **Product Creation**: Products are created at the platform level
2. **Checkout**: Customers purchase through hosted Stripe Checkout
3. **Destination Charge**: Money is sent to connected account with application fee
4. **Fee Collection**: Platform automatically collects 8.5% commission

```javascript
stripe.checkout.sessions.create({
  payment_intent_data: {
    application_fee_amount: calculateApplicationFee(totalAmount),
    transfer_data: {
      destination: connectedAccountId
    }
  }
});
```

## 🎯 API Endpoints

### Account Management

#### Create Connected Account
```
POST /api/stripe/accounts/create
```
Creates a new Stripe Connect account for a mentor.

#### Get Account Status
```
GET /api/stripe/accounts/[accountId]/status
```
Retrieves real-time account status and capabilities.

#### Start Onboarding
```
POST /api/stripe/accounts/[accountId]/onboard
```
Creates an account link for onboarding.

#### Open Dashboard
```
PUT /api/stripe/accounts/[accountId]/onboard
```
Creates a login link for the Express dashboard.

### Product Management

#### Create Product
```
POST /api/stripe/products
```
Creates a product with default price at platform level.

**Request Body:**
```json
{
  "name": "Web Development Course",
  "description": "Learn web development from scratch",
  "priceInCents": 29900,
  "currency": "usd",
  "connectedAccountId": "acct_..."
}
```

#### List Products
```
GET /api/stripe/products
```
Lists all products with connected account information.

### Checkout

#### Create Checkout Session
```
POST /api/stripe/checkout/create-session
```
Creates a checkout session for purchasing a product.

**Request Body:**
```json
{
  "productId": "prod_...",
  "quantity": 1,
  "connectedAccountId": "acct_..."
}
```

## 🎨 User Interface

### For Mentors (Account Holders)

1. **Account Management** (`/stripe/accounts`)
   - Create connected account
   - View account status
   - Start onboarding process
   - Access Express dashboard

2. **Product Management** (`/stripe/products`)
   - Create products with pricing
   - View all products
   - Manage product details

### For Customers

1. **Storefront** (`/stripe/store`)
   - Browse available products
   - Purchase products
   - Secure checkout process

2. **Payment Pages**
   - Success page (`/stripe/success`)
   - Cancellation page (`/stripe/cancel`)

## 🔒 Security Features

### Authentication
- All API endpoints require user authentication
- Account creation limited to authenticated users
- Product creation requires valid connected account

### Error Handling
- Comprehensive error handling with user-friendly messages
- Detailed logging for debugging
- Graceful fallbacks for API failures

### Data Validation
- Input validation on all forms
- Stripe account ID format validation
- Price and currency validation

## 📊 Fee Structure

The platform automatically collects an **8.5% commission** on all transactions:

```javascript
const calculateApplicationFee = (amountInCents: number): number => {
  const commissionRate = 0.085 // 8.5% commission
  return Math.round(amountInCents * commissionRate)
}
```

**Example:**
- Customer pays: $299.00
- Platform fee (8.5%): $25.42
- Seller receives: $273.58

## 🧪 Testing

### Test Mode
The integration works in Stripe's test mode by default. Use test card numbers:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

### Test Accounts
Create test connected accounts and verify:
- Account creation works
- Onboarding flow completes
- Products can be created
- Payments process correctly

## 🚀 Production Deployment

### Environment Setup
1. Switch to live Stripe keys
2. Update webhook endpoints
3. Test with real payment methods
4. Monitor transaction logs

### Monitoring
- Set up Stripe webhooks for real-time updates
- Monitor failed payments and disputes
- Track application fee collection
- Review connected account status

## 🔧 Customization

### Fee Structure
To change the commission rate, update the `calculateApplicationFee` function in `src/lib/stripe.ts`:

```javascript
const commissionRate = 0.10 // Change to 10%
```

### UI Styling
All UI components use Tailwind CSS and match your application's design system. Customize colors and styling in the component files.

### Business Logic
Modify the API endpoints to add custom business logic:
- Product approval workflows
- Custom pricing rules
- Enhanced validation
- Additional metadata storage

## 📚 Additional Resources

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Express Dashboard Guide](https://stripe.com/docs/connect/express-dashboard)
- [Webhook Guide](https://stripe.com/docs/webhooks)

## 🆘 Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check your environment variables
   - Ensure keys are from the correct environment (test vs live)

2. **"Account not found" error**
   - Verify account ID format (starts with `acct_`)
   - Check if account exists in your Stripe dashboard

3. **Onboarding not working**
   - Ensure account links are created correctly
   - Check redirect URLs in your environment

4. **Payments failing**
   - Verify connected account can accept payments
   - Check application fee calculations
   - Review Stripe dashboard for errors

### Debug Mode
Enable detailed logging by checking browser console and server logs for error messages and API responses.

---

## 🎉 Ready to Go!

Your Stripe Connect integration is now complete and ready for use. Mentors can create accounts, onboard, and start selling products while you automatically collect your platform fees!
