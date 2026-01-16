# 🔐 Quick Login Reference

## Test User Credentials

All users share the same password: **`password123`**

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| **RH** | `rh_user` | `password123` | Full HR access (no delete) |
| **Manager** | `manager_user` | `password123` | Limited access (view/edit only) |
| **CO** | `co_user` | `password123` | Full admin access |

**Or use real users:**
- `hiba.saadani` (RH) | `aymen.bacouche` (Manager) | `zoubaier.berrebeh` (CO)

## Quick Start

1. **Create test users:**
   ```bash
   npm run seed:users
   ```

2. **Start the app:**
   ```bash
   npm run dev
   ```

3. **Login at:** `http://localhost:3000/auth/sign-in`

## What to Test

- ✅ Login with each role
- ✅ Check sidebar navigation (different items per role)
- ✅ Try creating/editing/deleting records
- ✅ Verify API returns 403 for unauthorized actions
- ✅ Check user info in header shows correct role

---

**Note:** These are test credentials. Change passwords in production!
