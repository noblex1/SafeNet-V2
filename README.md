# SafeNet

**SafeNet** is a comprehensive public safety alert platform designed to help communities report, verify, and respond to incidents such as missing persons, kidnappings, stolen vehicles, and natural disasters. The platform combines traditional web technologies with blockchain immutability to provide a secure, transparent, and trusted incident reporting system.

## 🎯 Overview

SafeNet consists of four main components:

- **Backend API** - RESTful API built with Node.js, Express, and TypeScript
- **Mobile Application** - Cross-platform mobile app built with React Native and Expo
- **Web Admin Dashboard** - React-based administrative interface for authorities
- **Blockchain Smart Contracts** - Sui Move contracts for immutable incident verification

## ✨ Key Features

### For Public Users
- 📱 **Incident Reporting** - Report incidents with location, photos, and details
- 🔔 **Verified Alerts Feed** - View verified safety alerts from authorities
- 🗺️ **Interactive Map View** - Visualize incidents on a map
- 📋 **My Reports** - Track the status of your reported incidents
- 🔐 **Secure Authentication** - JWT-based authentication with secure token storage

### For Administrators & Authorities
- ✅ **Incident Verification** - Verify, reject, or resolve reported incidents
- 📊 **Dashboard Analytics** - View and filter all incidents with pagination
- 🔗 **Blockchain Integration** - All verifications recorded immutably on-chain
- 👥 **User Management** - Manage user accounts and permissions
- 📝 **Audit Trail** - Complete blockchain audit log for transparency

### Blockchain & Security
- 🔒 **Immutable Records** - Incident hashes stored on Sui blockchain
- 🛡️ **Privacy-First** - No personal data stored on-chain, only cryptographic hashes
- ✅ **Status Verification** - Transparent verification workflow with on-chain status
- 🔍 **Audit Logging** - Complete transaction history for compliance

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

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **MongoDB** 5+ (local or cloud instance)
- **Sui CLI** (for blockchain deployment)
- **Expo CLI** (for mobile development) - `npm install -g expo-cli`

### Backend API Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/safenet
   JWT_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   PORT=3000
   NODE_ENV=development
   
   # Blockchain configuration (optional)
   SUI_NETWORK=testnet
   SUI_RPC_URL=https://fullnode.testnet.sui.io:443
   SUI_PRIVATE_KEY=your-private-key
   SUI_PACKAGE_ID=your-package-id
   SUI_REGISTRY_ID=your-registry-id
   ```

3. **Create logs directory:**
   ```bash
   mkdir -p logs
   ```

4. **Start the server:**
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production build
   npm run build
   npm start
   ```

The API will be available at `http://localhost:3000`

### Mobile App Setup

1. **Navigate to mobile directory:**
   ```bash
   cd mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API endpoint:**
   
   Edit `src/config/api.ts` with your backend URL:
   - Android emulator: `http://10.0.2.2:3000`
   - iOS simulator: `http://localhost:3000`
   - Physical device: `http://YOUR_IP_ADDRESS:3000`

4. **Start Expo development server:**
   ```bash
   npm start
   ```

5. **Run on device/simulator:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

### Web Admin Dashboard Setup

1. **Navigate to web directory:**
   ```bash
   cd web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API endpoint (optional):**
   
   Create `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

The dashboard will be available at `http://localhost:5173`

### Smart Contracts Setup

1. **Install Sui CLI:**
   ```bash
   cargo install --locked --git https://github.com/MystenLabs/sui.git --branch devnet sui
   ```

2. **Publish contract:**
   ```bash
   sui client publish --gas-budget 100000000
   ```

3. **Set environment variables:**
   - `SUI_PACKAGE_ID` - Package ID from publish output
   - `SUI_REGISTRY_ID` - Registry object ID from initialization

## 📚 Documentation

Each component has detailed documentation:

