# MindBloom — Emotional Wellness Platform

MindBloom is a full-stack mental wellness application built with a React + Vite frontend and a Django REST Framework backend, supported by an Express/Node proxy layer with Google Gemini AI integration.

---

## 🌟 Key Features

- **BloomBot AI Companion**: AI-powered emotional support mascot powered by Google Gemini API.
- **Journaling & Mood Tracking**: Daily reflections, mood tracking, and analytics with interactive visualizations.
- **Inspire & Discover**: Curated affirmations, daily quotes, wellness articles, and community newsletters.
- **Reflection Modules**: Gratitude logs and reframing negative self-talk.
- **Admin Console**: Management dashboard for administrators to oversee system health, users, and content.
- **Authentication**: JWT token authentication with role-based routing (Standard User vs. Admin).

---

## 🚀 Getting Started for Local Development

### Prerequisites

- **Node.js**: v18 or higher
- **Python**: v3.10 or higher
- **pip** and **npm** or **bun**

---

### 1. Environment Setup

Create your `.env` configuration file from `.env.example`:

- **In Antigravity IDE**:
  - Right-click `.env.example` in the left sidebar file tree -> **Copy**, then **Paste** -> Rename the new file to `.env`.
  - OR open the integrated terminal (`Ctrl + ~` or `Cmd + ~`) and run:
    - On Windows PowerShell / Bash / Mac: `cp .env.example .env`
    - On Windows CMD: `copy .env.example .env`

- **Command Line**:
  - Windows CMD: `copy .env.example .env`
  - Mac / Linux / Git Bash / PowerShell: `cp .env.example .env`

Open `.env` and fill in your configuration keys:
- `GEMINI_API_KEY`: Your Google Gemini API Key.
- `DJANGO_SECRET_KEY`: Any secret string for local Django development.
- `DATABASE_URL` / `DB_NAME`: (Optional) PostgreSQL database settings. Defaults to `db.sqlite3` if not provided.

---

### 2. Frontend & Express Server Setup

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Start the development server (runs Vite + Express server on http://localhost:3000):
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

---

### 3. Django Backend Setup

1. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

4. Create a superuser / admin account (optional):
   ```bash
   python manage.py createsuperuser
   ```

5. Start the Django backend server (runs on http://localhost:8000):
   ```bash
   python manage.py runserver 8000
   ```

---

## 📁 Project Architecture

```
.
├── accounts/               # Django Auth & User Profile app
├── chatbot/                # Django BloomBot chat history & feedback app
├── journal/                # Django Journal entries & tags app
├── moods/                  # Django Mood logs & analytics app
├── inspire/                # Django Quotes, Affirmations, Articles app
├── reflection/             # Django Gratitude & Self-Talk app
├── mindbloom_backend/      # Django core settings and URL configurations
├── src/                    # React frontend application
│   ├── components/         # Layouts, UI components, and icons
│   ├── contexts/           # Auth and Theme context providers
│   ├── pages/              # Public, User App, and Admin pages
│   ├── services/           # API Service and client state management
│   ├── App.jsx             # React Router configuration
│   └── main.jsx            # React entry point
├── server.js               # Node/Express backend proxy with Gemini AI integration
├── index.html              # Frontend entry point
├── manage.py               # Django CLI management script
├── package.json            # Node dependencies and scripts
└── requirements.txt        # Python backend dependencies
```

---

## 🔒 Default Admin Credentials (Demo)

- **Admin Login**: Sign in via `/admin/login` or standard login.
- **Admin Email**: `admin@mindbloom.app`
- **Admin Password**: `admin123`

---

## 🛠️ Verification & Build Commands

- **Frontend Build**: `npm run build`
- **Frontend Linter**: `npm run lint`
- **Backend Migrations**: `python manage.py migrate`
- **Backend Unit Tests**: `python manage.py test`
