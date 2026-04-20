<<<<<<< HEAD
# AI-LearnMate Backend API

AI Integrated Smart Learning Hub - Backend API built with Node.js, Express, and PostgreSQL.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository and navigate to backend:**

```bash
cd backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the `backend` directory (or copy from `.env.example`):

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_learnmate
DB_USER=postgres
DB_PASSWORD=your_password_here

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000
```

4. **Create PostgreSQL database:**

```sql
CREATE DATABASE ai_learnmate;
```

5. **Start the server:**

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 🧩 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (JWT protected)

### Courses

- `POST /api/courses` - Create a course (Teacher only)
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `PUT /api/courses/:id` - Update course (Teacher only, own courses)
- `DELETE /api/courses/:id` - Delete course (Teacher only, own courses)

### AI Module

- `POST /api/ai/summarize` - Summarize text (GPT-4 placeholder)
- `POST /api/ai/quiz` - Generate quiz questions (GPT-4 placeholder)
- `POST /api/ai/transcribe` - Transcribe audio (Whisper placeholder)

### Recommendations

- `GET /api/recommendations/:userId` - Get course recommendations for a user

### Logs

- `GET /api/logs` - Get all logs (Admin/Teacher only)

## 🔐 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📝 Models

### User
- `id` (Integer, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: 'student', 'teacher')

### Course
- `id` (Integer, Primary Key)
- `title` (String)
- `description` (Text)
- `category` (String)
- `createdBy` (Integer, Foreign Key to User)

### Log
- `id` (Integer, Primary Key)
- `userId` (Integer, Foreign Key to User, nullable)
- `action` (String)
- `result` (String)
- `timestamp` (DateTime)

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Swagger** - API documentation
- **Nodemon** - Development server

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── aiController.js
│   │   ├── recommendationController.js
│   │   └── logController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── Log.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── recommendationRoutes.js
│   │   └── logRoutes.js
│   ├── middlewares/
│   │   └── auth.js
│   └── utils/
│       ├── jwt.js
│       └── logger.js
├── server.js
├── .env
├── package.json
└── README.md
```

## 🔄 Next Steps

1. **Integrate GPT-4 API** for AI summarization and quiz generation
2. **Integrate Whisper API** for audio transcription
3. **Add ML/embeddings** for better course recommendations
4. **Add admin role** to User model for better access control
5. **Set up database migrations** for production
6. **Add unit and integration tests**
7. **Add rate limiting** for API protection
8. **Add file upload** support for audio transcription

## 📄 License

ISC



=======
# backend-project
backend project
>>>>>>> 19113a8b1d234844d3b8d3542c18c8beea28adc7
