# StudyPlanner

StudyPlanner is a complete mock-test and study hub inspired by MockMatrixHub's structure:

- Landing page with aspirant-focused hero
- App install style section
- Explore Exams page
- Important Series page
- Live Test Center page
- Pricing / premium plan page
- Student mock test player
- Admin control panel
- Firebase Firestore and Supabase storage adapters
- JSON quiz file import/export

## Setup

Open `index.html` locally or deploy the folder to GitHub Pages, Cloudflare Pages, Firebase Hosting, Netlify, or Vercel.

## Quiz storage

Local sample data: `data/quizzes.json`

Firebase collections:
- `quizzes/{quizId}`
- `attempts/{attemptId}`

Supabase tables:
- Run `docs/schema.sql` in Supabase SQL editor.

## Configure Firebase/Supabase

Replace placeholders in:
- `firebase.js`
- `supabase.js`

Use only public Firebase web config and Supabase anon key in frontend code. Add secure admin authentication before production.

## Architecture upgrade from uploaded analysis

Added:
- Firebase Auth-ready `login.html`, `auth.js`, and `profile.html`
- PWA `manifest.json` and `sw.js`
- Result page placeholder for attempt history
- Premium guard pattern using `users/{uid}.isPremium`
- Detailed Firestore architecture in `docs/architecture.md`
- Payment-ready notes for Razorpay/Cashfree via secure Cloud Function

Recommended production rules:
- Allow public read only for free test metadata.
- Require authenticated premium users for premium question documents.
- Require admin custom claims for quiz uploads.
- Never put Razorpay/Cashfree secret keys in frontend JavaScript.
