# 💬 Real-Time Chat Application

A full-stack real-time chat application built using the MERN Stack and Socket.IO. Users can register, log in securely, send instant messages, and view online users in real time.

## 🚀 Features

- User Authentication (Signup & Login)
- Secure Password Hashing using bcrypt
- JWT-based Authentication
- Real-Time Messaging with Socket.IO
- Online/Offline User Status
- One-to-One Chat
- Responsive User Interface
- MongoDB Database Integration
- Protected Routes

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT Authentication
- bcrypt
- dotenv
- Cookie Parser

---

## 📂 Project Structure

```
realtime-chat-application/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Prachi-Ukey/realtime-chat-application.git
```

```
cd realtime-chat-application
```

---

## Backend Setup

```
cd backend
npm install
```

Create a `.env` file inside the backend folder.

Example:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```
npm start
```

---

## Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 📸 Screenshots

Add screenshots of:

- Login Page
- Signup Page
- Chat Window
- Online Users
- Real-Time Messaging

---

## 🔄 How It Works

1. User signs up or logs in.
2. JWT token authenticates the user.
3. User connects to Socket.IO server.
4. Online users are displayed instantly.
5. Messages are stored in MongoDB.
6. Socket.IO broadcasts messages in real time.

---

## 📦 API Endpoints

### Authentication

- POST `/api/auth/signup`
- POST `/api/auth/login`
- POST `/api/auth/logout`

### Messages

- GET `/api/messages/:id`
- POST `/api/messages/send/:id`

---

## 👩‍💻 Author

**Prachi Ukey**

GitHub: https://github.com/Prachi-Ukey

