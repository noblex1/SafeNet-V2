# SafeNet Mobile App - Architecture Overview

## Architecture Summary

The SafeNet mobile app is built using React Native with Expo, following a clean architecture pattern with clear separation of concerns.

### Key Architectural Decisions

1. **Expo Framework**: Chosen for easier development and deployment
2. **TypeScript**: Full type safety across the application
3. **Context API**: For global state management (authentication)
4. **Service Layer**: Centralized API communication
5. **Component-Based**: Reusable UI components
6. **Secure Storage**: Expo SecureStore for sensitive data

## Project Structure

```
mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── IncidentCard.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── FloatingActionButton.tsx
│   │
│   ├── config/              # Configuration files
│   │   └── api.ts           # API endpoints and base URL
│   │
│   ├── context/             # React Context providers
│   │   └── AuthContext.tsx  # Global authentication state
│   │
│   ├── navigation/          # Navigation setup
│   │   └── AppNavigator.tsx # Main navigation structure
│   │
│   ├── screens/             # Screen components
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ReportIncidentScreen.tsx
│   │   ├── IncidentDetailScreen.tsx
│   │   ├── MyReportsScreen.tsx
│   │   └── MapViewScreen.tsx
│   │
│   ├── services/            # API service layer
│   │   ├── api.ts          # Base API client with interceptors
│   │   ├── authService.ts  # Authentication API calls
│   │   └── incidentService.ts # Incident API calls
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts        # Shared types and interfaces
│   │
│   └── utils/              # Utility functions
│       ├── secureStorage.ts # Token storage utilities
│       └── validation.ts   # Input validation functions
│
├── App.tsx                  # Main app entry point
├── app.json                 # Expo configuration
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript configuration
```

## Data Flow

### Authentication Flow

1. User enters credentials → `LoginScreen`
2. `LoginScreen` calls `authService.login()`
3. `authService` uses `apiService` to make API call
4. Tokens stored via `secureStorage`
5. `AuthContext` updates with user data
6. Navigation automatically switches to authenticated stack

### Incident Reporting Flow

1. User fills form → `ReportIncidentScreen`
2. Form validation via `validation.ts` utilities
3. Location fetched via Expo Location API
4. `incidentService.createIncident()` called
5. Success → Navigate back to feed
6. Error → Display error message

### Data Fetching Flow

1. Screen component mounts
2. Calls service method (e.g., `incidentService.getVerifiedAlerts()`)
3. Service uses `apiService` (handles auth headers automatically)
4. API interceptor adds JWT token
5. Response parsed and returned
6. Component updates state with data

## Security Implementation

### Token Management
- **Storage**: Expo SecureStore (encrypted keychain/keystore)
- **Refresh**: Automatic token refresh on 401 errors
- **Expiration**: Handled by backend, app refreshes proactively

### Input Validation
- Client-side validation on all forms
- Server-side validation (backend handles)
- No sensitive data in logs or storage

### API Security
- JWT tokens in Authorization header
- HTTPS required in production
- Request/response interceptors for error handling

## Navigation Structure

```
AppNavigator
├── AuthStack (unauthenticated)
│   ├── Login
│   └── Register
│
└── MainStack (authenticated)
    ├── MainTabs
    │   ├── Home (Alerts Feed)
    │   ├── Map (Map View)
    │   └── MyReports
    │
    ├── ReportIncident (modal)
    └── IncidentDetail (detail view)
```

## Key Features Implementation

### 1. Authentication
- **Login/Register**: Full form validation
- **Token Storage**: Secure, encrypted storage
- **Auto-refresh**: Seamless token renewal
- **Logout**: Clears all stored data

### 2. Incident Reporting
- **Type Selection**: Multiple incident types
- **Location Services**: GPS integration
- **Form Validation**: Client-side checks
- **Error Handling**: User-friendly messages

### 3. Feed & Alerts
- **Pull-to-Refresh**: Manual refresh capability
- **Infinite Scroll**: Pagination support (ready)
- **Empty States**: Helpful messages
- **Error States**: Retry functionality

### 4. Map View
- **Interactive Map**: React Native Maps
- **Markers**: Incident locations
- **Navigation**: Tap marker → Detail view
- **Region Management**: Auto-zoom to incidents

### 5. My Reports
- **Status Tracking**: Real-time status updates
- **Pagination**: Load more incidents
- **Filtering**: By status (ready for implementation)
- **Logout**: Accessible from this screen

## API Integration

### Base API Client (`api.ts`)
- Axios instance with base configuration
- Request interceptor: Adds JWT token
- Response interceptor: Handles token refresh
- Error handling: Centralized error messages

### Service Layer
- **authService**: Authentication endpoints
- **incidentService**: Incident CRUD operations
- All services use the base `apiService`
- Type-safe responses

## State Management

### Global State (Context API)
- **AuthContext**: User authentication state
  - `user`: Current user object
  - `isAuthenticated`: Boolean flag
  - `isLoading`: Loading state
  - Methods: `login`, `register`, `logout`, `refreshUser`

### Local State (React Hooks)
- Each screen manages its own local state
- `useState` for component data
- `useEffect` for side effects
- `useCallback` for memoized functions

## Error Handling

### Strategy
1. **API Errors**: Caught in service layer
2. **User-Friendly Messages**: Extracted from API responses
3. **Display**: Alert dialogs or inline errors
4. **Retry**: Available for network errors
5. **Logging**: Console errors for debugging

## Performance Considerations

### Optimizations
- **Memoization**: `useCallback` for event handlers
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Ready for image uploads
- **List Optimization**: FlatList for efficient rendering
- **Network**: Minimal API calls, caching ready

### Low-Bandwidth Friendly
- Minimal data transfer
- Efficient API responses
- No unnecessary images
- Text-first design

## Testing Strategy (Ready for Implementation)

### Unit Tests
- Utility functions
- Validation logic
- Service methods

### Integration Tests
- API integration
- Navigation flows
- Authentication flow

### E2E Tests
- User journeys
- Critical paths
- Error scenarios

## Future Enhancements

### Ready for Implementation
- Image upload for incidents
- Push notifications
- Offline support
- Advanced filtering
- Search functionality
- User profile management
- Incident comments/updates

## Dependencies

### Core
- `react-native`: Mobile framework
- `expo`: Development platform
- `typescript`: Type safety

### Navigation
- `@react-navigation/native`: Navigation core
- `@react-navigation/stack`: Stack navigator
- `@react-navigation/bottom-tabs`: Tab navigator

### API & Storage
- `axios`: HTTP client
- `expo-secure-store`: Secure token storage

### Location & Maps
- `expo-location`: Location services
- `react-native-maps`: Map component

## Configuration

### API Base URL
Update `src/config/api.ts` with your backend URL:
- Development: `http://localhost:3000` (iOS) or `http://10.0.2.2:3000` (Android)
- Production: Your production API URL

### Environment Variables
Consider using `expo-constants` for environment-specific configs in production.

## Deployment

### Development
```bash
npm start
```

### Production Build
```bash
# iOS
expo build:ios

# Android
expo build:android
```

## Notes

- All API endpoints match the backend structure
- Error messages are user-friendly
- Code is well-commented
- TypeScript ensures type safety
- No hardcoded secrets or sensitive data
- Follows React Native best practices
