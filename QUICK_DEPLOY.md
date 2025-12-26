# 🚀 Quick Deployment Steps for vcanfreight.com

## What You Need to Do (3 Simple Steps)

### ✅ Step 1: Set Up Database (One-time setup)

Open PowerShell and run:

```powershell
cd "C:\Users\vijin\OneDrive\Desktop\stitch_login_register\vcan-app"
npx wrangler d1 execute vcanfreight-db --remote --file=./scripts/schema.sql
```

This creates all the tables in your Cloudflare database.

---

### ✅ Step 2: Build Your App

```powershell
npm run build
```

Wait for it to finish (takes 1-2 minutes).

---

### ✅ Step 3: Deploy to Cloudflare Pages

**Option A: Using Cloudflare Dashboard (Easiest)**

1. Go to: https://dash.cloudflare.com
2. Click **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Connect your GitHub: `https://github.com/Vijindran79/vcanfreight.com.git`
4. Configure:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
5. Click **Save and Deploy**

**Option B: Using Command Line**

```powershell
npx wrangler pages deploy .next --project-name=vcanfreight
```

---

## ⚙️ Configure Environment Variables

In Cloudflare Dashboard → Your Project → Settings → Environment Variables:

Add these:
```
SEARATES_PLATFORM_ID = 29979
SEARATES_API_KEY = K-21EB16AA-B6A6-4D41-9365-5882597F9B11
DOMAIN = vcanfreight.com
```

---

## 🔗 Link Database

In Cloudflare Dashboard → Your Project → Settings → Functions → D1 Database bindings:

- **Variable name**: `DB`
- **D1 Database**: `vcanfreight-db`

---

## ✅ That's It!

Your app will be live at: **https://vcanfreight.com**

---

## 🆘 If Something Goes Wrong

**Database errors?**
```powershell
npx wrangler d1 list
```

**Build fails?**
```powershell
rm -rf .next
npm run build
```

**Need help?** Check `DEPLOYMENT_GUIDE.md` for detailed instructions.



