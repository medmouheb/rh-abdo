# 🧪 Complete Testing Workflow - RH Platform

## ✅ Current Status

Your RH Platform is **FULLY OPERATIONAL**:
- ✅ Frontend & Backend: Running on `http://localhost:3000`
- ✅ Prisma Studio: Running on `http://localhost:5555`
- ✅ User Credentials Page: Opened in browser
- ✅ 8 Test Users: Ready to use
- ✅ All APIs: Configured and ready

---

## 📋 Step-by-Step Testing Guide

### **PHASE 1: Verify User Access** (15 minutes)

#### Test 1: Admin Access (CO Role)
1. Open: `http://localhost:3000/auth/sign-in`
2. Login with:
   ```
   Username: co_user
   Password: password123
   ```
3. **Expected Result:**
   - ✅ Login successful
   - ✅ See ALL sidebar sections (Main Menu, Recruitment, Administration, Settings)
   - ✅ Dashboard loads with data
   - ✅ Can access Users page
   - ✅ Can access all features

#### Test 2: RH Access
1. Logout (or open incognito window)
2. Login with:
   ```
   Username: rh_user
   Password: password123
   ```
3. **Expected Result:**
   - ✅ Login successful
   - ✅ See Main Menu + Recruitment sections
   - ✅ Can create hiring requests
   - ✅ Can create candidates
   - ❌ Cannot access Users/Settings (should be hidden)

#### Test 3: Manager Access
1. Logout (or open incognito window)
2. Login with:
   ```
   Username: manager_user
   Password: password123
   ```
3. **Expected Result:**
   - ✅ Login successful
   - ✅ Limited sidebar access
   - ✅ Can view hiring requests
   - ✅ Can edit existing records
   - ❌ Cannot create new candidates
   - ❌ Cannot delete records

---

### **PHASE 2: Test All Pages** (20 minutes)

Login as **co_user** (admin) to access all pages:

#### Main Menu
- [ ] **Dashboard** (`/`)
  - Check: Statistics display correctly
  - Check: Charts render properly
  - Check: Recent activities show

- [ ] **Calendar** (`/calendar`)
  - Check: Calendar view loads
  - Check: Can view events
  - Check: Navigation works

#### Recruitment Section
- [ ] **Recruitment Dashboard** (`/recruitment`)
  - Check: Recruitment metrics display
  - Check: Charts and statistics load

- [ ] **Hiring Requests List** (`/hiring-requests`)
  - Check: Table displays hiring requests
  - Check: Filters work
  - Check: Search functionality
  - Check: Can click to view details

- [ ] **Create Hiring Request** (`/hiring-requests/create`)
  - Check: Form displays correctly
  - Check: All fields are present
  - Check: Can fill out form
  - Try: Submit a test request

- [ ] **Candidates List** (`/candidates`)
  - Check: Table displays candidates
  - Check: Filters work
  - Check: Status badges display
  - Check: Can view candidate details

- [ ] **Create Candidate** (`/candidates/create`)
  - Check: Form displays correctly
  - Check: File upload works
  - Try: Create a test candidate

- [ ] **Vacant Positions** (`/vacant-positions`)
  - Check: Table displays positions
  - Check: Filters work
  - Check: Can assign candidates

#### Administration
- [ ] **Users** (`/users`)
  - Check: User list displays
  - Check: Can view all 8 users
  - Check: Can edit user details
  - Try: Create a new user

- [ ] **Departments** (`/departments`)
  - Check: Department list displays
  - Check: Can view department details

---

### **PHASE 3: Test APIs** (15 minutes)

#### Using Browser DevTools
1. Open DevTools (F12)
2. Go to **Network** tab
3. Navigate through pages
4. Check API calls:
   - ✅ Status 200 for successful requests
   - ✅ Status 401 for unauthorized
   - ✅ Data returns correctly

#### Using PowerShell
```powershell
# Test Login API
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"username":"co_user","password":"password123"}'

# Test Candidates API (after login)
Invoke-RestMethod -Uri "http://localhost:3000/api/candidates"

# Test Hiring Requests API
Invoke-RestMethod -Uri "http://localhost:3000/api/hiring-requests"
```

#### Using the Test Script
```bash
.\test-apis.bat
```

---

### **PHASE 4: Test User Roles** (20 minutes)

#### Test RH User Permissions
Login as: `hiba.saadani` / `password123`

**Should be able to:**
- ✅ Create hiring requests
- ✅ Create candidates
- ✅ Edit hiring requests
- ✅ Edit candidates
- ✅ View all recruitment data

**Should NOT be able to:**
- ❌ Delete records
- ❌ Access Users page
- ❌ Access Settings
- ❌ Manage system settings

#### Test Manager Permissions
Login as: `aymen.bacouche` / `password123`

**Should be able to:**
- ✅ View hiring requests
- ✅ Edit hiring requests
- ✅ View candidates
- ✅ Edit candidates

**Should NOT be able to:**
- ❌ Create new candidates
- ❌ Delete records
- ❌ Access Users page
- ❌ Access Settings

