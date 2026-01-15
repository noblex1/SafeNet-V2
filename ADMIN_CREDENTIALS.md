# Default Admin Credentials

## ✅ Default Admin Account Created

A default admin user has been created in the database for testing purposes.

### Login Credentials

**Email:** `admin@safenet.app`  
**Password:** `Admin123!`

### Usage

#### Web Dashboard
1. Navigate to `http://localhost:5173`
2. Enter the credentials above
3. Click "Sign in"

#### Mobile App
1. Open the SafeNet mobile app
2. Use the same credentials
3. Note: Mobile app is for public users, but admin can also use it

#### API Testing
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@safenet.app",
    "password": "Admin123!"
  }'
```

### ⚠️ Security Warning

**IMPORTANT:** This is a default account for testing only!

- **Change the password** after first login in production
- **Delete or disable** this account in production environments
- **Use strong passwords** for production admin accounts

### Creating Additional Admin Users

To create more admin users, you can:

1. **Use the script:**
   ```bash
   npm run create-admin
   ```
   (Note: This will only create if the email doesn't exist)

2. **Register normally, then update role:**
   - Register via API or mobile app
   - Update user role to `admin` in database:
   ```javascript
   // In MongoDB shell or via script
   db.users.updateOne(
     { email: "newadmin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

3. **Create via API and update:**
   - Register a user via `/api/auth/register`
   - Manually update the role in the database

### Resetting Admin Password

If you need to reset the admin password:

1. **Delete and recreate:**
   ```bash
   # Delete existing admin
   # Then run:
   npm run create-admin
   ```

2. **Update directly in database:**
   ```javascript
   // Password will be auto-hashed on save
   // You'll need to use bcrypt or create a new user
   ```

### User Roles

- `public_user` - Can report incidents, view verified alerts
- `admin` - Full access to all incidents, can verify/reject
- `authority` - Same as admin (for future differentiation)

The default admin account has the `admin` role, which provides full access to:
- All incidents (view, verify, reject, resolve)
- Web dashboard
- All API endpoints
