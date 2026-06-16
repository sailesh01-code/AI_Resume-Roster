================================================================================
              AI RESUME ANALYZER — Full-Stack ATS Resume Checker
================================================================================

A Full-Stack AI Resume Checker App built with the MERN stack (MongoDB, Express,
React, Node.js), styled with Tailwind CSS v4 + shadcn-style UI components, and
powered by Google Gemini AI.

Upload your resume as a PDF, get an instant ATS-readiness score with a detailed
breakdown, see prioritized issues and standout strengths, let AI rewrite your
weak bullet points, then track every improvement with full version history and
a side-by-side diff.


================================================================================
                              TABLE OF CONTENTS
================================================================================

  1.  Features
  2.  Tech Stack
  3.  Prerequisites
  4.  Project Structure
  5.  Getting Started
      5a.  Clone the Repository
      5b.  Backend Setup
      5c.  Frontend Setup
  6.  Environment Variables
  7.  Running the Application
  8.  API Endpoints Reference
  9.  Frontend Pages & Routes
  10. How to Use the App (Step-by-Step)
  11. Troubleshooting
  12. License


================================================================================
  1.  FEATURES
================================================================================

  1.  User Authentication
      - Secure register & login with JWT stored in httpOnly cookies
      - Passwords hashed with bcrypt
      - Profile updates and password changes

  2.  Resume Upload
      - PDF upload via drag-and-drop or file picker
      - Powered by multer (memory storage), 5 MB limit, PDF-only validation

  3.  PDF Text Extraction
      - Extracts clean text from PDF resumes using pdf-parse
      - Detects scanned / image-only PDFs and warns the user

  4.  AI Structured Parsing
      - Google Gemini converts raw resume text into structured JSON sections:
        basics, experience, education, skills, projects, certifications
      - Validated with Zod schemas for reliable output

  5.  ATS Scoring (0–100)
      - AI scores the resume across keywords, formatting, impact, and clarity
      - Full score breakdown with category-level feedback

  6.  AI Issues & Strengths
      - 5 prioritized issues with severity ratings and fix suggestions
      - 5 evidence-based strengths that highlight what the resume does well

  7.  AI Bullet Rewrites
      - 5–10 weak bullets rewritten to be stronger, quantified, ATS-friendly
      - Each rewrite includes the original text, improved version, and rationale

  8.  Keyword Analysis
      - Detects keywords already present in the resume
      - Highlights notable keywords missing for the target role

  9.  Version History
      - Every upload and rewrite creates an immutable version (V1, V2, V3…)
      - Full version history is preserved per resume

  10. Apply Rewrites → New Version
      - One click applies selected (or all) AI rewrites
      - Creates a fresh version automatically

  11. Version Diff
      - Word-level and line-level diff to compare any two versions side by side

  12. Dashboard
      - Totals, latest resume card, score evolution chart
      - Version stack, KPI cards with sparklines, activity feed

  13. Insights Page
      - Average & best scores, score trend graph
      - Top recurring issues, top missing/present keywords
      - Per-resume performance table

  14. Versions & History Pages
      - Flat version list with filters
      - Chronological event feed of the whole account

  15. Rate Limiting & Validation
      - Per-user AI rate limits to prevent abuse
      - Zod request validation on every route

  16. Light & Dark Mode
      - Soft-minimal responsive UI with theme persistence


================================================================================
  2.  TECH STACK
================================================================================

  Backend:
    - Node.js (>= 20)
    - Express 5
    - MongoDB + Mongoose 9
    - Google Gemini AI (@google/genai)
    - JWT (jsonwebtoken) + bcrypt
    - multer (PDF upload), pdf-parse (text extraction)
    - Zod 4 (validation), diff (text diffing)
    - express-rate-limit, morgan, cookie-parser, cors, dotenv

  Frontend:
    - React 19 + Vite 8
    - React Router v7
    - TanStack React Query v5 (server state)
    - Tailwind CSS v4 + @tailwindcss/vite
    - Framer Motion (animations)
    - Recharts (charts & graphs)
    - Lucide React (icons)
    - Axios (HTTP client)
    - react-dropzone (file upload UI)
    - class-variance-authority + clsx + tailwind-merge (utility classes)
    - @react-pdf/renderer (PDF export)


================================================================================
  3.  PREREQUISITES
