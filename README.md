# WoodNest Interiors

Modern full-stack furniture store (Next.js 14 + Prisma + Postgres + NextAuth + Cloudinary + Shadcn UI + Tailwind + Framer Motion).

## 1) Setup

1. Copy env file: `copy .env.example .env`
2. Start Postgres: `docker compose up -d`
3. Install deps: `npm i`
4. Migrate + seed: `npm run prisma:migrate` then `npm run db:seed`
5. Run: `npm run dev`

## 2) Admin login

- Go to `/admin/login`
- Credentials come from `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) and are written to the database by `prisma/seed.ts`.

## 3) Cloudinary images

- Set `CLOUDINARY_*` env vars.
- Admin product form uploads via a signed Cloudinary request.

## 4) WhatsApp checkout

- Set `NEXT_PUBLIC_WHATSAPP_PHONE_E164` (and optionally `WHATSAPP_PHONE_E164` for server-rendered links).

## 5) Structure

- Storefront pages: `src/app/(site)`
- Admin: `src/app/admin`
- API: `src/app/api`
- Prisma schema: `prisma/schema.prisma`

## Vercel Deploy

1. Push this repo to GitHub (already set up for `main`).
2. Import into Vercel.
3. Add Environment Variables in Vercel:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your deployed domain)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (optional, for admin uploads)
   - `NEXT_PUBLIC_WHATSAPP_PHONE_E164` (optional)
4. Deploy. Build runs `npm run vercel-build` (includes `prisma migrate deploy`).
5. Create admin user once (recommended): set `ADMIN_EMAIL` + `ADMIN_PASSWORD` locally with `DATABASE_URL` pointing to prod, then run `npm run db:seed`.
