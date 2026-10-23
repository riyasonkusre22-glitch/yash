# 🎓 Yash Tutorials — Full-Stack Educational Coaching Web Platform & Admin Dashboard

A modern, responsive, high-performance web application for **Yash Tutorials**, built using **React 18 (Vite)**, **Node.js (Express.js)**, and **MongoDB Atlas (Mongoose)**. The platform features an interactive public website, transparent fee estimation, online demo class bookings, dynamic practice quizzes, topper showcases, parent/student reviews, direct inquiry management, and an enterprise-grade **Protected Admin Dashboard (`/admin`)**.

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Architecture & Data Flow](#-architecture--data-flow)
4. [Admin System & Security Architecture](#-admin-system--security-architecture)
5. [Project Contents & Directory Structure](#-project-contents--directory-structure)
6. [Key Features & Interactive Modules](#-key-features--interactive-modules)
7. [Admin Dashboard & CRUD Modules](#-admin-dashboard--crud-modules)
8. [Database Schema & Models](#-database-schema--models)
9. [REST API Documentation](#-rest-api-documentation)
10. [Setup & Local Installation](#-setup--local-installation)
11. [Administrator Provisioning & Credentials](#-administrator-provisioning--credentials)
12. [Cloud Production Deployment (Render)](#-cloud-production-deployment-render)
13. [Testing & Verification](#-testing--verification)
14. [Troubleshooting & Windows Tips](#-troubleshooting--windows-tips)

---

## 🌟 Project Overview

**Yash Tutorials** is an educational coaching institute preparing students for School Board Exams (8th to 10th CBSE/State), 11th & 12th Science (PCM/PCB), and Competitive Entrance Exams (NEET UG, JEE Main & Advanced).

This full-stack application provides a dual experience:
1. **Public Website (`/`)**:
   - Course curriculums, toppers, reviews, and quiz questions are served dynamically from **MongoDB Atlas**.
   - Students can estimate customized fee structures with real-time scholarship and payment plan calculations.
   - Demo class registrations and contact inquiries are validated and stored directly into MongoDB.
   - Students can take an interactive practice quiz that grades responses instantly and records attempts in the database.
   - Zero links or mentions of the admin section exist anywhere on the public website.
2. **Secure Admin Dashboard (`/admin`)**:
   - Accessible **strictly** by typing `/admin` directly into the browser URL bar.
   - Full CRUD management over courses, student achievers, reviews, quiz questions, and quiz attempt analytics.
   - Lead management for demo class bookings and contact inquiries with status workflows and internal counselor notes.
   - Protected server-side by multi-layered authentication (Sessions, Bearer Tokens, CSRF, and Rate Limiting).

---

## 🛠 Tech Stack

### Frontend (Client)
- **Library / Framework**: React 18 (`react`, `react-dom`)
- **Routing**: React Router DOM v6 (`react-router-dom`)
- **Build Tool & Dev Server**: Vite 6+ with `@vitejs/plugin-react`
- **Styling**: Custom CSS Design System (`Plus Jakarta Sans` typography, CSS variables, glassmorphism, responsive utilities)
- **Icons**: Lucide React (`lucide-react`)
- **HTTP Client**: Axios (`axios`) with automatic Bearer token interceptor and CSRF header propagation
- **State Management**: React Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`) & React Contexts (`ToastContext`, `AdminAuthContext`)

### Backend (Server)
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 5
- **Database ODM**: Mongoose (`mongoose`)
- **Cloud Database**: MongoDB Atlas (Replica Set Cluster)
- **Authentication**: `express-session` backed by `connect-mongo` + HMAC-SHA256 Token fallback (essential for cross-domain deployments)
- **Password Security**: Bcrypt (`bcryptjs`) with automated salting
- **Security & Rate Limiting**: `express-rate-limit` (with reverse-proxy trust), CSRF verification, TLS/SSL MongoDB connections
- **Process Orchestration**: Concurrently (`concurrently`) for single-command full-stack development

---

## 🔄 Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER / CLIENT                         │
│   React 18 + React Router DOM                                          │
│   • Public Route  (/)      -> PublicWebsite Layout                     │
│   • Protected Route (/admin) -> AdminApp (Login or Dashboard)          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         HTTP Requests (via Axios)
      [Public: /api/*  |  Admin: /api/admin/* with Session Cookie / Bearer Token]
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        NODE.JS / EXPRESS BACKEND                       │
│   Express REST API Server                                              │
│                                                                        │
│   Middleware Pipeline:                                                 │
│   • Reverse Proxy Trust (app.set('trust proxy', 1))                    │
│   • CORS with credentials (allowed origins + .onrender.com)            │
│   • express.json() Body Parser                                         │
│   • MongoDB Session Store (connect-mongo)                              │
│   • DNS Resolver (Google 8.8.8.8 / Cloudflare 1.1.1.1 fallback)        │
│   • Rate Limiting (loginRateLimiter: 15 req / 15 min)                  │
│   • Auth Verification (requireAdmin: Cookie or Bearer Token)           │
│   • CSRF Protection (requireCsrf: X-CSRF-Token validation)             │
│                                                                        │
│   Mounted API Routes:                                                  │
│   • Public Routes:                                                     │
│     - /api/courses, /api/achievers, /api/testimonials                  │
│     - /api/quiz, /api/enrollments, /api/inquiries, /api/stats          │
│   • Admin Routes (Protected):                                          │
│     - /api/admin/auth (login, /me, logout)                             │
│     - /api/admin/stats (live counts)                                   │
│     - /api/admin/courses (full CRUD)                                   │
│     - /api/admin/achievers (full CRUD)                                 │
│     - /api/admin/testimonials (full CRUD + moderation)                 │
│     - /api/admin/quiz (full CRUD questions & attempts view)            │
│     - /api/admin/enrollments (view, status update, notes, delete)      │
│     - /api/admin/inquiries (view, status update, notes, delete)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                          Mongoose Driver (TLS/SSL)
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         MONGODB ATLAS CLUSTER                          │
│   Database: yash_tutorials                                             │
│                                                                        │
│   Collections:                                                         │
│   • admins                                                             │
│   • sessions                                                           │
│   • courses                                                            │
│   • achievers                                                          │
│   • testimonials                                                       │
│   • quizquestions                                                      │
│   • enrollments                                                        │
│   • inquiries                                                          │
│   • quizattempts                                                       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Admin System & Security Architecture

### 1. Zero Public Footprint
- The public website contains **NO** link, button, menu item, footer link, or icon referencing `/admin`.
- Access is strictly via **manual URL navigation** (`/admin`).
- Unauthenticated visitors hitting `/admin` see only the clean, isolated Admin Sign In card.
- Authenticated administrators see the full education management dashboard.

### 2. Dual Authentication Strategy (Cookies + Bearer Token)
In production, frontend (`https://yash-qebq.onrender.com`) and backend (`https://yash-twp2.onrender.com`) reside on different subdomains. Because modern browsers treat `*.onrender.com` as separate public suffixes, third-party cookies can be blocked.
- **Primary Mechanism**: MongoDB-backed HTTP-only session cookie (`express-session` + `connect-mongo`) with `SameSite=None` and `Secure=true`.
- **Cross-Domain Fallback**: Signed HMAC-SHA256 Bearer Token returned upon login, stored in `localStorage`, and transmitted via `Authorization: Bearer <token>`.
- **Middleware**: `requireAdmin.js` validates either the session or the token, ensuring seamless operation across local development and cross-domain cloud hosting.

### 3. CSRF Protection
- Cookie-authenticated state-changing requests (`POST`, `PUT`, `PATCH`, `DELETE`) require a valid `X-CSRF-Token` header matching the active session.
- Token-authenticated requests are verified cryptographically and are inherently protected against CSRF.

### 4. Brute-Force Rate Limiting
- `loginRateLimiter.js` restricts login attempts to 15 requests per 15 minutes per IP.
- Configured with `app.set('trust proxy', 1)` and `validate: { xForwardedForHeader: false }` to avoid proxy header conflicts on cloud reverse proxies (Render/Cloudflare).

### 5. Secure Password Storage
- Passwords are encrypted using `bcryptjs` with auto-generated salt rounds. Plaintext passwords never enter MongoDB or API payloads.

---

## 📂 Project Contents & Directory Structure

```
yesh_class/
├── package.json               # Root scripts (concurrently dev, server, client, seed, create-admin)
├── package-lock.json
├── README.md                  # Comprehensive platform documentation
│
├── client/                    # Frontend React 18 + Vite Application
│   ├── package.json           # Client dependencies (React 18, React Router, Axios, Lucide, Vite)
│   ├── vite.config.js         # Vite configuration & /api proxy to Express :5000
│   ├── index.html             # Single-page application root shell
│   │
│   ├── public/                # Static public assets
│   │   ├── favicon.svg
│   │   └── img/
│   │       └── classroom.jpg  # Yash Tutorials physical classroom image
│   │
│   └── src/                   # React source code
│       ├── main.jsx           # ReactDOM root, BrowserRouter, Axios baseURL & credentials
│       ├── App.jsx            # Router switch: / -> PublicWebsite, /admin/* -> AdminApp
│       │
│       ├── context/
│       │   └── ToastContext.jsx # Global Toast notification context & provider
│       │
│       ├── styles/
│       │   └── index.css      # Plus Jakarta Sans, variables, glassmorphism, animations
│       │
│       ├── components/        # Public Website Components
│       │   ├── Navbar.jsx         # Fixed glass navbar, mobile hamburger drawer, logo
│       │   ├── Hero.jsx           # Value prop, live 4-day countdown, classroom image
│       │   ├── MetricsBanner.jsx  # Dark banner, 12+ years, 95% avg, count-up animation
│       │   ├── About.jsx          # Conceptual clarity, testing analytics, 1-on-1 doubts
│       │   ├── Courses.jsx        # 8th-10th, 11th-12th Sci, NEET/JEE with filter tabs
│       │   ├── Achievers.jsx      # Hall of Fame toppers (AIR 412 NEET, 99.2%ile JEE)
│       │   ├── FeeCalculator.jsx  # Interactive fee calculator with scholarship logic
│       │   ├── Quiz.jsx           # 3-question science practice quiz with score posting
│       │   ├── Testimonials.jsx   # Parent & student verified reviews with 5-star ratings
│       │   ├── Contact.jsx        # Branch address, phone, email, timings & inquiry form
│       │   ├── Footer.jsx         # Footer brand mark, anchor links, copyright
│       │   ├── EnrollModal.jsx    # Modal dialog for booking free demo classes
│       │   └── Toast.jsx          # Floating auto-dismissing toast alerts
│       │
│       └── admin/             # Isolated Admin Module
│           ├── AdminApp.jsx       # Admin sub-router & layout wrapper
│           │
│           ├── context/
│           │   └── AdminAuthContext.jsx # Session + Bearer token auth provider
│           │
│           ├── components/
│           │   ├── AdminLayout.jsx  # Responsive sidebar, header, active route pill, logout
│           │   └── ConfirmModal.jsx # Reusable modal for destructive delete actions
│           │
│           └── pages/
│               ├── AdminLogin.jsx        # Secure login page (no public navbar/footer)
│               ├── DashboardOverview.jsx # Live database stats cards & quick actions
│               ├── CoursesAdmin.jsx      # Full CRUD for Courses + active toggle
│               ├── AchieversAdmin.jsx    # Full CRUD for Hall of Fame toppers
│               ├── TestimonialsAdmin.jsx # Full CRUD for Testimonials + approval toggle
│               ├── QuizAdmin.jsx         # Full CRUD for Practice Quiz questions
│               ├── EnrollmentsAdmin.jsx  # Demo class leads, status workflow & notes
│               ├── InquiriesAdmin.jsx    # Contact leads, status workflow & notes
│               └── QuizAttemptsAdmin.jsx # Live quiz results & score analytics
│
└── server/                    # Backend Node.js + Express + MongoDB Server
    ├── package.json           # Server dependencies (Express, Mongoose, Dotenv, CORS, Bcrypt, Session)
    ├── server.js              # Express app entry point, middleware pipeline & route mounts
    ├── seed.js                # Database migration and public data seeding script
    ├── .env                   # Environment config (PORT, MONGO_URI, SESSION_SECRET, etc.)
    │
    ├── config/
    │   ├── db.js              # Mongoose connection with Windows DNS fallback
    │   └── token.js           # HMAC-SHA256 Token sign & verify utility
    │
    ├── middleware/
    │   ├── requireAdmin.js    # Session & Bearer token auth + CSRF verification
    │   └── loginRateLimiter.js# 15 req / 15 min rate limiter with proxy trust
    │
    ├── models/                # Mongoose Database Schemas
    │   ├── Admin.js           # Admin users with bcrypt password hashing
    │   ├── Course.js          # Course curriculums, subjects, fees, badges, active status
    │   ├── Achiever.js        # Toppers, percentiles, batches, quotes, active status
    │   ├── Testimonial.js     # Parent/student reviews, ratings, approval flag
    │   ├── QuizQuestion.js    # Practice questions, options, correct index, explanation
    │   ├── Enrollment.js      # Demo class bookings, status, counselor notes
    │   ├── Inquiry.js         # Contact inquiries, status, follow-up notes
    │   └── QuizAttempt.js     # Recorded student quiz attempts and scores
    │
    ├── routes/                # Express REST API Routes
    │   ├── courses.js         # Public GET /api/courses
    │   ├── achievers.js       # Public GET /api/achievers
    │   ├── testimonials.js    # Public GET /api/testimonials (approved only)
    │   ├── quiz.js            # Public GET /api/quiz/questions, POST /api/quiz/attempts
    │   ├── enrollments.js     # Public POST /api/enrollments
    │   ├── inquiries.js       # Public POST /api/inquiries
    │   │
    │   ├── adminAuth.js       # POST /api/admin/auth/login, GET /me, POST /logout
    │   ├── adminStats.js      # GET /api/admin/stats
    │   ├── adminCourses.js    # GET, POST, PUT, DELETE, PATCH toggle /api/admin/courses
    │   ├── adminAchievers.js  # GET, POST, PUT, DELETE /api/admin/achievers
    │   ├── adminTestimonials.js# GET, POST, PUT, DELETE, PATCH approve /api/admin/testimonials
    │   ├── adminQuiz.js       # GET, POST, PUT, DELETE /api/admin/quiz/questions
    │   ├── adminEnrollments.js# GET, PATCH status/notes, DELETE /api/admin/enrollments
    │   ├── adminInquiries.js  # GET, PATCH status/notes, DELETE /api/admin/inquiries
    │   └── adminQuizAttempts.js# GET /api/admin/quiz/attempts
    │
    └── scripts/
        ├── createAdmin.js     # Admin provisioning script (idempotent)
        └── testSuite.js       # Automated 19-point security & CRUD integration test runner
```

---

## 💎 Key Features & Interactive Modules

| Feature | Component | Description |
| :--- | :--- | :--- |
| **Fixed Glass Navbar** | `Navbar.jsx` | Fixed header with backdrop blur (`glass`), responsive anchor links, direct phone dialing, and mobile slide-out menu drawer. Contains zero admin links. |
| **Hero Banner & Classroom** | `Hero.jsx` | Highlights batch admissions, headline gradient, 3 benefit pills, primary CTAs, real photo of Yash Tutorials classroom, 4.9★ rating badge, and live 4-day countdown timer. |
| **Performance Metrics** | `MetricsBanner.jsx` | Dark slate statistics banner featuring animated numbers (`12+ Years`, `95%+ Avg Score`, `20:1 Ratio`, `100% Attention`). |
| **The Yash Advantage** | `About.jsx` | 3 distinct feature pillars covering Conceptual Clarity, Weekly Tests with Analytics, and 1-on-1 Personalized Doubt Sessions. |
| **Curriculum Filter Tabs** | `Courses.jsx` | Interactive category tabs (`All Programs`, `Class 8th-10th`, `Class 11th-12th Science`, `NEET/JEE Prep`) with subject lists, highlights, and direct course booking triggers. |
| **Hall of Fame** | `Achievers.jsx` | Cards showing actual toppers with custom initial badges, scores (`98.6% CBSE`, `AIR 412 NEET`, `99.2%ile JEE`), and testimonials. |
| **Fee Estimator** | `FeeCalculator.jsx` | Reactive calculator calculating base tuition, lump-sum 5% discount, merit scholarships (up to 15%), and installment breakdown. |
| **Interactive Science Quiz** | `Quiz.jsx` | Multiple choice practice test with instant validation, explanations, progress tracker, and automatic server submission. |
| **Verified Testimonials** | `Testimonials.jsx` | Reviews from parents and students with 5-star ratings and academic credentials. |
| **Contact & Inquiry Form** | `Contact.jsx` | Address, operating hours, phone, email, and live inquiry submission connected to MongoDB. |
| **Demo Class Booking Modal** | `EnrollModal.jsx` | Pop-up modal supporting pre-selected course forwarding and auto-closing with feedback toast. |

---

## 🛡 Admin Dashboard & CRUD Modules

Accessible exclusively at `/admin`:

1. **Dashboard Overview**:
   - Live database metrics: Total Courses, Active Courses, Hall of Fame Toppers, Testimonials, Demo Bookings, Inquiries, and Quiz Attempts.
   - Quick-action shortcuts directly into each management section.
2. **Courses Management**:
   - Create, edit, and delete courses.
   - Dynamic subject and feature tags.
   - Category selector (`school`, `science`, `competitive`) and header gradient presets.
   - Instant active/inactive visibility toggle.
3. **Student Achievers**:
   - Manage toppers, exam scores, percentiles, batches, quotes, and avatar badge colors.
4. **Testimonials Moderation**:
   - Full CRUD over student/parent reviews with 1-5 star ratings.
   - One-click approval toggle (`isApproved`) to control public visibility.
5. **Practice Quiz Management**:
   - Create and modify quiz questions with 4 answer choices and custom explanations.
   - Radio button to set the zero-based correct answer index.
6. **Enrollment Leads (Demo Classes)**:
   - View student registrations, phone numbers, and requested courses.
   - Status tracking workflow: `pending` ➔ `contacted` ➔ `enrolled` ➔ `cancelled`.
   - Internal counselor notes for follow-up tracking.
7. **Contact Inquiries**:
   - Manage general inquiries with status workflow (`new` ➔ `in-progress` ➔ `resolved` ➔ `closed`).
   - Counselor notes and deletion with confirmation.
8. **Quiz Attempt Analytics**:
   - Real-time stream of student quiz attempts with accuracy score pills and submission timestamps.

---

## 🗄 Database Schema & Models

### 1. `Admin` (`server/models/Admin.js`)
```javascript
{
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // Bcrypt hash
  name: { type: String, default: 'Administrator' },
  role: { type: String, default: 'superadmin' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}
```

### 2. `Course` (`server/models/Course.js`)
```javascript
{
  title: { type: String, required: true },
  category: { type: String, enum: ['school', 'science', 'competitive'], required: true },
  subtitle: String,
  badge: String,
  headerClass: String,
  subjects: [String],
  features: [String],
  baseFee: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}
```

### 3. `Enrollment` (`server/models/Enrollment.js`)
```javascript
{
  studentName: { type: String, required: true },
  phone: { type: String, required: true },
  course: { type: String, required: true },
  status: { type: String, enum: ['pending', 'contacted', 'enrolled', 'cancelled'], default: 'pending' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}
```

### 4. `Inquiry` (`server/models/Inquiry.js`)
```javascript
{
  studentName: { type: String, required: true },
  parentPhone: { type: String, required: true },
  classPreference: String,
  preferredTime: String,
  message: String,
  status: { type: String, enum: ['new', 'in-progress', 'resolved', 'closed'], default: 'new' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}
```

### 5. `Achiever` (`server/models/Achiever.js`)
```javascript
{
  name: { type: String, required: true },
  initials: { type: String, required: true },
  achievement: { type: String, required: true },
  batch: { type: String, required: true },
  quote: { type: String, required: true },
  bgColor: { type: String, default: '#c7d2fe' },
  textColor: { type: String, default: '#3730a3' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}
```

### 6. `Testimonial` (`server/models/Testimonial.js`)
```javascript
{
  author: { type: String, required: true },
  role: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  quote: { type: String, required: true },
  isApproved: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```

### 7. `QuizQuestion` (`server/models/QuizQuestion.js`)
```javascript
{
  question: { type: String, required: true },
  category: { type: String, required: true },
  options: [String],       // Exactly 4 answer choices
  correct: Number,         // 0-based index
  explanation: String,
  order: { type: Number, default: 0 }
}
```

### 8. `QuizAttempt` (`server/models/QuizAttempt.js`)
```javascript
{
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answers: [{ questionIndex: Number, selectedAnswer: Number, isCorrect: Boolean }],
  createdAt: { type: Date, default: Date.now }
}
```

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000` (or `https://yash-twp2.onrender.com` in production)

### Public Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/stats` | Public counts of courses, achievers, enrollments |
| `GET` | `/api/courses` | Active courses (supports `?category=science`) |
| `GET` | `/api/achievers` | Active Hall of Fame toppers |
| `GET` | `/api/testimonials` | Approved reviews |
| `GET` | `/api/quiz/questions` | Practice quiz questions |
| `POST`| `/api/quiz/attempts` | Record student quiz attempt |
| `POST`| `/api/enrollments` | Book demo class |
| `POST`| `/api/inquiries` | Submit inquiry form |

### Protected Admin Endpoints (`requireAdmin` & `requireCsrf`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/admin/auth/login` | Sign in administrator (rate-limited) |
| `GET`  | `/api/admin/auth/me` | Verify active session & return admin details |
| `POST` | `/api/admin/auth/logout` | Terminate session & clear cookies |
| `GET`  | `/api/admin/stats` | Real-time database counts for all collections |
| `GET`  | `/api/admin/courses` | Fetch all courses (active + inactive) |
| `POST` | `/api/admin/courses` | Create a new course |
| `PUT`  | `/api/admin/courses/:id` | Update existing course |
| `PATCH`| `/api/admin/courses/:id/toggle` | Toggle active status |
| `DELETE`| `/api/admin/courses/:id` | Delete course |
| `GET`  | `/api/admin/achievers` | Fetch all achievers |
| `POST` | `/api/admin/achievers` | Add a new achiever |
| `PUT`  | `/api/admin/achievers/:id` | Update achiever details |
| `DELETE`| `/api/admin/achievers/:id` | Delete achiever |
| `GET`  | `/api/admin/testimonials` | Fetch all testimonials (approved + pending) |
| `POST` | `/api/admin/testimonials` | Create a testimonial |
| `PUT`  | `/api/admin/testimonials/:id` | Update testimonial |
| `PATCH`| `/api/admin/testimonials/:id/approve` | Toggle approval status |
| `DELETE`| `/api/admin/testimonials/:id` | Delete testimonial |
| `GET`  | `/api/admin/quiz/questions` | Fetch all quiz questions |
| `POST` | `/api/admin/quiz/questions` | Create quiz question |
| `PUT`  | `/api/admin/quiz/questions/:id` | Update quiz question |
| `DELETE`| `/api/admin/quiz/questions/:id` | Delete quiz question |
| `GET`  | `/api/admin/enrollments` | List demo class bookings (supports `?status=...`) |
| `PATCH`| `/api/admin/enrollments/:id` | Update enrollment status & notes |
| `DELETE`| `/api/admin/enrollments/:id` | Delete enrollment record |
| `GET`  | `/api/admin/inquiries` | List inquiries (supports `?status=...`) |
| `PATCH`| `/api/admin/inquiries/:id` | Update inquiry status & notes |
| `DELETE`| `/api/admin/inquiries/:id` | Delete inquiry record |
| `GET`  | `/api/admin/quiz/attempts` | View live quiz attempt log |

---

## 🚀 Setup & Local Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [npm](https://www.npmjs.com/) (v9+)
- MongoDB Atlas cluster connection string

### 1. Install Dependencies
From the repository root:
```bash
# Install root orchestration tools
npm install

# Install server & client dependencies
npm run install-all
```

### 2. Configure Environment Variables
Create or verify `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://riyasonkusre22_db_user:3TDUjQkp1B3JtnaP@yash.8lus1h9.mongodb.net/yash_tutorials?retryWrites=true&w=majority
NODE_ENV=development
SESSION_SECRET=yash-tutorials-secure-production-session-key-4f46e5-312e81
ADMIN_EMAIL=admin@yashtutorials.com
ADMIN_INITIAL_PASSWORD=YashAdmin2026!
```

### 3. Seed Public Content & Provision Superadmin
```bash
# Seed initial courses, toppers, reviews, quiz questions
npm run seed

# Provision the superadmin account
npm run create-admin
```

### 4. Run Both Servers Concurrently
```bash
npm run dev
```
- **Public Website**: Open `http://localhost:5173`
- **Admin Dashboard**: Open `http://localhost:5173/admin`

---

## 👤 Administrator Provisioning & Credentials

The platform includes an automated, idempotent provisioning utility (`server/scripts/createAdmin.js`).

To provision or reset the superadmin:
```bash
npm run create-admin
```

**Default Credentials:**
- **URL**: `/admin`
- **Email**: `admin@yashtutorials.com`
- **Password**: `YashAdmin2026!`

*(You can customize the initial credentials in `server/.env` using `ADMIN_EMAIL` and `ADMIN_INITIAL_PASSWORD` before running the command).*

---

## ☁ Cloud Production Deployment (Render)

The project is designed for zero-friction deployment on [Render](https://render.com).

### Service 1: Backend Web Service (`yash-twp2`)
- **Environment**: Node
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variables**:
  | Key | Recommended Value |
  | :--- | :--- |
  | `NODE_ENV` | `production` |
  | `MONGO_URI` | `mongodb+srv://...` |
  | `SESSION_SECRET` | *(long random secret string)* |
  | `ADMIN_EMAIL` | `admin@yashtutorials.com` |
  | `ADMIN_INITIAL_PASSWORD` | `YashAdmin2026!` |
  | `CLIENT_URL` | `https://yash-qebq.onrender.com` |

### Service 2: Frontend Static Site (`yash-qebq`)
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  | Key | Recommended Value |
  | :--- | :--- |
  | `VITE_API_URL` | `https://yash-twp2.onrender.com` |
- **SPA Rewrites (Crucial for direct `/admin` access)**:
  - In Render Static Site ➔ **Redirects / Rewrites**:
    - **Source**: `/*`
    - **Destination**: `/index.html`
    - **Action**: `Rewrite`

---

## 🧪 Testing & Verification

An automated test suite verifies all security rules, public endpoints, and administrative CRUD operations:

```bash
node server/scripts/testSuite.js
```

### Verified Test Matrix (19/19 Passing):
1. ✅ Health check endpoint returns 200 OK
2. ✅ Public courses list active records
3. ✅ Public student demo enrollment creates new document
4. ✅ Public inquiry submission creates new document
5. ✅ Unauthenticated request to `/api/admin/stats` receives **401 Unauthorized**
6. ✅ Admin login with invalid password receives **401 Unauthorized**
7. ✅ Admin login with valid credentials succeeds and returns session & token
8. ✅ Authenticated `/api/admin/auth/me` returns admin profile
9. ✅ Authenticated `/api/admin/stats` returns accurate database counts
10. ✅ Course creation via `/api/admin/courses` persists to MongoDB
11. ✅ Course update via `/api/admin/courses/:id` applies changes
12. ✅ Course active toggle flips visibility flag
13. ✅ Course deletion removes test document
14. ✅ Achiever creation via `/api/admin/achievers` persists
15. ✅ Testimonial creation and approval toggle updates public state
16. ✅ Quiz question creation persists 4 options and correct index
17. ✅ Enrollment lead status update (`pending` ➔ `contacted`) & notes persistence
18. ✅ Admin logout invalidates session & cookie
19. ✅ Request after logout receives **401 Unauthorized**

---

## 💡 Troubleshooting & Windows Tips

- **Node.js DNS SRV Resolution (`querySrv ECONNREFUSED`)**:
  - Some Windows network routers fail to resolve MongoDB Atlas SRV connection strings.
  - The project sets `dns.setServers(['8.8.8.8', '1.1.1.1'])` in `server/config/db.js` and `server/server.js` to ensure reliable resolution on all networks.
- **Render Reverse Proxy Warning (`ERR_ERL_UNEXPECTED_X_FORWARDED_FOR`)**:
  - Resolved with `app.set('trust proxy', 1)` in `server.js` and `validate: { xForwardedForHeader: false }` in `loginRateLimiter.js`.
- **Cross-Domain Session Cookie Blocking**:
  - Browsers block third-party cookies across different `.onrender.com` domains. The application automatically falls back to an HMAC Bearer token (`Authorization: Bearer <token>`) so admin logins work uninterruptedly.
- **Static Site 404 on Direct `/admin` Refresh**:
  - Ensure the Render Static Site has the Rewrite rule `/*` ➔ `/index.html` (Action: `Rewrite`).

---

## 📄 License & Credits
- **Institute**: Yash Tutorials — Premier Educational Coaching
- **Design & Architecture**: Crafted with Plus Jakarta Sans typography, Tailwind palette tokens, Lucide icons, and modern glassmorphism.
- **License**: ISC
