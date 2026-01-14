# SafeNet Backend Architecture

## System Overview

SafeNet backend is a RESTful API built with Node.js, Express, TypeScript, and MongoDB. It follows clean architecture principles with clear separation of concerns.

## Architecture Layers

```
┌─────────────────────────────────────────┐
│         HTTP Request Layer              │
│  (Routes, Middleware, Controllers)      │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         Business Logic Layer             │
│         (Services)                       │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌───────────────┐      ┌──────────────────┐
│   Database    │      │   Blockchain     │
│   (MongoDB)   │      │   (Sui - Abstract)│
└───────────────┘      └──────────────────┘
```

## Directory Structure

```
src/
├── config/
│   └── database.ts          # MongoDB connection configuration
│
├── controllers/
│   ├── authController.ts    # Authentication request handlers
│   └── incidentController.ts # Incident request handlers
│
├── middleware/
│   ├── auth.ts              # JWT authentication & RBAC
│   ├── errorHandler.ts      # Centralized error handling
│   ├── rateLimiter.ts       # Rate limiting configurations
│   └── validator.ts         # Validation middleware wrapper
│
├── models/
│   ├── User.ts              # User Mongoose schema
│   └── Incident.ts          # Incident Mongoose schema
│
├── routes/
│   ├── authRoutes.ts        # Authentication routes
│   ├── incidentRoutes.ts    # Incident routes
│   └── index.ts             # Route aggregator
│
├── services/
│   ├── authService.ts       # Authentication business logic
│   ├── incidentService.ts   # Incident business logic
│   └── blockchainService.ts # Blockchain abstraction layer
│
├── types/
│   └── index.ts             # TypeScript type definitions
│
├── utils/
│   ├── logger.ts            # Winston logger configuration
│   └── crypto.ts            # Cryptographic utilities
│
└── server.ts                # Application entry point
```

## Request Flow

### 1. Authentication Flow

```
Client Request
    │
    ▼
Rate Limiter (authRateLimiter)
    │
    ▼
Validation Middleware (express-validator)
    │
    ▼
Controller (authController)
    │
    ▼
Service (authService)
    │
    ├──► User Model (MongoDB)
    └──► JWT Token Generation
    │
    ▼
Response (with tokens)
```

### 2. Incident Creation Flow

```
Client Request (with JWT)
    │
    ▼
Authentication Middleware (authenticate)
    │
    ▼
RBAC Middleware (authorize)
    │
    ▼
Rate Limiter (incidentCreationRateLimiter)
    │
    ▼
Validation Middleware
    │
    ▼
Controller (incidentController)
    │
    ▼
Service (incidentService)
    │
    ├──► Incident Model (MongoDB)
    ├──► Generate Incident Hash (crypto)
    └──► Blockchain Service (async)
    │
    ▼
Response (with incident data)
```

### 3. Incident Verification Flow (Admin/Authority)

```
Admin Request (with JWT)
    │
    ▼
Authentication Middleware
    │
    ▼
RBAC Middleware (admin/authority only)
    │
    ▼
Controller (incidentController.updateStatus)
    │
    ▼
Service (incidentService.updateIncidentStatus)
    │
    ├──► Update Incident Model
    └──► Update Blockchain Status (async)
    │
    ▼
Response (updated incident)
```

## Security Architecture

### Authentication
- **JWT Access Tokens**: Short-lived (15 minutes)
- **JWT Refresh Tokens**: Long-lived (7 days)
- **Password Hashing**: bcrypt with configurable rounds (default: 12)

### Authorization
- **Role-Based Access Control (RBAC)**:
  - `public_user`: Can create incidents, view verified alerts
  - `admin`: Full access to all incidents
  - `authority`: Same as admin (for future differentiation)

### Rate Limiting
- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **Incident Creation**: 10 incidents per hour

### Input Validation
- **express-validator**: All endpoints validated
- **Type Safety**: TypeScript for compile-time checks
- **Sanitization**: Email normalization, string trimming

### Security Headers
- **Helmet**: Security headers (XSS protection, etc.)
- **CORS**: Configurable origins
- **Compression**: Response compression

## Database Schema

