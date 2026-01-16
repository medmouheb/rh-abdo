# Vacant Position Management - API Documentation

## Overview
Complete API endpoints for managing vacant positions, including candidate assignments, budget management, and responsible person assignment.

---

## API Endpoints

### 1. **Get All Hiring Requests**
**Endpoint:** `GET /api/hiring-requests`

**Description:** Fetches all hiring requests based on user role permissions.

**Authorization:** Required (JWT Token)

**Response:**
```json
[
  {
    "id": 1,
    "jobTitle": "Software Engineer",
    "service": "IT",
    "workLocation": "TT",
    "contractType": "CDI",
    "status": "VACANT",
    "hiringCost": 50000,
    "recruiter": {
      "id": 1,
      "username": "john_doe",
      "role": "RH"
    },
    "candidates": [
      {
        "id": 1,
        "firstName": "Jane",
        "lastName": "Smith",
        "status": "INTERVIEW"
      }
    ],
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

---

### 2. **Get Single Hiring Request**
**Endpoint:** `GET /api/hiring-requests/[id]`

**Description:** Fetches detailed information about a specific hiring request.

**Parameters:**
- `id` (path parameter): Hiring request ID

**Authorization:** Required

**Response:**
```json
{
  "id": 1,
  "jobTitle": "Software Engineer",
  "service": "IT",
  "workLocation": "TT",
  "contractType": "CDI",
  "status": "VACANT",
  "hiringCost": 50000,
  "recruiter": {
    "id": 1,
    "username": "john_doe",
    "role": "RH"
  },
  "candidates": [
    {
      "id": 1,
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "phone": "+216 12 345 678",
      "status": "INTERVIEW",
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ]
}
```

---

### 3. **Update Hiring Request (Budget/Responsible)**
**Endpoint:** `PATCH /api/hiring-requests/[id]`

**Description:** Updates hiring request details including budget and responsible person.

**Parameters:**
- `id` (path parameter): Hiring request ID

**Request Body:**
```json
{
  "budget": 60000,
  "recruiterId": 2,
  "status": "IN_PROGRESS",
  "workLocation": "TTG",
  "contractType": "CDD"
}
```

**Authorization:** Required

**Response:**
```json
{
  "id": 1,
  "jobTitle": "Software Engineer",
  "hiringCost": 60000,
  "recruiterId": 2,
  "status": "IN_PROGRESS",
  "recruiter": {
    "id": 2,
    "username": "new_recruiter",
    "role": "Manager"
  }
}
```

---

### 4. **Delete Hiring Request**
**Endpoint:** `DELETE /api/hiring-requests/[id]`

**Description:** Deletes a hiring request (RH role only).

**Parameters:**
- `id` (path parameter): Hiring request ID

**Authorization:** Required (RH role only)

**Response:**
```json
{
  "success": true,
  "message": "Hiring request deleted successfully"
}
```

---

### 5. **Get Candidates for Hiring Request**
**Endpoint:** `GET /api/hiring-requests/[id]/candidates`

**Description:** Fetches all candidates assigned to a specific hiring request.

**Parameters:**
- `id` (path parameter): Hiring request ID

**Authorization:** Required

**Response:**
```json
[
  {
    "id": 1,
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "+216 12 345 678",
    "status": "INTERVIEW",
    "createdAt": "2024-01-10T10:00:00Z"
  },
  {
    "id": 2,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+216 98 765 432",
    "status": "SCREENING",
    "createdAt": "2024-01-12T14:30:00Z"
  }
]
```

---

### 6. **Add Candidate to Hiring Request**
**Endpoint:** `POST /api/hiring-requests/[id]/candidates`

**Description:** Assigns a candidate to a hiring request.

**Parameters:**
- `id` (path parameter): Hiring request ID

**Request Body:**
```json
{
  "candidateId": 5
}
```

**Authorization:** Required

**Response:**
```json
{
  "id": 5,
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice@example.com",
  "hiringRequestId": 1,
  "status": "NEW",
  "createdAt": "2024-01-15T09:00:00Z"
}
```

---

### 7. **Remove Candidate from Hiring Request**
**Endpoint:** `DELETE /api/hiring-requests/[id]/candidates/[candidateId]`

**Description:** Removes a candidate from a hiring request.

**Parameters:**
- `id` (path parameter): Hiring request ID
- `candidateId` (path parameter): Candidate ID

**Authorization:** Required

**Response:**
```json
{
  "success": true,
  "message": "Candidate removed from position",
  "candidate": {
    "id": 5,
    "firstName": "Alice",
    "lastName": "Johnson",
    "hiringRequestId": null
  }
}
```

---

## Frontend Integration Examples

### **Adding a Candidate**
```typescript
const handleAddCandidate = async (candidateId: number) => {
  const response = await apiRequest(
    `/api/hiring-requests/${positionId}/candidates`,
    {
      method: "POST",
      body: JSON.stringify({ candidateId })
    }
  );
  
  if (response.ok) {
    const newCandidate = await response.json();
    // Update UI
  }
};
```

### **Updating Budget**
```typescript
const handleSaveBudget = async (newBudget: number) => {
  const response = await apiRequest(
    `/api/hiring-requests/${positionId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ budget: newBudget })
    }
  );
  
  if (response.ok) {
    const updated = await response.json();
    // Update UI
  }
};
```

### **Changing Responsible Person**
```typescript
const handleSaveResponsible = async (recruiterId: number) => {
  const response = await apiRequest(
    `/api/hiring-requests/${positionId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ recruiterId })
    }
  );
  
  if (response.ok) {
    const updated = await response.json();
    // Update UI
  }
};
```

### **Removing a Candidate**
```typescript
const handleRemoveCandidate = async (candidateId: number) => {
  if (!confirm("Remove this candidate?")) return;
  
  const response = await apiRequest(
    `/api/hiring-requests/${positionId}/candidates/${candidateId}`,
    { method: "DELETE" }
  );
  
  if (response.ok) {
    // Update UI
  }
};
```

---

## Error Handling

All endpoints return standard HTTP status codes:

- **200**: Success
- **201**: Created
- **400**: Bad Request (missing/invalid parameters)
- **401**: Unauthorized (no valid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error

**Error Response Format:**
```json
{
  "error": "Error message description"
}
```

---

## Security & Permissions

### **Role-Based Access:**
- **RH**: Full access to all operations
- **Manager/CO**: Can manage their own hiring requests
- **Candidate**: Read-only access to their own data

### **Authentication:**
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Database Schema

### **HiringRequest Model:**
```prisma
model HiringRequest {
  id                Int         @id @default(autoincrement())
  jobTitle          String
  service           String
  workLocation      String?
  contractType      String
  status            String      @default("VACANT")
  hiringCost        Float?
  recruiterId       Int?
  recruiter         User?       @relation(fields: [recruiterId], references: [id])
  candidates        Candidate[]
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
}
```

### **Candidate Model:**
```prisma
model Candidate {
  id                Int            @id @default(autoincrement())
  firstName         String
  lastName          String
  email             String?
  phone             String?
  status            String         @default("NEW")
  hiringRequestId   Int?
  hiringRequest     HiringRequest? @relation(fields: [hiringRequestId], references: [id])
  createdAt         DateTime       @default(now())
}
```

---

## Testing

Use tools like **Postman** or **Thunder Client** to test endpoints:

1. **Get Auth Token:** Login via `/api/auth/login`
2. **Set Authorization Header:** `Bearer <token>`
3. **Test CRUD Operations:** Create, Read, Update, Delete

---

## Notes

- All dates are in ISO 8601 format
- Currency is in Tunisian Dinars (DT)
- Candidate status values: `NEW`, `SCREENING`, `INTERVIEW`, `OFFER`, `HIRED`, `REJECTED`
- Hiring request status values: `VACANT`, `IN_PROGRESS`, `HIRED`, `COMPLETED`, `CANCELLED`, `SUSPENDED`

---

**Last Updated:** January 16, 2026
**Version:** 1.0.0