================================================================================

  Before you begin, make sure you have the following installed:

  [✓] Node.js   >= 20.x        https://nodejs.org
  [✓] npm       >= 10.x        (comes with Node.js)
  [✓] MongoDB   >= 7.x         https://www.mongodb.com/try/download/community
                                (or use MongoDB Atlas cloud — free tier available)
  [✓] Git                      https://git-scm.com

  You also need:
  [✓] A Google Gemini API key   https://aistudio.google.com/app/apikey


================================================================================
  4.  PROJECT STRUCTURE
================================================================================

  AI Resume Analyzer/
  │
  ├── backend/                         # Express.js API server
  │   ├── .env                         # Environment variables (DO NOT COMMIT)
  │   ├── package.json                 # Backend dependencies & scripts
  │   └── src/
  │       ├── server.js                # Express app entry point
  │       ├── config/
  │       │   ├── db.js                # MongoDB connection logic
  │       │   └── env.js               # Environment config loader
  │       ├── middleware/
  │       │   ├── auth.js              # JWT authentication middleware
  │       │   ├── errorHandler.js      # Global error handler + 404 handler
  │       │   ├── rateLimit.js         # Per-user rate limiting
  │       │   ├── upload.js            # Multer PDF upload (5 MB, PDF only)
  │       │   └── validate.js          # Zod request body validation
  │       ├── models/
  │       │   ├── User.js              # User model (name, email, passwordHash)
  │       │   ├── Resume.js            # Resume model (title, userId, versions)
  │       │   ├── ResumeVersion.js     # Version model (rawText, parsedSections)
  │       │   └── Analysis.js          # Analysis model (ATS score, issues, etc.)
  │       ├── routes/
  │       │   ├── auth.js              # /api/auth — register, login, logout, me
  │       │   ├── resume.js            # /api/resumes — CRUD, analyze, rewrite, diff
  │       │   ├── dashboard.js         # /api/dashboard — stats, charts, activity
  │       │   ├── insights.js          # /api/insights — aggregate analytics
  │       │   ├── versions.js          # /api/versions — flat version list
  │       │   ├── history.js           # /api/history — chronological event feed
  │       │   └── health.js            # /api/health — server health check
  │       ├── services/
  │       │   ├── geminiService.js      # Google Gemini AI integration
  │       │   ├── structuredParser.js   # AI structured resume parsing
  │       │   ├── pdfService.js         # PDF text extraction (pdf-parse)
  │       │   └── diffService.js        # Word/line diff engine
  │       └── utils/
  │           ├── ApiError.js           # Custom API error class
  │           ├── asyncHandler.js       # Async route wrapper
  │           └── jwt.js                # JWT sign/verify + cookie options
  │
  └── frontend/
      └── ai-resume-checker-ui-boilerplate-code/   # Vite + React app
          ├── index.html               # HTML entry point
          ├── vite.config.js           # Vite config (proxy, aliases, Tailwind)
          ├── package.json             # Frontend dependencies & scripts
          └── src/
              ├── main.jsx             # React DOM root
              ├── App.jsx              # App root with providers
              ├── routes.jsx           # React Router config (all routes)
              ├── index.css            # Global CSS + Tailwind + theme variables
              ├── api/                 # Axios API client
              │   └── client.js
              ├── context/             # React Context (Auth, Theme)
              ├── hooks/               # Custom React hooks
              ├── lib/                 # Utility libraries
              ├── components/
              │   ├── ui/              # Reusable UI (Card, Button, Badge, etc.)
              │   ├── layout/          # AppShell, Sidebar, Header
              │   ├── landing/         # Landing/Hero components
              │   ├── auth/            # Auth form components
              │   ├── resume/          # Resume upload, detail components
              │   ├── analysis/        # Score, issues, strengths, rewrites
              │   ├── dashboard/       # Dashboard widgets & charts
              │   └── export/          # PDF export components
              └── pages/
                  ├── Landing.jsx      # Public landing page
                  ├── Login.jsx        # Login page
                  ├── Register.jsx     # Registration page
                  ├── Dashboard.jsx    # Main dashboard
                  ├── Resumes.jsx      # Resume list
                  ├── ResumeDetail.jsx # Single resume (analysis, versions, diff)
                  ├── Export.jsx       # PDF export page
                  ├── Insights.jsx     # Analytics & insights
                  ├── Versions.jsx     # All versions (flat list)
                  ├── History.jsx      # Chronological activity feed
                  └── Settings.jsx     # User profile & theme settings


================================================================================
  5.  GETTING STARTED
