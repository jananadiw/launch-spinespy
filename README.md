# SpineSpy Landing Page

Public marketing site for [SpineSpy](https://www.spinespy.com), deployed on Vercel at [spinespy.com](https://www.spinespy.com).

SpineSpy is a one-time **$9.99 USD** (plus applicable tax) macOS menubar app with Stripe checkout and license management.

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS
- Framer Motion
- Stripe (payments)
- Postgres (licenses)
- Resend (email)

Project decisions are recorded in [decisions.md](context/decisions.md).

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

**Required Environment Variables**:

- `NEXT_PUBLIC_SITE_URL` - Your site URL (e.g., `http://localhost:3000`)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `STRIPE_PRICE_ID` - Stripe price ID for the $9.99 product (sandbox: price_1UbTYAAZAvtzPdJvM78Ogexf)
- `DATABASE_URL` - PostgreSQL connection string
- `LICENSE_SIGNING_PRIVATE_KEY` - Ed25519 private key (base64)
- `LICENSE_SIGNING_PUBLIC_KEY` - Ed25519 public key (base64)
- `RESEND_API_KEY` - Resend API key for sending emails
- `LICENSE_FROM_EMAIL` - From email address (e.g., `noreply@spinespy.com`)

**Generate License Signing Keys**:

```bash
node -e "const nacl = require('tweetnacl'); const util = require('tweetnacl-util'); const keyPair = nacl.sign.keyPair(); console.log('PRIVATE:', util.encodeBase64(keyPair.secretKey)); console.log('PUBLIC:', util.encodeBase64(keyPair.publicKey));"
```

### 3. Set Up Database

Run the schema migration on your Postgres database (Vercel Postgres or Neon):

```bash
psql $DATABASE_URL -f db/schema.sql
```

Or connect to your database and run the SQL in `db/schema.sql`.

### 4. Configure Stripe

1. Create a product in Stripe Dashboard
2. Create a price for $9.99 USD
3. Copy the price ID to `STRIPE_PRICE_ID` (sandbox: price_1UbTYAAZAvtzPdJvM78Ogexf)
4. Enable automatic tax collection in Stripe Dashboard

### 5. Set Up Webhook Endpoint

For local testing, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret from the CLI output to `STRIPE_WEBHOOK_SECRET`.

For production, register your webhook endpoint in Stripe Dashboard:
- URL: `https://www.spinespy.com/api/stripe/webhook`
- Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`, `charge.dispute.created`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Testing Checkout

Use Stripe test card: `4242 4242 4242 4242`
- Any future expiration date
- Any 3-digit CVC
- Any ZIP code

## License API

The licensing system provides three endpoints for the macOS app:

- `POST /api/license/activate` - Activate a license on a device
- `POST /api/license/validate` - Validate and refresh a license token
- `POST /api/license/deactivate` - Deactivate a license on a device

See [docs/licensing.md](docs/licensing.md) for the complete API documentation and integration guide.

## Deployment Checklist

Before deploying to production:

1. ✅ Set all environment variables in Vercel
2. ✅ Provision Postgres database (Vercel Postgres or Neon)
3. ✅ Run database migration
4. ✅ Configure Stripe webhook endpoint
5. ✅ Set up Resend domain and verify DNS
6. ✅ Test checkout flow end-to-end
7. ✅ Verify license email delivery
8. ✅ Test license activation/validation/deactivation
