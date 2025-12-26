# 🚀 VCANFreight Deployment Guide

## Quick Deployment Checklist

### ✅ Pre-Deployment Checklist

1. **Database Setup** (D1 Database)
   - ✅ Database created: `vcanfreight-db`
   - ✅ Database ID: `19de061f-5e36-4c13-838f-1a0aa7bc85df`
   - ⚠️ **ACTION REQUIRED**: Run schema migration on remote database

2. **Environment Variables**
   - ✅ SeaRates Platform ID: `29979`
   - ✅ SeaRates API Key: `K-21EB16AA-B6A6-4D41-9365-5882597F9B11`
   - ⚠️ **OPTIONAL**: Add AviationStack API key for airfreight schedules

3. **Domain Configuration**
   - ✅ Domain: `vcanfreight.com`
   - ✅ Configured in `wrangler.toml`

---

## 📋 Step-by-Step Deployment Instructions

### Step 1: Initialize Remote Database Schema

**IMPORTANT**: Run this command to create all tables in your Cloudflare D1 database:

```bash
cd "C:\Users\vijin\OneDrive\Desktop\stitch_login_register\vcan-app"
npx wrangler d1 execute vcanfreight-db --remote --file=./schema.sql
```

**Note**: If `schema.sql` doesn't exist, you'll need to create it. The schema should include:
- `users` table
- `subscriptions` table
- `life_rates` table
- `rates_cache` table
- Any other tables your app needs

### Step 2: Build Your Next.js App

```bash
cd "C:\Users\vijin\OneDrive\Desktop\stitch_login_register\vcan-app"
npm run build
```

This will create the `.next` folder with your production build.

### Step 3: Deploy to Cloudflare Pages

#### Option A: Using Wrangler CLI (Recommended)

```bash
# Make sure you're logged in to Cloudflare
npx wrangler login

# Deploy to Cloudflare Pages
npx wrangler pages deploy .next --project-name=vcanfreight
```

#### Option B: Using Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **Pages**
3. Click **Create a project**
4. Connect your GitHub repository (if you've pushed to GitHub)
   - Repository: `https://github.com/Vijindran79/vcanfreight.com.git`
5. Configure build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (root of repo)

### Step 4: Configure Environment Variables

In Cloudflare Dashboard → Your Project → Settings → Environment Variables, add:

```
SEARATES_PLATFORM_ID=29979
SEARATES_API_KEY=K-21EB16AA-B6A6-4D41-9365-5882597F9B11
DOMAIN=vcanfreight.com
```

**Optional** (for airfreight schedules):
```
AVIATION_STACK_API_KEY=your_api_key_here
```

### Step 5: Link D1 Database to Pages

1. In Cloudflare Dashboard → Your Project → Settings → Functions
2. Under **D1 Database bindings**, add:
   - **Variable name**: `DB`
   - **D1 Database**: `vcanfreight-db`

Or add to `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "vcanfreight-db"
database_id = "19de061f-5e36-4c13-838f-1a0aa7bc85df"
```

### Step 6: Configure Custom Domain

1. In Cloudflare Dashboard → Your Project → Custom domains
2. Add `vcanfreight.com` and `www.vcanfreight.com`
3. Follow DNS setup instructions (usually automatic if domain is on Cloudflare)

### Step 7: Test Your Deployment

1. Visit `https://vcanfreight.com`
2. Test key features:
   - ✅ Homepage loads
   - ✅ Theme toggle works (day/night mode)
   - ✅ Language selector works
   - ✅ Guest login works
   - ✅ Booking forms work
   - ✅ HS code auto-suggest works
   - ✅ Schedules page works
   - ✅ Dashboard loads

---

## 🔧 Troubleshooting

### Database Connection Issues

If you get database errors:
```bash
# Verify database exists
npx wrangler d1 list

# Check database binding
npx wrangler d1 info vcanfreight-db
```

### Build Errors

If build fails:
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Environment Variables Not Working

Make sure variables are set in:
1. Cloudflare Dashboard → Project Settings → Environment Variables
2. `wrangler.toml` (for local development)

---

## 📝 Post-Deployment Tasks

1. **Test All Features**
   - [ ] User registration
   - [ ] User login
   - [ ] Guest access
   - [ ] FCL booking
   - [ ] LCL booking
   - [ ] Airfreight booking
   - [ ] HS code auto-suggest
   - [ ] Schedules (sea & air)
   - [ ] Theme toggle
   - [ ] Language selector
   - [ ] Dashboard

2. **Monitor API Usage**
   - Check SeaRates API calls (50/month limit)
   - Monitor database queries
   - Check error logs in Cloudflare Dashboard

3. **Set Up Monitoring**
   - Enable Cloudflare Analytics
   - Set up error tracking (optional)
   - Monitor performance

---

## 🎯 Quick Commands Reference

```bash
# Navigate to project
cd "C:\Users\vijin\OneDrive\Desktop\stitch_login_register\vcan-app"

# Build for production
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy .next --project-name=vcanfreight

# Run database migrations
npx wrangler d1 execute vcanfreight-db --remote --file=./schema.sql

# View logs
npx wrangler pages deployment tail
```

---

## ✅ You're Ready to Deploy!

**Next Steps:**
1. Run the database schema migration (Step 1)
2. Build your app (Step 2)
3. Deploy to Cloudflare Pages (Step 3)
4. Configure environment variables (Step 4)
5. Test everything (Step 7)

**Need Help?** Check the Cloudflare Pages documentation or contact support.

---

## 📞 Support Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)



