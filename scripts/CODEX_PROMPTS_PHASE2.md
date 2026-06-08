# Stillroom Site — Phase 2 Codex Prompts
# Sequential — run in order, stop on failure

---

## CONTEXT (read before every prompt)

Repo: `/Users/ehauga/Desktop/local dev/stillroom`
Stack: Vite + React 19 + plain CSS (no Tailwind, no component library)
Entry: `src/main.jsx` + `src/styles.css`
Deployed: Cloudflare Pages at stillroom.readyaimgo-8918.chatgpt-team.site
Firebase project will be added in PROMPT_03 onward.

---

## PROMPT_01 — Apply Stillroom Brand Tokens (Colors + Fonts)

**Goal:** Replace the current placeholder palette with Stillroom's actual brand identity extracted from stillroommusicinc.org.

The Wix site uses:
- Background: white (`#FFFFFF`) / off-white sections
- Primary text: near-black (`#1A1A1A`)
- Accent/logo color: deep burgundy/wine `#5C1F2E` (pulled from logo mark)
- Secondary accent: warm charcoal `#2E2E2E`
- Body font: **Cormorant Garamond** (serif — already in use, keep it)
- Display/heading font: **Libre Baskerville** or **Playfair Display** — the Wix site uses a classic serif for headings, NOT Bebas Neue. Switch the display font.
- UI/mono labels: **DM Mono** (keep)
- Button color: uses the burgundy `#5C1F2E` not rust

**Tasks:**
1. Open `src/styles.css`
2. Update `:root` CSS variables:
   ```css
   :root {
     --ink: #1A1A1A;
     --paper: #FFFFFF;
     --bone: #F5F2EE;
     --burgundy: #5C1F2E;
     --warm-gray: #2E2E2E;
     --gold: #9C7E4A;
     --moss: #1E3028;
     --text: #1A1A1A;
   }
   ```
3. Replace all `var(--rust)` references with `var(--burgundy)`
4. Update the Google Fonts import URL in `styles.css` to:
   ```
   https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@300;400&display=swap
   ```
5. In `styles.css`, change ALL `font-family: "Bebas Neue"` references to `font-family: "Playfair Display"` — adjust `letter-spacing` from `0.15em` down to `0.02em` and `line-height` from `0.95` up to `1.05` wherever applied
6. In `index.html`, update the `<title>` and add a `<link>` preconnect to fonts.googleapis.com and fonts.gstatic.com
7. Run `npm run build` — confirm 0 errors
8. Commit: `git add -A && git commit -m "Apply Stillroom brand tokens: burgundy palette + Playfair Display"`

---

## PROMPT_02 — Firebase Project Init + Firestore Schema

**Goal:** Add Firebase to the repo so score submissions, audition registrations, and newsletter signups are stored in Firestore — not just emailed.

**Tasks:**
1. Install Firebase:
   ```
   npm install firebase
   ```
2. Create `src/firebase.js`:
   ```js
   import { initializeApp } from 'firebase/app';
   import { getFirestore } from 'firebase/firestore';

   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID,
   };

   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   ```
3. Create `.env.local` (gitignored) with placeholder keys — Ezra will fill in real values:
   ```
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   ```
4. Confirm `.env.local` is in `.gitignore`
5. Create `src/collections.js` documenting the Firestore schema:
   ```js
   // Firestore Collections

   // scores/{docId}
   // { firstName, lastName, email, title, genre, duration,
   //   instrumentation, scoreLink, statement, status: 'pending',
   //   createdAt: serverTimestamp() }

   // auditions/{docId}
   // { firstName, lastName, email, sessionDate, sessionType,
   //   instrument, experience, status: 'pending',
   //   createdAt: serverTimestamp() }

   // subscribers/{docId}
   // { email, name, createdAt: serverTimestamp() }
   ```
6. Run `npm run build` — confirm 0 errors
7. Commit: `git add -A && git commit -m "Add Firebase + Firestore schema"`

---

## PROMPT_03 — Wire Score Submission Form to Firestore

**Goal:** Replace the mailto href on the score submission form with a real Firestore write. Show success/error state in the UI.

**Tasks:**
1. Open `src/main.jsx`
2. Import at top:
   ```js
   import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
   import { db } from './firebase';
   ```
