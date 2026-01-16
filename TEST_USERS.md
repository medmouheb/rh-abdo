# Test Users for Role-Based Access Control

This document provides test user credentials for testing the RBAC system.

## Test Users

All test users have the same password for easy testing: **`password123`**

### Test Users (Simple)

#### 1. RH User (Human Resources)
- **Username:** `rh_user`
- **Password:** `password123`
- **Role:** RH
- **Permissions:** 
  - ✅ View Dashboard
  - ✅ View, Create, Edit Hiring Requests
  - ✅ View, Create, Edit Candidates
  - ✅ View, Create, Edit Vacant Positions
  - ✅ View, Manage Calendar
  - ✅ View Settings (read-only)
  - ✅ View, Create, Edit Employees
  - ❌ Cannot Delete records
  - ❌ Cannot Manage Settings

#### 2. Manager User
- **Username:** `manager_user`
- **Password:** `password123`
- **Role:** Manager
- **Permissions:**
  - ✅ View Dashboard
  - ✅ View, Create, Edit Hiring Requests
  - ✅ View, Edit Candidates (❌ Cannot Create)
  - ✅ View, Edit Vacant Positions (❌ Cannot Create)
  - ✅ View Calendar (❌ Cannot Manage)
  - ✅ View, Edit Employees (❌ Cannot Create)
  - ❌ Cannot Access Settings
  - ❌ Cannot Delete records

#### 3. CO User (Chief Officer)

### Real Users (from recruitment types)

#### 4. SAADANI HIBA (RH)
- **Username:** `hiba.saadani`
- **Password:** `password123`
- **Role:** RH
- **Department:** RH

#### 5. MOHAMED AYMEN BACOUCHE (Manager)
- **Username:** `aymen.bacouche`
- **Password:** `password123`
- **Role:** Manager
- **Department:** Production

#### 6. zoubaier berrebeh (CO)
- **Username:** `zoubaier.berrebeh`
- **Password:** `password123`
- **Role:** CO
- **Department:** Méthode & Indus

#### 7. Ahmed Ben Ali (CO)
- **Username:** `ahmed.benali`
- **Password:** `password123`
- **Role:** CO
- **Department:** Finance

#### 8. Leila Mansouri (Manager)
- **Username:** `leila.mansouri`
- **Password:** `password123`
- **Role:** Manager
- **Department:** Qualité
- **Username:** `co_user`
- **Password:** `password123`
- **Role:** CO
- **Permissions:**
  - ✅ Full access to all features
  - ✅ View, Create, Edit, Delete all records
  - ✅ Manage Settings
  - ✅ Full administrative access

## How to Create Test Users

### Option 1: Using the Seed Script (Recommended)

Run the seed script to create all test users:

```bash
npm run seed:users
```

Or directly:

```bash
npx tsx src/lib/seed-users.ts
```

### Option 2: Using the Main Seed Script

The main seed script also includes test users:

```bash
npx prisma db seed
```

### Option 3: Manual Database Insert

You can also manually insert users using Prisma Studio:

```bash
npx prisma studio
```

Then create users with:
- username: `rh_user`, `manager_user`, or `co_user`
- password: (bcrypt hash of `password123`)
- role: `RH`, `Manager`, or `CO`

## Testing the System

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Login with different users:**
   - Go to `/auth/sign-in`
   - Try logging in with each test user
   - Notice how the sidebar navigation changes based on role
   - Test different actions to verify permissions

3. **Test API endpoints:**
   - Use the browser's developer tools to inspect API calls
   - Try creating/editing/deleting records with different roles
   - Verify that unauthorized actions return 403 Forbidden

## Password Hash

If you need to create users manually, the password `password123` hashes to:
```
$2b$10$YourHashHere
```

Use bcrypt to generate the hash:
```javascript
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('password123', 10);
```

## Notes

- All test users use the same password for convenience during development
- In production, enforce strong, unique passwords
- Consider using environment variables for test credentials
- The seed script uses bcrypt with 10 salt rounds for password hashing
