# ✅ Feature Implemented: Multi-Step Validation Workflow

## 🎯 Goal
Ensure that a pending hiring request acts as a "workflow" that must be approved by 3 specific stakeholders in order:
1. **Responsable RH**
2. **Plant Manager**
3. **Responsable Recrutement**

## 🛠️ Changes Implemented

### 1. Database Schema
- Added 3 new status fields to `HiringRequest`:
  - `validationRHStatus`
  - `validationPlantManagerStatus`
  - `validationRecruitmentStatus`
- Request status defaults to `PENDING_VALIDATION`.

### 2. Backend (API)
- **File**: `src/app/api/hiring-requests/[id]/route.ts`
- **Logic**: 
  - **Validation Handling**: Updates specific step status.
  - **Auto-Approval**: All 3 approved -> Status `VACANT`.
  - **Auto-Rejection**: Any rejected -> Status `CANCELLED`.
  - **🔔 Notification Chain**:
    - **Refusal**: Notify Creator (Demandeur) with reason.
    - **RH Approved**: Notify **Plant Managers** (Validation Required).
    - **Plant Manager Approved**: Notify **Responsable Recrutement** (Validation Required).

### 3. Frontend (UI)
- **File**: `src/app/hiring-requests/page.tsx`
- **Modal**: Added a "Workflow de Validation" section.
- **Visuals**:
  - Numbered steps (1, 2, 3).
  - Color-coded badges (Gray=Pending, Green=Approved, Red=Rejected).
- **Controls**:
  - **Step 1 (RH)**: Visible/Active for RH User immediately.
  - **Step 2 (Plant Manager)**: Active for Manager/CO ONLY after RH approves.
  - **Step 3 (Recruitment)**: Active for RH User ONLY after Plant Manager approves.

## 🧪 How to Test

1. **Seed Users** (Already done):
   - `rh_user` (Role: RH)
   - `manager_user` (Role: Manager)
   - `co_user` (Role: CO)
   
2. **Workflow Test**:
   - **Login as CO**: Create a request.
   - **Login as RH**: Open request. You see Step 1 active. Click "Valider". (Step 1 -> Green).
   - **Login as Manager**: Open request. You see Step 2 active. Click "Valider". (Step 2 -> Green).
   - **Login as RH**: Open request. You see Step 3 active. Click "Valider". (Step 3 -> Green).
   - **Result**: Request status becomes `VACANT`.

---

**Status**: ✅ Completed.
