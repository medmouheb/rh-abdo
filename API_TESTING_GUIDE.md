# 🧪 API Testing Guide - RH Platform

## 📍 Base URL
```
http://localhost:3000
```

---

## 🔐 Authentication APIs

### 1. Login
**POST** `/api/auth/login`
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Test with cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

---

## 👥 Candidates APIs

### 2. Get All Candidates
**GET** `/api/candidates`

**Test with cURL:**
```bash
curl http://localhost:3000/api/candidates
```

### 3. Get Candidate by ID
**GET** `/api/candidates/[id]`

**Test with cURL:**
```bash
curl http://localhost:3000/api/candidates/1
```

### 4. Create Candidate
**POST** `/api/candidates`

**Test with cURL:**
```bash
curl -X POST http://localhost:3000/api/candidates \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@example.com\"}"
```

### 5. Get Candidate Status History
**GET** `/api/candidates/[id]/status-history`

**Test with cURL:**
```bash
curl http://localhost:3000/api/candidates/1/status-history
```

---

## 📝 Hiring Requests APIs

### 6. Get All Hiring Requests
**GET** `/api/hiring-requests`

**Test with cURL:**
```bash
curl http://localhost:3000/api/hiring-requests
```

### 7. Get Hiring Request by ID
**GET** `/api/hiring-requests/[id]`

**Test with cURL:**
```bash
curl http://localhost:3000/api/hiring-requests/1
```

### 8. Create Hiring Request
**POST** `/api/hiring-requests`

**Test with cURL:**
```bash
curl -X POST http://localhost:3000/api/hiring-requests \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Software Engineer\",\"department\":\"IT\"}"
```

### 9. Get Candidates for Hiring Request
**GET** `/api/hiring-requests/[id]/candidates`

**Test with cURL:**
```bash
curl http://localhost:3000/api/hiring-requests/1/candidates
```

### 10. Get Specific Candidate for Hiring Request
**GET** `/api/hiring-requests/[id]/candidates/[candidateId]`

**Test with cURL:**
```bash
curl http://localhost:3000/api/hiring-requests/1/candidates/1
```

---

## 👨‍💼 Employees APIs

### 11. Get All Employees
**GET** `/api/employees`

**Test with cURL:**
```bash
curl http://localhost:3000/api/employees
```

### 12. Get Employee by ID
**GET** `/api/employees/[id]`

**Test with cURL:**
```bash
curl http://localhost:3000/api/employees/1
```

---

## 📅 Interviews APIs

### 13. Get All Interviews
**GET** `/api/interviews`

**Test with cURL:**
```bash
curl http://localhost:3000/api/interviews
```

### 14. Get Interview by ID
**GET** `/api/interviews/[id]`

**Test with cURL:**
```bash
curl http://localhost:3000/api/interviews/1
```

### 15. Create Interview
**POST** `/api/interviews`

**Test with cURL:**
```bash
curl -X POST http://localhost:3000/api/interviews \
  -H "Content-Type: application/json" \
  -d "{\"candidateId\":1,\"date\":\"2026-01-25\",\"type\":\"TECHNICAL\"}"
```

---

## 🔔 Notifications APIs

### 16. Get All Notifications
**GET** `/api/notifications`

**Test with cURL:**
```bash
curl http://localhost:3000/api/notifications
```

### 17. Get Notification by ID
**GET** `/api/notifications/[id]`

**Test with cURL:**
```bash
curl http://localhost:3000/api/notifications/1
```

---

## 📊 Vacant Positions APIs

### 18. Assign Candidate to Vacant Position
**POST** `/api/vacant-positions/[id]/assign-candidate`

**Test with cURL:**
```bash
curl -X POST http://localhost:3000/api/vacant-positions/1/assign-candidate \
  -H "Content-Type: application/json" \
  -d "{\"candidateId\":1}"
```

---

## 📤 Upload APIs

### 19. Upload File
**POST** `/api/upload/[id]/[type]`

**Test with cURL:**
```bash
curl -X POST http://localhost:3000/api/upload/1/cv \
  -F "file=@/path/to/file.pdf"
```

---

## 🧪 Testing with Postman

1. **Import Collection**: Create a new Postman collection
2. **Set Base URL**: Use `http://localhost:3000` as base URL
3. **Add Authorization**: If needed, add Bearer token from login response
4. **Test Each Endpoint**: Go through each API listed above

---

## 🌐 Testing in Browser

### Frontend Pages to Test:

1. **Dashboard**: http://localhost:3000/
2. **Calendar**: http://localhost:3000/calendar
3. **Recruitment Dashboard**: http://localhost:3000/recruitment
4. **Hiring Requests List**: http://localhost:3000/hiring-requests
5. **Create Hiring Request**: http://localhost:3000/hiring-requests/create
6. **Candidates List**: http://localhost:3000/candidates
7. **Create Candidate**: http://localhost:3000/candidates/create
8. **Vacant Positions**: http://localhost:3000/vacant-positions
9. **Users**: http://localhost:3000/users
10. **Departments**: http://localhost:3000/departments
11. **Sign In**: http://localhost:3000/auth/sign-in

---

## 📝 Notes

- Make sure `npm run dev` is running in the root directory
- Default port is 3000
- Some APIs may require authentication
- Check the console for any errors
- Use browser DevTools Network tab to inspect API calls

---

## 🔑 Test Credentials

Based on your conversation history, you can use:
- **Username**: admin
- **Password**: admin123

Or check `LOGIN_CREDENTIALS.md` and `TEST_USERS.md` for more test users.
