# Togetherwise

A full-stack community empowerment platform built with the **MERN stack** (MongoDB, Express, React, Node.js) and Tailwind CSS.

## 🌐 Live Features

- **7 public pages**: Home, Campaigns, Success Stories, About Us, Donate, Transparency, Volunteer
- **Admin portal** at `/admin` with dashboard, project management, and media uploads
- **JWT authentication** with HttpOnly cookies
- **Recharts** data visualizations (Donation Allocation, Financial Overview)
- **Tailwind CSS** with custom Deep Forest Green + Vibrant Lime palette

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/togetherwise.git
cd togetherwise
```

### 2. Set up the Backend
```bash
cd server
cp .env.example .env       # Fill in your values (MongoDB URI, JWT secret)
npm install
npm run dev                # Starts on http://localhost:5000
```

### 3. Seed the Admin User (first time only)
```bash
cd server
npm run seed
# Default: ***********
```

### 4. Set up the Frontend
```bash
cd client
npm install
npm run dev                # Starts on http://localhost:5173
```

## 📁 Project Structure
```
togetherwise/
├── server/                 # Express API
│   ├── config/db.js        # MongoDB connection
│   ├── controllers/        # Route handlers
│   ├── middleware/         # JWT auth + admin guards
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   ├── seed/adminSeed.js   # Default admin creator
│   └── server.js           # Entry point
│
└── client/                 # React + Vite frontend
    └── src/
        ├── api/            # Axios instance
        ├── components/     # Navbar, Footer, Privacy Modal
        ├── context/        # Auth context
        └── pages/          # All page components
```

## 🔐 Environment Variables

Copy `server/.env.example` → `server/.env` and fill in:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string (min 32 chars) |
| `JWT_EXPIRES_IN` | Token lifetime e.g. `7d` |
| `PORT` | API port (default: 5000) |
| `CLIENT_URL` | React app URL (default: http://localhost:5173) |

## 🤝 Collaboration

See [CONTRIBUTING.md](CONTRIBUTING.md) for the branching strategy and PR workflow.

## 📞 Contact

**Email:** shamalsathsara4@gmail.com
**Phone:** +94 72 357 7818 
**Address:** No 349/07/A Palanwatta, Pannipitiya, Sri Lanka
