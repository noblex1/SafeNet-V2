# Troubleshooting Guide

## Common Issues and Solutions

### 1. Expo Go Compatibility Error
**Error**: "Project is incompatible with this version of Expo Go"

**Solution**: 
- ✅ Fixed: Project upgraded to Expo SDK 54
- Make sure your Expo Go app is updated to the latest version
- Clear Expo Go cache: Settings → Clear Cache

### 2. App Won't Load on Phone

**Checklist**:
1. ✅ Entry point fixed: Changed from `expo-router/entry` to `index.js`
2. ✅ Removed expo-router (we use React Navigation)
3. ✅ Added required dependencies: `react-native-gesture-handler`, `react-native-reanimated`
4. ✅ Babel config updated for Reanimated

**If still failing**:
- Make sure phone and computer are on the same WiFi network
- Check firewall isn't blocking port 19000
- Try using tunnel mode: `npx expo start --tunnel`
- Clear cache: `npx expo start --clear`

### 3. Network Connection Issues

**Symptoms**: Can't connect to backend API

**Solutions**:
- For Android emulator: Update `API_BASE_URL` to `http://10.0.2.2:3000`
- For iOS simulator: Use `http://localhost:3000`
- For physical device: Use your computer's IP (e.g., `http://192.168.1.100:3000`)
- Check backend is running: `cd /home/phantomx/Videos/SafeNet && npm run dev`

### 4. Metro Bundler Errors

**Solutions**:
- Clear cache: `npx expo start --clear`
- Delete node_modules: `rm -rf node_modules && npm install`
- Reset Metro: `npx expo start --reset-cache`

### 5. Build Errors

**Common fixes**:
```bash
# Clean everything
cd mobile
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

## Current Configuration

- **Expo SDK**: 54.0.0
- **React Native**: 0.76.5
- **Entry Point**: `index.js` → `App.tsx`
- **Navigation**: React Navigation (not Expo Router)

## Quick Fixes

### Restart Everything
```bash
# Kill all Expo processes
pkill -f expo

# Restart backend
cd /home/phantomx/Videos/SafeNet
npm run dev

# Restart mobile app
cd /home/phantomx/Videos/SafeNet/mobile
npx expo start --clear
```

### Check Server Status
```bash
# Backend
curl http://localhost:3000/api/incidents/alerts/verified

# Should return JSON response
```

### Update API URL for Your Device
Edit `mobile/src/config/api.ts`:
```typescript
export const API_BASE_URL = __DEV__
  ? 'http://YOUR_COMPUTER_IP:3000'  // Change this
  : 'https://api.safenet.app';
```

## Still Having Issues?

1. Check Expo Go app version matches SDK 54
2. Verify backend is running and accessible
3. Check network connectivity
4. Review error logs in Expo Go: Tap "View error log"
5. Try tunnel mode if on different networks
