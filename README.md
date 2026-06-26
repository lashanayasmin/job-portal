# Job Portal - MERN Stack (For Fresh Graduates)

A complete job portal built with the MERN stack (MongoDB, Express, React, Node.js) featuring JWT authentication, role-based access, and a modern responsive UI.

## Features

- **User Authentication** - Signup, Login, Logout with JWT
- **Role-based Access** - Job Seeker and Employer roles
- **Employer Dashboard** - Post/Edit/Delete jobs, View applicants, Update application status
- **Job Seeker Dashboard** - Update profile, Upload resume (PDF), Apply for jobs, View applied jobs
- **Job Search & Filter** - Search by title/company/location, Filter by job type
- **Responsive UI** - Built with Tailwind CSS
- **Protected Routes** - Role-based route protection
- **Form Validation** - Client and server-side validation
- **RESTful API** - Clean MVC architecture
- **Error Handling** - Comprehensive error handling and loading states

## Tech Stack

- MongoDB + Mongoose
- Express.js
- React 18 + Vite
- Redux Toolkit
- Tailwind CSS
- JWT Authentication
- Multer (file upload)

## Project Structure

```
job-portal/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth, error handling, upload
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── uploads/         # Resume PDF storage
│   ├── .env             # Environment variables
│   └── server.js        # Entry point
└── frontend/
    ├── src/
    │   ├── components/  # Reusable React components
    │   ├── pages/       # Page components
    │   ├── redux/       # Redux store & slices
    │   └── utils/       # Axios config
    ├── index.html
    └── vite.config.js
```

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

### 3. Run the Application

```bash
# Start backend (from backend folder)
npm run dev

# Start frontend (from frontend folder, in a new terminal)
npm run dev
```

- Backend runs on: `http://localhost:5000`
- Frontend runs on: `http://localhost:5173`

The Vite dev server proxies `/api` requests to the backend automatically.

### 4. Build for Production

```bash
cd frontend
npm run build
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile + upload resume

### Jobs
- `GET /api/jobs` - Get all jobs (with search/filter)
- `GET /api/jobs/employer` - Get employer's jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (employer)
- `PUT /api/jobs/:id` - Update job (employer)
- `DELETE /api/jobs/:id` - Delete job (employer)

### Applications
- `POST /api/applications/:jobId/apply` - Apply for job (seeker)
- `GET /api/applications/mine` - Get my applications (seeker)
- `GET /api/applications/:jobId` - Get applications for a job (employer)
- `PUT /api/applications/:id/status` - Update application status (employer)

## Database Collections

- **Users** - Stores seekers and employers with profile data
- **Jobs** - Job listings posted by employers
- **Applications** - Job applications with status tracking
