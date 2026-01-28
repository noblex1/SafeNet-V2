# SafeNet

> A blockchain-powered public safety alert platform for transparent, verifiable incident reporting and community protection.

**SafeNet** is an enterprise-grade public safety platform that combines modern web technologies with blockchain immutability to provide secure, transparent, and trusted incident reporting. Designed for communities, law enforcement, and emergency services to collaboratively manage public safety incidents including missing persons, kidnappings, stolen vehicles, and natural disasters.

## 📊 Project Status

| Component | Status | Version | Technology |
|-----------|--------|---------|------------|
| Backend API | ✅ Production-Ready | 1.0.0 | Node.js, Express, TypeScript |
| Mobile App | ✅ Production-Ready | 1.0.0 | React Native (Expo SDK 54) |
| Web Dashboard | ✅ Production-Ready | 1.0.0 | React 18, Vite, Tailwind CSS |
| Smart Contracts | ✅ Deployed (Testnet) | 1.0.0 | Sui Move (2024.beta) |

**Last Updated:** January 2025  
**Codebase:** ~10,500 lines of TypeScript/Move code  
**Network:** Sui Testnet

### Recent Achievements
- ✅ Full-stack TypeScript implementation with strict type safety
- ✅ Cross-platform mobile support (iOS, Android, Web)
- ✅ Dynamic API configuration with automatic endpoint detection
- ✅ Real-time updates via Socket.IO
- ✅ Privacy-first blockchain integration (only hashes on-chain)
- ✅ Comprehensive security measures (JWT, rate limiting, encryption)

For detailed technical analysis and improvement roadmap, see [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md).

## 🎯 Platform Overview

SafeNet is built on a modern, scalable microservices architecture with four core components:

### Core Components

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| **Backend API** | RESTful API server | JWT auth, rate limiting, MongoDB, Socket.IO real-time updates |
| **Mobile App** | Cross-platform client | iOS/Android/Web support, offline-ready, auto-refresh, secure storage |
| **Web Dashboard** | Admin interface | Incident verification, analytics, user management, audit logs |
| **Blockchain Layer** | Immutable registry | Sui Move contracts, privacy-first design, transparent verification |

### Architecture Highlights
- **Separation of Concerns**: Clean layered architecture with service, controller, and model layers
- **Type Safety**: Full TypeScript implementation across all components
- **Security First**: Multiple layers of security including encryption, rate limiting, and RBAC
- **Scalability**: Designed for horizontal scaling with stateless API and shared database
- **Privacy**: Zero personal data on blockchain - only cryptographic hashes stored

## ✨ Key Features

### 👥 Public User Features
- **Incident Reporting**: Submit detailed reports with location, photos, and metadata
- **Verified Alerts Feed**: Real-time feed of authority-verified safety alerts with auto-refresh
- **Interactive Map View**: Geospatial visualization of incidents (mobile with fallback for web)
- **Report Tracking**: Monitor status of submitted incidents (Pending → Verified → Resolved)
- **Secure Authentication**: JWT-based auth with automatic token refresh and secure storage
- **Modern UX**: Dark/light theme support, toast notifications, password visibility toggle
- **Cross-Platform**: Seamless experience across iOS, Android, and web browsers

### 🛡️ Authority & Admin Features
- **Incident Verification Workflow**: Review, verify, reject, or resolve reported incidents
- **Advanced Dashboard**: Filter and paginate incidents by status, type, and date
- **Blockchain Integration**: Automatic on-chain recording of all verification actions
- **User Management**: View and manage user accounts with role-based permissions
- **Audit Trail**: Complete immutable history of all incident status changes
- **Real-Time Updates**: Socket.IO integration for live incident notifications
- **Verification Notes**: Add context and reasoning for verification decisions

### 🔐 Security & Blockchain
- **Immutable Records**: SHA-256 incident hashes stored permanently on Sui blockchain
- **Privacy-First Design**: Zero personal data on-chain - only cryptographic hashes
- **Transparent Verification**: Public audit trail for accountability and trust
- **Smart Contract Validation**: Status transition rules enforced at blockchain level
- **Multi-Layer Security**: Rate limiting, input validation, CORS, Helmet, bcrypt encryption
- **Role-Based Access Control**: Granular permissions (Public User, Authority, Admin)
- **Secure Token Management**: JWT access tokens (15min) + refresh tokens (7 days)

