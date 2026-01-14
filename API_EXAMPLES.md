# SafeNet API Examples

Complete API request/response examples using curl.

## Base URL

```
http://localhost:3000/api
```

## Authentication Examples

### 1. Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+233123456789"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+233123456789",
      "role": "public_user",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123"
  }'
```

**Response:** Same structure as register

### 3. Refresh Token

```bash
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 4. Get Current User

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+233123456789",
      "role": "public_user",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

## Incident Examples

### 5. Create Incident (Missing Person)

```bash
curl -X POST http://localhost:3000/api/incidents \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "type": "missing_person",
    "title": "Missing Child - Age 5, Last Seen at Accra Mall",
    "description": "Last seen at Accra Mall wearing red shirt and blue jeans. Height approximately 3 feet. Please contact if you have any information.",
    "location": {
      "address": "Accra Mall, Spintex Road, Accra, Ghana",
      "coordinates": {
        "lat": 5.6037,
        "lng": -0.1870
      }
    },
    "metadata": {
      "age": 5,
      "gender": "male",
      "clothing": "red shirt, blue jeans"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Incident reported successfully",
  "data": {
    "incident": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "reporterId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "type": "missing_person",
      "title": "Missing Child - Age 5, Last Seen at Accra Mall",
      "description": "Last seen at Accra Mall wearing red shirt and blue jeans...",
      "location": {
        "address": "Accra Mall, Spintex Road, Accra, Ghana",
        "coordinates": {
          "lat": 5.6037,
          "lng": -0.1870
        }
      },
      "status": 0,
      "incidentHash": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
      "metadata": {
        "age": 5,
        "gender": "male",
        "clothing": "red shirt, blue jeans"
      },
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  }
}
```

### 6. Create Incident (Stolen Vehicle)

```bash
curl -X POST http://localhost:3000/api/incidents \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "type": "stolen_vehicle",
    "title": "Stolen Toyota Corolla - License Plate GR-1234-20",
    "description": "White Toyota Corolla 2020 model stolen from parking lot. Last seen heading towards Tema.",
    "location": {
      "address": "Osu, Accra, Ghana",
      "coordinates": {
        "lat": 5.5556,
        "lng": -0.1750
      }
    },
    "metadata": {
      "make": "Toyota",
      "model": "Corolla",
      "year": 2020,
      "color": "White",
      "licensePlate": "GR-1234-20"
    }
  }'
```

### 7. Create Incident (Natural Disaster)

```bash
curl -X POST http://localhost:3000/api/incidents \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "type": "natural_disaster",
    "title": "Severe Flooding in Adenta",
    "description": "Heavy rainfall causing severe flooding. Multiple roads impassable. Residents advised to stay indoors.",
    "location": {
      "address": "Adenta, Accra, Ghana",
      "coordinates": {
        "lat": 5.7000,
        "lng": -0.2000
      }
    },
    "metadata": {
      "disasterType": "flood",
      "severity": "high"
    }
  }'
```

### 8. Get All Incidents (Public User - Only Verified)

```bash
curl -X GET "http://localhost:3000/api/incidents?page=1&limit=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "success": true,
  "data": {
    "incidents": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "reporterId": {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john.doe@example.com"
        },
        "type": "missing_person",
        "title": "Missing Child - Age 5",
        "description": "...",
        "location": {
          "address": "Accra Mall, Accra, Ghana",
          "coordinates": {
            "lat": 5.6037,
            "lng": -0.1870
          }
        },
        "status": 1,
        "incidentHash": "a1b2c3d4e5f6...",
        "blockchainTxId": "0x1234...",
        "verifiedAt": "2024-01-15T12:00:00.000Z",
        "verifiedBy": {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
          "firstName": "Admin",
          "lastName": "User"
        },
        "createdAt": "2024-01-15T11:00:00.000Z",
        "updatedAt": "2024-01-15T12:00:00.000Z"
      }
    ],
    "total": 25,
    "page": 1,
    "limit": 20
  }
}
```

### 9. Get Incidents with Filters (Admin/Authority)

```bash
# Get pending incidents
curl -X GET "http://localhost:3000/api/incidents?status=0&page=1&limit=20" \
  -H "Authorization: Bearer <admin_token>"

# Get incidents by type
curl -X GET "http://localhost:3000/api/incidents?type=missing_person&status=1" \
  -H "Authorization: Bearer <admin_token>"

# Get incidents by reporter
curl -X GET "http://localhost:3000/api/incidents?reporterId=65a1b2c3d4e5f6g7h8i9j0k1" \
  -H "Authorization: Bearer <admin_token>"
```

### 10. Get Single Incident

```bash
curl -X GET http://localhost:3000/api/incidents/65a1b2c3d4e5f6g7h8i9j0k2 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 11. Get Verified Alerts (Public - No Auth Required)

```bash
curl -X GET http://localhost:3000/api/incidents/alerts/verified
```

**Response:**
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "_id": "...",
        "type": "missing_person",
        "title": "...",
        "status": 1,
        "createdAt": "..."
      }
    ]
  }
}
```

### 12. Update Incident Status - Verify (Admin/Authority Only)

```bash
curl -X PATCH http://localhost:3000/api/incidents/65a1b2c3d4e5f6g7h8i9j0k2/status \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": 1,
    "verificationNotes": "Verified by local authorities. Incident confirmed."
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Incident status updated successfully",
  "data": {
    "incident": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "status": 1,
      "verifiedAt": "2024-01-15T12:00:00.000Z",
      "verifiedBy": "65a1b2c3d4e5f6g7h8i9j0k3",
      "verificationNotes": "Verified by local authorities. Incident confirmed.",
      "blockchainTxId": "0x5678...",
      "updatedAt": "2024-01-15T12:00:00.000Z"
    }
  }
}
```

### 13. Update Incident Status - Mark as False

```bash
curl -X PATCH http://localhost:3000/api/incidents/65a1b2c3d4e5f6g7h8i9j0k2/status \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": 2,
    "verificationNotes": "False alarm. Person found safe."
  }'
```

### 14. Update Incident Status - Mark as Resolved

```bash
curl -X PATCH http://localhost:3000/api/incidents/65a1b2c3d4e5f6g7h8i9j0k2/status \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": 3,
    "verificationNotes": "Incident resolved. Missing person found safe."
  }'
```

## Health Check

### 15. Health Check

```bash
curl -X GET http://localhost:3000/api/health
```

**Response:**
```json
{
  "success": true,
  "message": "SafeNet API is running",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

## Error Examples

### 400 - Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Password must be at least 8 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

### 401 - Unauthorized

```json
{
  "success": false,
  "message": "Authentication required. Please provide a valid token."
}
```

### 403 - Forbidden

```json
{
  "success": false,
  "message": "Insufficient permissions. Access denied."
}
```

### 404 - Not Found

```json
{
  "success": false,
  "message": "Incident not found"
}
```

### 429 - Rate Limit Exceeded

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

## Notes

- Replace `<accessToken>` and `<admin_token>` with actual JWT tokens
- All timestamps are in ISO 8601 format
- Incident status: 0=Pending, 1=Verified, 2=False, 3=Resolved
- Public users can only see verified incidents (unless it's their own)
- Admin/Authority can see and manage all incidents
