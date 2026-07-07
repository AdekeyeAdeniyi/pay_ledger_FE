# PayLedger: Financial Operations Ledger

PayLedger is a high-performance financial reconciliation engine designed
to automate payment tracking, invoice management, and settlement
matching for modern enterprises.

## 🚀 Features

- **Real-time Ledger:** Instant visibility into collections and
  receivables.
- **Automated Reconciliation:** Sync bank transfers directly to
  invoices via NUBAN virtual accounts.
- **Immutable Audit Trail:** Cryptographic logging for every inbound
  webhook and payment event.
- **Dynamic Checkout:** Seamless generation of payment links for
  on-time customers.
- **Generate Invoice:** Generate digital invoice

## 🛠 Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **State Management:** TanStack Query (React Query)
- **API Client:** Axios
- **Icons:** Lucide React

## 📦 Getting Started

### 1. Prerequisites

- Node.js (v18+)
- Access to the Nomba Developer API

### 2. Environment Variables

Create a `.env.local` file in your root directory:

```bash
NEXT_PUBLIC_API_URL=your_api_url_here
NEXT_PUBLIC_NOMBA_SECRET=NombaHackathon2026
```

## 🔐 Webhook Integration & Testing

To integrate with Nomba and test reconciliation, use the Developer's
Testing Kit below.

### Webhook Simulation (Postman)

1.  Go to **Settings → Bank Settings** and copy your unique Webhook URL.

2.  Generate the HMAC signature using:

```javascript
> **⚠️ Note:** Fill in the required fields before running this script.

const crypto = require("crypto");

function generateNombaSignature(secret, payload) {
  const timestamp = new Date().toISOString();
  const stringToSign = timestamp + JSON.stringify(payload);
  const signature = crypto
    .createHmac("sha256", secret)
    .update(stringToSign)
    .digest("hex");
  return { timestamp, signature };
}

const MY_SECRET_KEY = "NombaHackathon2026";

const virtualPayload = `{"event_type":"payment_success","requestId":"49e11b44-909b-4f83-82b4-9a83aXXXXXX","data":{"merchant":{"walletId":"693e907aad9ea59616XXXX","walletBalance":539.4,"userId":"613bb620-c8e5-45f6-9c00-XXXXXXXX"},"terminal":{},"transaction":{"aliasAccountNumber":"967913XXX","fee":0.6,"sessionId":"1000042602061021531516XXXXXX","type":"vact_transfer","transactionId":"API-VACT_TRA-613BB-eeae578a-cdd4-459c-8bd5-XXXXXX","aliasAccountName":"Peter/Peter Enterprise","responseCode":"","originatingFrom":"api","transactionAmount":"${[[INVOICE_AMOUNT]]}","narration":"Transfer from JOHN GRASS","time":"2026-02-06T10:21:56Z","aliasAccountReference":"${[[INVOICE_ACCOUNT_REFERENCE]]}","aliasAccountType":"VIRTUAL"},"customer":{"bankCode":"305","senderName":"JOHN GRASS","bankName":"Paycom (Opay)","accountNumber":"81689XXX"}}}`

const orderPayload = `{"event_type":"payment_success","requestId":"1ef33774-6d95-411c-b5*************","data":{"merchant":{"walletId":"1ef33774-6d95-411c-b5*************","walletBalance":259.47,"userId":"1ef33774-6d95-411c-b5*************"},"terminal":{},"tokenizedCardData":{"tokenKey":"N/A","cardType":"Visa","tokenExpiryYear":"N/A","tokenExpiryMonth":"N/A","cardPan":"4***45**** ****111*"},"transaction":{"fee":2.8,"type":"online_checkout","transactionId":"WEB-ONLINE_C-69923-2e102708-ee34-4a29-b713-a826ca928a********","cardIssuer":"Visa","responseCode":"","originatingFrom":"web","merchantTxRef":"18********","transactionAmount":amount,"time":"2025-09-11T11:50:05Z"},"customer":{"billerId":"418745**** ****1119","productId":"418***"},"order":{"amount":${[[INSERT_ORDER_AMOUNT]]},"orderId":"1ef33774-6d95-411c-b5*************","cardType":"Visa","accountId":"1ef33774-6d95-411c-b5*************","cardLast4Digits":"111*","cardCurrency":"NGN","customerEmail":"makurseme@gmail.com","customerId":"7628783*******","isTokenizedCardPayment":"false","orderReference":${[[INSERT_INVOICE_ORDER_REFERENCE]]},"paymentMethod":"card_payment","callbackUrl":"https://nomba.com","currency":"NGN"}}}`

const credentials = generateNombaSignature(MY_SECRET_KEY, virtualPayload);
console.log("nomba-timestamp:", credentials.timestamp);
console.log("nomba-signature:", credentials.signature);
```

### Postman Configuration

- Method: `POST`

Headers:

- `nomba-signature`: Generated signature
- `nomba-sig-value`: Generated signature
- `nomba-signature-algorithm`: HmacSHA256
- `nomba-signature-version`: 1.0.0
- `nomba-timestamp`: Generated timestamp

## 🏗 Architecture

The application follows a clean service-oriented architecture:

- `services/` -- API wrappers for Axios
- `hooks/` -- TanStack Query hooks for caching and refetching
- `components/` -- Modular UI components based on the design system

## 🤝 Support

For technical inquiries or bug reporting, please contact the development
team via the internal documentation portal.
