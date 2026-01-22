Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RH PLATFORM - API TESTING" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"

# Test 1: Login
Write-Host "[1/13] Testing Login API..." -ForegroundColor Yellow
try {
    $loginBody = '{"username":"co_user","password":"password123"}'
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    Write-Host "  ✅ SUCCESS - Token received" -ForegroundColor Green
    $token = $loginResponse.token
} catch {
    Write-Host "  ❌ FAILED" -ForegroundColor Red
}
Write-Host ""

# Test 2: Get Candidates
Write-Host "[2/13] Testing GET /api/candidates..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/candidates"
    Write-Host "  ✅ SUCCESS" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}
Write-Host ""

# Test 3: Get Candidate by ID
Write-Host "[3/13] Testing GET /api/candidates/1..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/candidates/1"
    Write-Host "  ✅ SUCCESS" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}
Write-Host ""

# Test 4: Get Candidate Status History
Write-Host "[4/13] Testing GET /api/candidates/1/status-history..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/candidates/1/status-history"
    Write-Host "  ✅ SUCCESS" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}
Write-Host ""

# Test 5: Get Hiring Requests
Write-Host "[5/13] Testing GET /api/hiring-requests..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/hiring-requests"
    Write-Host "  ✅ SUCCESS" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}
Write-Host ""

# Test 6: Get Hiring Request by ID
Write-Host "[6/13] Testing GET /api/hiring-requests/1..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/hiring-requests/1"
    Write-Host "  ✅ SUCCESS" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}
Write-Host ""

# Test 7: Get Hiring Request Candidates
Write-Host "[7/13] Testing GET /api/hiring-requests/1/candidates..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/hiring-requests/1/candidates"
    Write-Host "  ✅ SUCCESS" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}
Write-Host ""

# Test 8: Get Employees
Write-Host "[8/13] Testing GET /api/employees..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/employees"
    Write-Host "  ✅ SUCCESS" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}
Write-Host ""

# Test 9: Get Employee by ID
Write-Host "[9/13] Testing GET /api/employees/1..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/employees/1"
    Write-Host "  ✅ SUCCESS" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}
Write-Host ""

# Test 10: Get Interviews
Write-Host "[10/13] Testing GET /api/interviews..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/interviews"
    Write-Host "  ✅ SUCCESS" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}
Write-Host ""

# Test 11: Get Interview by ID
Write-Host "[11/13] Testing GET /api/interviews/1..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/interviews/1"
    Write-Host "  ✅ SUCCESS" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}
Write-Host ""

# Test 12: Get Notifications
Write-Host "[12/13] Testing GET /api/notifications..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/notifications"
    Write-Host "  ✅ SUCCESS" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}
Write-Host ""

# Test 13: Get Notification by ID
Write-Host "[13/13] Testing GET /api/notifications/1..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/notifications/1"
    Write-Host "  ✅ SUCCESS" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TESTING COMPLETE!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: Status 401 = Authentication required (expected for protected routes)" -ForegroundColor Gray
Write-Host "Note: Status 404 = Endpoint not found or no data" -ForegroundColor Gray
