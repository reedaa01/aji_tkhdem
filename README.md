# Aji Tkhdem — Full-Stack SaaS Career Platform

A production-ready SaaS web application that allows users to build a professional portfolio, find remote jobs, and track applications.

---

## 🏗️ Tech Stack

| Layer        | Technology                         |
|--------------|------------------------------------|
| Frontend     | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend      | Node.js + Express.js               |
| Database     | MySQL                              |
| Auth         | JWT (JSON Web Tokens)              |
| File Uploads | Multer (local storage)             |
| Jobs API     | Remotive Public API                |

---

## 📁 Project Structure

```
Portfolio Saas/
├── backend/                    # Express REST API
│   ├── config/
│   │   ├── db.js               # MySQL connection pool
│   │   └── schema.sql          # Database schema
│   ├── controllers/            # Business logic (MVC)
│   │   ├── authController.js
│   │   ├── portfolioController.js
│   │   ├── skillController.js
│   │   ├── experienceController.js
│   │   ├── projectController.js
│   │   ├── jobController.js
│   │   └── applicationController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT protect middleware
│   │   ├── validate.js         # express-validator errors
│   │   ├── upload.js           # Multer file upload handlers
│   │   └── errorHandler.js     # Global error handler
│   ├── models/                 # DB query layer
│   │   ├── User.js
│   │   ├── Portfolio.js
│   │   ├── Skill.js
│   │   ├── Experience.js
│   │   ├── Project.js
│   │   └── JobApplication.js
│   ├── routes/                 # API route definitions
│   │   ├── auth.js
│   │   ├── portfolio.js
│   │   ├── skills.js
│   │   ├── experience.js
│   │   ├── projects.js
│   │   ├── jobs.js
│   │   └── applications.js
│   ├── uploads/                # Uploaded files (gitignored)
│   │   ├── avatars/
│   │   ├── cvs/
│   │   └── projects/
│   ├── .env                    # Environment variables
│   └── server.js               # Express app entry point
│
└── frontend/                   # Next.js 14 App
    ├── app/
    │   ├── (auth)/             # Public auth routes
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   ├── (dashboard)/        # Protected dashboard routes
    │   │   ├── dashboard/page.tsx
    │   │   ├── portfolio/page.tsx
    │   │   ├── jobs/page.tsx
    │   │   └── applications/page.tsx
    │   ├── layout.tsx          # Root layout (AuthProvider + Toaster)
    │   └── page.tsx            # Landing page
    ├── components/
    │   ├── ui/                 # Reusable UI primitives
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Textarea.tsx
    │   │   ├── Select.tsx
    │   │   ├── Card.tsx
    │   │   ├── Modal.tsx
    │   │   └── Spinner.tsx
    │   └── layout/
    │       └── Sidebar.tsx     # Responsive sidebar navigation
    ├── hooks/
    │   └── useAuth.tsx         # Auth context + provider
    ├── lib/
    │   ├── api.ts              # Axios instance with JWT interceptor
    │   ├── services.ts         # All API service functions
    │   └── utils.ts            # Helpers, formatters, color maps
    └── types/
        └── index.ts            # All TypeScript interfaces
```

---

## 🗄️ Database Schema

```
users            — id, uuid, email, password, full_name, role
portfolios       — user_id, headline, bio, phone, location, website, github, linkedin, avatar_url, cv_url
skills           — user_id, name, level (beginner/intermediate/advanced/expert)
experience       — user_id, company, position, description, start_date, end_date, is_current
projects         — user_id, title, description, tech_stack, project_url, github_url, image_url
job_applications — user_id, job_id, job_title, company_name, job_url, location, job_type, status, notes
```

---

## 🔌 API Endpoints

### Auth
| Method | Route              | Description           |
|--------|--------------------|-----------------------|
| POST   | /api/auth/register | Register new user     |
| POST   | /api/auth/login    | Login, receive JWT    |
| GET    | /api/auth/me       | Get current user      |

### Portfolio
| Method | Route                  | Description              |
|--------|------------------------|--------------------------|
| GET    | /api/portfolio         | Get full portfolio        |
| PUT    | /api/portfolio         | Create / update profile   |
| POST   | /api/portfolio/avatar  | Upload avatar image       |
| POST   | /api/portfolio/cv      | Upload CV (PDF)           |

### Skills, Experience, Projects
All support `GET /`, `POST /`, `PUT /:id`, `DELETE /:id`

### Jobs
| Method | Route      | Query Params                  |
|--------|------------|-------------------------------|
| GET    | /api/jobs  | search, category, limit       |

### Applications
| Method | Route                  | Description                   |
|--------|------------------------|-------------------------------|
| GET    | /api/applications      | All user applications         |
| GET    | /api/applications/stats| Status breakdown counts       |
| POST   | /api/applications      | Apply to a job                |
| PATCH  | /api/applications/:id  | Update status / notes         |
| DELETE | /api/applications/:id  | Remove application            |

---

## 🚀 Setup Instructions

### 1. MySQL Database
```sql
-- Run the schema file
mysql -u root -p < backend/config/schema.sql
```

### 2. Backend
```bash
cd backend
cp .env .env.local   # then fill in your values
npm install
npm run dev          # runs on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev          # runs on http://localhost:3000
```

### Environment Variables

**backend/.env**
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=aji_tkhdem
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
JOBS_API_URL=https://remotive.com/api/remote-jobs
```

**frontend/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## ✅ Features

- [x] Secure JWT authentication (register / login / protected routes)
- [x] Portfolio builder (bio, headline, skills, experience, projects)
- [x] Avatar upload (image) and CV upload (PDF)
- [x] Live remote job listings via Remotive API
- [x] One-click job application with notes
- [x] Application status pipeline (applied → interview → offer)
- [x] Dashboard with stats and recent activity
- [x] Fully responsive UI with Tailwind CSS
- [x] Input validation on both frontend (Zod) and backend (express-validator)
- [x] Global error handling and toast notifications
