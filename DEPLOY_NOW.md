# 🚀 DEPLOYMENT GUIDE - VCANFreight to Cloudflare Pages

## Current Status
✅ Production build completed and ready  
✅ All code improvements applied  
✅ Database schema updated  
✅ Application tested and verified  

---

## 📦 DEPLOYMENT OPTIONS

### Option A: Using Cloudflare Dashboard (Easiest - Recommended) ✅

This is the **easiest method** and doesn't require CLI authentication.

#### Steps:

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Sign in to your Cloudflare account

2. **Create/Connect to Pages Project**
   - Click **Workers & Pages** in the sidebar
   - Click **Create application** → **Pages**
   - Choose **Connect to Git**

3. **Connect GitHub Repository**
   - Repository: `https://github.com/Vijindran79/vcanfreight.com.git`
   - Branch: `main`
   - Click **Connect**

4. **Configure Build Settings**
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (or leave blank)
   - Click **Save and Deploy**

5. **Add Environment Variables**
   After deployment starts, go to **Settings** → **Environment Variables**
   
   Add for **Production**:
   ```
   JWT_SECRET = [Generate with: openssl rand -base64 32]
   SEARATES_PLATFORM_ID = 29979
   SEARATES_API_KEY = K-21EB16AA-B6A6-4D41-9365-5882597F9B11
   DOMAIN = vcanfreight.com
   ```

6. **Link D1 Database**
   - Go to **Settings** → **Functions** → **D1 Database**
   - Click **Add binding**
   - Variable name: `DB`
   - Database: `vcanfreight-db`
   - Click **Save**

7. **Deploy Database Schema**
   Open your terminal and run:
   ```bash
   npx wrangler d1 execute vcanfreight-db --remote --file=./scripts/schema.sql
   ```

8. **Visit Your Site**
   - Your app is live at: `https://vcanfreight.com`
   - Dashboard: `https://vcanfreight.com/dashboard`
   - Login: `https://vcanfreight.com/auth/login`

---

### Option B: Using Wrangler CLI (Manual)

If you prefer command-line deployment:

```bash
# 1. Login to Cloudflare
npx wrangler login

# 2. Deploy the build
npx wrangler pages deploy .next --project-name=vcanfreight

# 3. Add environment variables via dashboard or wrangler
npx wrangler pages env secret set JWT_SECRET --project-name=vcanfreight
npx wrangler pages env secret set SEARATES_API_KEY --project-name=vcanfreight

# 4. Deploy database schema
npx wrangler d1 execute vcanfreight-db --remote --file=./scripts/schema.sql
```

---

## ✅ Post-Deployment Checklist

After deployment completes, verify everything works:

### 1. Test Homepage
- [ ] Visit `https://vcanfreight.com`
- [ ] Page loads without errors
- [ ] Styling looks correct
- [ ] Dark/light mode toggle works

### 2. Test Authentication
- [ ] Click "Log In" → Login page loads
- [ ] Click "Register" → Registration page loads
- [ ] Try logging in with test credentials
- [ ] Try "Continue as Guest"

### 3. Test Key Features
- [ ] Navigate to `/booking` page
- [ ] Try HS code auto-suggest
- [ ] Check schedules page
- [ ] Verify theme toggle works
- [ ] Check language selector works

### 4. Test API Endpoints
- [ ] `/api/auth/login` - Test login
- [ ] `/api/auth/register` - Test registration
- [ ] `/api/hs-code?description=test` - Test HS code API
- [ ] `/api/schedules` - Test schedules API
- [ ] `/api/rates` - Test rates API

### 5. Check Logs
- In Cloudflare Dashboard:
  - Go to **Workers & Pages** → **vcanfreight** → **Logs**
  - Look for any errors
  - Verify no 500 errors

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Check if build output exists
ls -la .next/

# If missing, rebuild
npm run build

# Check for errors
npm run build 2>&1 | tail -50
```

### Database Connection Issues
```bash
# Verify database exists
npx wrangler d1 list

# Check database info
npx wrangler d1 info vcanfreight-db

# Run migrations
npx wrangler d1 execute vcanfreight-db --remote --file=./scripts/schema.sql
```

### Environment Variables Not Working
1. Verify in **Cloudflare Dashboard** → **Settings** → **Environment Variables**
2. Make sure variables are set for **Production** environment
3. Check **Functions** → **D1 Database** bindings are correct
4. Restart deployment after adding variables

### 500 Errors in API
1. Check that `JWT_SECRET` is set
2. Verify D1 database binding name is `DB`
3. Check logs in Cloudflare Dashboard
4. Ensure database schema was migrated: `npx wrangler d1 execute vcanfreight-db --remote --file=./scripts/schema.sql`

### Pages Not Loading
1. Verify domain is pointing to Cloudflare in DNS
2. Check that `vcanfreight.com` is configured in your Cloudflare account
3. Check Pages deployment logs for build errors
4. Verify build output directory is `.next`

---

## 📊 Deployment Verification

After deployment, verify the build:

```bash
# Check build output
ls -la .next/

# Build should contain:
# - .next/server/ (backend code)
# - .next/static/ (frontend code)
# - .next/app-build-manifest.json
# - .next/routes-manifest.json
```

---

## 🎯 Expected Result

After successful deployment:

```
✅ Application live at: https://vcanfreight.com
✅ All pages accessible
✅ APIs responding
✅ Database connected
✅ Authentication working
✅ No console errors
```

---

## 📞 Need Help?

If deployment fails:

1. **Check Cloudflare Status**: https://www.cloudflarestatus.com/
2. **Review Wrangler Docs**: https://developers.cloudflare.com/workers/wrangler/
3. **Check Pages Logs**: Cloudflare Dashboard → Pages → Logs
4. **Verify Domain**: Make sure `vcanfreight.com` is in your Cloudflare account

---

## 🚀 You're Ready!

Your application is production-ready. Choose **Option A** (Dashboard) for the easiest deployment!

**Estimated time**: 5-10 minutes