### User Model
```typescript
{
  email: string (unique, indexed)
  password: string (hashed, not selected by default)
  firstName: string
  lastName: string
  phone: string
  role: UserRole (enum)
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Incident Model
```typescript
{
  reporterId: ObjectId (ref: User, indexed)
  type: IncidentType (enum)
  title: string
  description: string
  location: {
    address: string
    coordinates: { lat, lng } (optional)
  }
  status: IncidentStatus (0-3, indexed)
  incidentHash: string (indexed)
  blockchainTxId: string
  verifiedAt: Date
  verifiedBy: ObjectId (ref: User)
  verificationNotes: string
  metadata: object
  createdAt: Date
  updatedAt: Date
}
```

### Indexes
- User: `email` (unique)
- Incident: `reporterId`, `status`, `incidentHash`, `type+status` (compound)

## Blockchain Integration

### Abstraction Layer
The `BlockchainService` provides an abstracted interface for blockchain operations:

```typescript
class BlockchainService {
  submitIncidentHash(hash, status): Promise<txId>
  updateIncidentStatus(hash, status, verifier): Promise<txId>
  getAuditLog(hash): Promise<BlockchainSubmission[]>
  verifyTransaction(txId): Promise<boolean>
}
```

### Blockchain Rules
- ✅ Only incident hashes stored on-chain
- ✅ Verification status updates
- ✅ Verifier address/ID
- ✅ Timestamps
- ❌ No personal data
- ❌ No sensitive information

### Current Implementation
- Placeholder implementation ready for Sui SDK integration
- Failures don't break API (async, non-blocking)
- Logs all blockchain operations

## Error Handling

### Error Types
1. **CustomError**: Operational errors with status codes
2. **Validation Errors**: From express-validator
3. **Authentication Errors**: JWT-related
4. **Database Errors**: MongoDB errors
5. **Server Errors**: Unexpected errors

### Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Optional validation errors
}
```

### Error Logging
- **Winston Logger**: Structured logging
- **Error Levels**: error, warn, info, debug
- **Log Files**: `logs/error.log`, `logs/combined.log`

## API Design Principles

### RESTful Conventions
- **GET**: Retrieve resources
- **POST**: Create resources
- **PATCH**: Update resources (partial)
- **DELETE**: Not implemented (soft delete via status)

### Response Format
```json
{
  "success": boolean,
  "message": string,
  "data": object
}
```

### Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## Data Flow Examples

### Creating an Incident

1. **Client** sends POST `/api/incidents` with JWT token
2. **Middleware** validates token and checks permissions
3. **Controller** extracts and validates request data
4. **Service** creates incident in MongoDB
5. **Service** generates SHA256 hash of incident data
6. **Service** updates incident with hash
7. **Service** (async) submits hash to blockchain
8. **Controller** returns incident data to client

### Verifying an Incident

1. **Admin** sends PATCH `/api/incidents/:id/status` with status=1
2. **Middleware** validates admin role
3. **Controller** validates status update
4. **Service** updates incident status in MongoDB
5. **Service** records verifier and timestamp
6. **Service** (async) updates blockchain with new status
7. **Controller** returns updated incident

## Scalability Considerations

### Current Design
- Stateless API (JWT tokens)
- Database indexes for common queries
- Rate limiting to prevent abuse
- Async blockchain operations

### Future Enhancements
- Caching layer (Redis) for frequently accessed data
- Database read replicas
- Message queue for blockchain operations
- Horizontal scaling with load balancer

## Testing Strategy (Future)

### Unit Tests
- Service layer logic
- Utility functions
- Validation rules

### Integration Tests
- API endpoints
- Database operations
- Authentication flows

### E2E Tests
- Complete user workflows
- Admin verification workflows

## Deployment Considerations

### Environment Variables
- Database connection
- JWT secrets
- Blockchain RPC URL
- Rate limiting configs

### Production Checklist
- [ ] Set strong JWT secrets
- [ ] Configure MongoDB connection pool
- [ ] Set up proper CORS origins
- [ ] Configure rate limits
- [ ] Set up log rotation
- [ ] Enable HTTPS/TLS
- [ ] Configure health checks
- [ ] Set up monitoring

## Dependencies

### Core
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `jsonwebtoken`: JWT handling
- `bcrypt`: Password hashing

### Security
- `helmet`: Security headers
- `cors`: CORS handling
- `express-validator`: Input validation
- `express-rate-limit`: Rate limiting

### Utilities
- `winston`: Logging
- `dotenv`: Environment variables
- `compression`: Response compression

### Development
- `typescript`: Type safety
- `ts-node-dev`: Development server
- `eslint`: Code linting
