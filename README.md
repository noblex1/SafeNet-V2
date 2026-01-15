# SafeNet Backend API

Public Safety Alert Platform - Backend API built with Node.js, Express, TypeScript, and MongoDB.

## Architecture Overview

```
src/
├── config/          # Database and configuration
├── controllers/     # Request handlers
├── middleware/      # Auth, RBAC, validation, error handling
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── services/        # Business logic layer
├── types/           # TypeScript type definitions
├── utils/           # Utility functions (logger, crypto)
└── server.ts        # Application entry point
```

## Features

- ✅ User authentication & authorization (JWT + refresh tokens)
- ✅ Role-based access control (Public User, Admin, Authority)
- ✅ Incident CRUD operations
- ✅ Admin verification workflow
- ✅ Blockchain hash submission (abstracted service layer)
- ✅ Rate limiting
- ✅ Input validation
- ✅ Centralized error handling
- ✅ Security best practices (helmet, CORS, password hashing)

## Setup

### Prerequisites

- Node.js 18+ 
- MongoDB 5+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
# Set MONGODB_URI, JWT_SECRET, etc.

# Create logs directory
mkdir -p logs

# Run in development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## Environment Variables

See `.env.example` for required environment variables:

- `MONGODB_URI` - MongoDB connection string
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `JWT_SECRET` - Secret for access tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+233123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+233123456789",
      "role": "public_user",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:** Same structure as register

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
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

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <accessToken>
```

### Incidents

#### Create Incident
```http
POST /api/incidents
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "type": "missing_person",
  "title": "Missing Child - Age 5",
  "description": "Last seen at Accra Mall wearing red shirt and blue jeans...",
  "location": {
    "address": "Accra Mall, Accra, Ghana",
    "coordinates": {
      "lat": 5.6037,
      "lng": -0.1870
    }
  },
  "metadata": {
    "age": 5,
    "gender": "male"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Incident reported successfully",
  "data": {
    "incident": {
      "_id": "...",
      "reporterId": "...",
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
      "status": 0,
      "incidentHash": "a1b2c3d4e5f6...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Get Incidents (with filters)
```http
GET /api/incidents?status=1&type=missing_person&page=1&limit=20
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `status` - 0 (Pending), 1 (Verified), 2 (False), 3 (Resolved)
- `type` - missing_person, kidnapping, stolen_vehicle, natural_disaster
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `reporterId` - Filter by reporter (Admin/Authority only)

**Response:**
```json
{
  "success": true,
  "data": {
    "incidents": [...],
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```

#### Get Single Incident
```http
GET /api/incidents/:id
Authorization: Bearer <accessToken>
```

#### Get Verified Alerts (Public - No Auth Required)
```http
GET /api/incidents/alerts/verified
```

#### Update Incident Status (Admin/Authority Only)
```http
PATCH /api/incidents/:id/status
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "status": 1,
  "verificationNotes": "Verified by local authorities"
}
```

**Status Values:**
- `1` - Verified
- `2` - False
- `3` - Resolved

## Incident Status Enum

Global contract used across all systems:

- `0` = Pending
- `1` = Verified
- `2` = False
- `3` = Resolved

## User Roles

- `public_user` - Can report incidents, view verified alerts
- `admin` - Can verify/reject incidents, view all incidents
- `authority` - Same as admin (for future differentiation)

## Security Features

- **Password Hashing**: bcrypt with configurable rounds
- **JWT Authentication**: Access tokens (15min) + Refresh tokens (7 days)
- **Rate Limiting**: 
  - General: 100 requests per 15 minutes
  - Auth: 5 attempts per 15 minutes
  - Incident creation: 10 per hour
- **Input Validation**: express-validator on all endpoints
- **Helmet**: Security headers
- **CORS**: Configurable origins
- **RBAC**: Role-based access control middleware

## Blockchain Integration

The blockchain service is abstracted in `src/services/blockchainService.ts`.

**Important Rules:**
- Only incident hashes are stored on-chain
- No personal data on blockchain
- Blockchain failures don't break the API
- Currently uses placeholder implementation (ready for Sui SDK integration)

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [...] // Validation errors if applicable
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Build TypeScript
npm run build

# Lint code
npm run lint
```

## License

ISC
