# SafeNet Web Admin Dashboard

React-based admin dashboard for SafeNet - used by authorities to review and verify public safety incidents.

## Features

- **Admin Authentication**: Secure login with JWT tokens
- **Incident Review Dashboard**: View and filter all reported incidents
- **Incident Verification**: Verify, reject, or resolve incidents with notes
- **Blockchain Audit Log**: Read-only view of blockchain transactions
- **User Management**: Basic user viewing (placeholder for future expansion)
- **Role-Based Access Control**: Only Admin and Authority roles can access

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd web
npm install
```

### Configuration

Create a `.env` file (optional):

```env
VITE_API_BASE_URL=http://localhost:3000
```

If not set, defaults to `http://localhost:3000`.

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

Output will be in the `dist` directory.

## Project Structure

```
web/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Layout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── config/          # Configuration
│   │   └── api.ts
│   ├── context/         # React Context
│   │   └── AuthContext.tsx
│   ├── pages/           # Page components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── IncidentDetail.tsx
│   │   ├── Users.tsx
│   │   └── Blockchain.tsx
│   ├── services/        # API services
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   └── incidentService.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── utils/           # Utilities
│   │   └── storage.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Features Overview

### Authentication
- JWT-based authentication
- Automatic token refresh
- Secure token storage (localStorage)
- Protected routes with role-based access

### Incident Management
- View all incidents with pagination
- Filter by status and type
- View detailed incident information
- Update incident status (Verify/False/Resolve)
- Add verification notes
- View blockchain transaction data

### Security
- Role-based access control (Admin/Authority only)
- Protected routes
- Secure API communication
- Token-based authentication

## API Integration

The dashboard integrates with the SafeNet backend API:

- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `GET /api/incidents` - Get incidents (with filters)
- `GET /api/incidents/:id` - Get incident details
- `PATCH /api/incidents/:id/status` - Update incident status

## Notes

- User management page is a placeholder (backend endpoint needed)
- Blockchain log shows read-only data from incidents
- All incident status updates are logged to blockchain
- Dashboard requires Admin or Authority role

## License

ISC