## 🏗️ Architecture

```
SafeNet/
├── src/                    # Backend API (Node.js/Express/TypeScript)
│   ├── config/            # Database and service configuration
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Auth, validation, error handling
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic (including blockchain)
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utilities (logger, crypto)
│   └── server.ts          # Application entry point
│
├── mobile/                 # Mobile App (React Native/Expo)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── screens/       # Screen components
│   │   ├── services/      # API service layer
│   │   ├── navigation/    # Navigation setup
│   │   └── context/       # React Context providers
│   └── ...
│
├── web/                    # Web Admin Dashboard (React/Vite)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── context/       # React Context
│   └── ...
│
└── sources/                # Smart Contracts (Sui Move)
    └── incident_registry.move  # Incident registry contract
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

| Requirement | Version | Purpose | Installation |
|-------------|---------|---------|--------------|
| Node.js | 18+ | Runtime environment | [nodejs.org](https://nodejs.org) |
| npm/yarn | Latest | Package manager | Included with Node.js |
| MongoDB | 5+ | Database | [mongodb.com](https://mongodb.com) or use MongoDB Atlas |
| Sui CLI | Latest | Blockchain deployment | `cargo install --locked --git https://github.com/MystenLabs/sui.git` |
| Expo CLI | Latest | Mobile development | `npm install -g expo-cli` |

### System Requirements
- **OS**: Linux, macOS, or Windows (WSL2 recommended)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space

### 1️⃣ Backend API Setup

#### Installation

```bash
# Clone the repository
git clone <repository-url>
cd safenet

# Install dependencies
npm install

# Create logs directory
mkdir -p logs
```

#### Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*

# Database
MONGODB_URI=mongodb://localhost:27017/safenet

# JWT Authentication
JWT_SECRET=your-super-secret-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Sui Blockchain (Optional - for blockchain features)
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
SUI_PRIVATE_KEY=your-private-key-hex
SUI_PACKAGE_ID=0x08dc2a934117abd6446b3f06329c9a537f576c7df3a637395018cc37d9d7473c
SUI_REGISTRY_ID=0x3b0e28ebac3caebdd010657d26d74902db981ab6ffb3ae993bb1f981015bcbf3
```

**Security Note**: Generate strong secrets using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Running the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Validate environment variables
node validate-env.js
```

