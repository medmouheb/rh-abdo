# 🎯 Quick Start Guide - Testing Your RH Platform

## ✅ Current Status

Your application is **RUNNING** successfully!
- ✅ Frontend & Backend Server: `http://localhost:3000`
- ✅ Process ID: 18952
- ✅ Running for: 4+ hours

---

## 🌐 Access Your Application

### Open in Browser:
```
http://localhost:3000
```

### Login Credentials:
- **Username**: `admin`
- **Password**: `admin123`

---

## 📱 All Available Pages in Sidebar

### MAIN MENU
1. **Dashboard** - Vue d'ensemble
   - URL: `http://localhost:3000/`
   
2. **Calendar**
   - URL: `http://localhost:3000/calendar`

### RECRUITMENT
3. **Tableau de Bord** (Recruitment Dashboard)
   - URL: `http://localhost:3000/recruitment`

4. **Demandes d'Embauche** (Hiring Requests)
   - Liste des demandes: `http://localhost:3000/hiring-requests`
   - Créer une demande: `http://localhost:3000/hiring-requests/create`

5. **Candidatures** (Candidates)
   - Liste des candidats: `http://localhost:3000/candidates`
   - Nouvelle candidature: `http://localhost:3000/candidates/create`

6. **Positions Vacantes** (Vacant Positions)
   - URL: `http://localhost:3000/vacant-positions`

### ADMINISTRATION
7. **Utilisateurs** (Users)
   - URL: `http://localhost:3000/users`

8. **Départements** (Departments)
   - URL: `http://localhost:3000/departments`

### SETTINGS
9. **Authentication**
   - Sign In: `http://localhost:3000/auth/sign-in`

---

## 🧪 Testing Checklist

### Frontend Testing (in Browser)
- [ ] Login page works
- [ ] Dashboard loads
- [ ] Calendar page displays
- [ ] Recruitment dashboard shows data
- [ ] Hiring requests list loads
- [ ] Can create new hiring request
- [ ] Candidates list displays
- [ ] Can create new candidate
- [ ] Vacant positions table shows
- [ ] Users management page works
- [ ] Departments page loads
- [ ] Sidebar navigation works
- [ ] Dark mode toggle works
- [ ] User profile displays correctly

### API Testing (see API_TESTING_GUIDE.md)
- [ ] Login API (`POST /api/auth/login`)
- [ ] Get Candidates (`GET /api/candidates`)
- [ ] Get Hiring Requests (`GET /api/hiring-requests`)
- [ ] Get Employees (`GET /api/employees`)
- [ ] Get Interviews (`GET /api/interviews`)
- [ ] Get Notifications (`GET /api/notifications`)
- [ ] Create Candidate (`POST /api/candidates`)
- [ ] Create Hiring Request (`POST /api/hiring-requests`)
- [ ] Upload files (`POST /api/upload/[id]/[type]`)

---

## 🚀 Quick Test Commands

### Test APIs from Command Line:
```bash
# Run the automated test script
.\test-apis.bat
```

### Or test individually:
```powershell
# Test Login
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"admin","password":"admin123"}'

# Test Candidates (may need auth token)
Invoke-RestMethod -Uri "http://localhost:3000/api/candidates"

# Test Hiring Requests
Invoke-RestMethod -Uri "http://localhost:3000/api/hiring-requests"
```

---

## 📚 Additional Resources

- **API Testing Guide**: `API_TESTING_GUIDE.md` - Complete API documentation
- **Test Users**: `TEST_USERS.md` - All available test accounts
- **Login Credentials**: `LOGIN_CREDENTIALS.md` - Authentication details
- **Animations Guide**: `ANIMATIONS_GUIDE.md` - UI animations documentation
- **Role-Based Access**: `ROLE_BASED_ACCESS_CONTROL.md` - Permission system

---

## 🔧 Troubleshooting

### If pages don't load:
1. Check that `npm run dev` is running
2. Verify port 3000 is accessible
3. Check browser console for errors
4. Clear browser cache and reload

### If APIs return 401:
1. Make sure you're logged in
2. Check if authentication token is valid
3. Some APIs require specific user roles

### If sidebar doesn't show all pages:
1. Check your user role (different roles see different pages)
2. Login as admin to see all pages
3. Check `ROLE_BASED_ACCESS_CONTROL.md` for permissions

---

## 📝 Next Steps

1. **Open the application**: Navigate to `http://localhost:3000`
2. **Login**: Use admin/admin123
3. **Explore each page**: Click through all sidebar items
4. **Test functionality**: Try creating, editing, viewing data
5. **Check APIs**: Use the test script or Postman
6. **Report issues**: Note any errors or missing features

---

## 💡 Tips

- Use **Chrome DevTools** (F12) to inspect network requests
- Check the **Console** tab for JavaScript errors
- Use the **Network** tab to see API calls
- The sidebar collapses on desktop (click the arrow to expand/collapse)
- Dark mode toggle is in the header
- User info is displayed in the sidebar

---

**Happy Testing! 🎉**
