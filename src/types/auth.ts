// User roles
export type UserRole = "RH" | "Manager" | "CO";

// JWT payload structure
export interface JWTPayload {
  userId: number;
  username: string;
  role: UserRole;
}

// User session data
export interface UserSession {
  userId: number;
  username: string;
  role: UserRole;
}

// Role-based access permissions
export interface RolePermissions {
  // Dashboard
  canViewDashboard: boolean;
  
  // Hiring Requests
  canViewHiringRequests: boolean;
  canCreateHiringRequests: boolean;
  canEditHiringRequests: boolean;
  canDeleteHiringRequests: boolean;
  canApproveHiringRequests: boolean;
  
  // Candidates
  canViewCandidates: boolean;
  canCreateCandidates: boolean;
  canEditCandidates: boolean;
  canDeleteCandidates: boolean;
  canValidateCandidates: boolean;
  
  // Vacant Positions
  canViewVacantPositions: boolean;
  canCreateVacantPositions: boolean;
  canEditVacantPositions: boolean;
  canDeleteVacantPositions: boolean;
  
  // Calendar
  canViewCalendar: boolean;
  canManageCalendar: boolean;
  
  // Settings
  canViewSettings: boolean;
  canManageSettings: boolean;
  
  // Employees
  canViewEmployees: boolean;
  canCreateEmployees: boolean;
  canEditEmployees: boolean;
  canDeleteEmployees: boolean;
  
  // Administration
  canManageUsers: boolean;
  canManageDepartments: boolean;
}

// Role permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  RH: {
    canViewDashboard: true,
    canViewHiringRequests: true,
    canCreateHiringRequests: true,
    canEditHiringRequests: true,
    canDeleteHiringRequests: false,
    canApproveHiringRequests: true,
    canViewCandidates: true,
    canCreateCandidates: true,
    canEditCandidates: true,
    canDeleteCandidates: false,
    canValidateCandidates: true,
    canViewVacantPositions: true,
    canCreateVacantPositions: true,
    canEditVacantPositions: true,
    canDeleteVacantPositions: false,
    canViewCalendar: true,
    canManageCalendar: true,
    canViewSettings: true,
    canManageSettings: false,
    canViewEmployees: true,
    canCreateEmployees: true,
    canEditEmployees: true,
    canDeleteEmployees: false,
    canManageUsers: true,
    canManageDepartments: true,
  },
  Manager: {
    canViewDashboard: true,
    canViewHiringRequests: true,
    canCreateHiringRequests: true,
    canEditHiringRequests: true,
    canDeleteHiringRequests: false,
    canApproveHiringRequests: true,
    canViewCandidates: true,
    canCreateCandidates: false,
    canEditCandidates: true,
    canDeleteCandidates: false,
    canValidateCandidates: true,
    canViewVacantPositions: true,
    canCreateVacantPositions: false,
    canEditVacantPositions: true,
    canDeleteVacantPositions: false,
    canViewCalendar: true,
    canManageCalendar: false,
    canViewSettings: false,
    canManageSettings: false,
    canViewEmployees: true,
    canCreateEmployees: false,
    canEditEmployees: true,
    canDeleteEmployees: false,
    canManageUsers: false,
    canManageDepartments: false,
  },
  CO: {
    canViewDashboard: true,
    canViewHiringRequests: true,
    canCreateHiringRequests: true,
    canEditHiringRequests: true,
    canDeleteHiringRequests: true,
    canApproveHiringRequests: true,
    canViewCandidates: true,
    canCreateCandidates: true,
    canEditCandidates: true,
    canDeleteCandidates: true,
    canValidateCandidates: true,
    canViewVacantPositions: true,
    canCreateVacantPositions: true,
    canEditVacantPositions: true,
    canDeleteVacantPositions: true,
    canViewCalendar: true,
    canManageCalendar: true,
    canViewSettings: true,
    canManageSettings: true,
    canViewEmployees: true,
    canCreateEmployees: true,
    canEditEmployees: true,
    canDeleteEmployees: true,
    canManageUsers: true,
    canManageDepartments: true,
  },
};
