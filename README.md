# 🧠 AI LearnMate

An advanced AI-powered educational platform built with a robust **Microservices Architecture**. AI LearnMate helps students transform lectures, audio, and YouTube videos into interactive learning materials using modern AI technologies.

The platform combines a **React Native mobile application**, a **Node.js backend API**, and a dedicated **FastAPI AI microservice** to deliver scalable and intelligent educational features.

---

# 🚀 Features

- 🎙️ AI-powered Audio & Video Transcription
- 📺 YouTube Video Transcription using `yt-dlp`
- 📝 Smart AI Summarization
- ❓ Automatic Quiz Generation
- 🔐 JWT-based Authentication & Authorization
- 📂 File Upload Support
- 🤖 AI-driven Educational Assistance
- ☁️ Microservices-based Architecture
- 📱 Cross-platform Mobile Application

---

# 🏗️ Project Architecture

```text
AI-LEARNMATE/
│
├── Frontend (React Native + Expo) 📱
│       ↓
│
├── Backend API (Node.js + Express) 🌐
│       ↓
│
├── AI Service (Python + FastAPI) 🤖
│       ↓
│
└── 🗄️ Supabase PostgreSQL Database
```

---

# 📁 Project Structure

```text
AI-LEARNMATE/
│
├── backend/
│   ├── ai-service/
│   │   ├── app.py
│   │   ├── requirements.txt
│   │   ├── venv/
│   │   └── .env
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── uploads/
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── navigation/
│   │   ├── screens/
│   │   └── context/
│
├── package.json
└── README.md
```

---

# 🛠️ Tech Stack

## 📱 Frontend

- React Native
- Expo
- React Navigation
- Axios
- Context API

---

## 🌐 Backend API

- Node.js
- Express.js
- Sequelize ORM
- JWT Authentication
- Multer
- fluent-ffmpeg

---

## 🤖 AI Service

- FastAPI
- Python
- Deepgram SDK
- Google Gemini API
- Groq API
- yt-dlp

---

## 🗄️ Database

- PostgreSQL
- Supabase

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/patilroshan7768/ai-learnmate.git

cd ai-learnmate
```

---

# 2️⃣ Setup Backend API

```bash
cd backend

npm install
```

## Create `.env`

```env
PORT=3000

DATABASE_URL=your_supabase_connection_string

JWT_SECRET=your_super_secret_jwt_key
```

## Start Backend

```bash
npm run dev
```

---

# 3️⃣ Setup AI Service

```bash
cd backend/ai-service

python -m venv venv
```

## Activate Virtual Environment

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

## Install Requirements

```bash
pip install -r requirements.txt
```

## Create `.env`

```env
DEEPGRAM_API_KEY=your_deepgram_api_key

GEMINI_API_KEY=your_gemini_api_key

GROQ_API_KEY=your_groq_api_key
```

## Run AI Service

```bash
uvicorn app:app --reload --port 5001
```

---

# 4️⃣ Setup Frontend

```bash
cd Frontend

npm install
```

## Start Expo App

```bash
npx expo start
```

---

# 🔗 API Communication Flow

```text
Frontend
   ↓
Node.js Backend
   ↓
FastAPI AI Service
   ↓
AI Models (Gemini / Deepgram / Groq)
```

---

# 🔐 Environment Variables

## Backend 

## Create `.env`

```env
PORT=3000

DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

JWT_SECRET=your_super_secret_jwt_key
```

---

## AI Service `.env`

```env
DEEPGRAM_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
```

---

# 📌 Key Highlights

- 🔥 Hybrid Backend Architecture using Node.js + FastAPI
- ⚡ Dedicated AI Microservice for heavy AI processing
- 🧠 Integration with multiple AI providers
- 📱 Mobile-first cross-platform design
- ☁️ Scalable and modular system design
- 🔒 Secure authentication and API communication

---

# 🧠 Future Improvements

- 🔍 RAG-based AI Chatbot
- 🗂️ Vector Database Integration
- 📊 Learning Analytics Dashboard
- 🎤 Voice-based AI Interaction
- 🔔 Push Notifications
- 🧪 AI Model Fine-Tuning

---

# 👨‍💻 Author

## Roshan Patil

- GitHub: https://github.com/patilroshan7768

---