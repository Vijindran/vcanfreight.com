# Firebase to Cloudflare Data Migration Guide

## Overview

Your Cloudflare backend is **already set up** with:
- ✅ Database schema (users, bookings, rates_cache)
- ✅ API routes for authentication (login, register, Google OAuth)
- ✅ API routes for bookings
- ✅ Cloudflare utility functions

## What Needs to be Done

### 1. Set Up Cloudflare D1 Database

First, create the D1 database in Cloudflare:

```bash
# Install Wrangler CLI (if not already installed)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create the D1 database
wrangler d1 create vcanfreight-db

# Note the database_id from the output and update wrangler.toml
```

Update `wrangler.toml` with the database_id:

```toml
[[d1_databases]]
binding = "DB"
database_name = "vcanfreight-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Replace with actual ID
```

### 2. Initialize Database Schema

Run the schema to create tables:

```bash
wrangler d1 execute vcanfreight-db --file=./schema.sql
```

### 3. Migrate Your Firebase Data

You have **two options**:

#### Option A: Use the Migration API (Recommended)

If you have Firebase data exported as JSON:

1. **Export your Firebase data:**
   - Users collection
   - Bookings collection  
   - Rates collection (if any)

2. **Format the data** as JSON:
   ```json
   {
     "users": [...],
     "bookings": [...],
     "rates": [...]
   }
   ```

3. **Call the migration API:**
   ```bash
   curl -X POST https://your-domain.com/api/migrate \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d @firebase-export.json
   ```

#### Option B: Use the Migration Script

1. **Place your Firebase export files** in `/data` directory:
   - `data/users.json`
   - `data/bookings.json`
   - `data/rates.json`

2. **Run the migration script:**
   ```bash
   npx tsx scripts/migrate-firebase-to-cloudflare.ts
   ```

3. **Review the generated SQL** in `data/migration.sql`

4. **Execute the SQL:**
   ```bash
   wrangler d1 execute vcanfreight-db --file=./data/migration.sql
   ```

### 4. Firebase Data Format

Your Firebase data should follow this structure:

#### Users:
```json
{
  "uid": "user123",
  "email": "user@example.com",
  "displayName": "John Doe",
  "createdAt": {
    "seconds": 1234567890
  }
}
```

#### Bookings:
```json
{
  "id": "booking123",
  "userId": "user123",
  "containerType": "FCL",
  "origin": "Shanghai",
  "destination": "Los Angeles",
  "cargoDescription": "Electronics",
  "status": "pending",
  "createdAt": {
    "seconds": 1234567890
  }
}
```

#### Rates:
```json
{
  "id": "rate123",
  "origin": "Shanghai",
  "destination": "Los Angeles",
  "price": 1250.00,
  "currency": "USD",
  "transitTime": 24,
  "carrier": "Maersk",
  "validUntil": {
    "seconds": 1234567890
  }
}
```

## Important Notes

### Password Migration
- **Firebase doesn't store password hashes** in a way we can migrate
- Users will need to **reset their passwords** after migration
- Or you can provide a temporary password and force password reset on first login

### Google OAuth Users
- Google OAuth users will need to **sign in again** with Google
- The migration will preserve their email and name, but they'll need to re-authenticate

### Fresh Start Option
If you prefer to start fresh (no data migration):
- The database schema is already set up
- New users can register immediately
- No migration needed - just deploy!

## Deployment

Once migration is complete:

1. **Set environment variables** in Cloudflare Pages:
   - `JWT_SECRET` - A secure random string
   - `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret

2. **Deploy to Cloudflare Pages:**
   ```bash
   npm run build
   wrangler pages deploy .next
   ```

## Need Help?

If you need to provide fresh data or have questions:
1. Export your Firebase data (if you have it)
2. Share the data format/structure
3. I can help format it for migration

Or if you prefer to start fresh, that's perfectly fine - the backend is ready to go!