- [Backend API Documentation](#backend-api) - API endpoints and usage
- [Mobile App README](mobile/README.md) - Mobile app setup and features
- [Web Dashboard README](web/README.md) - Admin dashboard guide
- [Smart Contracts README](smart-contracts/README.md) - Blockchain contract documentation

## 🔌 Backend API

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
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

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Incident Endpoints

#### Create Incident
```http
POST /api/incidents
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "type": "missing_person",
  "title": "Missing Child - Age 5",
  "description": "Last seen at location...",
  "location": {
    "address": "123 Main St, City",
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

#### Get Incidents (with filters)
```http
GET /api/incidents?status=1&type=missing_person&page=1&limit=20
Authorization: Bearer <accessToken>
```

#### Get Verified Alerts (Public - No Auth)
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

### Incident Status Enum

- `0` = Pending
- `1` = Verified
- `2` = False
- `3` = Resolved

### User Roles

- **`public_user`** - Can report incidents, view verified alerts
- **`admin`** - Can verify/reject incidents, view all incidents
- **`authority`** - Same as admin (for future differentiation)

## 🔒 Security Features

### Authentication & Authorization
- **JWT Authentication** - Access tokens (15min) + Refresh tokens (7 days)
- **Password Hashing** - bcrypt with configurable rounds
- **Role-Based Access Control (RBAC)** - Admin, Authority, and Public User roles

### API Security
- **Rate Limiting:**
  - General: 100 requests per 15 minutes
  - Auth: 5 attempts per 15 minutes
  - Incident creation: 10 per hour
- **Input Validation** - express-validator on all endpoints
- **Helmet** - Security headers
- **CORS** - Configurable origins
- **Error Handling** - Centralized error handling without exposing internals

### Blockchain Security
- **Privacy-First Design** - Only cryptographic hashes stored on-chain
- **Immutable Audit Trail** - All status changes recorded permanently
- **Status Validation** - Smart contract enforces valid status transitions

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

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, CORS, bcrypt
- **Blockchain:** Sui SDK (@mysten/sui)
- **File Storage:** Cloudinary
- **Logging:** Winston

### Mobile
- **Framework:** React Native (Expo)
- **Language:** TypeScript
- **Navigation:** React Navigation
- **Maps:** React Native Maps
- **Storage:** Expo SecureStore
- **API Client:** Axios

### Web
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Routing:** React Router
- **Styling:** Tailwind CSS
- **API Client:** Axios

### Blockchain
- **Platform:** Sui Network
- **Language:** Move
- **Edition:** 2024.beta

## 📦 Scripts

### Backend
```bash
npm run dev              # Start development server
npm run build            # Build TypeScript
npm start                # Run production build
npm run lint             # Lint code
npm run create-admin     # Create admin user
npm run check-blockchain # Check blockchain status
npm run view-tx          # View transaction details
npm run submit-pending   # Submit pending incidents to blockchain
```

### Mobile
```bash
npm start                # Start Expo dev server
npm run android          # Run on Android
npm run ios              # Run on iOS
npm run web              # Run on web
```

### Web
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Lint code
```

## 🧪 Testing

```bash
# Backend tests
npm test

# Run integration tests
./test-integration.js

# Test backend endpoints
./test-backend.sh

# Validate environment
node validate-env.js
```

## 📝 Environment Variables

### Backend Required Variables

```env
MONGODB_URI=mongodb://localhost:27017/safenet
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
```

### Backend Optional (Blockchain)

```env
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
SUI_PRIVATE_KEY=your-private-key-hex
SUI_PACKAGE_ID=0x...
SUI_REGISTRY_ID=0x...
```

### Web Optional

```env
VITE_API_BASE_URL=http://localhost:3000
```

## 🐛 Error Handling

All API errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Validation errors if applicable
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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

ISC

## 🆘 Support

For issues, questions, or contributions:
- Check the component-specific README files for detailed documentation
- Review the troubleshooting guides in each component
- Open an issue on the repository

---

**SafeNet** - Building safer communities through transparent, trusted incident reporting.
