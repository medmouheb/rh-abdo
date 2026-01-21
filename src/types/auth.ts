// User roles
export type UserRole = "REQUESTER" | "RECRUITER" | "PLANT_MANAGER" | "HR_MANAGER";

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
  HR_MANAGER: {
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
  PLANT_MANAGER: {
    canViewDashboard: true,
    canViewHiringRequests: true,
    canCreateHiringRequests: false,
    canEditHiringRequests: false,
    canDeleteHiringRequests: false,
    canApproveHiringRequests: true, // Approver
    canViewCandidates: true,
    canCreateCandidates: false,
    canEditCandidates: false,
    canDeleteCandidates: false,
    canValidateCandidates: true, // Can validate
    canViewVacantPositions: true,
    canCreateVacantPositions: false,
    canEditVacantPositions: false,
    canDeleteVacantPositions: false,
    canViewCalendar: true,
    canManageCalendar: false,
    canViewSettings: false,
    canManageSettings: false,
    canViewEmployees: true,
    canCreateEmployees: false,
    canEditEmployees: false,
    canDeleteEmployees: false,
    canManageUsers: false,
    canManageDepartments: false,
  },
  RECRUITER: {
    canViewDashboard: true,
    canViewHiringRequests: true,
    canCreateHiringRequests: false,
    canEditHiringRequests: false,
    canDeleteHiringRequests: false,
    canApproveHiringRequests: false,
    canViewCandidates: true,
    canCreateCandidates: true, // Recruiter job
    canEditCandidates: true,
    canDeleteCandidates: false,
    canValidateCandidates: true,
    canViewVacantPositions: true,
    canCreateVacantPositions: false,
    canEditVacantPositions: false,
    canDeleteVacantPositions: false,
    canViewCalendar: true,
    canManageCalendar: true,
    canViewSettings: false,
    canManageSettings: false,
    canViewEmployees: false,
    canCreateEmployees: false,
    canEditEmployees: false,
    canDeleteEmployees: false,
    canManageUsers: false,
    canManageDepartments: false,
  },
  REQUESTER: {
    canViewDashboard: true,
    canViewHiringRequests: true,
    canCreateHiringRequests: true, // Can create
    canEditHiringRequests: true, // Own only (handled by logic)
    canDeleteHiringRequests: false,
    canApproveHiringRequests: false,
    canViewCandidates: true,
    canCreateCandidates: false,
    canEditCandidates: false,
    canDeleteCandidates: false,
    canValidateCandidates: false,
    canViewVacantPositions: true,
    canCreateVacantPositions: false,
    canEditVacantPositions: false,
    canDeleteVacantPositions: false,
    canViewCalendar: true,
    canManageCalendar: false,
    canViewSettings: false,
    canManageSettings: false,
    canViewEmployees: false,
    canCreateEmployees: false,
    canEditEmployees: false,
    canDeleteEmployees: false,
    canManageUsers: false,
    canManageDepartments: false,
  }
};
