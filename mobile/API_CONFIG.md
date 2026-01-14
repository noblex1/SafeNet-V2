# API Configuration Guide

## Current Configuration

The API base URL is configured in `src/config/api.ts`.

**Current setting**: `http://localhost:3000` (works for iOS simulator)

## Platform-Specific URLs

### iOS Simulator
```typescript
export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://api.safenet.app';
```
✅ This is the current setting - works for iOS simulator

### Android Emulator
```typescript
export const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:3000'  // Android emulator uses 10.0.2.2 for localhost
  : 'https://api.safenet.app';
```

### Physical Device (iOS/Android)
```typescript
export const API_BASE_URL = __DEV__
  ? 'http://192.168.1.XXX:3000'  // Replace XXX with your computer's IP
  : 'https://api.safenet.app';
```

**To find your computer's IP:**
- **Linux/Mac**: Run `ifconfig` or `ip addr` and look for your local network IP (usually 192.168.x.x)
- **Windows**: Run `ipconfig` and look for IPv4 Address

## Quick Change

Edit `src/config/api.ts` and update line 11-12:

```typescript
export const API_BASE_URL = __DEV__
  ? 'http://YOUR_URL_HERE:3000'
  : 'https://api.safenet.app';
```

## Verify Backend is Running

Make sure your SafeNet backend is running:
```bash
cd /home/phantomx/Videos/SafeNet
npm run dev
```

The backend should be accessible at `http://localhost:3000/api`

## Testing Connection

After starting the app, try to:
1. Register a new account
2. If you get a network error, check:
   - Backend is running
   - API_BASE_URL matches your platform
   - Firewall isn't blocking the connection
