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

```bash
cp .env.example .env.local
```

`.env.example` lists every variable. With the default `USE_MOCKS=true`, none of the Stripe, Postgres, or Resend values are needed: checkout, licenses, and email are mocked in memory.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Click **Buy SpineSpy** to run a mock purchase, then open [/dev/emails](http://localhost:3000/dev/emails) to see the license email.

### Phase 2: real payments (`USE_MOCKS=false`)

Not implemented yet. The stubs in `src/lib/license/{stripe,postgres,resend}/` list what each needs.

1. Postgres: provision Neon from the Vercel Marketplace (sets `DATABASE_URL`), then `psql "$DATABASE_URL" -f db/schema.sql`.
2. Stripe: sandbox keys, `STRIPE_PRICE_ID`, and a webhook for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded` at `/api/stripe/webhook`. Locally: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
3. Resend: verify `spinespy.com`, set `RESEND_API_KEY` and `LICENSE_FROM_EMAIL=hello@spinespy.com`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Vitest) |

## Licensing

Purchase flow, license API for the Mac app, seed keys, and rate limits: [docs/licensing.md](docs/licensing.md).

## Deployment Checklist

Vercel Production defaults to real providers when `USE_MOCKS` is unset, so the live site never shows a fake purchase. Until Phase 2 ships, the live Buy button shows "Checkout is unavailable". Never set `USE_MOCKS=true` in Production.

1. Phase 2 providers implemented and `USE_MOCKS=false` in Vercel
2. Neon database provisioned and `db/schema.sql` applied
3. Stripe webhook endpoint registered (`https://www.spinespy.com/api/stripe/webhook`)
4. Resend domain verified
5. End-to-end sandbox purchase: email arrives, key activates in the app, refund revokes it
