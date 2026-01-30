# Cloudflare Migration Guide

This document explains how to migrate from Firebase to Cloudflare for VCANFreight.

## Overview

The application has been migrated from Firebase to Cloudflare services:
- **Firebase Auth** → **JWT-based authentication with Cloudflare D1**
- **Firestore** → **Cloudflare D1 (SQLite)**
- **Firebase Hosting** → **Cloudflare Pages**

## Prerequisites

1. Cloudflare account with your domain `vcanfreight.com` configured
2. Cloudflare Workers & Pages enabled
3. Node.js and npm installed

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Cloudflare D1 Database

```bash
# Login to Cloudflare
npx wrangler login

# Create the D1 database
npx wrangler d1 create vcanfreight-db

# Note the database_id from the output and update wrangler.toml
```

### 3. Update wrangler.toml

Edit `wrangler.toml` and add the `database_id` from step 2:

```toml
[[d1_databases]]
binding = "DB"
database_name = "vcanfreight-db"
database_id = "YOUR_DATABASE_ID_HERE"
```

### 4. Run Database Migrations

```bash
npm run db:migrate
```

Or manually:

```bash
npx wrangler d1 execute vcanfreight-db --file=./schema.sql
```

### 5. Set Environment Variables

In Cloudflare Dashboard:
1. Go to Workers & Pages → Your Project → Settings → Environment Variables
2. Add the following variables:

- `JWT_SECRET`: A strong random string (generate with `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID`: (Optional) Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: (Optional) Your Google OAuth client secret
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `SEARATES_PLATFORM_ID`: (Optional) SeaRates API platform ID
- `SEARATES_API_KEY`: (Optional) SeaRates API key

For local development, create a `.env.local` file:

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### 6. Configure Domain

1. In Cloudflare Dashboard, go to Workers & Pages → Your Project
2. Go to Custom Domains
3. Add `vcanfreight.com` and `www.vcanfreight.com`
4. Update DNS records as instructed

### 7. Deploy to Cloudflare Pages

```bash
# Build the Next.js app
npm run build

# Deploy to Cloudflare Pages
npm run cf:deploy
```

Or connect your GitHub repository to Cloudflare Pages for automatic deployments.

## Database Schema

The database includes the following tables:

- **users**: User accounts with email/password and Google OAuth support
- **bookings**: Shipping bookings
- **rates_cache**: Cached shipping rates

See `schema.sql` for the complete schema.

## API Endpoints

All API routes are now in `app/api/`:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `POST /api/stripe/checkout` - Stripe checkout

## Authentication Flow

1. User logs in via `/api/auth/login` or `/api/auth/register`
2. Server returns JWT token
3. Client stores token in localStorage
4. Client includes token in `Authorization: Bearer <token>` header for protected routes
5. Server verifies token using `verifyJWT()` function

## Local Development

For local development with D1 database:

```bash
# Start local D1 database
npx wrangler d1 execute vcanfreight-db --local --file=./schema.sql

# Run Next.js dev server
npm run dev
```

Note: The app will work in mock mode if D1 is not available locally.

## Differences from Firebase

1. **Authentication**: Uses JWT tokens instead of Firebase Auth sessions
2. **Database**: SQLite (D1) instead of Firestore (NoSQL)
3. **Real-time**: Not included by default (can add Cloudflare Durable Objects if needed)
4. **File Storage**: Use Cloudflare R2 instead of Firebase Storage

## Troubleshooting

### Database not available

If you see "D1 database not available" warnings, ensure:
- Database is created in Cloudflare
- `database_id` is set in `wrangler.toml`
- Environment variables are set correctly

### Authentication not working

- Check that `JWT_SECRET` is set
- Verify token is being stored in localStorage
- Check browser console for errors

### Deployment issues

- Ensure `next.config.ts` has `output: 'standalone'`
- Check Cloudflare Pages build logs
- Verify all environment variables are set

## Support

For issues or questions, contact: vg@vcanresources.com