#### Test CO/Admin Permissions
Login as: `zoubaier.berrebeh` / `password123`

**Should be able to:**
- ✅ Full access to all features
- ✅ Create/Edit/Delete all records
- ✅ Access Users page
- ✅ Access Settings
- ✅ Manage system

---

### **PHASE 5: Test Functionality** (30 minutes)

#### Create a Complete Workflow
1. **Login as RH** (`rh_user`)
2. **Create a Hiring Request:**
   - Go to `/hiring-requests/create`
   - Fill in all fields
   - Submit
   - Verify it appears in the list

3. **Create a Candidate:**
   - Go to `/candidates/create`
   - Fill in candidate details
   - Upload CV (if available)
   - Submit
   - Verify it appears in the list

4. **Link Candidate to Request:**
   - Go to vacant positions
   - Assign the candidate
   - Verify the assignment

5. **Schedule Interview:**
   - Open candidate details
   - Click "Schedule Interview"
   - Fill in interview details
   - Save

6. **Update Candidate Status:**
   - Change candidate status
   - Add notes
   - Verify status history updates

---

### **PHASE 6: Test Database** (10 minutes)

#### Using Prisma Studio
1. Open: `http://localhost:5555`
2. Check tables:
   - [ ] **User** - Should have 8 users
   - [ ] **HiringRequest** - Check existing requests
   - [ ] **Candidate** - Check existing candidates
   - [ ] **Interview** - Check scheduled interviews
   - [ ] **Department** - Check departments

3. Try editing a record:
   - Select a user
   - Edit a field
   - Save
   - Verify change in app

---

## 🐛 Common Issues & Solutions

### Issue: Login fails
**Solution:**
- Verify users exist in database (check Prisma Studio)
- Run: `npm run seed:users`
- Check password is exactly: `password123`

### Issue: Page returns 404
**Solution:**
- Verify `npm run dev` is running
- Check URL is correct
- Clear browser cache

### Issue: API returns 401
**Solution:**
- Make sure you're logged in
- Check authentication token
- Try logging out and back in

### Issue: Sidebar doesn't show all pages
**Solution:**
- Check user role (different roles see different pages)
- Login as `co_user` to see all pages
- Check `ROLE_BASED_ACCESS_CONTROL.md`

### Issue: Data doesn't load
**Solution:**
- Check browser console for errors
- Check Network tab in DevTools
- Verify database has data
- Run seed script if needed

---

## 📊 Testing Checklist Summary

### Users Tested (8 total)
- [ ] co_user (Admin)
- [ ] rh_user (RH)
- [ ] manager_user (Manager)
- [ ] hiba.saadani (RH)
- [ ] aymen.bacouche (Manager)
- [ ] zoubaier.berrebeh (CO)
- [ ] ahmed.benali (CO)
- [ ] leila.mansouri (Manager)

### Pages Tested (11 total)
- [ ] Dashboard
- [ ] Calendar
- [ ] Recruitment Dashboard
- [ ] Hiring Requests List
- [ ] Create Hiring Request
- [ ] Candidates List
- [ ] Create Candidate
- [ ] Vacant Positions
- [ ] Users
- [ ] Departments
- [ ] Sign In

### APIs Tested (19 total)
- [ ] Login API
- [ ] Candidates APIs (4)
- [ ] Hiring Requests APIs (5)
- [ ] Employees APIs (2)
- [ ] Interviews APIs (3)
- [ ] Notifications APIs (2)
- [ ] Vacant Positions API (1)
- [ ] Upload API (1)

### Features Tested
- [ ] User authentication
- [ ] Role-based access control
- [ ] Create hiring request
- [ ] Create candidate
- [ ] Schedule interview
- [ ] Update candidate status
- [ ] File upload
- [ ] Search/Filter
- [ ] Dark mode toggle
- [ ] Sidebar navigation
- [ ] User profile display

---

## 🎯 Quick Access Links

- **Application**: http://localhost:3000
- **Login Page**: http://localhost:3000/auth/sign-in
- **Prisma Studio**: http://localhost:5555
- **User Credentials**: file:///c:/Users/Abderrahmen/rh-abdo/user-credentials.html

---

## 📚 Documentation Files

All documentation is in your project root:
- `ALL_USER_LOGINS.md` - Complete user credentials
- `USER_LOGINS.txt` - Simple text format
- `user-credentials.html` - Interactive HTML page
- `API_TESTING_GUIDE.md` - Complete API documentation
- `QUICK_START_TESTING.md` - Quick start guide
- `SITEMAP.txt` - Visual sitemap
- `test-apis.bat` - Automated API test script

---

## ⏱️ Estimated Testing Time

- **Quick Test** (all pages): 15-20 minutes
- **Thorough Test** (all features): 1-2 hours
- **Complete Test** (all users + APIs): 2-3 hours

---

## 🎉 You're Ready to Test!

**Recommended Order:**
1. Open `user-credentials.html` (already opened)
2. Open `http://localhost:3000/auth/sign-in`
3. Start with `co_user` to see everything
4. Follow Phase 1-6 above
5. Use the checklists to track progress

**Happy Testing! 🚀**