================================================================================


  ─── 5a. Clone the Repository ────────────────────────────────────────────────

    git clone <your-repo-url>
    cd "AI Resume Analyzer"


  ─── 5b. Backend Setup ───────────────────────────────────────────────────────

    1) Navigate to the backend folder:
       cd backend

    2) Install dependencies:
       npm install

    3) Create your .env file (or edit the existing one):
       Copy the template below and fill in your values:

       ┌─────────────────────────────────────────────────────────────────────┐
       │  MONGO_URI=mongodb://localhost:27017/ai-resume-roaster             │
       │  JWT_SECRET=your-random-secret-key-here                           │
       │  PORT=5000                                                         │
       │  GEMINI_API_KEY=your-google-gemini-api-key-here                   │
       │  GEMINI_MODEL=gemini-2.5-flash                                    │
       └─────────────────────────────────────────────────────────────────────┘

       IMPORTANT: Replace JWT_SECRET with a long random string.
       IMPORTANT: Replace GEMINI_API_KEY with your actual API key from
                  https://aistudio.google.com/app/apikey

    4) Make sure MongoDB is running:
       - Local: Start mongod service (or run "mongod" in a separate terminal)
       - Cloud: Use a MongoDB Atlas connection string in MONGO_URI

    5) Start the backend server:
       npm run dev        (development with auto-reload via nodemon)
       npm start          (production mode)

       The server will start at:  http://localhost:5000


  ─── 5c. Frontend Setup ──────────────────────────────────────────────────────

    1) Navigate to the frontend app folder:
       cd frontend/ai-resume-checker-ui-boilerplate-code

    2) Install dependencies:
       npm install

    3) Start the development server:
       npm run dev

       The app will start at:  http://localhost:5173

    NOTE: The Vite dev server is pre-configured to proxy all /api/* requests
          to http://localhost:5000, so the frontend and backend work together
          seamlessly during development. No extra CORS config needed.


================================================================================
  6.  ENVIRONMENT VARIABLES
================================================================================

  All environment variables go in:  backend/.env

  ┌────────────────────┬────────────────────────────────────────────────────────┐
  │ Variable           │ Description                                           │
  ├────────────────────┼────────────────────────────────────────────────────────┤
  │ MONGO_URI          │ MongoDB connection string                             │
  │                    │ Default: mongodb://localhost:27017/ai-resume-roaster   │
  ├────────────────────┼────────────────────────────────────────────────────────┤
  │ JWT_SECRET         │ Secret key for signing JWT tokens                     │
  │                    │ REQUIRED — use a strong random string                 │
  ├────────────────────┼────────────────────────────────────────────────────────┤
  │ PORT               │ Port the backend server runs on                       │
  │                    │ Default: 5000                                          │
  ├────────────────────┼────────────────────────────────────────────────────────┤
  │ GEMINI_API_KEY     │ Your Google Gemini AI API key                         │
  │                    │ Get one at: https://aistudio.google.com/app/apikey    │
  ├────────────────────┼────────────────────────────────────────────────────────┤
  │ GEMINI_MODEL       │ Which Gemini model to use                             │
  │                    │ Default: gemini-2.5-flash                             │
  ├────────────────────┼────────────────────────────────────────────────────────┤
  │ JWT_EXPIRES_IN     │ JWT token expiry duration                             │
  │                    │ Default: 7d                                            │
  ├────────────────────┼────────────────────────────────────────────────────────┤
  │ COOKIE_NAME        │ Name of the auth cookie                               │
  │                    │ Default: arr_token                                     │
  ├────────────────────┼────────────────────────────────────────────────────────┤
  │ CLIENT_ORIGIN      │ Comma-separated allowed origins for CORS              │
  │                    │ Default: http://localhost:5173,http://localhost:5174   │
  ├────────────────────┼────────────────────────────────────────────────────────┤
  │ NODE_ENV           │ Set to "production" for production mode               │
  │                    │ Default: development                                  │
  └────────────────────┴────────────────────────────────────────────────────────┘


================================================================================
  7.  RUNNING THE APPLICATION
================================================================================

  You need TWO terminals running simultaneously:

  ┌──────────────────────────────────────────────────────────────────────────────┐
  │                                                                            │
  │  TERMINAL 1 — Backend                                                      │
  │  ─────────────────────                                                     │
  │  cd backend                                                                │
  │  npm run dev                                                               │
  │                                                                            │
  │  → Server starts at http://localhost:5000                                   │
  │  → Connects to MongoDB                                                     │
  │  → Logs requests with morgan in development                                │
  │                                                                            │
  ├──────────────────────────────────────────────────────────────────────────────┤
  │                                                                            │
  │  TERMINAL 2 — Frontend                                                     │
  │  ──────────────────────                                                    │
  │  cd frontend/ai-resume-checker-ui-boilerplate-code                         │
  │  npm run dev                                                               │
  │                                                                            │
  │  → App starts at http://localhost:5173                                      │
  │  → API calls proxied to localhost:5000                                     │
  │  → Open http://localhost:5173 in your browser                              │
  │                                                                            │
  └──────────────────────────────────────────────────────────────────────────────┘

  To build the frontend for production:
    cd frontend/ai-resume-checker-ui-boilerplate-code
    npm run build
    npm run preview     (preview the production build locally)


================================================================================
  8.  API ENDPOINTS REFERENCE
================================================================================

  Base URL:  http://localhost:5000/api

  ─── Authentication (/api/auth) ──────────────────────────────────────────────

  POST   /api/auth/register     Register a new user
                                Body: { name, email, password }

  POST   /api/auth/login        Login with credentials
                                Body: { email, password }

  POST   /api/auth/logout       Logout (clears auth cookie)

  GET    /api/auth/me           Get current logged-in user

  PATCH  /api/auth/profile      Update user profile
                                Body: { name }

  ─── Resumes (/api/resumes) ──────────────────────────────────────────────────

  POST   /api/resumes                 Upload a new resume (PDF)
                                      Form data: file (PDF, max 5 MB)
                                      Optional: title (string)

  GET    /api/resumes                 List all resumes for the current user

  GET    /api/resumes/:id             Get a single resume with all versions

  DELETE /api/resumes/:id             Delete a resume and all its data

  ─── Analysis & AI ───────────────────────────────────────────────────────────

  POST   /api/resumes/:id/analyze     Run AI analysis on a resume version
                                      Body: { versionId?, targetRole? }
                                      Returns: ATS score, issues, strengths,
                                               bullet rewrites, keywords

  GET    /api/resumes/:id/analyses    List all analyses for a resume

  GET    /api/resumes/:id/versions/:versionId/analysis
                                      Get the latest analysis for a specific
                                      version

  ─── Rewrites & Versions ─────────────────────────────────────────────────────

  POST   /api/resumes/:id/rewrite     Apply AI rewrites to create a new version
                                      Body: { analysisId, rewriteIds?[], label? }

  GET    /api/resumes/:id/versions/:versionId
                                      Get a specific version's full data

  ─── Diff ────────────────────────────────────────────────────────────────────

  GET    /api/resumes/:id/diff        Compare two versions side by side
                                      Query: from=<versionId>&to=<versionId>
                                             &mode=words|lines

  ─── Dashboard & Analytics ───────────────────────────────────────────────────

  GET    /api/dashboard               Dashboard stats, charts, activity feed

  GET    /api/insights                Aggregate analytics & insights

  GET    /api/versions                Flat list of all versions (with filters)

  GET    /api/history                 Chronological account activity feed

  ─── Health ──────────────────────────────────────────────────────────────────

  GET    /api/health                  Server health check


================================================================================
  9.  FRONTEND PAGES & ROUTES
================================================================================

  ┌───────────────────────┬─────────────────────────────────────────────────────┐
  │ Route                 │ Page / Description                                 │
  ├───────────────────────┼─────────────────────────────────────────────────────┤
  │ /                     │ Landing Page (public)                              │
  │ /login                │ Login Page                                         │
  │ /register             │ Registration Page                                  │
  ├───────────────────────┼─────────────────────────────────────────────────────┤
  │ /dashboard            │ Dashboard — KPIs, score chart, activity feed       │
  │ /resumes              │ Resume List — all uploaded resumes                 │
  │ /resumes/:id          │ Resume Detail — analysis, rewrites, versions, diff │
  │ /resumes/:id/export   │ PDF Export — download improved resume as PDF       │
  │ /insights             │ Insights — analytics, trends, keyword analysis     │
  │ /versions             │ Versions — flat list of all versions               │
  │ /history              │ History — chronological event feed                 │
  │ /settings             │ Settings — profile, password, theme                │
  └───────────────────────┴─────────────────────────────────────────────────────┘

  All routes under /dashboard, /resumes, etc. are PROTECTED and require login.
  Unauthenticated users are redirected to /login.


================================================================================
  10.  HOW TO USE THE APP (Step-by-Step)
================================================================================

  STEP 1 — Create an Account
  ──────────────────────────
    • Open http://localhost:5173 in your browser
    • Click "Get Started" or go to /register
    • Fill in your name, email, and password (min 8 characters)
    • You'll be logged in automatically

  STEP 2 — Upload Your Resume
  ────────────────────────────
    • Go to the Dashboard (/dashboard) or Resumes (/resumes) page
    • Click the upload area or drag-and-drop your PDF resume
    • Only PDF files up to 5 MB are accepted
    • The app extracts text and creates Version 1 (V1) automatically

  STEP 3 — Analyze Your Resume
  ─────────────────────────────
    • On the Resume Detail page (/resumes/:id), click "Analyze"
    • Optionally enter a target job role for better keyword analysis
    • The AI will return:
        ✓ ATS Score (0–100) with category breakdown
        ✓ 5 prioritized issues with severity and fixes
        ✓ 5 evidence-based strengths
        ✓ 5–10 bullet rewrites with rationale
        ✓ Present and missing keywords

  STEP 4 — Review AI Suggestions
  ────────────────────────────────
    • Browse through the Issues, Strengths, and Rewrites tabs
    • Each rewrite shows: original bullet → improved bullet + why

  STEP 5 — Apply Rewrites
  ─────────────────────────
    • Select individual rewrites or apply all at once
    • Click "Apply Rewrites" to create a new version (V2, V3…)
    • The rewritten text replaces weak bullets in the resume

  STEP 6 — Compare Versions
  ──────────────────────────
    • Use the Version Diff feature to compare any two versions
    • Choose "words" or "lines" mode
    • Additions are highlighted in green, removals in red

  STEP 7 — Re-Analyze
  ─────────────────────
    • After applying rewrites, analyze the new version again
    • Track your ATS score improvement over time

  STEP 8 — Export
  ────────────────
    • Go to /resumes/:id/export to generate a PDF of your improved resume

  STEP 9 — Check Your Progress
  ─────────────────────────────
    • Dashboard: See your score evolution chart and activity feed
    • Insights: View aggregate analytics, recurring issues, keyword trends
    • Versions: Browse all versions across all resumes
    • History: See a timeline of every action on your account


================================================================================
  11.  TROUBLESHOOTING
================================================================================

  Problem: "Cannot connect to MongoDB"
  Solution:
    • Make sure MongoDB is running locally (run "mongod")
    • Or update MONGO_URI in .env with your MongoDB Atlas connection string
    • Check that the database port (default 27017) is not blocked

  Problem: "Missing required env vars"
  Solution:
    • Make sure backend/.env exists with MONGO_URI and JWT_SECRET
    • The server will refuse to start if these are missing

  Problem: "GEMINI_API_KEY is missing or invalid"
  Solution:
    • Get a free API key from https://aistudio.google.com/app/apikey
    • Add it to backend/.env as GEMINI_API_KEY=your-key-here

  Problem: "PDF upload fails or no text extracted"
  Solution:
    • Make sure the file is a real PDF (not renamed .jpg, .docx, etc.)
    • File must be under 5 MB
    • Scanned/image-only PDFs may not have extractable text
      → The app will warn you if this is detected

  Problem: "Frontend shows 'Loading...' forever"
  Solution:
    • Make sure the backend is running on port 5000
    • Check that the Vite proxy is working (see vite.config.js)
    • Open browser DevTools → Network tab to check for failed API calls

  Problem: "Rate limit exceeded"
  Solution:
    • The app limits AI analysis requests per user to prevent abuse
    • Wait a few minutes and try again

  Problem: "npm install fails"
  Solution:
    • Make sure you have Node.js >= 20 installed (run "node -v")
    • Try deleting node_modules and package-lock.json, then run npm install
    • On Windows, run the terminal as Administrator if permission errors occur

  Problem: "Port 5000 or 5173 already in use"
  Solution:
    • Change PORT in backend/.env to a different number (e.g., 5001)
    • If you change the backend port, also update the proxy target in
      frontend/ai-resume-checker-ui-boilerplate-code/vite.config.js


================================================================================
  12.  LICENSE
================================================================================

  This project is for educational and personal use.


================================================================================
                           Happy Resume Building! 🚀
================================================================================