3. Replace the `scoreHref` useMemo and the `<a className="button primary full" href={scoreHref}>` with:
   - A `submitScore` async function that calls `addDoc(collection(db, 'scores'), { ...score, status: 'pending', createdAt: serverTimestamp() })`
   - A `scoreState` state: `'idle' | 'submitting' | 'success' | 'error'`
   - A `<button>` that calls `submitScore` on click
   - Disabled + loading text while `scoreState === 'submitting'`
   - Success message: "Score received. Our Artistic Directors will be in touch."
   - Error message: "Submission failed. Please email stillroommke@gmail.com directly."
4. Clear the form fields on success
5. Run `npm run build` — confirm 0 errors
6. Commit: `git add -A && git commit -m "Wire score form to Firestore"`

---

## PROMPT_04 — Wire Audition Registration to Firestore

**Goal:** Give the audition section a real registration form that writes to Firestore, replacing the mailto link.

**Tasks:**
1. In `src/main.jsx`, add audition registration state:
   ```js
   const [audition, setAudition] = useState({
     firstName: '', lastName: '', email: '',
     sessionDate: 'May 23', sessionType: 'Instruments',
     instrument: '', experience: ''
   });
   const [auditionState, setAuditionState] = useState('idle');
   ```
2. Add a `submitAudition` async function writing to `collection(db, 'auditions')` with `serverTimestamp()`
3. In the auditions section JSX, add a registration form below the session list:
   - Fields: First name, Last name, Email, Session (dropdown from `auditionSessions`), Instrument / Voice type, Brief experience note
   - Submit button with loading/success/error states matching the score form pattern
4. Style the form using existing `.panel`, `label`, `input`, `.button.primary` classes — no new CSS classes needed
5. Run `npm run build` — confirm 0 errors
6. Commit: `git add -A && git commit -m "Wire audition registration to Firestore"`

---

## PROMPT_05 — Newsletter Subscriber Capture

**Goal:** Add an email capture bar (above footer) that writes to `subscribers` collection in Firestore.

**Tasks:**
1. Add subscriber state to App:
   ```js
   const [subEmail, setSubEmail] = useState('');
   const [subName, setSubName] = useState('');
   const [subState, setSubState] = useState('idle');
   ```
2. Add `submitSubscriber` async function writing `{ name: subName, email: subEmail, createdAt: serverTimestamp() }` to `collection(db, 'subscribers')`
3. Add a new `<section className="subscribe section">` just before `<footer>`:
   - Dark background (`var(--warm-gray)`)
   - Heading: "Stay in the Room" 
   - Subtext: "Get updates on auditions, score calls, and concert season."
   - Two inputs: Name, Email
   - Submit button with states
4. Add `.subscribe` styles to `styles.css` — keep it minimal, use existing variable set
5. Run `npm run build` — confirm 0 errors
6. Commit: `git add -A && git commit -m "Add subscriber capture to Firestore"`

---

## PROMPT_06 — Admin Dashboard (/admin route)

**Goal:** Add a password-protected `/admin` page for JJ to review score submissions, audition registrations, and subscribers from Firestore. No full auth system — just an env-var secret pin.

**Tasks:**
1. Install react-router-dom:
   ```
   npm install react-router-dom
   ```
2. Add to `.env.local`:
   ```
   VITE_ADMIN_PIN=stillroom2026
   ```
3. Create `src/Admin.jsx`:
   - Pin gate: simple `<input type="password">` checked against `import.meta.env.VITE_ADMIN_PIN`
   - Once unlocked, render three tabs: Scores | Auditions | Subscribers
   - Each tab fetches from Firestore (getDocs) and renders a table with all fields + createdAt
   - Scores tab: show a status badge (pending/reviewed/programmed) with a dropdown to update it via `updateDoc`
   - Styling: use existing CSS variables, keep it functional not fancy
4. Create `src/App.jsx` wrapping routing:
   ```jsx
   import { BrowserRouter, Routes, Route } from 'react-router-dom';
   import Main from './main.jsx';
   import Admin from './Admin.jsx';
   export default function App() {
     return (
       <BrowserRouter>
         <Routes>
           <Route path="/" element={<Main />} />
           <Route path="/admin" element={<Admin />} />
         </Routes>
       </BrowserRouter>
     );
   }
   ```
5. Update entry point in `main.jsx` to render `<App />` instead of the current component directly (rename current export to `Main`)
6. Add `vite.config.js` with `historyApiFallback` support (or confirm Cloudflare Pages `_redirects` file handles SPA routing):
   - Create `public/_redirects` with content: `/* /index.html 200`
7. Run `npm run build` — confirm 0 errors
8. Commit: `git add -A && git commit -m "Add /admin dashboard with Firestore read + score status update"`

---

## PROMPT_07 — Stripe Donation Integration

