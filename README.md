# Bernoulli 25'-26' — Alumni Tracking Website

Tracking Records for Alumni Contact & Engagement for School Administration (T.R.A.C.E.). Built with **Next.js**, **Firebase Firestore**, **Zustand**, and **Tailwind CSS**.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up Firebase (see [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed instructions):
   - Create a Firebase project
   - Enable Firestore Database
   - Copy `.env.example` to `.env.local` and add your Firebase config

3. Start development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

- **/** — Home: nav to T.R.A.C.E., Alumni Registration, School Registrar, Our Team
- **/alumni-registration** — Alumni can register their information (NEW!)
- **/login** — Password-only login (demo password: `registrar`)
- **/trace** — Alumni List & Contact Information; links to ABM and STEM, plus Alumni Registration
- **/trace/abm** — ABM strand alumni
- **/trace/stem** — STEM strand alumni
- **/researchers** — About the Researchers (four profiles)
- **/registrar** — School Registrar (redirects to login if not authenticated)

## Tech

- **Next.js 14** (App Router)
- **Firebase Firestore** — Cloud database for alumni data storage
- **Zustand** — global state (`isAuthenticated`, `currentPage`) in `src/store/useAppStore.ts`
- **Tailwind CSS** — colors and layout aligned with the prototype (orange, red, cream, peach)

## Firebase Migration

If you have existing CSV data, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for migration instructions.

## Demo login

Password for School Registrar / authenticated area: **registrar**
