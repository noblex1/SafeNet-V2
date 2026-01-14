# SafeNet Backend - Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB 5+ running locally or accessible
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy from .env.example (if it exists) or create manually
cat > .env << EOF
NODE_ENV=development
PORT=3000

MONGODB_URI=mongodb://localhost:27017/safenet

JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

BLOCKCHAIN_RPC_URL=https://fullnode.testnet.sui.io:443
BLOCKCHAIN_NETWORK=testnet

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

BCRYPT_ROUNDS=12
EOF
```

**Important**: Change the JWT secrets to strong, random strings in production!

### 3. Create Logs Directory

```bash
mkdir -p logs
```

### 4. Start MongoDB

Make sure MongoDB is running:

```bash
# Using systemd (Linux)
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or check if already running
mongosh --eval "db.adminCommand('ping')"
```

### 5. Start Development Server

```bash
npm run dev
```

The server should start on `http://localhost:3000`

### 6. Test the API

```bash
# Health check
curl http://localhost:3000/api/health

# Expected response:
# {"success":true,"message":"SafeNet API is running","timestamp":"..."}
```

## Creating Your First User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+233123456789"
  }'
```

Save the `accessToken` and `refreshToken` from the response.

## Creating Your First Incident

```bash
curl -X POST http://localhost:3000/api/incidents \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "missing_person",
    "title": "Test Missing Person Report",
    "description": "This is a test incident report for verification purposes.",
    "location": {
      "address": "Accra, Ghana"
    }
  }'
```

## Creating an Admin User

To create an admin user, you'll need to manually update the database or add a seed script:

```javascript
// Using MongoDB shell or Mongoose
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or use Mongoose in a script:

```typescript
import User from './src/models/User';
import { UserRole } from './src/types';

const makeAdmin = async () => {
  await User.updateOne(
    { email: 'admin@example.com' },
    { role: UserRole.ADMIN }
  );
};
```

## Common Issues

### MongoDB Connection Error

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**: 
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` is correct
- Verify MongoDB port (default: 27017)

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
- Change `PORT` in `.env` to a different port
- Or stop the process using port 3000: `lsof -ti:3000 | xargs kill`

### JWT Secret Not Set

**Error**: `JWT_SECRET is not configured`

**Solution**: Ensure `.env` file exists and contains `JWT_SECRET` and `JWT_REFRESH_SECRET`

### TypeScript Compilation Errors

**Error**: Type errors during build

**Solution**:
- Run `npm install` to ensure all dependencies are installed
- Check `tsconfig.json` is correct
- Ensure Node.js version is 18+

## Next Steps

1. Review `README.md` for complete API documentation
2. Check `API_EXAMPLES.md` for more API usage examples
3. Read `ARCHITECTURE.md` for system design details
4. Set up your frontend to connect to this API

## Production Deployment

Before deploying to production:

1. ✅ Set strong, random JWT secrets (min 32 characters)
2. ✅ Use environment-specific MongoDB URI
3. ✅ Configure proper CORS origins
4. ✅ Set `NODE_ENV=production`
5. ✅ Enable HTTPS/TLS
6. ✅ Set up log rotation
7. ✅ Configure monitoring and alerts
8. ✅ Review rate limiting settings
9. ✅ Set up database backups
10. ✅ Configure firewall rules

## Development Commands

```bash
# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

## Project Structure

```
SafeNet/
├── src/              # Source code
├── logs/            # Application logs
├── dist/            # Compiled JavaScript (after build)
├── .env             # Environment variables (create this)
├── package.json     # Dependencies and scripts
├── tsconfig.json    # TypeScript configuration
└── README.md        # Full documentation
```

## Support

For issues or questions:
1. Check the documentation files (README.md, ARCHITECTURE.md)
2. Review API examples (API_EXAMPLES.md)
3. Check application logs in `logs/` directory
