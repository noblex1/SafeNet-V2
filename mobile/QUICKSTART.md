# SafeNet Mobile App - Quick Start Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Studio (for Android)

## Setup Steps

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure API Endpoint

Edit `src/config/api.ts` and update the `API_BASE_URL`:

```typescript
export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000'  // Change this!
  : 'https://api.safenet.app';
```

**Important**: Update based on your setup:
- **iOS Simulator**: `http://localhost:3000`
- **Android Emulator**: `http://10.0.2.2:3000`
- **Physical Device**: `http://YOUR_COMPUTER_IP:3000` (e.g., `http://192.168.1.100:3000`)

### 3. Start Backend Server

Make sure your SafeNet backend is running on port 3000 (or update the URL above).

```bash
# In the backend directory
npm run dev
```

### 4. Start Expo Development Server

```bash
npm start
```

### 5. Run on Device/Emulator

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

## First Run

1. **Register a new account** or **login** with existing credentials
2. Explore the **Alerts** tab to see verified incidents
3. Tap the **+** button to report a new incident
4. Check **My Reports** to track your submitted incidents
5. View incidents on the **Map** tab

## Testing the App

### Test User Flow

1. **Registration**
   - Fill in all required fields
   - Password must have uppercase, lowercase, and number
   - Phone number validation

2. **Login**
   - Use registered credentials
   - Tokens stored securely

3. **Report Incident**
   - Select incident type
   - Fill title (min 5 chars)
   - Fill description (min 20 chars)
   - Enter location or use "Use Current Location"
   - Submit

4. **View Alerts**
   - See verified incidents in feed
   - Pull down to refresh
   - Tap incident to see details

5. **My Reports**
   - View your submitted incidents
   - See status updates
   - Logout option available

## Troubleshooting

### "Network Error"
- Check backend is running
- Verify API_BASE_URL is correct
- Check firewall/network settings

### "Location Permission Denied"
- Grant location permissions when prompted
- Check device settings

### "Token Expired"
- App should auto-refresh
- If persists, logout and login again

### Build Errors
- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Next Steps

- Review `ARCHITECTURE.md` for detailed architecture
- Check `README.md` for full documentation
- Customize UI colors/styles in component files
- Add image upload functionality
- Implement push notifications

## Support

For issues or questions, refer to:
- Expo Documentation: https://docs.expo.dev
- React Navigation: https://reactnavigation.org
- React Native: https://reactnative.dev
