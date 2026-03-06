# 📋 Task & Project Tracker

A full-stack **Task & Project Management** application built with a Laravel REST API backend and a Vue 3 SPA frontend, packaged as a monorepo.

<img width="1920" height="917" alt="image" src="https://github.com/user-attachments/assets/7182e5b0-052c-4a17-a58d-5df2078ef0ea" />

## ✨ Features

- 🔐 Authentication via **Laravel Sanctum** (token-based)
- 📁 Project management with status, description, and **due date**
- 🗂️ Kanban board with **5 columns**: To Do, In Progress, Testing, Done, Pending
- 📌 Drag-and-drop task cards
- ⏰ Task due date tracking with **urgency highlighting**
- 📊 Dashboard with stats (active projects, pending tasks, near-due tasks)
- 🔍 Project search
- 📋 Global task view across all projects

---

## 🛠️ Tech Stack

### Backend

| Component | Technology       |
| --------- | ---------------- |
| Framework | Laravel 12       |
| Database  | PostgreSQL       |
| Auth      | Laravel Sanctum  |
| API       | RESTful JSON API |
| Language  | PHP 8.2+         |

### Frontend

| Component   | Technology              |
| ----------- | ----------------------- |
| Framework   | Vue 3 (Composition API) |
| Language    | TypeScript              |
| State Mgmt  | Pinia                   |
| Routing     | Vue Router 4            |
| HTTP Client | Axios                   |
| UI Template | NiceAdmin (Bootstrap 5) |
| Build Tool  | Vite                    |

---

## 📂 Project Structure

```
Task & Project Tracker/
├── backend/                    # Laravel 12 REST API
│   ├── app/
│   │   ├── Http/Controllers/   # API controllers
│   │   └── Models/             # Eloquent models
│   ├── database/
│   │   ├── migrations/         # Database table definitions
│   │   └── seeders/            # Default seed data
│   ├── routes/
│   │   └── api.php             # API route definitions
│   └── .env                    # Backend environment variables
│
├── frontend/                   # Vue 3 SPA
│   ├── src/
│   │   ├── views/              # Page components
│   │   ├── stores/             # Pinia state stores (auth, project, task)
│   │   ├── services/           # Axios API service
│   │   ├── types/              # TypeScript interfaces
│   │   └── routes/             # Vue Router config
│   ├── public/assets/          # NiceAdmin template assets (CSS, JS, images)
│   └── .env                    # Frontend environment variables
│
├── template/                   # Original NiceAdmin template files
├── TaskTracker_PostmanCollection.json  # Postman API collection
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **PHP** >= 8.2 with the `pdo_pgsql` extension enabled
- **Composer** >= 2.x
- **Node.js** >= 18.x and **npm**
- **PostgreSQL** >= 14

---

## 🗄️ Database Setup (PostgreSQL)

1. Open your PostgreSQL shell or a GUI tool (e.g., pgAdmin, DBeaver).

2. Create a new database:

   ```sql
   CREATE DATABASE task_tracker;
   ```

3. Optionally, create a dedicated user:
   ```sql
   CREATE USER tracker_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE task_tracker TO tracker_user;
   ```

---

## ⚙️ Backend Setup (Laravel)

### 1. Install dependencies

```bash
cd backend
composer install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=task_tracker
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
```

### 3. Generate application key

```bash
php artisan key:generate
```

### 4. Run migrations

```bash
php artisan migrate
```

### 5. Run seeders (populate default data)

Default data includes the admin user and task categories (To Do, In Progress, Testing, Done, Pending).

```bash
php artisan db:seed
```

Or run fresh migrations with seeding in one command:

```bash
php artisan migrate:fresh --seed
```

**Default Admin Credentials:**

| Field    | Value            |
| -------- | ---------------- |
| Email    | `admin@track.er` |
| Password | `password123`    |

### 6. Start the backend server

```bash
php artisan serve
```

The API will be available at: `http://localhost:8000`

---

## 🎨 Frontend Setup (Vue 3)

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Start the development server

```bash
# Using PowerShell (bypasses execution policy restriction):
node node_modules\vite\bin\vite.js

# Or if npm scripts are enabled on your system:
npm run dev
```

The app will be available at: `http://localhost:5173`

---

## 🧪 Testing

### Backend (PHP Unit / Feature Tests)

```bash
cd backend
php artisan test
```

### Frontend (Vitest)

```bash
cd frontend
node node_modules\vitest\vitest.mjs run
```

---

## 📖 API Documentation

A **Postman Collection** for all API endpoints is included in the root of the project:

```
TaskTracker_PostmanCollection.json
```

### Importing into Postman

1. Open **Postman**
2. Click **Import** → **File**
3. Select `TaskTracker_PostmanCollection.json`
4. Set the collection variable `base_url` to `http://localhost:8000`
5. Log in first via `POST /api/login` to get a token, then set it as bearer token

### Available API Endpoints

| Method   | Endpoint                   | Auth Required | Description                    |
| -------- | -------------------------- | ------------- | ------------------------------ |
| `POST`   | `/api/login`               | ❌            | Login and get Sanctum token    |
| `POST`   | `/api/logout`              | ✅            | Logout current session         |
| `GET`    | `/api/user`                | ✅            | Get authenticated user info    |
| `GET`    | `/api/dashboard`           | ✅            | Dashboard stats & urgent tasks |
| `GET`    | `/api/projects`            | ✅            | List all projects              |
| `POST`   | `/api/projects`            | ✅            | Create a new project           |
| `GET`    | `/api/projects/{id}`       | ✅            | Get project details with tasks |
| `PUT`    | `/api/projects/{id}`       | ✅            | Update a project               |
| `GET`    | `/api/categories`          | ✅            | List all task categories       |
| `GET`    | `/api/tasks`               | ✅            | List all tasks (global view)   |
| `GET`    | `/api/projects/{id}/tasks` | ✅            | List tasks for a project       |
| `POST`   | `/api/projects/{id}/tasks` | ✅            | Create a task in a project     |
| `PUT`    | `/api/tasks/{id}`          | ✅            | Update a task                  |
| `DELETE` | `/api/tasks/{id}`          | ✅            | Soft-delete a task             |

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">Made by <a href="https://github.com/IbnnuuS">IbnnuuS</a></div>
