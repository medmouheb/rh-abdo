# 🚀 Quick Reference - Running the Application

## Option 1: Docker (Recommended for Web App)

### Start Everything
```powershell
docker-compose up --build
```

### Seed Database (First Time)
```powershell
docker-compose exec backend npm run seed
```

### Access
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Stop
```powershell
docker-compose down
```

---

## Option 2: Local Development

### Prerequisites
- MongoDB installed and running
- Node.js 18+

### Backend
```powershell
cd backend
cmd /c npm install
cmd /c npm run seed      # First time only
cmd /c npm run dev
```

### Frontend (Web)
```powershell
cmd /c npm install
cmd /c npm run dev
```

### Frontend (Electron Desktop)
```powershell
cmd /c npm install
cmd /c npm run electron:dev
```

---

## Default Users

| Username    | Password      | Role      |
|-------------|---------------|-----------|
| admin       | admin123      | rh        |
| manager1    | manager123    | manager   |
| directeur1  | directeur123  | directeur |

---

## Useful Commands

### Docker
```powershell
# View logs
docker-compose logs -f backend

# Restart service
docker-compose restart backend

# Clean everything
docker-compose down -v
```

### Backend (Local)
```powershell
cd backend
cmd /c npm run dev     # Development
cmd /c npm run build   # Build
cmd /c npm start       # Production
```

### Frontend (Local)
```powershell
cmd /c npm run dev          # Next.js dev
cmd /c npm run electron:dev # Electron dev
cmd /c npm run build        # Build
```

---

## Troubleshooting

**Port in use?**
```powershell
# Stop all Docker containers
docker-compose down
```

**MongoDB issues?**
```powershell
# Check MongoDB is running
docker-compose ps
```

**Need clean start?**
```powershell
docker-compose down -v
docker-compose up --build
```

---

## Architecture

```
┌─────────────────┐
│   Frontend      │  :3000
│   (Next.js)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Backend       │  :5000
│   (Express)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   MongoDB       │  :27017
└─────────────────┘
```

**Note:** Electron (desktop) mode doesn't work in Docker. Use local development for desktop app.
