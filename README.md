# Job Portal — MERN Stack (For Fresh Graduates)

A full-stack job portal built with the MERN stack (MongoDB, Express, React, Node.js) featuring JWT authentication, role-based access, resume uploads to Cloudinary, and a modern responsive UI. Designed to connect **job seekers** (fresh graduates) with **employers**.

## What this project does  

The app has two kinds of users, each with their own dashboard:

- **Job Seekers** sign up, build a profile (phone, skills, education, experience), upload a PDF resume, browse and search jobs, and apply to them. They can track the status of every application (pending → reviewed → shortlisted / rejected).
- **Employers** sign up, post job listings, edit or delete them, view the applicants for each job (with their resume and profile), and move each application through the hiring pipeline.

Anyone (even logged-out visitors) can browse and search the public job listings; applying and posting require an account with the matching role.

### How it fits together

```
React (Vite + Redux Toolkit)  ──HTTP──►  Express REST API  ──►  MongoDB (Mongoose)
        │                                        │
        │                                        └──►  Cloudinary  (PDF resume storage)
        └─ JWT in localStorage, sent as Bearer token on every request
```

- **Auth**: passwords are hashed with bcrypt; login returns a JWT that the frontend stores in `localStorage` and attaches to every API call. Protected routes are guarded both on the client (`ProtectedRoute`) and the server (`protect` + `authorize` middleware).
- **Authorization**: route access is gated by role — only `employer`s can create/edit/delete jobs and review applicants; only `seeker`s can apply and view their own applications. Ownership is enforced server-side (an employer can only touch their own jobs/applicants).
- **File uploads**: resumes (PDF, max 5 MB) are uploaded via Multer straight to **Cloudinary** — no local disk is used, which is what makes the app deployable to serverless platforms like Vercel.
- **State**: the frontend uses Redux Toolkit slices (`auth`, `jobs`, `applications`) with async thunks wrapping Axios calls.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Redux Toolkit, React Router, Tailwind CSS, React Toastify, React Icons |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB (Atlas in production) |
| Auth | JWT, bcryptjs |
| File storage | Multer + Cloudinary |

## Project Structure

```
job-portal/
├── vercel.json              # Single-deployment config (serves frontend + routes /api to backend)
├── backend/
│   ├── api/index.js         # Vercel serverless entry (exports the Express app)
│   ├── config/              # DB connection (cached) + Cloudinary config
│   ├── controllers/         # Route handlers (auth, jobs, applications)
│   ├── middleware/          # auth (protect/authorize), errorHandler, upload (Multer→Cloudinary)
│   ├── models/              # Mongoose schemas (User, Job, Application)
│   ├── routes/              # Express route definitions
│   ├── server.js            # Express app + local dev entry point
│   └── .env                 # Environment variables (not committed)
└── frontend/
    ├── src/
    │   ├── components/      # Navbar, JobCard, ProtectedRoute, Spinner
    │   ├── pages/           # Home, Login, Signup, JobListings, JobDetail,
    │   │                    #   Seeker/Employer dashboards, Post/Edit job
    │   ├── redux/           # Store + auth/jobs/applications slices
    │   └── utils/           # Axios instance, resume URL helper
    ├── index.html
    └── vite.config.js       # Dev server proxies /api → localhost:5000
```

## Local Development

### Prerequisites

- Node.js v16+
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A free [Cloudinary](https://cloudinary.com/) account (for resume uploads)

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure backend environment

Fill in `backend/.env` (template already present):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

The frontend needs **no** `.env` locally — Vite proxies `/api` to the backend automatically.

### 3. Run

```bash
# Terminal 1 — backend
cd backend && npm run dev      # http://localhost:5000

# Terminal 2 — frontend
cd frontend && npm run dev     # http://localhost:5173
```

## Deploying to Vercel (single project)

This repo is configured for a **single Vercel deployment** that serves the React build and the API under one domain. The root `vercel.json` builds the frontend as static output and routes `/api/*` to the backend serverless function.

1. **Import the repo** into Vercel and set **Root Directory** to `./` (the repo root).
2. **Environment Variables** — add the backend ones in the Vercel dashboard:
   `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
   Do **not** set `VITE_API_URL` — the app calls `/api` on the same domain.
3. **MongoDB Atlas → Network Access** — allow `0.0.0.0/0` (Vercel's serverless IPs are dynamic).
4. **Deploy.** The site and `…/api/health` will both respond on the same URL.

> The `.env` file is git-ignored and never uploaded — that's why the same variables must be re-entered in the Vercel dashboard.

## API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Log in, returns JWT |
| GET | `/api/auth/me` | Authenticated | Get current user |
| PUT | `/api/auth/profile` | Authenticated | Update profile + upload resume |

### Jobs
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/jobs` | Public | List jobs (supports `search`, `type`, `location` query params) |
| GET | `/api/jobs/employer` | Employer | Get the logged-in employer's jobs |
| GET | `/api/jobs/:id` | Public | Get a single job |
| POST | `/api/jobs` | Employer | Create a job |
| PUT | `/api/jobs/:id` | Employer (owner) | Update a job |
| DELETE | `/api/jobs/:id` | Employer (owner) | Delete a job |

### Applications
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/applications/:jobId/apply` | Seeker | Apply for a job (PDF resume upload) |
| GET | `/api/applications/mine` | Seeker | List my applications |
| GET | `/api/applications/:jobId` | Employer (owner) | List applicants for a job |
| PUT | `/api/applications/:id/status` | Employer (owner) | Update an application's status |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Returns `{ status: 'ok' }` |

## Data Models

- **User** — `name`, `email`, `password` (hashed), `role` (`seeker` \| `employer`), and a `profile` sub-document (`phone`, `skills[]`, `experience`, `education`, `resume`, `company`).
- **Job** — `company`, `title`, `location`, `type` (Full-time / Part-time / Internship / Contract / Remote), `description`, `requirements[]`, `salary`, `vacancies`, `employer` (ref User).
- **Application** — `job` (ref Job), `seeker` (ref User), `resume` (Cloudinary URL), `status` (pending / reviewed / shortlisted / rejected). A unique index on `(job, seeker)` prevents duplicate applications.
