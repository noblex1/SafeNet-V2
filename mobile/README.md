# SafeNet Mobile App

React Native mobile application for SafeNet - a public safety alert platform for African communities.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Incident Reporting**: Report incidents (missing persons, kidnappings, stolen vehicles, disasters)
- **Verified Alerts Feed**: View verified incident alerts from authorities
- **Map View**: See incidents on an interactive map
- **My Reports**: Track the status of your reported incidents
- **Location Services**: Automatic location detection for incident reporting

## Tech Stack

- React Native (Expo)
- TypeScript
- React Navigation
- Axios for API calls
- Expo SecureStore for token storage
- React Native Maps for map view
- Expo Location for location services

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Studio (for Android development)

### Installation

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Configure API endpoint:
   - Open `src/config/api.ts`
   - Update `API_BASE_URL` with your backend server URL:
     - For Android emulator: `http://10.0.2.2:3000`
     - For iOS simulator: `http://localhost:3000`
     - For physical device: Use your computer's IP address (e.g., `http://192.168.1.100:3000`)

### Running the App

1. Start the Expo development server:
```bash
npm start
```

2. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

### Building for Production

#### iOS
```bash
expo build:ios
```

#### Android
```bash
expo build:android
```

## Project Structure

```
mobile/
├── src/
│   ├── components/       # Reusable UI components
│   ├── config/           # Configuration files
│   ├── context/          # React Context providers
│   ├── navigation/       # Navigation setup
│   ├── screens/          # Screen components
│   ├── services/         # API service layer
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── App.tsx               # Main app entry point
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript configuration
```

## Key Features Implementation

### Authentication
- JWT-based authentication with secure token storage
- Automatic token refresh on expiration
- Protected routes based on authentication state

### Incident Reporting
- Form validation for all inputs
- Location detection using device GPS
- Support for multiple incident types
- Image upload support (ready for implementation)

### Security
- Secure token storage using Expo SecureStore
- Input validation on all forms
- No hardcoded secrets
- API error handling

### UX Considerations
- Mobile-first design
- Low-bandwidth friendly (minimal data usage)
- Pull-to-refresh on feeds
- Loading states and error handling
- Simple, intuitive navigation

## API Integration

The app integrates with the SafeNet backend API. Ensure your backend is running and accessible at the configured `API_BASE_URL`.

### Required Backend Endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Token refresh
- `GET /api/auth/me` - Get current user
- `GET /api/incidents/alerts/verified` - Get verified alerts
- `POST /api/incidents` - Create incident
- `GET /api/incidents` - Get incidents
- `GET /api/incidents/:id` - Get incident details

## Environment Configuration

Update the API base URL in `src/config/api.ts` based on your development environment.

## Troubleshooting

### Common Issues

1. **Network Error**: Ensure your backend is running and the API_BASE_URL is correct
2. **Location Permission**: Grant location permissions when prompted
3. **Token Expired**: The app automatically refreshes tokens, but you may need to log in again

## License

ISC