**Server will be available at:** `http://localhost:3000`  
**API Documentation:** See [Backend API](#-backend-api) section below

### 2️⃣ Mobile App Setup

#### Installation

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install
```

#### API Configuration

The mobile app **automatically detects** the correct API endpoint:

| Platform | Endpoint | Configuration |
|----------|----------|---------------|
| Android Emulator | `http://10.0.2.2:3000` | ✅ Automatic |
| iOS Simulator | `http://localhost:3000` | ✅ Automatic |
| Physical Device | `http://<your-ip>:3000` | ✅ Auto-detected from Expo |
| Web Browser | `http://localhost:3000` | ✅ Automatic |

**No manual configuration needed!** The app uses Expo Constants to dynamically detect the dev server IP.

#### Running the App

```bash
# Start Expo development server
npm start

# Or with offline mode (if network issues)
npm start -- --offline

# Platform-specific commands
npm run android  # Android emulator
npm run ios      # iOS simulator
npm run web      # Web browser
```

#### Launch Options

Once the dev server starts:
- Press **`i`** for iOS simulator
- Press **`a`** for Android emulator  
- Press **`w`** for web browser
- **Scan QR code** with Expo Go app on physical device

**Troubleshooting**: See [mobile/TROUBLESHOOTING.md](mobile/TROUBLESHOOTING.md) for common issues

### 3️⃣ Web Admin Dashboard Setup

#### Installation

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install
```

#### Configuration (Optional)

Create a `.env` file in the `web` directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

If not set, defaults to `http://localhost:3000`.

#### Running the Dashboard

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run preview
```

**Dashboard will be available at:** `http://localhost:5173`

**Access Requirements**: Admin or Authority role required (create admin user with `npm run create-admin` in backend)

### 4️⃣ Smart Contracts Setup

#### Installation

```bash
# Install Sui CLI (requires Rust)
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch devnet sui

# Verify installation
sui --version
```

#### Deployment

```bash
# Build the contract
sui move build

# Publish to testnet
sui client publish --gas-budget 100000000

# Note the Package ID and Registry ID from output
```

#### Configuration

Update your backend `.env` with deployment details:

```env
SUI_PACKAGE_ID=<package-id-from-publish>
SUI_REGISTRY_ID=<registry-object-id>
SUI_PRIVATE_KEY=<your-private-key>
```

#### Current Testnet Deployment

| Parameter | Value |
|-----------|-------|
| Network | Sui Testnet |
| Package ID | `0x08dc2a934117abd6446b3f06329c9a537f576c7df3a637395018cc37d9d7473c` |
| Registry ID | `0x3b0e28ebac3caebdd010657d26d74902db981ab6ffb3ae993bb1f981015bcbf3` |
| RPC URL | `https://fullnode.testnet.sui.io:443` |

**Documentation**: See [smart-contracts/README.md](smart-contracts/README.md) for detailed contract documentation

## 📚 Documentation

Each component has detailed documentation:

- [Backend API Documentation](#backend-api) - API endpoints and usage
- [Mobile App README](mobile/README.md) - Mobile app setup and features
- [Mobile Architecture](mobile/ARCHITECTURE.md) - Mobile app architecture details
- [Mobile Troubleshooting](mobile/TROUBLESHOOTING.md) - Common issues and solutions
- [Web Dashboard README](web/README.md) - Admin dashboard guide
- [Smart Contracts README](smart-contracts/README.md) - Blockchain contract documentation
- [Project Analysis](PROJECT_ANALYSIS.md) - Comprehensive project analysis and improvement recommendations

## 🔌 Backend API Reference

### Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

### Authentication Endpoints

#### 1. Register User
Create a new user account.

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "public_user"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### 2. Login
Authenticate existing user.

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### 3. Refresh Token
Get new access token using refresh token.

```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 4. Get Current User
Retrieve authenticated user details.

```http
GET /api/auth/me
Authorization: Bearer <accessToken>
```

### Incident Endpoints

#### 1. Create Incident
Report a new incident (requires authentication).

```http
POST /api/incidents
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "type": "missing_person",
  "title": "Missing Child - Age 5",
  "description": "Last seen at Central Park around 3 PM...",
  "location": {
    "address": "123 Main St, City, Country",
    "coordinates": {
      "lat": 5.6037,
      "lng": -0.1870
    }
  },
  "metadata": {
    "age": 5,
    "gender": "male",
    "height": "3'5\"",
    "lastSeen": "2025-01-28T15:00:00Z"
  }
}
```

**Incident Types:**
- `missing_person` - Missing persons
- `kidnapping` - Kidnapping incidents
- `stolen_vehicle` - Stolen vehicles
- `natural_disaster` - Natural disasters
- `other` - Other incidents

#### 2. Get Verified Alerts (Public)
Retrieve verified incidents (no authentication required).

```http
GET /api/incidents/alerts/verified?page=1&limit=20
```

#### 3. Get All Incidents (Admin/Authority)
Retrieve all incidents with filters.

```http
GET /api/incidents?status=1&type=missing_person&page=1&limit=20
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `status` - Filter by status (0-3)
- `type` - Filter by incident type
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

#### 4. Get Incident Details
Retrieve specific incident by ID.

```http
GET /api/incidents/:id
Authorization: Bearer <accessToken>
```

#### 5. Update Incident Status (Admin/Authority Only)
Verify, reject, or resolve an incident.

```http
PATCH /api/incidents/:id/status
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "status": 1,
  "verificationNotes": "Verified by local police department. Case #12345"
}
```

### Data Models

#### Incident Status Enum
| Value | Status | Description |
|-------|--------|-------------|
| `0` | Pending | Awaiting verification |
| `1` | Verified | Confirmed by authorities |
| `2` | False | False alarm / Invalid |
| `3` | Resolved | Incident resolved |

#### User Roles
| Role | Permissions | Description |
|------|-------------|-------------|
| `public_user` | Report incidents, view verified alerts | Default role for registered users |
| `authority` | All public_user + verify/reject incidents | Law enforcement, emergency services |
| `admin` | All authority + user management | System administrators |

### Rate Limits

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| General API | 100 requests | 15 minutes |
| Authentication | 5 attempts | 15 minutes |
| Incident Creation | 10 requests | 1 hour |

### WebSocket Events (Socket.IO)

Connect to: `ws://localhost:3000`

**Events:**
- `incident:created` - New incident reported
- `incident:verified` - Incident verified by authority
- `incident:updated` - Incident status changed
- `incident:resolved` - Incident marked as resolved

## 🏗️ Project Structure

```
SafeNet/
├── src/                          # Backend API (Node.js/Express/TypeScript)
│   ├── config/                   # Configuration (database, cloudinary, socket)
│   ├── controllers/              # Request handlers (auth, incidents)
│   ├── middleware/               # Auth, validation, error handling, rate limiting
│   ├── models/                   # Mongoose schemas (User, Incident)
│   ├── routes/                   # API route definitions
│   ├── services/                 # Business logic (auth, incidents, blockchain)
│   ├── types/                    # TypeScript type definitions
│   ├── utils/                    # Utilities (logger, crypto)
│   └── server.ts                 # Application entry point
│
├── mobile/                       # Mobile App (React Native/Expo)
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── config/              # API configuration
│   │   ├── context/             # React Context (Auth, Theme, Notifications)
│   │   ├── navigation/          # Navigation setup
│   │   ├── screens/             # Screen components (12 screens)
│   │   ├── services/            # API service layer
│   │   ├── theme/               # Theme configuration
│   │   ├── types/               # TypeScript types
│   │   └── utils/               # Utilities (storage, validation, error boundary)
│   ├── App.tsx                  # Main app component
│   └── index.js                 # Entry point
│
├── web/                          # Web Admin Dashboard (React/Vite)
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── config/              # API configuration
│   │   ├── context/             # React Context (Auth)
│   │   ├── pages/               # Page components (Dashboard, Login, etc.)
│   │   ├── services/            # API services
│   │   ├── types/               # TypeScript types
│   │   └── utils/               # Utilities
│   └── index.html               # HTML entry point
│
├── sources/                      # Smart Contracts (Sui Move)
│   └── incident_registry.move   # Incident registry contract
│
├── scripts/                      # Utility scripts
│   ├── create-admin.ts          # Create admin user
│   ├── check-blockchain.ts      # Verify blockchain connection
│   └── submit-pending-to-blockchain.ts
│
├── logs/                         # Application logs
│   ├── combined.log             # All logs
│   └── error.log                # Error logs only
│
├── .env                          # Environment variables (not in git)
├── Move.toml                     # Sui Move package config
├── package.json                  # Backend dependencies
└── README.md                     # This file
```

### Code Statistics
- **Total Lines**: ~10,500 lines of TypeScript/Move code
- **Backend**: ~3,500 lines
- **Mobile**: ~5,000 lines
- **Web**: ~1,500 lines
- **Smart Contracts**: ~500 lines

## ⛓️ Blockchain Integration

SafeNet uses **Sui Move** smart contracts to provide an immutable registry for incident verification.

### Key Features
- ✅ Only incident hashes (SHA256) stored on-chain - no personal data
- ✅ Status transitions enforced by smart contract logic
- ✅ Complete audit trail for all verifications
- ✅ Transaction verification and querying capabilities

### Contract Architecture

The `IncidentRegistry` contract provides:
- `submit_incident` - Submit incident hash to registry
- `update_status` - Update verification status (Verified/False/Resolved)
- View functions for querying incident records

See [smart-contracts/README.md](smart-contracts/README.md) for detailed documentation.

## 🛠️ Technology Stack

### Backend API
| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Runtime | Node.js | 18+ | JavaScript runtime |
| Framework | Express.js | 4.18+ | Web application framework |
| Language | TypeScript | 5.3+ | Type-safe development |
| Database | MongoDB | 5+ | Document database with Mongoose ODM |
| Authentication | JWT | 9.0+ | Stateless authentication with refresh tokens |
| Blockchain | Sui SDK | 1.45.2 | Blockchain integration |
| Security | Helmet, bcrypt, rate-limit | Latest | Multi-layer security |
| File Storage | Cloudinary | 2.8+ | Cloud-based media management |
| Logging | Winston | 3.11+ | Structured logging |
| Real-Time | Socket.IO | 4.8+ | WebSocket communication |

### Mobile Application
| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | React Native (Expo) | SDK 54 | Cross-platform mobile development |
| Language | TypeScript | 5.1+ | Type safety |
| Navigation | React Navigation | 6.1+ | Stack and tab navigation |
| Maps | React Native Maps | 1.20+ | Geospatial visualization |
| Storage | Expo SecureStore | 15.0+ | Encrypted credential storage |
| HTTP Client | Axios | 1.6+ | API communication with interceptors |
| State Management | React Context API | - | Global state management |
| Icons | Expo Vector Icons | 15.0+ | Icon library |

### Web Dashboard
| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | React | 18.2+ | UI library |
| Language | TypeScript | 5.2+ | Type safety |
| Build Tool | Vite | 5.0+ | Fast build and HMR |
| Routing | React Router | 6.20+ | Client-side routing |
| Styling | Tailwind CSS | 3.3+ | Utility-first CSS framework |
| HTTP Client | Axios | 1.6+ | API communication |

### Blockchain Layer
| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Platform | Sui Network | Testnet | Layer-1 blockchain |
| Language | Move | 2024.beta | Smart contract language |
| Network | Sui Testnet | - | Testing environment |
| Package ID | 0x08dc2a93... | - | Deployed contract address |

## 📦 Available Scripts

### Backend Scripts

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run dev` | Start development server with hot reload | Development |
| `npm run build` | Compile TypeScript to JavaScript | Pre-deployment |
| `npm start` | Run production build | Production |
| `npm run lint` | Lint code with ESLint | Code quality |
| `npm run create-admin` | Create admin user interactively | Initial setup |
| `npm run check-blockchain` | Verify blockchain connection | Debugging |
| `npm run view-tx` | View transaction details by digest | Blockchain audit |
| `npm run submit-pending` | Submit pending incidents to blockchain | Batch operations |

### Mobile Scripts

| Command | Description | Usage |
|---------|-------------|-------|
| `npm start` | Start Expo development server | Development |
| `npm run android` | Launch on Android emulator | Android testing |
| `npm run ios` | Launch on iOS simulator | iOS testing |
| `npm run web` | Launch in web browser | Web testing |

### Web Dashboard Scripts

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run dev` | Start Vite development server | Development |
| `npm run build` | Build for production | Deployment |
| `npm run preview` | Preview production build | Pre-deployment testing |
| `npm run lint` | Lint code with ESLint | Code quality |

## 🧪 Testing & Validation

### Backend Testing

```bash
# Run all tests (when implemented)
npm test

# Integration tests
node test-integration.js

# API endpoint tests
bash test-backend.sh

# Blockchain integration tests
node test-blockchain.js

# Validate environment configuration
node validate-env.js
```

### Manual Testing

```bash
# Test API health
curl http://localhost:3000/api/incidents/alerts/verified

# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

**Note**: Comprehensive test suite implementation is planned (see [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md) for roadmap)

## � ESecurity Best Practices

### Production Deployment Checklist

- [ ] **Environment Variables**: Never commit `.env` files - use environment-specific configs
- [ ] **Secrets**: Generate strong JWT secrets (32+ characters, random)
- [ ] **CORS**: Restrict `CORS_ORIGIN` to specific domains (not `*`)
- [ ] **HTTPS**: Use HTTPS in production for all API endpoints
- [ ] **Rate Limiting**: Adjust rate limits based on expected traffic
- [ ] **Database**: Use MongoDB Atlas or secured MongoDB instance with authentication
- [ ] **Cloudinary**: Restrict API keys to specific domains/IPs
- [ ] **Blockchain**: Secure private keys with hardware wallets or key management services
- [ ] **Monitoring**: Set up error tracking (Sentry) and uptime monitoring
- [ ] **Backups**: Implement automated database backups

### Security Features

| Feature | Implementation | Status |
|---------|----------------|--------|
| Authentication | JWT with refresh tokens | ✅ Implemented |
| Password Hashing | bcrypt (12 rounds) | ✅ Implemented |
| Rate Limiting | Express rate limit | ✅ Implemented |
| Input Validation | express-validator | ✅ Implemented |
| Security Headers | Helmet.js | ✅ Implemented |
| CORS Protection | Configurable origins | ✅ Implemented |
| SQL Injection | MongoDB (NoSQL) | ✅ Protected |
| XSS Protection | Input sanitization | ✅ Implemented |
| CSRF Protection | Stateless JWT | ✅ Protected |

## 🐛 Error Handling & API Responses

### Standard Response Format

All API responses follow a consistent structure:

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| `200` | OK | Successful GET, PATCH, DELETE |
| `201` | Created | Successful POST (resource created) |
| `400` | Bad Request | Validation errors, malformed request |
| `401` | Unauthorized | Missing or invalid authentication token |
| `403` | Forbidden | Insufficient permissions for action |
| `404` | Not Found | Resource does not exist |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Unexpected server error |

### Error Logging

All errors are logged to:
- **Console**: Development environment
- **Files**: `logs/error.log` and `logs/combined.log`
- **Format**: Structured JSON with timestamps and context

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork** the repository
2. **Clone** your fork: `git clone <your-fork-url>`
3. **Create** a feature branch: `git checkout -b feature/your-feature-name`
4. **Make** your changes with clear, descriptive commits
5. **Test** your changes thoroughly
6. **Lint** your code: `npm run lint`
7. **Push** to your fork: `git push origin feature/your-feature-name`
8. **Open** a Pull Request with a clear description

### Code Standards

- **TypeScript**: Use strict type checking
- **Formatting**: Follow existing code style
- **Comments**: Document complex logic
- **Commits**: Use conventional commit messages
- **Testing**: Add tests for new features (when test suite is implemented)

### Areas for Contribution

- 🧪 Test coverage (high priority)
- 📚 Documentation improvements
- 🐛 Bug fixes
- ✨ New features (discuss in issues first)
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations

See [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md) for improvement roadmap.

## 📄 License

ISC

## 🆘 Support & Troubleshooting

### Documentation Resources

| Resource | Description | Link |
|----------|-------------|------|
| Project Analysis | Technical analysis and improvement roadmap | [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md) |
| Mobile Architecture | Mobile app architecture details | [mobile/ARCHITECTURE.md](mobile/ARCHITECTURE.md) |
| Mobile Troubleshooting | Common mobile issues and solutions | [mobile/TROUBLESHOOTING.md](mobile/TROUBLESHOOTING.md) |
| Mobile Quick Start | Mobile setup guide | [mobile/QUICKSTART.md](mobile/QUICKSTART.md) |
| Web Dashboard Guide | Admin dashboard documentation | [web/README.md](web/README.md) |
| Smart Contracts | Blockchain contract documentation | [smart-contracts/README.md](smart-contracts/README.md) |

### Common Issues

#### Mobile App Issues

**Network Errors:**
- ✅ App automatically detects correct API endpoint
- Ensure backend is running on `0.0.0.0:3000` (not just `localhost`)
- Check firewall settings for physical devices
- Verify both devices are on the same WiFi network

**Expo Start Issues:**
- Port 8081 in use: Kill process or use `--offline` flag
- Network fetch errors: `npx expo start --offline`
- Clear cache: `npx expo start --clear`

#### Backend Issues

**Connection Problems:**
- Verify MongoDB is running: `mongosh` or check MongoDB Atlas
- Validate environment: `node validate-env.js`
- Check logs: `tail -f logs/combined.log`
- Test API: `curl http://localhost:3000/api/incidents/alerts/verified`

**Blockchain Issues:**
- Verify Sui CLI: `sui --version`
- Check network: `sui client active-env`
- Test connection: `npm run check-blockchain`

### Getting Help

1. **Check Documentation**: Review component-specific READMEs
2. **Validate Setup**: Run `node validate-env.js`
3. **Check Logs**: Review `logs/error.log` for backend errors
4. **Search Issues**: Check existing GitHub issues
5. **Open Issue**: Create detailed issue with error logs and steps to reproduce

---

## 🎉 Acknowledgments

Built with modern technologies and best practices for public safety and community protection.

### Key Technologies
- [Node.js](https://nodejs.org) - JavaScript runtime
- [React Native](https://reactnative.dev) - Mobile framework
- [Expo](https://expo.dev) - React Native platform
- [Sui Blockchain](https://sui.io) - Layer-1 blockchain
- [MongoDB](https://mongodb.com) - NoSQL database
- [TypeScript](https://typescriptlang.org) - Type-safe JavaScript

---

## 📄 License

ISC License - See LICENSE file for details

---

<div align="center">

**SafeNet** - Building safer communities through transparent, trusted incident reporting.

*Powered by blockchain technology for immutable verification and public accountability*

**[Report Issue](../../issues)** • **[Request Feature](../../issues)** • **[Documentation](PROJECT_ANALYSIS.md)**

</div>
