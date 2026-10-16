# GACEB Scholar — starter website

A responsive React + Vite starter for GACEB Scholar, designed around the Uganda O-Level and A-Level learning community. The supplied GACEB badge is included as `assets/gaceb-badge.png` without changing its artwork.

## Included in this starter
- Home page with premium academic styling, gentle animations, dark mode and mobile navigation.
- Funding page with Premium Weekly (UGX 10,000/week) and Premium Monthly (UGX 30,000/month) membership cards. Payment processing is not connected yet; connect a provider and verify subscriptions securely before accepting money.
- Resources page with A-Level → Sciences / Arts and O-Level → Sciences / Humanities.
- Search and filters for sample resources.
- PDF upload form, pending-review state, and a clear +5 coins-after-approval message.
- Student/teacher demo dashboards, schools page, rewards page and About GACEB page.
- Gauge Assistant chat UI with starter answers.
- Account creation UI and sample coin balance.
- Mobile responsive layout and reduced-motion support.

## Run locally
Install Node.js (LTS), then in this folder run:

```bash
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

The production files are generated in `dist/`.

## Publish through GitHub
1. Create a new GitHub repository named `gaceb-scholar`.
2. Unzip this project and upload all files/folders to the repository root (not just the zip).
3. Commit the files.
4. For a real deployed app, connect the repository to Vercel and set the build command to `npm run build`, output directory to `dist`.
5. If using GitHub Pages, configure Vite's `base` path to match the repository name before building. GitHub Pages only hosts static files and cannot provide secure authentication, persistent uploads, moderation, or server-side coin validation.

## Important: demo vs production
This is a front-end starter, not a finished secure service. The demo sign-in form does not create real accounts. Uploads are held only in the current page session and are not stored in cloud storage. Sample resources do not include real PDF files, so their download buttons explain that a backend is needed. The +5 coin rule is shown in the UI, but coins must only be issued by a trusted server after an upload is approved or a qualifying invite is verified.

Before opening to the public, connect a backend such as Supabase:
- Authentication: email/password or another supported sign-in method.
- Database: profiles, schools, resources, moderation status, coin ledger, referrals and redemptions.
- Storage: private PDF bucket with file-size/type checks and secure download URLs.
- Server-side functions / database policies: award 5 coins exactly once for each approved PDF and once per verified invite; block duplicate uploads, duplicate accounts and self-referrals.
- Admin dashboard: review, approve/reject, and moderate uploads.
- Copyright/permission checks: accept only original or properly authorised PDFs; do not redistribute copyrighted textbooks or papers without permission.
- Gauge Assistant: connect an AI service if you want live AI answers. The included chat is a demo UI with predefined responses.

## Add the real photos to About GACEB
The current project preserves the real badge you uploaded. The four earlier photos are not bundled automatically because they were not mounted as accessible files for this build. Add your original photos into `public/images/` (for example `ceo-gauge.jpg`, `teacher-award-1.jpg`, `teacher-award-2.jpg`, `teacher-award-3.jpg`) and update the two leader photo placeholders in `src/main.jsx` to use the actual image paths. Do not replace them with AI-generated portraits.

## Branding
Website name: **GACEB Scholar**  
Tagline: **Learn · Share · Rise**  
GACEB badge: original user-provided artwork, unchanged.


## Floating “Donate to GACEB” button

A floating gold, slightly transparent donation button is included across the app. Before accepting real donations, replace `YOUR-DONATION-LINK` in `src/main.jsx` with your verified donation checkout URL (for example, a payment link from a provider that supports your Ugandan mobile money account). The button alone does not process payments; a real provider account and payment link are required. Never put secret API keys in frontend code.
