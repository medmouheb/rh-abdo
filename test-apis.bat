@echo off
echo ========================================
echo Testing RH Platform APIs
echo ========================================
echo.

echo [1/5] Testing Login API...
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
echo.
echo.

echo [2/5] Testing Candidates API...
curl http://localhost:3000/api/candidates
echo.
echo.

echo [3/5] Testing Hiring Requests API...
curl http://localhost:3000/api/hiring-requests
echo.
echo.

echo [4/5] Testing Employees API...
curl http://localhost:3000/api/employees
echo.
echo.

echo [5/5] Testing Notifications API...
curl http://localhost:3000/api/notifications
echo.
echo.

echo ========================================
echo API Testing Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Open http://localhost:3000 in your browser
echo 2. Login with admin/admin123
echo 3. Navigate through all sidebar pages
echo.
pause
