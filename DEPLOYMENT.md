# Deployment Guide for VCANFreight on Cloudflare

## Quick Start

### 1. Prerequisites

- Cloudflare account with domain `vcanfreight.com` configured
- Node.js 18+ installed
- Wrangler CLI (will be installed via npm)

### 2. Initial Setup

```bash
# Install dependencies
npm install

# Login to Cloudflare
npx wrangler login
```

### 3. Create D1 Database

```bash
# Create the database
npx wrangler d1 create vcanfreight-db
```

**Important**: Copy the `database_id` from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "vcanfreight-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Paste the ID here
```

### 4. Initialize Database Schema

```bash
npm run db:migrate
```

Or manually:

```bash
npx wrangler d1 execute vcanfreight-db --file=./schema.sql
```

### 5. Configure Environment Variables

#### In Cloudflare Dashboard:

1. Go to **Workers & Pages** → Your Project → **Settings** → **Environment Variables**
2. Add the following variables for **Production**:

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Strong random string for JWT signing | Generate with: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID (optional) | `123456789-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret (optional) | `GOCSPX-...` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` |
| `SEARATES_PLATFORM_ID` | SeaRates API platform ID | `29979` |
| `SEARATES_API_KEY` | SeaRates API key | `K-21EB16AA-B6A6-4D41-9365-5882597F9B11` |
| `SEARATES_API_URL` | SeaRates API base URL (optional) | `https://api.searates.com/v2` |

**Note**: SeaRates API has a limit of **50 calls per calendar month**. The system uses smart caching to maximize quota usage.

#### For Local Development:

Create `.env.local`:

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### 6. Build the Application

```bash
npm run build
```

### 7. Deploy to Cloudflare Pages

#### Option A: Deploy via CLI

```bash
npm run cf:deploy
```

#### Option B: Connect GitHub Repository (Recommended)

1. Go to Cloudflare Dashboard → **Workers & Pages** → **Create Application**
2. Choose **Pages** → **Connect to Git**
3. Select your repository
4. Configure:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (or your app directory)
5. Add environment variables in the dashboard
6. Deploy!

### 8. Configure Custom Domain

1. In Cloudflare Dashboard → Your Pages Project → **Custom Domains**
2. Click **Set up a custom domain**
3. Add `vcanfreight.com` and `www.vcanfreight.com`
4. Follow DNS configuration instructions
5. Cloudflare will automatically configure SSL/TLS

### 9. Verify Deployment

1. Visit `https://vcanfreight.com`
2. Test user registration
3. Test login
4. Test booking creation

## Local Development

### Run with Local D1 Database

```bash
# Initialize local D1 database
npx wrangler d1 execute vcanfreight-db --local --file=./schema.sql

# Start Next.js dev server
npm run dev
```

The app will run at `http://localhost:3000`

**Note**: The app will work in "mock mode" if D1 is not available, but some features may be limited.

## Database Management

### View Database

```bash
# Production database
npx wrangler d1 execute vcanfreight-db --command "SELECT * FROM users"

# Local database
npx wrangler d1 execute vcanfreight-db --local --command "SELECT * FROM users"
```

### Backup Database

```bash
# Export production database
npx wrangler d1 export vcanfreight-db --output backup.sql
```

### Restore Database

```bash
# Import to production database
npx wrangler d1 execute vcanfreight-db --file=backup.sql
```

## Troubleshooting

### Database Connection Issues

- Verify `database_id` is correct in `wrangler.toml`
- Check that database exists: `npx wrangler d1 list`
- Ensure environment variables are set correctly

### Authentication Not Working

- Verify `JWT_SECRET` is set in environment variables
- Check browser console for errors
- Verify API routes are accessible: `curl https://vcanfreight.com/api/auth/login`

### Build Failures

- Check Node.js version: `node --version` (should be 18+)
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Deployment Issues

- Check Cloudflare Pages build logs
- Verify all environment variables are set
- Ensure `next.config.ts` has `output: 'standalone'`

## Monitoring

### View Logs

```bash
# Real-time logs
npx wrangler tail

# Pages logs (in dashboard)
# Go to Workers & Pages → Your Project → Logs
```

### Analytics

- Cloudflare Analytics: Dashboard → Analytics
- Custom analytics can be added via Cloudflare Web Analytics

## Security Checklist

- [ ] `JWT_SECRET` is a strong random string (32+ characters)
- [ ] All environment variables are set in Cloudflare (not in code)
- [ ] HTTPS is enabled (automatic with Cloudflare)
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled (via Cloudflare)
- [ ] DDoS protection is enabled (automatic with Cloudflare)

## Support

For issues or questions:
- Email: vg@vcanresources.com
- Domain: vcanfreight.com

## Next Steps

1. Set up monitoring and alerts
2. Configure backup strategy for D1 database
3. Set up CI/CD pipeline for automatic deployments
4. Add Cloudflare R2 for file storage (if needed)
5. Configure Cloudflare Workers for additional serverless functions

