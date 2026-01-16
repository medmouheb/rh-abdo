# Role-Based Access Control (RBAC) Implementation

This document describes the role-based access control system implemented for the NextAdmin HR application.

## Roles

The application supports three user roles:

1. **RH** (Human Resources) - Full access to recruitment and HR functions
2. **MANAGER** - Limited access, can view and validate but has restrictions on creation/deletion
3. **CO** (Chief Officer) - Full administrative access to all features

## Permission Matrix

### Dashboard
- **RH**: ✅ View
- **MANAGER**: ✅ View
- **CO**: ✅ View

### Hiring Requests
- **RH**: ✅ View, Create, Edit, Approve
- **MANAGER**: ✅ View, Create, Edit, Approve
- **CO**: ✅ View, Create, Edit, Delete, Approve

### Candidates
- **RH**: ✅ View, Create, Edit, Validate
- **MANAGER**: ✅ View, Edit, Validate (❌ Create)
- **CO**: ✅ View, Create, Edit, Delete, Validate

### Vacant Positions
- **RH**: ✅ View, Create, Edit
- **MANAGER**: ✅ View, Edit (❌ Create)
- **CO**: ✅ View, Create, Edit, Delete

### Calendar
- **RH**: ✅ View, Manage
- **MANAGER**: ✅ View (❌ Manage)
- **CO**: ✅ View, Manage

### Settings
- **RH**: ✅ View (❌ Manage)
- **MANAGER**: ❌ View, ❌ Manage
- **CO**: ✅ View, Manage

### Employees
- **RH**: ✅ View, Create, Edit
- **MANAGER**: ✅ View, Edit (❌ Create)
- **CO**: ✅ View, Create, Edit, Delete

## Implementation Details

### Authentication Flow

1. User logs in with username and password via `/api/auth/login`
2. Server validates credentials and returns JWT token with user role
3. Token is stored in localStorage and included in API requests
4. Client-side components check user role for UI rendering
5. Server-side API routes verify role for authorization

### Files Structure

```
src/
├── types/
│   └── auth.ts                    # Role types and permissions definitions
├── lib/
│   ├── auth.ts                     # Authentication utilities
│   └── navigation.ts              # Navigation filtering utilities
├── contexts/
│   └── AuthContext.tsx            # React context for auth state
├── components/
│   ├── Auth/
│   │   ├── SigninWithPassword.tsx  # Login form with API integration
│   │   └── ProtectedRoute.tsx      # Route protection component
│   └── Layouts/
│       ├── sidebar/
│       │   ├── data/index.ts       # Navigation data with permissions
│       │   └── index.tsx           # Sidebar with role filtering
│       └── header/
│           └── user-info/          # User info with logout
└── app/
    ├── api/
    │   ├── auth/login/route.ts     # Login endpoint with role in JWT
    │   ├── employees/route.ts      # Employee CRUD with role checks
    │   ├── candidates/route.ts     # Candidate CRUD with role checks
    │   └── hiring-request/route.ts # Hiring request with role checks
    └── middleware.ts                # Route protection middleware
```

### Database Schema

The `User` model includes a `role` field:

```prisma
model User {
  id       Int    @id @default(autoincrement())
  username String @unique
  password String
  role     String @default("RH") // RH, MANAGER, CO
  ...
}
```

### Usage Examples

#### Protecting a Route

```tsx
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["RH", "CO"]}>
      <YourComponent />
    </ProtectedRoute>
  );
}
```

#### Checking Permissions in Components

```tsx
import { useAuth } from "@/contexts/AuthContext";
import { hasPermission } from "@/lib/auth";

function MyComponent() {
  const { user } = useAuth();
  
  if (!hasPermission(user?.role, "canCreateCandidates")) {
    return null; // Hide create button
  }
  
  return <CreateButton />;
}
```

#### API Route Protection

```tsx
import { verifyAuth } from "@/lib/auth";
import { UserRole } from "@/types/auth";

export async function POST(request: Request) {
  const { error, user } = await requireAuth(request, ["RH", "CO"]);
  if (error) return error;
  
  // Your protected logic here
}
```

## Migration

To update existing users to use the new role system:

1. Run Prisma migration:
   ```bash
   npx prisma migrate dev --name update_user_roles
   ```

2. Update existing users in the database:
   ```sql
   UPDATE User SET role = 'RH' WHERE role = 'RECRUITER';
   UPDATE User SET role = 'MANAGER' WHERE role = 'HR_MANAGER';
   UPDATE User SET role = 'CO' WHERE role = 'ADMIN';
   ```

## Testing

1. Create test users with different roles:
   - RH user: `username: rh_user, role: RH`
   - Manager user: `username: manager_user, role: MANAGER`
   - CO user: `username: co_user, role: CO`

2. Test login flow for each role
3. Verify sidebar navigation shows correct items per role
4. Test API endpoints with different roles
5. Verify protected routes redirect unauthorized users

## Security Notes

- JWT tokens expire after 24 hours
- Tokens are stored in localStorage (consider httpOnly cookies for production)
- All API routes verify authentication and authorization
- Role checks happen both client-side (UI) and server-side (API)
- Never trust client-side role checks alone - always verify on the server
