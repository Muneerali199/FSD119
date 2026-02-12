# HealthVillage

HealthVillage is a full-stack rural telemedicine platform with secure authentication, role-based access control, scheduling, encrypted consultations, EHR, prescriptions, and admin analytics.

## Stack
- Next.js App Router + TypeScript
- PostgreSQL + Prisma
- JWT sessions (httpOnly cookies)
- Field-level encryption (AES-256-GCM)

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment variables:

```bash
copy .env.example .env
```

Generate a 32-byte base64 key for `DATA_ENCRYPTION_KEY`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

3. Initialize the database:

```bash
npx prisma migrate dev --name init
```

4. Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Core Features
- Secure registration, login, and role-based access
- Scheduling with doctor availability, queue control, and automated reminders
- Encrypted consultation rooms with WebRTC manual offer/answer flow
- Secure chat and encrypted file sharing tied to consultations
- EHR with encrypted symptoms, diagnosis, treatment, and notes
- Digital prescriptions with tracking and follow-up reminders
- Admin analytics, audit logs, and access reporting
- Optional modules: AI symptom triage, mock payments, device data ingestion

## Architecture Notes
- API routes in `src/app/api/*` enforce RBAC and audit logging.
- Sensitive data is encrypted at rest using `src/lib/crypto.ts`.
- Session cookies are httpOnly and signed via `AUTH_SECRET`.
- Prisma schema in `prisma/schema.prisma` defines all data entities.

## Security Practices
- TLS for all requests in production (terminate at your gateway).
- Store `AUTH_SECRET` and `DATA_ENCRYPTION_KEY` in a vault.
- Use database encryption at rest + backups with strict access controls.
- Review audit logs regularly and set retention policies.
- Apply rate limits and WAF rules for public endpoints.

## Suggested Production Enhancements
- Add TURN servers and automated WebRTC signaling.
- Add multi-factor authentication and password rotation policies.
- Integrate real SMS/email providers for reminders.
- Implement file storage on S3/GCS with envelope encryption.

## Scripts
- `npm run dev` - start development server
- `npm run build` - build
- `npm run start` - start production
- `npm run lint` - lint
