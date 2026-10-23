# 🎓 Yash Tutorials — Full-Stack Educational Coaching Web Platform

A modern, responsive, high-performance web application for **Yash Tutorials**, built using **React.js (Vite)**, **Node.js (Express.js)**, and **MongoDB Atlas (Mongoose)**. The platform features an interactive design, transparent fee estimation, online demo class bookings, dynamic practice quizzes, topper showcases, parent/student reviews, and direct inquiry management.

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Architecture & Data Flow](#-architecture--data-flow)
4. [Project Contents & Directory Structure](#-project-contents--directory-structure)
5. [Key Features & Interactive Modules](#-key-features--interactive-modules)
6. [Database Schema & Models](#-database-schema--models)
7. [REST API Documentation](#-rest-api-documentation)
8. [Setup & Installation](#-setup--installation)
9. [Database Migration & Seeding](#-database-migration--seeding)
10. [Troubleshooting & Windows Tips](#-troubleshooting--windows-tips)

---

## 🌟 Project Overview

**Yash Tutorials** is an educational coaching institute preparing students for School Board Exams (8th to 10th CBSE/State), 11th & 12th Science (PCM/PCB), and Competitive Entrance Exams (NEET UG, JEE Main & Advanced). 

This full-stack application replaces static brochure sites with a fully dynamic, data-driven experience where:
- Course offerings, toppers, reviews, and quiz questions are served dynamically from **MongoDB Atlas**.
- Students can estimate customized fee structures with real-time scholarship and payment plan calculations.
- Demo class registrations and contact inquiries are validated and stored directly into MongoDB.
- Students can take an interactive practice quiz that grades responses instantly and records attempts in the database.

---

## 🛠 Tech Stack

### Frontend (Client)
- **Library / Framework**: React 18 (`react`, `react-dom`)
- **Build Tool & Dev Server**: Vite 6+ with `@vitejs/plugin-react`
- **Styling**: Custom CSS Design System (`Plus Jakarta Sans` typography, CSS variables, glassmorphism, responsive utilities)
- **Icons**: Lucide React (`lucide-react`)
- **HTTP Client**: Axios (`axios`)
- **State Management**: React Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`) & React Context (`ToastContext`)

### Backend (Server)
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database ODM**: Mongoose (`mongoose`)
- **Cloud Database**: MongoDB Atlas (Replica Set Cluster)
- **Middleware**: CORS (`cors`), Built-in JSON body parser (`express.json()`), Dotenv (`dotenv`)
- **Process Orchestration**: Concurrently (`concurrently`) for single-command full-stack development

---

## 🔄 Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER / CLIENT                         │
│   React 18 + Vite Dev Server (http://localhost:5173)                   │
│                                                                        │
│   Components:                                                          │
│   Navbar | Hero | FeeCalculator | Quiz | Courses | EnrollModal ...     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         HTTP Requests (via Axios)
               [Vite dev proxy forwards /api -> http://localhost:5000]
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        NODE.JS / EXPRESS BACKEND                       │
│   Express REST API Server (http://localhost:5000)                      │
│                                                                        │
│   Middleware:                                                          │
│   • CORS Header Configuration                                          │
│   • express.json() Body Parser                                         │
│   • Centralized Async Error Handler                                    │
│   • DNS Resolver (Google 8.8.8.8 / Cloudflare 1.1.1.1 fallback)        │
│                                                                        │
│   Routes Mounted:                                                      │
│   • /api/courses       -> Course.js                                    │
│   • /api/achievers     -> Achiever.js                                  │
│   • /api/testimonials  -> Testimonial.js                               │
│   • /api/quiz          -> QuizQuestion.js, QuizAttempt.js              │
│   • /api/enrollments   -> Enrollment.js                                │
│   • /api/inquiries     -> Inquiry.js                                   │
│   • /api/stats         -> Aggregated Counts                            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                          Mongoose Driver (TLS/SSL)
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         MONGODB ATLAS CLUSTER                          │
│   Replica Set: ac-epw04dn-shard-00-*.8lus1h9.mongodb.net               │
│   Database: yash_tutorials                                             │
│                                                                        │
│   Collections:                                                         │
│   • courses                                                            │
│   • achievers                                                          │
│   • testimonials                                                       │
│   • quizquestions                                                      │
│   • enrollments                                                        │
│   • inquiries                                                          │
│   • quizattempts                                                       │
└────────────────────────────────────────────────────────────────────────┘
```

### How Data Passes Between Layers:

1. **Initial Mount & Data Hydration**:
   - When the user opens the web app, React components (`Courses`, `Achievers`, `Testimonials`, `Quiz`) mount.
   - Each component issues an asynchronous `GET` request using Axios (e.g., `axios.get('/api/courses')`).
   - The Vite development proxy catches `/api/*` and proxies it to Express on `http://localhost:5000`.
   - Express queries MongoDB Atlas via Mongoose models (`Course.find()`, etc.) and returns structured JSON responses.
   - If the remote database is temporarily unreachable, components gracefully fall back to default props so the UI never crashes or flashes blank.

2. **Demo Class Booking Flow**:
   - The user clicks **"Enroll Now"** in the Navbar, Hero banner, or any Course card.
   - `EnrollModal.jsx` opens, optionally pre-populating the chosen course.
   - On form submit, `axios.post('/api/enrollments', { studentName, phone, course })` sends the payload to Express.
   - Express validates required fields and instantiates a new Mongoose `Enrollment` document which is saved directly to MongoDB Atlas.
   - The response returns `201 Created` with the newly assigned MongoDB `_id` and timestamp.
   - The modal automatically closes, and `ToastContext` triggers a notification banner ("Registration submitted! Yash Tutorials counselor will reach out shortly.").

3. **Inquiry Message Flow**:
   - In `Contact.jsx`, a parent or student fills out student name, parent phone, course preference, preferred batch timing (morning/evening), and a custom message.
   - Payload is submitted via `POST /api/inquiries`.
   - Express writes the document to the `inquiries` collection in MongoDB Atlas.
   - On success, the form inputs reset and an acknowledgment toast appears.

4. **Practice Quiz & Analytics Flow**:
   - In `Quiz.jsx`, interactive questions with multiple choices are displayed one-by-one.
   - When a student selects an option, instant visual feedback highlights correct (emerald green) or incorrect (red) answers with icon badges.
   - After completing all questions, a celebration summary card calculates the score and issues a `POST /api/quiz/attempts` containing `{ score, totalQuestions, answers }` to log the student's attempt in MongoDB.

5. **Dynamic Fee Calculation (Client-Side Reactive Math)**:
   - In `FeeCalculator.jsx`, user choices for Class (`8th` to `JEE/NEET`), Payment Schedule (`One-Time` vs `Installment`), and Merit Scholarship (`0%`, `10%`, `15%`) trigger an immediate `useMemo` calculation.
   - Calculations enforce:
     $$\text{Discount \%} = \text{Scholarship \%} + (\text{isOneTime} ? 5\% : 0\%)$$
     $$\text{Discount Amount} = \text{round}\left(\frac{\text{Base Fee} \times \text{Discount \%}}{100}\right)$$
     $$\text{Final Payable} = \text{Base Fee} - \text{Discount Amount}$$
   - Formatted in Indian Rupee format (`₹33,250`) with an instant CTA to book the demo for the selected class.

---

## 📂 Project Contents & Directory Structure

```
yesh_class/
├── package.json               # Root scripts (concurrently dev, server, client, seed)
├── package-lock.json
├── README.md                  # Comprehensive platform documentation
│
├── img/                       # Source assets provided for the coaching center
│   └── WhatsApp Image 2026-10-18 at 2.14.39 PM.jpeg
│
├── client/                    # Frontend React.js + Vite Application
│   ├── package.json           # Client dependencies (React 18, Axios, Lucide, Vite)
│   ├── vite.config.js         # Vite configuration & /api proxy to Express :5000
│   ├── index.html             # Single-page application root shell
│   │
│   ├── public/                # Static public assets
│   │   ├── favicon.svg
│   │   ├── icons.svg
│   │   └── img/
│   │       └── classroom.jpg  # Yash Tutorials physical classroom image
│   │
│   └── src/                   # React source code
│       ├── main.jsx           # ReactDOM root renderer
│       ├── App.jsx            # Root application layout & state orchestrator
│       │
│       ├── context/
│       │   └── ToastContext.jsx # Global Toast notification context & provider
│       │
│       ├── styles/
│       │   └── index.css      # Plus Jakarta Sans, variables, glassmorphism, animations
│       │
│       └── components/
│           ├── Navbar.jsx         # Fixed glass navbar, mobile hamburger drawer, logo
│           ├── Hero.jsx           # Value prop, live 4-day countdown, classroom image
│           ├── MetricsBanner.jsx  # Dark banner, 12+ years, 95% avg, count-up animation
│           ├── About.jsx          # Conceptual clarity, testing analytics, 1-on-1 doubts
│           ├── Courses.jsx        # 8th-10th, 11th-12th Sci, NEET/JEE with filter tabs
│           ├── Achievers.jsx      # Hall of Fame toppers (AIR 412 NEET, 99.2%ile JEE)
│           ├── FeeCalculator.jsx  # Interactive fee calculator with scholarship logic
│           ├── Quiz.jsx           # 3-question science practice quiz with score posting
│           ├── Testimonials.jsx   # Parent & student verified reviews with 5-star ratings
│           ├── Contact.jsx        # Branch address, phone, email, timings & inquiry form
│           ├── Footer.jsx         # Footer brand mark, anchor links, copyright
│           ├── EnrollModal.jsx    # Modal dialog for booking free demo classes
│           └── Toast.jsx          # Floating auto-dismissing toast alerts
│
└── server/                    # Backend Node.js + Express + MongoDB Server
    ├── package.json           # Server dependencies (Express, Mongoose, Dotenv, CORS)
    ├── server.js              # Express app entry point, route mounts & health checks
    ├── seed.js                # Database migration and seeding script
    ├── .env                   # Environment config (PORT, MONGO_URI, NODE_ENV)
    │
    ├── config/
    │   └── db.js              # Mongoose connection with Windows DNS fallback
    │
    ├── models/                # Mongoose Database Schemas
    │   ├── Course.js          # Course curriculums, subjects, fees, badges
    │   ├── Achiever.js        # Toppers, percentiles, batches, quotes
    │   ├── Testimonial.js     # Parent/student reviews and ratings
    │   ├── QuizQuestion.js    # Practice questions, options, correct answers
    │   ├── Enrollment.js      # Demo class bookings (studentName, phone, course)
    │   ├── Inquiry.js         # Contact inquiries (student, parentPhone, timing, message)
    │   └── QuizAttempt.js     # Recorded student quiz attempts and scores
    │
    └── routes/                # Express REST API Routes
        ├── courses.js         # GET /api/courses, GET /api/courses/:id
        ├── achievers.js       # GET /api/achievers
        ├── testimonials.js    # GET /api/testimonials
        ├── quiz.js            # GET /api/quiz/questions, POST /api/quiz/attempts
        ├── enrollments.js     # POST /api/enrollments, GET /api/enrollments
        └── inquiries.js       # POST /api/inquiries, GET /api/inquiries
```

---

## 💎 Key Features & Interactive Modules

| Feature | Component | Description |
| :--- | :--- | :--- |
| **Fixed Glass Navbar** | `Navbar.jsx` | Fixed header with backdrop blur (`glass`), responsive anchor links, direct phone dialing, and mobile slide-out menu drawer. |
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

## 🗄 Database Schema & Models

### 1. `Course` (`server/models/Course.js`)
```javascript
{
  title: String,           // e.g. "Secondary Foundation"
  category: String,        // "school" | "science" | "competitive"
  subtitle: String,        // e.g. "Class 8th, 9th & 10th"
  badge: String,           // e.g. "State & CBSE Board"
  headerClass: String,     // CSS gradient identifier
  subjects: [String],      // Array of subject names
  features: [String],      // Key program highlights
  baseFee: Number,         // Reference annual fee
  order: Number,           // Display sorting index
  isActive: Boolean        // Availability flag
}
```

### 2. `Enrollment` (`server/models/Enrollment.js`)
```javascript
{
  studentName: { type: String, required: true },
  phone: { type: String, required: true },
  course: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}
```

### 3. `Inquiry` (`server/models/Inquiry.js`)
```javascript
{
  studentName: { type: String, required: true },
  parentPhone: { type: String, required: true },
  classPreference: String,
  preferredTime: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
}
```

### 4. `QuizQuestion` (`server/models/QuizQuestion.js`)
```javascript
{
  question: { type: String, required: true },
  category: { type: String, required: true },
  options: [String],       // 4 answer choices
  correct: Number,         // 0-based index of correct answer
  explanation: String,     // Conceptual explanation
  order: Number
}
```

### 5. `QuizAttempt` (`server/models/QuizAttempt.js`)
```javascript
{
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answers: [{
    questionIndex: Number,
    selectedAnswer: Number,
    isCorrect: Boolean
  }],
  createdAt: { type: Date, default: Date.now }
}
```

### 6. `Achiever` & `Testimonial`
Stores Hall of Fame students (name, batch, score, quote, styling colors) and verified reviews (author, role, rating, feedback).

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000` (or `http://localhost:5173` through Vite proxy)

### Endpoints Overview

| Method | Endpoint | Description | Sample Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status check | _None_ |
| `GET` | `/api/stats` | Counts of courses, achievers, enrollments, inquiries | _None_ |
| `GET` | `/api/courses` | Fetch all active courses (supports `?category=science`) | _None_ |
| `GET` | `/api/achievers` | Fetch Hall of Fame toppers | _None_ |
| `GET` | `/api/testimonials` | Fetch student/parent reviews | _None_ |
| `GET` | `/api/quiz/questions` | Fetch practice quiz questions | _None_ |
| `POST`| `/api/quiz/attempts` | Record a completed quiz attempt | `{"score": 3, "totalQuestions": 3}` |
| `POST`| `/api/enrollments` | Book a free demo class | `{"studentName": "Riya", "phone": "9876543210", "course": "Class 10th"}` |
| `GET` | `/api/enrollments` | List all booked demo classes (newest first) | _None_ |
| `POST`| `/api/inquiries` | Submit contact inquiry | `{"studentName": "Aman", "parentPhone": "9123456789", "message": "Fees?"}` |
| `GET` | `/api/inquiries` | List all inquiries (newest first) | _None_ |

---

## 🚀 Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [npm](https://www.npmjs.com/) (v9+)
- MongoDB Atlas account (or local MongoDB community server)

### 1. Clone & Install Dependencies
From the repository root:
```bash
# Install root orchestration tools
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

### 2. Configure Environment Variables
Verify or create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://riyasonkusre22_db_user:3TDUjQkp1B3JtnaP@yash.8lus1h9.mongodb.net/yash_tutorials?retryWrites=true&w=majority
NODE_ENV=development
```

### 3. Run Development Servers
You can start both frontend and backend concurrently with a single command from the project root:
```bash
npm run dev
```

Alternatively, run each service in separate terminals:
```bash
# Terminal 1: Backend Server (runs on http://localhost:5000)
npm run server

# Terminal 2: Vite React Client (runs on http://localhost:5173)
npm run client
```

Now open **`http://localhost:5173`** in your browser.

---

## 🌱 Database Migration & Seeding

The project includes an automated database migration and seeding utility that initializes MongoDB Atlas with courses, toppers, reviews, quiz questions, and sample inquiries.

To run the seeder:
```bash
npm run seed
```
Or directly from the `server` directory:
```bash
cd server
npm run seed
```

**What the seeder does:**
1. Connects to MongoDB Atlas using authenticated TLS/SSL.
2. Clears and migrates the `courses`, `achievers`, `testimonials`, and `quizquestions` collections.
3. Inserts all official courses, toppers, and practice questions.
4. Preserves existing live student enrollments and inquiries (or seeds realistic baseline records if empty).
5. Closes the connection cleanly with exit code `0`.

---

## 💡 Troubleshooting & Windows Tips

- **Node.js SRV Resolution on Windows (`querySrv ECONNREFUSED`)**:
  - Some Windows network routers fail to resolve MongoDB `mongodb+srv://` DNS SRV records through standard local DNS.
  - This project automatically configures `dns.setServers(['8.8.8.8', '1.1.1.1'])` in [`server/config/db.js`](file:///c:/Users/Riya/OneDrive/Desktop/yesh_class/server/config/db.js) and [`server/server.js`](file:///c:/Users/Riya/OneDrive/Desktop/yesh_class/server/server.js) to resolve MongoDB Atlas hostnames consistently.
- **Port In Use (5000 or 5173)**:
  - If port 5000 is occupied, you can change `PORT=5001` in `server/.env` and update the proxy target in `client/vite.config.js`.
- **OneDrive Sync Warnings**:
  - If developing within OneDrive folders, keep `node_modules` local or run `npm install --prefer-offline` to prevent cloud file locking.

---

## 📄 License & Credits
- **Institute**: Yash Tutorials — Premier Educational Coaching
- **Design & Architecture**: Crafted with Plus Jakarta Sans typography, Tailwind color tokens, Lucide icon set, and modern glassmorphism.
- **License**: ISC
