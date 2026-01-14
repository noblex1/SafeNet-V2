# SafeNet Web Dashboard - Quick Start

## Prerequisites

- Node.js 18+
- npm or yarn
- SafeNet backend running on port 3000

## Setup

### 1. Install Dependencies

```bash
cd web
npm install
```

### 2. Configure API URL (Optional)

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Or update `src/config/api.ts` directly.

### 3. Start Development Server

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`

## First Use

1. **Login**: Use admin/authority credentials
   - Email: Your admin email
   - Password: Your admin password

2. **Dashboard**: View all incidents
   - Filter by status or type
   - Click an incident to review details

3. **Verify Incidents**: 
   - Click on an incident
   - Review details
   - Add verification notes
   - Click "Verify", "Mark as False", or "Resolve"

4. **Blockchain Log**: 
   - View all blockchain transactions
   - Filter to see only incidents with blockchain data

## Features

- ✅ Admin authentication
- ✅ Incident review dashboard
- ✅ Incident verification (Verify/False/Resolve)
- ✅ Blockchain audit log viewer
- ✅ User management (placeholder)

## Troubleshooting

### "Cannot connect to server"
- Ensure backend is running: `cd .. && npm run dev`
- Check API URL in `.env` or `src/config/api.ts`
- Verify backend is accessible

### "Unauthorized" errors
- Check if you're logged in with admin/authority role
- Verify tokens are stored (check browser localStorage)
- Try logging out and logging back in

### Build errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

## Next Steps

- Review `ARCHITECTURE.md` for detailed architecture
- Check `README.md` for full documentation
- Customize styling in `tailwind.config.js`
- Add features as needed
