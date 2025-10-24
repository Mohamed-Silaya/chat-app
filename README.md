# 💬 Django Channels Real-Time Chat Application

A **modern real-time chat application** built with **Django**, **Django Channels**, and **WebSockets** — featuring multi-room chat, REST APIs, live dashboard analytics, and production-ready scalability using **Redis**.

![Django](https://img.shields.io/badge/Django-5.2.7-green)
![Channels](https://img.shields.io/badge/Channels-4.3.1-blue)
![React](https://img.shields.io/badge/React-Frontend-purple)
![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-orange)
![Redis](https://img.shields.io/badge/Redis-Channel_Layer-red)
![License](https://img.shields.io/badge/License-MIT-lightgrey)


---

## 🚀 Overview

This project demonstrates **real-time communication** between users through **WebSockets**, powered by **Django Channels**.  
It supports **multiple chat rooms**, **instant messaging**, a **RESTful API**, and a **live dashboard** for administrators.

It’s ideal as a base for **social platforms**, **team communication tools**, or **customer support systems** — and great for learning Django Channels and React integration.

---
## Screen shots 
![welcome](https://github.com/Mohamed-Silaya/chat-app/blob/main/image/Welcome.png)
![Home](https://github.com/Mohamed-Silaya/chat-app/blob/main/image/Home.png)
![1](https://github.com/Mohamed-Silaya/chat-app/blob/main/image/1.png)
![2](https://github.com/Mohamed-Silaya/chat-app/blob/main/image/2.png)
---
## ✨ Features
### 🔧 Backend Features
- ⚡ **Real-Time Messaging** — Instant communication using WebSockets and Django Channels  
- 🗂️ **Multiple Chat Rooms** — Dynamic room creation and joining  
- 🔌 **RESTful API** — CRUD endpoints for conversations and messages  
- 📊 **Live Dashboard** — Real-time stats for conversations and user activity  
- 👤 **User Management** — Automatic user creation and conversation tracking  
- 🚀 **Production Ready** — Redis channel layer support for scalability  

### 🎨 Frontend Features
- 💻 **Modern React UI** — Clean and responsive interface built with React Hooks  
- 🔁 **Real-Time Updates** — Messages appear instantly without reloads  
- 🏷️ **Room Management** — Create and switch between chat rooms  
- 👥 **User Profiles** — Personalized chat sessions  
- 📱 **Mobile Responsive** — Works smoothly across devices  
- 🌗 **Dark/Light Theme** — Customizable user appearance  
 

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Backend Framework** | Django 5.2.7 |
| **Real-Time Layer** | Django Channels 4.3.1 |
| **API** | Django REST Framework 3.16.1 |
| **Frontend** | React + Vite + Hooks |
| **Database** | SQLite (Dev) / PostgreSQL (Prod) |
| **WebSocket Server** | Daphne |
| **Channel Layer** | Redis (Prod) / InMemory (Dev) |
| **HTTP Client** | Axios / Fetch API |

---

## ⚙️ Installation & Setup

### 🧩 Prerequisites
- Python **3.8+**
- Node.js **16+**
- Redis 
- Docker
- Docker Compose
### 🏁 Setup Steps
 #### Backend Setup
```bash
# 1️⃣ Clone the repository
git clone https://github.com/Mohamed-Silaya/chat-app.git
cd chat-app

# 2️⃣ Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3️⃣ Install dependencies
pip install -r requirements.txt

# 4️⃣ Run migrations
python manage.py migrate

# 5️⃣ (Optional) Create superuser
python manage.py createsuperuser

# 6️⃣ Start development server
python manage.py runserver
```
Then open http://localhost:8000
 to view the app.

 #### Frontend Setup
 ```bash
 # 1️⃣ Navigate to frontend directory
cd Front

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start frontend dev server
npm run dev

 ```
Frontend available at: http://localhost:5173

 ## 🧭 Project Structure
 ``` bash
chat-app/
├── project/                 # Django project configuration
│   ├── settings.py          # Django settings
│   ├── urls.py              # URL routing
│   ├── asgi.py              # ASGI setup for Channels
│   └── wsgi.py              # WSGI setup for compatibility
├── chat/                    # Chat application
│   ├── models.py            # Conversation and Message models
│   ├── views.py             # REST API views
│   ├── urls.py              # App routes
│   ├── consumers.py         # WebSocket consumers
│   ├── routing.py           # WebSocket routing
│   ├── serializers.py       # DRF serializers
│   └── admin.py             # Django admin registration
├── Front/                   # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API and WebSocket helpers
│   │   └── styles/          # CSS/SCSS styling
│   ├── public/              # Static assets
│   ├── package.json
│   └── vite.config.js
├── requirements.txt         # Python dependencies
└── manage.py


 ```

## 🌍 REST API Endpoints
```bash
| Method | Endpoint                                   | Description                          |
| ------ | ------------------------------------------ | ------------------------------------ |
| GET    | `/api/conversations/`                      | List all conversations               |
| GET    | `/api/conversations/{name}/`               | Retrieve specific conversation       |
| GET    | `/api/conversations/{room_name}/messages/` | Get all messages in a room           |
| GET    | `/api/dashboard/stats/`                    | Fetch real-time dashboard statistics |

```
##  Docker Deployment## 
``` bash
services:
  backend:
    build: 
      context: ./Back
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    volumes:
      - ./Back:/app
    command: >
      sh -c "python manage.py migrate &&
             python manage.py collectstatic --noinput &&
             daphne project.asgi:application --bind 0.0.0.0 --port 8000"

  frontend:
    build:
      context: ./Front/chat-front
      dockerfile: ../Dockerfile.frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_BASE_URL: "http://backend:8000"

    depends_on:
      - backend
    command: ["npm", "run", "dev", "--host"]

  redis:
    image: redis:alpine
    container_name: chat-redis
    ports:
      - "6379:6379"
    restart: always
```
### Run it:
```bash
docker compose up --build
```
###  Traditional Deployment (Without Docker)
```bash 
# Install production servers
pip install gunicorn daphne

# Run with Daphne for WebSocket support
daphne project.asgi:application --bind 0.0.0.0 --port 8000

cd Front
npm run build
```
## Troubleshooting
```bash 
# Check Django logs
python manage.py runserver

# Re-apply migrations
python manage.py migrate

# Check Redis (for production)
redis-cli ping

# Verify WebSocket connection (browser console)

```