**Goal:** Replace the "Request Donation Instructions" mailto with real Stripe Checkout for one-time donations.

**Tasks:**
1. Install Stripe JS:
   ```
   npm install @stripe/stripe-js
   ```
2. Add to `.env.local`:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
3. Create `src/stripe.js`:
   ```js
   import { loadStripe } from '@stripe/stripe-js';
   export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
   ```
4. Note: Stripe Checkout requires a backend to create a session. For now, create a Stripe Payment Link for each donation tier via the Stripe dashboard, and update the `tiers` array in `main.jsx` with a `link` property for each tier pointing to the Stripe Payment Link URL.
5. Replace donation `<a className="button light full" href={donationHref}>` with a `<a href={selectedTierLink} target="_blank" rel="noreferrer" className="button light full">` that opens the Stripe Payment Link.
6. Add a note in `src/stripe.js` comment: "TODO: replace Payment Links with server-side Checkout Sessions when Firebase Functions are added (Phase 3)"
7. Run `npm run build` — confirm 0 errors
8. Commit: `git add -A && git commit -m "Add Stripe Payment Link donation flow per tier"`

---

## PROMPT_08 — Photo Upload for Score Submissions (Firebase Storage)

**Goal:** Allow composers to optionally attach a photo or PDF of their score directly in the form (not just a link).

**Tasks:**
1. Add Firebase Storage to `src/firebase.js`:
   ```js
   import { getStorage } from 'firebase/storage';
   export const storage = getStorage(app);
   ```
2. In `src/main.jsx`, add `scoreFile` state: `const [scoreFile, setScoreFile] = useState(null)`
3. Add a file input to the score form:
   ```jsx
   <label>
     Upload Score PDF (optional)
     <input type="file" accept=".pdf,.musicxml,.mxl" onChange={e => setScoreFile(e.target.files[0])} />
   </label>
   ```
4. In `submitScore`, if `scoreFile` exists:
   - Upload to Firebase Storage at `scores/{timestamp}_{filename}`
   - Get the download URL
   - Include `uploadedScoreUrl` in the Firestore doc
5. Style the file input within the existing `.panel` dark theme
6. Run `npm run build` — confirm 0 errors
7. Commit: `git add -A && git commit -m "Add score PDF upload to Firebase Storage"`

---

## PROMPT_09 — SEO + Meta Tags + OG Images

**Goal:** Give every page proper meta tags, Open Graph data, and a Twitter card so sharing on social actually looks good.

**Tasks:**
1. In `index.html`, add full meta block:
   ```html
   <meta name="description" content="Stillroom Music Inc. is Milwaukee's contemporary music ensemble amplifying underrepresented composers across the Midwest." />
   <meta property="og:title" content="Stillroom Music Inc." />
   <meta property="og:description" content="Milwaukee's contemporary ensemble for a wider, bolder future of new music." />
   <meta property="og:image" content="/og-image.jpg" />
   <meta property="og:url" content="https://stillroommusicinc.org" />
   <meta name="twitter:card" content="summary_large_image" />
   <link rel="canonical" href="https://stillroommusicinc.org" />
   ```
2. Create `public/og-image.jpg` — use the existing hero image (download from the Unsplash URL in main.jsx, resize to 1200x630, save to `public/`)
3. Add `<link rel="icon" href="/favicon.ico">` — create a minimal favicon using the "S" lettermark in burgundy on white (use a base64 SVG favicon as fallback if no image tool available)
4. Run `npm run build` — confirm 0 errors
5. Commit: `git add -A && git commit -m "Add SEO meta tags, OG image, favicon"`

---

## SUMMARY — What This Unlocks vs Wix

| Feature | Wix (current) | After Phase 2 |
|---|---|---|
| Score submission | Google Form → email | Firestore with status tracking |
| Audition registration | Manual email | Firestore + admin view |
| Donations | Manual PayPal/Venmo | Stripe Payment Links |
| Newsletter | n/a | Firestore subscribers list |
| Admin review | Gmail inbox | /admin dashboard with tabs |
| File upload | n/a | Firebase Storage PDF upload |
| SEO/OG | Wix auto-generated | Custom per-page |
| Hosting | Wix locked-in | Cloudflare Pages, portable |

---

## Firebase Should be Added: YES

Codex's initial assessment ("no Firebase needed yet") was correct for a static launch, 
but the moment any of the following go live, Firebase is required:
- Score submissions stored and tracked
- Audition registrations
- Newsletter signups
- Admin dashboard
- File uploads

Add Firebase in PROMPT_02. The project is already at that stage.
