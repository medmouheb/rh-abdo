# 🔐 Login Credentials for All Roles

## Quick Reference

**All users share the same password:** `password123`

---

## 📋 Test Users (Simple)

### 1. RH User (Human Resources)
- **Username:** `rh_user`
- **Password:** `password123`
- **Role:** RH
- **Access:** Full HR access (can create/edit, cannot delete)

### 2. Manager User
- **Username:** `manager_user`
- **Password:** `password123`
- **Role:** Manager
- **Access:** Limited access (view/edit only, cannot create/delete)

### 3. CO User (Chief Officer)
- **Username:** `co_user`
- **Password:** `password123`
- **Role:** CO
- **Access:** Full admin access (all permissions)

---

## 👥 Real Users (from recruitment types)

### 4. SAADANI HIBA (RH)
- **Username:** `hiba.saadani`
- **Password:** `password123`
- **Role:** RH
- **Department:** RH
- **Email:** hiba.saadani@company.com

### 5. MOHAMED AYMEN BACOUCHE (Manager)
- **Username:** `aymen.bacouche`
- **Password:** `password123`
- **Role:** Manager
- **Department:** Production
- **Email:** aymen@company.com

### 6. zoubaier berrebeh (CO)
- **Username:** `zoubaier.berrebeh`
- **Password:** `password123`
- **Role:** CO
- **Department:** Méthode & Indus
- **Email:** zoubaier@company.com

### 7. Ahmed Ben Ali (CO)
- **Username:** `ahmed.benali`
- **Password:** `password123`
- **Role:** CO
- **Department:** Finance
- **Email:** ahmed@company.com

### 8. Leila Mansouri (Manager)
- **Username:** `leila.mansouri`
- **Password:** `password123`
- **Role:** Manager
- **Department:** Qualité
- **Email:** leila.mansouri@company.com

---

## 🚀 How to Create These Users

### Option 1: Quick Seed (Recommended)
```bash
npm run seed:users
```

### Option 2: Full Database Seed
```bash
npx prisma db seed
```

### Option 3: Manual Creation
Use Prisma Studio:
```bash
npx prisma studio
```

Then create users with:
- **username**: (as listed above)
- **password**: (bcrypt hash of `password123`)
- **role**: RH, Manager, or CO

---

## 📊 Role Permissions Summary

### RH Role
✅ View Dashboard  
✅ View, Create, Edit Hiring Requests  
✅ View, Create, Edit Candidates  
✅ View, Create, Edit Vacant Positions  
✅ View, Manage Calendar  
✅ View Settings (read-only)  
✅ View, Create, Edit Employees  
❌ Cannot Delete records  
❌ Cannot Manage Settings  

### Manager Role
✅ View Dashboard  
✅ View, Create, Edit Hiring Requests  
✅ View, Edit Candidates (❌ Cannot Create)  
✅ View, Edit Vacant Positions (❌ Cannot Create)  
✅ View Calendar (❌ Cannot Manage)  
✅ View, Edit Employees (❌ Cannot Create)  
❌ Cannot Access Settings  
❌ Cannot Delete records  

### CO Role
✅ Full access to all features  
✅ View, Create, Edit, Delete all records  
✅ Manage Settings  
✅ Full administrative access  

---

## 🧪 Testing Checklist

- [ ] Login with `rh_user` / `password123` → Verify RH permissions
- [ ] Login with `manager_user` / `password123` → Verify Manager restrictions
- [ ] Login with `co_user` / `password123` → Verify full access
- [ ] Check sidebar navigation changes per role
- [ ] Test creating/editing/deleting records
- [ ] Verify API returns 403 for unauthorized actions

---

## 📝 Notes

- All passwords are set to `password123` for easy testing
- In production, enforce strong, unique passwords
- Users are created with bcrypt hashing (10 salt rounds)
- The seed script automatically creates all users listed above
