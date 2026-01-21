# Quick Start Guide

## Backend Setup & Testing

### 1. Install MongoDB

If you don't have MongoDB installed:

**Option A: Install MongoDB Community Edition Locally**
- Download from https://www.mongodb.com/try/download/community
- Install and start MongoDB service

**Option B: Use MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string and update `.env`: `MONGODB_URI=mongodb+srv://...`

### 2. Start MongoDB (if local)

```powershell
# Start MongoDB service (Windows)
net start MongoDB

# Or use MongoDB Compass to start it
```

### 3. Install Backend Dependencies  

```powershell
cd backend
cmd /c npm install
```

### 4. Seed the Database

```powershell
cmd /c npm run seed
```

This creates three default users:
- **RH**: `admin` / `admin123`
- **Manager**: `manager1` / `manager123`
- **Directeur**: `directeur1` / `directeur123`

### 5. Start Backend Server

```powershell
cmd /c npm run dev
```

The backend will start on http://localhost:5000

### 6. Test the API

**Test health endpoint:**
```powershell
curl http://localhost:5000/health
```

**Test login:**
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"admin123"}'
```

## Next Steps - Frontend Integration

After backend is running, update the frontend to use the backend API:

1. Add axios to frontend (if not already):
```powershell
cmd /c npm install axios
```

2. Update `.env` in frontend root:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. Create API client in `src/lib/api.ts`

4. Replace Prisma calls with API calls

5. Update authentication to use HTTP-only cookies

## Common Issues

### PowerShell Script Execution Error

If you get "running scripts is disabled", use `cmd /c` prefix:
```powershell
cmd /c npm run dev
```

### MongoDB Connection Error

- Ensure MongoDB is running
- Check MONGODB_URI in `.env`
- For Atlas, ensure your IP is whitelisted

### CORS Error

- Ensure FRONTEND_URL in backend `.env` matches your frontend URL
- Default is `http://localhost:3000`

## Project Structure

```
backend/
├── src/
│   ├── config/         # Database config
│   ├── controllers/    # Business logic  
│   ├── middleware/     # Auth, roles, errors
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── utils/          # Helpers, JWT
│   └── server.ts       # Main entry point
└── uploads/            # File uploads
```
