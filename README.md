# GymFlow ⚡

A high-performance fitness and nutrition tracking dashboard focused on elite UI design and dynamic workout persistence. Built on the PERN stack (MySQL instead of PostgreSQL).

## Features
- **Secure Authentication**: Custom user accounts with salted password hashing (`bcryptjs`) and secure stateless session management (`jsonwebtoken`).
- **Dynamic Nutrition Tracking**: Search real-time food entries via the USDA FoodData Central API. Calculate exact macro portion sizes and permanently save meal logs to your specific user database.
- **Neon-Themed Interactive Dashboard**: Fully responsive dark-mode UI with custom `radial-gradient` JS mouse-tracking elements, staggered letter CSS animations, and floating UI components.
- **Database Persistence**: MySQL backend architecture that tracks `users` and `user_foods` to ensure calories and macronutrient progress rings are always securely saved.

## Tech Stack
**Frontend**: React, Vite, React Router, Lucide Icons, Axios.
**Backend**: Node.js, Express, MySQL2.
**Security**: bcryptjs, jsonwebtoken, cors.

## Installation

### 1. Database Setup
Make sure you have a local MySQL server running. The backend is configured to automatically create the `gymflow` database and tables upon startup.

### 2. Backend Environment
Navigate to the `/backend` directory and add a `.env` file with your config:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=gymflow
PORT=5000
JWT_SECRET=supersecretgymflowkey_123
```

### 3. Start the Servers
Open two separate terminal windows.

**Terminal 1 (Backend API):**
```bash
cd backend
npm install
node server.js
```

**Terminal 2 (Frontend Client):**
```bash
npm install
npm run dev
```

Navigate to `http://localhost:5173` to view the app!
