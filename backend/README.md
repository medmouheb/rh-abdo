# HR Management System Backend

Backend API for the HR Management System built with Node.js, Express, MongoDB, and TypeScript.

## Features

- **Authentication**: JWT-based authentication with HTTP-only cookies
- **Role-Based Access Control**: Three roles (rh, manager, directeur)
- **User Management**: RH can create, update, and delete users
- **Hiring Requests**: Manage hiring requests and recruitment processes
- **Candidates**: Full candidate management with file uploads
- **Interviews**: Schedule and track interviews
- **Notifications**: Real-time notification system

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Seed the database with default users:
```bash
npm run seed
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Default Users

After seeding, you can log in with:

- **RH**: `admin` / `admin123`
- **Manager**: `manager1` / `manager123`
- **Directeur**: `directeur1` / `directeur123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Users (RH only)
- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Hiring Requests
- `POST /api/hiring-requests` - Create
- `GET /api/hiring-requests` - Get all
- `GET /api/hiring-requests/:id` - Get by ID
- `PUT /api/hiring-requests/:id` - Update
- `DELETE /api/hiring-requests/:id` - Delete

### Candidates
- `POST /api/candidates` - Create
- `GET /api/candidates` - Get all
- `GET /api/candidates/:id` - Get by ID
- `PUT /api/candidates/:id` - Update
- `DELETE /api/candidates/:id` - Delete
- `GET /api/candidates/:id/status-history` - Get status history
- `POST /api/candidates/:id/upload` - Upload documents

### Interviews
- `POST /api/interviews` - Create
- `GET /api/interviews` - Get all
- `GET /api/interviews/:id` - Get by ID
- `PUT /api/interviews/:id` - Update
- `DELETE /api/interviews/:id` - Delete

### Notifications
- `POST /api/notifications` - Create
- `GET /api/notifications/me` - Get my notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete

## Security

- Tokens stored in HTTP-only cookies to prevent XSS attacks
- CORS configured for frontend URL only
- Password hashing with bcrypt
- Role-based access control middleware

## File Structure

```
backend/
├── src/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── utils/          # Utilities & helpers
│   └── server.ts       # Express app entry point
├── uploads/            # Uploaded files
├── .env               # Environment variables
├── package.json
└── tsconfig.json
```
