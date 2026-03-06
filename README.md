# Quick Test – Client

Frontend application for the **Quick Test real-time competition platform**.
Built with **React, TailwindCSS, Ant Design, React Query, and Socket.IO**.

This client allows users to **join competitions, answer questions in real time, and view live leaderboards**.

---

# 🚀 Features

- Real-time quiz competition
- Live leaderboard updates using **Socket.IO**
- QR code join system
- Event-based competitions
- Role-based interface
- Dark mode UI
- Admin user management
- Event management
- Mobile-friendly interface

---

# 🛠 Tech Stack

| Technology           | Purpose                 |
| -------------------- | ----------------------- |
| React                | UI framework            |
| React Router         | Routing                 |
| Ant Design           | UI components           |
| TailwindCSS          | Styling                 |
| TanStack React Query | Server state management |
| Socket.IO Client     | Real-time communication |
| Day.js               | Date handling           |
| Vite                 | Build tool              |

---

# 📂 Project Structure

```
src
│
├── api
│   └── axios.js
│
├── components
│   ├── Loading.jsx
│   ├── ErrorPage.jsx
│   └── Layout.jsx
│
├── features
│   ├── Admin
│   ├── Events
│   ├── Login
│   ├── Join
│   └── Competition
│
├── store
│   └── authStore.js
│
├── socket
│   └── socket.js
│
├── utils
│
├── App.jsx
└── main.jsx
```

---

# ⚙️ Environment Variables

Create `.env` file in root:

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_NODE_ENV=development
```

---

# 📦 Installation

Install dependencies:

```
npm install
```

---

# ▶️ Run Development Server

```
npm run dev
```

App will run on:

```
http://localhost:5173
```

---

# 🏗 Build for Production

```
npm run build
```

Preview production build:

```
npm run preview
```

---

# 🔐 Authentication

Authentication is handled using **JWT tokens**.

Flow:

1. User logs in
2. Server returns token
3. Token stored in client store
4. Token sent in `Authorization` header

Example:

```
Authorization: Bearer <token>
```

---

# 📡 Real-time Communication

The platform uses **Socket.IO** for:

- Live answers
- Leaderboard updates
- Event finish notifications
- Manager monitoring

Socket connection example:

```javascript
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL);
```

---

# 📱 Join Competition

Users can join competitions using:

- **QR Code**
- **Join Link**

Example route:

```
/join/:joinCode
```

---

# 👨‍💻 Admin Panel

Admins can:

- Manage users
- Create competitions
- Monitor live events
- View results
- Control event lifecycle

---

# 🧪 Development Mode

Some features are visible only in development:

```
import.meta.env.VITE_NODE_ENV === "development"
```

Used for:

- Manual join links
- Debug tools
- Development UI elements

---

# 📷 QR Code Feature

Each event generates a **QR Code** for easy joining.

Users can:

- Scan QR code
- Download QR code image
- Open manual join link

---

# 🏆 Leaderboard

Leaderboard updates in **real time**:

Sorting priority:

1. Highest score
2. Lowest answer time

---

# 🧹 Code Quality

Recommended tools:

```
ESLint
Prettier
```

---

# 📄 License

MIT License

---

# 👤 Author

Feruz Atamyradow
