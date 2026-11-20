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

### Real payments (`USE_MOCKS=false`)

1. **Postgres:** add Neon from the Vercel Marketplace (sets `DATABASE_URL`). Copy `DATABASE_URL` into `.env.local`, then run `npm run db:migrate`.
2. **Stripe (sandbox first):**
   - Turn on managed payments in Dashboard → Settings → Managed payments.
   - Give the product behind `STRIPE_PRICE_ID` an eligible tax code (e.g. `txcd_10202000`, downloadable software).
   - Set `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID`.
   - Add a webhook endpoint at `/api/stripe/webhook` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`, and set `STRIPE_WEBHOOK_SECRET`.
   - Locally: `stripe listen --forward-to localhost:3000/api/stripe/webhook` prints the secret.
3. **Resend:** verify `spinespy.com`, then set `RESEND_API_KEY` and `LICENSE_FROM_EMAIL=hello@spinespy.com`.
4. Set `USE_MOCKS=false` and `NEXT_PUBLIC_SITE_URL`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Vitest) |
| `npm run db:migrate` | Apply `db/schema.sql` to `DATABASE_URL` |

## Licensing

Purchase flow, license API for the Mac app, seed keys, and rate limits: [docs/licensing.md](docs/licensing.md).

## Deployment Checklist

Vercel Production uses the real providers when `USE_MOCKS` is unset, so the live site never shows a fake purchase. Never set `USE_MOCKS=true` in Production.

1. Production env vars set: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`, `DATABASE_URL`, `RESEND_API_KEY`, `LICENSE_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL`
2. `npm run db:migrate` run against the production database
3. Stripe webhook endpoint registered (`https://www.spinespy.com/api/stripe/webhook`) with the three events
4. Resend domain verified
5. End-to-end sandbox purchase: email arrives, key activates in the app, refund revokes it
