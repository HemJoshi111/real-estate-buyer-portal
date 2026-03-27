<h1>
	<img src="client/favicon.svg" alt="EstateHub" width="28" valign="middle" />
	Real Estate Buyer Portal
</h1>

A full-stack buyer portal for real-estate users to register, login, browse property listings, and manage personal favourites.

Repository: [HemJoshi111/real-estate-buyer-portal](https://github.com/HemJoshi111/real-estate-buyer-portal)

## Overview

This project implements a practical buyer workflow with secure authentication and a personalized dashboard:

- User signup and login with JWT-based authentication
- Protected dashboard with buyer profile context
- Property catalog and personal favourites management
- Add/remove favourite actions with per-user ownership enforcement
- Modern responsive UI for auth, listing cards, and property detail modal

## Key Features

### Authentication
- Register with `name`, `email`, and `password`
- Login with email and password
- Password hashing via `bcryptjs` (no plain-text password storage)
- JWT token generation and protected API middleware
- Client-side auth persistence and logout flow

### Buyer Dashboard
- Personalized greeting with user name and role
- Sticky sidebar menu (`Home`, `My Favorites`)
- Property cards with favourite toggles
- Popup/modal property detail view
- Toast notifications for add/remove favourite and errors

### Favourites
- Toggle favourite on any property
- "My Favorites" view filtered per authenticated user
- Backend checks ensure users only access/modify their own favourites

## Tech Stack

### Frontend
- React + Vite
- React Router
- Tailwind CSS
- Lucide React icons

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)

## Project Structure

```text
buyer-portal/
├── client/                  # React frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── pages/
│   └── package.json
├── server/                  # Express API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── package.json
└── README.md
```

## Getting Started (from GitHub)

## 1. Clone the repository

```bash
git clone https://github.com/HemJoshi111/real-estate-buyer-portal.git
cd real-estate-buyer-portal
```

## 2. Install dependencies

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

## 3. Configure environment variables (Backend)

Inside `server/`, create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Notes:
- Use a strong `JWT_SECRET` value.
- Ensure your MongoDB connection is accessible from your machine.

## 4. Seed sample property data (optional)

```bash
cd server
npm run seed
```

## 5. Run the backend

```bash
cd server
npm run dev
```

Backend runs at: `http://localhost:5000`

## 6. Run the frontend

Open a new terminal:

```bash
cd client
npm run dev
```

Frontend runs at: `http://localhost:5173`

## 7. Open in browser

Go to:

`http://localhost:5173`

## Available Scripts

### Backend (`server/`)
- `npm run dev` - Start server with nodemon
- `npm start` - Start server with node
- `npm run seed` - Seed property data

### Frontend (`client/`)
- `npm run dev` - Start Vite dev server
- `npm run build` - Build production assets
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Summary

Base URL: `http://localhost:5000/api`

### User Routes
- `POST /users/register` - Register new user
- `POST /users/login` - Login user
- `GET /users/profile` - Get authenticated profile (protected)
- `POST /users/logout` - Logout endpoint (protected)

### Property Routes
- `GET /properties` - Get all properties
- `GET /properties/:id` - Get property details

### Favourite Routes
- `GET /favorites/my` - Get current user's favourites (protected)
- `POST /favorites/toggle` - Add/remove favourite (protected)

## Example End-to-End Flow

1. Open app on `http://localhost:5173`
2. Sign up with name, email, password
3. Login and access dashboard
4. Browse properties under `Home`
5. Click heart icon to add/remove favourites
6. Open `My Favorites` to view only saved properties
7. Open card modal for full property details
8. Logout from dashboard

## Screenshots (Current UI)

### Login

![Login Page](docs/login.png)

### Signup

![Signup Page](docs/signup.png)

### Dashboard (Home)

![Dashboard Home](docs/dashboard.png)

### Dashboard (My Favorites)

![Dashboard Favorites](docs/favorites.png)

### Property Details Modal

![Property Details Modal](docs/details.png)

## Security Notes

- Passwords are hashed before saving (`bcryptjs`)
- JWT is used for protected route authorization
- User-specific favourites are enforced server-side using authenticated user context

## Troubleshooting

### Frontend cannot connect to backend
- Verify backend is running on port `5000`
- Verify frontend API base URL in `client/src/api/api.js`
- Check CORS settings in backend

### Mongo connection issue
- Validate `MONGO_URI` in `server/.env`
- Confirm network/IP access if using MongoDB Atlas

### Invalid token / unauthorized errors
- Re-login to refresh token
- Ensure `Authorization: Bearer <token>` is sent for protected endpoints

## Author

Developed by Er. Hem Joshi.

