# 🧪 Test Scenario Guide: Full Hiring Request Workflow

Follow this step-by-step guide to verify the complete creation, validation, and notification chain.

## 👤 Credentials Reference
| Role | Username | Password |
|------|----------|----------|
| **CO (Demandeur)** | `co_user` | `password123` |
| **RH (Responsable)** | `rh_user` | `password123` |
| **Manager (Plant)** | `manager_user` | `password123` |

---

## 🟢 Scenario A: Successful Validation Path

### Step 1: Create Request (CO)
1. **Login** as **CO** (`co_user`).
2. Go to **Demandes d'Embauche**.
3. Click **Nouvelle Demande**.
4. Fill details (Job: "Ingénieur Test", Service: "IT").
5. Click **Soumettre**.
   - *Result*: Request created with status `PENDING`.

### Step 2: RH Validation (RH)
1. **Logout** and **Login** as **RH** (`rh_user`).
2. Check top-right **Notifications** (Bell Icon).
   - *Verify*: "Nouvelle Demande d'Embauche...".
3. Open the request details.
4. Go to "Workflow de Validation".
5. Click **Valider** on **Step 1 (Responsable RH)**.
   - *Result*: Step 1 turns GREEN.
   - *System*: Automatically notifies Plant Managers.

### Step 3: Plant Manager Validation (Manager)
1. **Logout** and **Login** as **Manager** (`manager_user`).
2. Check **Notifications**.
   - *Verify*: "Validation Requise (Plant Manager)...".
3. Open the request details.
4. Click **Valider** on **Step 2 (Plant Manager)**.
   - *Result*: Step 2 turns GREEN.
   - *System*: Automatically notifies Recruitment (RH).

### Step 4: Final Recruitment Validation (RH)
1. **Logout** and **Login** as **RH** (`rh_user`).
2. Check **Notifications**.
   - *Verify*: "Validation Requise (Resp. Recrutement)...".
3. Open the request details.
4. Click **Valider** on **Step 3 (Resp. Recrutement)**.
   - *Result*: Step 3 turns GREEN. Overall Status becomes `VACANT` (Open/Confirmed).

---

## 🔴 Scenario B: Refusal Path

1. **Login** as **CO** (`co_user`) and create a new request "Stagiaire A".
2. **Login** as **RH** (`rh_user`).
3. Open request "Stagiaire A".
4. In "Workflow de Validation", click **Refuser** on Step 1.
5. Enter Reason: "Budget refusé".
6. **Login** back as **CO** (`co_user`).
7. Check **Notifications**.
   - *Verify*: "Demande Refusée... Raison: Budget refusé".
   - *Result*: Request status is `CANCELLED`.
