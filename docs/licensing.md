# SpineSpy licensing

One-time purchase, $9.99 plus tax, up to 3 Macs. No trial, no accounts. The email entered at Stripe Checkout is the buyer's only identity. The license key goes out only by email; the website never shows it.

## Purchase flow

```
Buy button ──POST /api/checkout──▶ { url } ──▶ Stripe Checkout ──▶ /thanks?session_id=…
                                                     │
                                                     └─ webhook: checkout.session.completed
                                                          ├─ createLicense (idempotent on session id)
                                                          └─ sendLicenseEmail (once per license)

Lost key: /restore ──POST /api/license/resend { email }──▶ same reply whether or not the email exists
Refund:   webhook charge.refunded (full) ──▶ revokeLicense by payment intent
```

In mock mode (`USE_MOCKS=true`; also the default when unset, except on Vercel Production), checkout skips Stripe. It runs the same fulfillment code with a fake paid session, then returns `/thanks?session_id=mock_…`. Mock emails appear at `/dev/emails` (dev builds only).

## Code layout

Everything lives in `src/lib/license/`. Routes import only `service.ts`.

| File | Role |
|------|------|
| `types.ts` | Domain types, the `LicenseStore`, `CheckoutProvider`, `EmailProvider`, `WebhookProvider` interfaces |
| `core.ts` | Rules: idempotent fulfillment, 3-device limit, statuses, resend. Takes providers as an argument |
| `service.ts` | `core` bound to the providers that `USE_MOCKS` selects |
| `providers.ts` | Picks mock or real providers |
| `mock/*` | In-memory store with seed keys, console + outbox email, instant checkout, unsigned webhook |
| `stripe/*`, `postgres/*`, `resend/*` | Phase 2 implementations (stubs with TODOs today) |
| `stripe/helpers.ts` | Stripe event → `PaymentEvent` mapping, site origin, refund check (implemented, tested) |
| `email-template.ts` | License email copy, shared by the mock and Resend |
| `rate-limit.ts`, `http.ts` | In-memory rate limits and request parsing for the routes |

Phase 2 fills in the stub files and sets `USE_MOCKS=false`. Routes, pages, and `core.ts` stay the same.

## License API (Mac app)

Base URL: `https://www.spinespy.com/api/license`. All requests are `POST` with a JSON body. The contract is the same in mock and real modes.

Domain results always come back as HTTP 200 with a `status` field. Keys are trimmed and uppercased before lookup.

### `POST /activate`

```json
{ "key": "SPY-ABCD-EFGH-JKLM", "deviceId": "stable-device-id", "deviceName": "Studio MacBook Pro" }
```

Returns `{ "status": "ok" | "invalid" | "revoked" | "limit_reached" }`.

- At most 3 active devices per key.
- Activating a device that is already active returns `ok` and updates its name.
- `deviceName` is optional (defaults to `Mac`, max 100 characters).

### `POST /deactivate`

```json
{ "key": "SPY-ABCD-EFGH-JKLM", "deviceId": "stable-device-id" }
```

Returns `{ "status": "ok" }`. Frees the slot. Unknown keys and devices also return `ok`.

### `POST /validate`

```json
{ "key": "SPY-ABCD-EFGH-JKLM", "deviceId": "stable-device-id" }
```

Returns `{ "status": "active" | "revoked" | "invalid" | "not_activated" }`. `revoked` takes priority over `not_activated`. Each `active` result updates the device's `lastValidatedAt`.

### `POST /resend` (website)

```json
{ "email": "buyer@example.com" }
```

Returns `{ "message": "If a purchase exists for this email, we've resent your key." }`. Resends every active key for that email. The reply and its timing are the same whether or not the email has a purchase.

### Errors

| HTTP | Body | When |
|------|------|------|
| 400 | `{ "error": "deviceId is required" }` | Missing or non-JSON body, missing `deviceId` (max 200 characters) |
| 400 | `{ "error": "Enter a valid email address." }` | `/resend` with a bad email |
| 429 | `{ "error": "rate_limited" }` + `Retry-After` | Over the rate limit |
| 500 | `{ "error": "server_error" }` | Unexpected failure; retry later |

### Rate limits (per IP, per server instance)

| Endpoint | Limit |
|----------|-------|
| activate, deactivate | 10 / minute |
| validate | 30 / minute |
| resend | 5 / minute per IP, 3 / hour per email (over the email limit: same reply, no send) |
| `/api/checkout` | 10 / minute |

## Mock seed keys

| Key | State |
|-----|-------|
| `SPY-TEST-0000-0001` | Valid, no devices |
| `SPY-FULL-0000-0001` | Valid, already on 3 Macs (`seed-mac-1` … `seed-mac-3`) |
| `SPY-REVK-0000-0001` | Revoked |

All three belong to `seed@example.com`, so `/restore` with that email resends the two active keys.

Mock state lives in server memory. It resets when the dev server restarts, and it is not shared across Vercel function instances.

## Testing by hand (mock mode)

```bash
npm run dev
curl -s localhost:3000/api/license/activate -H 'content-type: application/json' \
  -d '{"key":"SPY-FULL-0000-0001","deviceId":"new-mac","deviceName":"New Mac"}'
# {"status":"limit_reached"}

# Refund a mock purchase (payment intent is pi_mock_<id> for session mock_<id>):
curl -s localhost:3000/api/stripe/webhook -H 'content-type: application/json' \
  -d '{"type":"charge.refunded","data":{"object":{"payment_intent":"pi_mock_<id>","refunded":true,"amount":999,"amount_refunded":999}}}'
```
