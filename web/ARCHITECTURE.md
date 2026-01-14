# SafeNet Web Dashboard - Architecture

## Overview

The SafeNet Web Admin Dashboard is a React-based single-page application for authorities to review and verify public safety incidents. It provides a clean, secure interface for incident management with role-based access control.

## Architecture

### Tech Stack
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first CSS framework

### Project Structure

```
web/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx       # Main dashboard layout with navigation
│   │   └── ProtectedRoute.tsx # Route guard component
│   │
│   ├── config/              # Configuration
│   │   └── api.ts          # API endpoints and base URL
│   │
│   ├── context/             # React Context providers
│   │   └── AuthContext.tsx  # Authentication state management
│   │
│   ├── pages/               # Page components
│   │   ├── Login.tsx       # Login page
│   │   ├── Dashboard.tsx  # Incident list with filters
│   │   ├── IncidentDetail.tsx # Incident review/verification
│   │   ├── Users.tsx       # User management (placeholder)
│   │   └── Blockchain.tsx # Blockchain audit log viewer
│   │
│   ├── services/            # API service layer
│   │   ├── api.ts         # Base API client with interceptors
│   │   ├── authService.ts # Authentication API calls
│   │   └── incidentService.ts # Incident API calls
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   │
│   ├── utils/              # Utility functions
│   │   └── storage.ts     # Token storage (localStorage)
│   │
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles (Tailwind)
│
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Dependencies
```

## Data Flow

### Authentication Flow

1. User enters credentials → `Login` page
2. `Login` calls `authService.login()`
3. `authService` uses `apiService` to make API call
4. Tokens stored in localStorage via `storage.ts`
5. `AuthContext` updates with user data
6. Router redirects to `/dashboard`

### Incident Review Flow

1. Admin navigates to Dashboard
2. `Dashboard` component loads incidents via `incidentService.getIncidents()`
3. Filters applied via query parameters
4. User clicks incident → navigates to `IncidentDetail`
5. Admin reviews details and updates status
6. `IncidentDetail` calls `incidentService.updateStatus()`
7. Status updated in backend and blockchain
8. Redirect back to dashboard

## Security Implementation

### Authentication
- **JWT Tokens**: Access token (short-lived) + Refresh token (long-lived)
- **Storage**: localStorage (sufficient for admin dashboard)
- **Auto-refresh**: Token refresh on 401 errors
- **Logout**: Clears all stored tokens

### Authorization
- **Protected Routes**: `ProtectedRoute` component checks authentication
- **Role-Based Access**: Only Admin and Authority roles can access
- **Route Guards**: Automatic redirect to login if not authenticated

### API Security
- **Token in Headers**: JWT in Authorization header
- **Interceptors**: Automatic token injection and refresh
- **Error Handling**: Graceful handling of auth failures

## Key Features

### 1. Incident Dashboard
- **List View**: All incidents with pagination
- **Filters**: By status and type
- **Search**: Ready for implementation
- **Real-time Updates**: Refresh to see latest

### 2. Incident Detail/Verification
- **Full Details**: All incident information
- **Reporter Info**: Contact details
- **Blockchain Data**: Transaction IDs and hashes
- **Status Actions**: Verify, Mark as False, Resolve
- **Verification Notes**: Add notes with status updates

### 3. Blockchain Audit Log
- **Read-Only View**: All blockchain transactions
- **Filtering**: Show only incidents with blockchain data
- **Transaction Details**: Hash, Tx ID, Record ID
- **Status Tracking**: Current incident status

### 4. User Management
- **Placeholder**: Ready for backend endpoint
- **Future**: View, edit, manage user accounts

## State Management

### Global State (Context API)
- **AuthContext**: User authentication state
  - `user`: Current user object
  - `isAuthenticated`: Boolean flag
  - `isAdmin` / `isAuthority`: Role checks
  - Methods: `login`, `logout`, `refreshUser`

### Local State (React Hooks)
- Each page manages its own local state
- `useState` for component data
- `useEffect` for side effects
- `useCallback` for memoized functions

## Routing

```
/ → Redirect to /dashboard
/login → Login page (public)
/dashboard → Incident list (protected, admin/authority)
/incidents/:id → Incident detail (protected, admin/authority)
/users → User management (protected, admin/authority)
/blockchain → Blockchain log (protected, admin/authority)
```

## API Integration

### Base API Client
- Axios instance with base configuration
- Request interceptor: Adds JWT token
- Response interceptor: Handles token refresh
- Error handling: Centralized error messages

### Service Layer
- **authService**: Authentication endpoints
- **incidentService**: Incident CRUD operations
- All services use the base `apiService`

## Styling

### Tailwind CSS
- Utility-first CSS framework
- Responsive design
- Consistent color scheme
- Clean, modern UI

### Design System
- **Colors**: Blue (primary), Gray (neutral), Status colors
- **Typography**: System fonts
- **Spacing**: Consistent padding/margins
- **Components**: Reusable patterns

## Performance

### Optimizations
- **Code Splitting**: Route-based (via React Router)
- **Lazy Loading**: Ready for implementation
- **Memoization**: `useCallback` for event handlers
- **Efficient Rendering**: React best practices

## Error Handling

### Strategy
1. **API Errors**: Caught in service layer
2. **User-Friendly Messages**: Extracted from API responses
3. **Display**: Inline error messages or alerts
4. **Logging**: Console errors for debugging

## Future Enhancements

### Ready for Implementation
- User management CRUD operations
- Advanced filtering and search
- Export functionality
- Real-time updates (WebSocket)
- Analytics dashboard
- Bulk operations
- Incident comments/notes history

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Environment Variables
- `VITE_API_BASE_URL`: Backend API URL (default: http://localhost:3000)

## Security Notes

- Tokens stored in localStorage (acceptable for admin dashboard)
- HTTPS required in production
- CORS configured on backend
- Role-based access enforced on both frontend and backend
- No sensitive data in client-side code
