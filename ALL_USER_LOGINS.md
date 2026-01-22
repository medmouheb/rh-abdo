# 🔐 ALL USER LOGIN CREDENTIALS

## 🎯 Quick Reference

**IMPORTANT:** All users share the same password: `password123`

---

## 📋 COMPLETE USER LIST (8 Users)

### 🔵 TEST USERS (Simple Testing)

#### 1️⃣ RH User (Human Resources)
```
Username: rh_user
Password: password123
Role:     RH
Access:   Full HR access (create/edit, no delete)
```

#### 2️⃣ Manager User
```
Username: manager_user
Password: password123
Role:     Manager
Access:   Limited (view/edit only, no create/delete)
```

#### 3️⃣ CO User (Chief Officer - Admin)
```
Username: co_user
Password: password123
Role:     CO
Access:   Full admin access (all permissions)
```

---

### 🟢 REAL USERS (From Recruitment System)

#### 4️⃣ SAADANI HIBA (RH)
```
Username:   hiba.saadani
Password:   password123
Role:       RH
Department: RH
Email:      hiba.saadani@company.com
```

#### 5️⃣ MOHAMED AYMEN BACOUCHE (Manager)
```
Username:   aymen.bacouche
Password:   password123
Role:       Manager
Department: Production
Email:      aymen@company.com
```

#### 6️⃣ Zoubaier Berrebeh (CO)
```
Username:   zoubaier.berrebeh
Password:   password123
Role:       CO
Department: Méthode & Indus
Email:      zoubaier@company.com
```

#### 7️⃣ Ahmed Ben Ali (CO)
```
Username:   ahmed.benali
Password:   password123
Role:       CO
Department: Finance
Email:      ahmed@company.com
```

#### 8️⃣ Leila Mansouri (Manager)
```
Username:   leila.mansouri
Password:   password123
Role:       Manager
Department: Qualité
Email:      leila.mansouri@company.com
```

---

## 📊 USERS BY ROLE

### RH Role (2 users)
- `rh_user` / `password123`
- `hiba.saadani` / `password123`

### Manager Role (3 users)
- `manager_user` / `password123`
- `aymen.bacouche` / `password123`
- `leila.mansouri` / `password123`

### CO Role (3 users)
- `co_user` / `password123`
- `zoubaier.berrebeh` / `password123`
- `ahmed.benali` / `password123`

---

## 🎭 ROLE PERMISSIONS

### 🔵 RH Role
✅ View Dashboard
✅ View, Create, Edit Hiring Requests
✅ View, Create, Edit Candidates
✅ View, Create, Edit Vacant Positions
✅ View, Manage Calendar
✅ View Settings (read-only)
✅ View, Create, Edit Employees
❌ Cannot Delete records
❌ Cannot Manage Settings

### 🟡 Manager Role
✅ View Dashboard
✅ View, Create, Edit Hiring Requests
✅ View, Edit Candidates (❌ Cannot Create)
✅ View, Edit Vacant Positions (❌ Cannot Create)
✅ View Calendar (❌ Cannot Manage)
✅ View, Edit Employees (❌ Cannot Create)
❌ Cannot Access Settings
❌ Cannot Delete records

### 🟢 CO Role (Admin)
✅ Full access to all features
✅ View, Create, Edit, Delete all records
✅ Manage Settings
✅ Full administrative access

---

## 🚀 HOW TO LOGIN

1. Open: http://localhost:3000/auth/sign-in
2. Enter any username from the list above
3. Enter password: `password123`
4. Click "Sign In"

---

## 🧪 TESTING DIFFERENT ROLES

### Test RH Access:
```
Login: rh_user / password123
Test: Create hiring request, add candidate, view all pages
```

### Test Manager Access:
```
Login: manager_user / password123
Test: Try to create candidate (should fail), edit existing records
```

### Test Admin Access:
```
Login: co_user / password123
Test: Full access to all features, can delete records
```

---

## 🔧 CREATE USERS (If Not Already Created)

Run this command to create all users:
```bash
npm run seed:users
```

Or:
```bash
npx tsx src/lib/seed-users.ts
```

---

## 📝 QUICK COPY-PASTE CREDENTIALS

For quick testing, copy and paste these:

**RH User:**
```
rh_user
password123
```

**Manager User:**
```
manager_user
password123
```

**Admin User:**
```
co_user
password123
```

**Real RH User:**
```
hiba.saadani
password123
```

**Real Manager:**
```
aymen.bacouche
password123
```

**Real Admin:**
```
zoubaier.berrebeh
password123
```

---

## 🎯 RECOMMENDED TESTING ORDER

1. **Start with Admin** (`co_user`) - See all features
2. **Test RH** (`rh_user`) - See HR-specific access
3. **Test Manager** (`manager_user`) - See limited access
4. **Try Real Users** - Test with actual names

---

## 📌 IMPORTANT NOTES

- ⚠️ All users have the same password: `password123`
- 🔒 In production, use strong, unique passwords
- 🔑 Passwords are hashed with bcrypt (10 salt rounds)
- 👥 Total: 8 users (3 test + 5 real)
- 🌐 Login URL: http://localhost:3000/auth/sign-in

---

**Happy Testing! 🎉**
