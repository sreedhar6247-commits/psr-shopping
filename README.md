# PSR Shopping V3

Starter full-stack project structure for PSR Shopping.

## Stack
- Next.js + TypeScript frontend
- API route placeholders
- PostgreSQL-ready database layer
- Admin dashboard starter
- UPI/payment integration placeholder

## Run
1. Install Node.js 20+.
2. Copy `.env.example` to `.env.local`.
3. Set `DATABASE_URL` when a PostgreSQL database is available.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open `http://localhost:3000`.

This starter intentionally does not contain real payment secrets or production credentials.

## Production TODO
- Add PostgreSQL/Prisma migrations
- Add secure authentication and admin roles
- Add server-side order creation
- Add payment gateway + webhook verification
- Add image storage
- Add shipping integration
- Add email/SMS/WhatsApp notifications
- Deploy frontend/backend/database
