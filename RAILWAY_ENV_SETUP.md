# 🚂 Railway Environment Variables Setup

## Frontend Service (docflow-schedule)

### Required Environment Variables

Set these in your Railway dashboard for the `docflow-schedule` service:

1. Go to Railway Dashboard
2. Click on `docflow-schedule` service
3. Go to **Variables** tab
4. Add these variables:

```bash
# Backend API URL
VITE_API_URL=https://doctor-flow-services-production.up.railway.app/api

# Application Name (optional)
VITE_APP_NAME=DocFlow

# Application URL (optional)
VITE_APP_URL=https://docflow-schedule-production.up.railway.app
```

---

## Backend Service (doctor-flow-services-production)

### Required Environment Variables

Make sure these are set in your Railway dashboard for the backend service:

```bash
# Database (should already be set via Railway's service linking)
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_DATABASE=${{Postgres.PGDATABASE}}

# Application
NODE_ENV=production
PORT=3000

# CORS - Frontend URL
CORS_ORIGIN=https://docflow-schedule-production.up.railway.app
```

---

## How to Set Environment Variables in Railway

### Method 1: Via Dashboard (Recommended)

1. Go to https://railway.app
2. Select your project
3. Click on the service (e.g., `docflow-schedule`)
4. Click **Variables** tab
5. Click **+ New Variable**
6. Enter name and value
7. Click **Add**
8. Railway will automatically redeploy

### Method 2: Via Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Set a variable
railway variables --set VITE_API_URL=https://doctor-flow-services-production.up.railway.app/api

# Or set multiple at once
railway variables
# Then paste in the format: KEY=value
```

---

## Verification

After setting environment variables:

1. **Check Build Logs**
   - Go to Deployments
   - Click latest deployment
   - Check build logs for environment variables

2. **Test API Connection**
   - Open your app: https://docflow-schedule-production.up.railway.app
   - Open browser DevTools → Network tab
   - Create an appointment or load patients
   - Check API calls are going to: `https://doctor-flow-services-production.up.railway.app/api`

3. **Check CORS**
   - If you see CORS errors, verify `CORS_ORIGIN` is set correctly in backend service
   - Must match: `https://docflow-schedule-production.up.railway.app`

---

## Common Issues

### Issue: API calls going to localhost
**Solution:** VITE_API_URL not set in Railway
- Set the variable in Railway dashboard
- Redeploy the service

### Issue: CORS errors
**Solution:** Backend CORS_ORIGIN not set correctly
- Go to backend service → Variables
- Set: `CORS_ORIGIN=https://docflow-schedule-production.up.railway.app`
- Redeploy backend

### Issue: 502 Bad Gateway
**Solution:** Backend not running or database not connected
- Check backend service logs
- Verify database variables are set
- Check migrations have run

---

## Local Development Setup

For local development, create a `.env.local` file in `docflow-schedule/`:

```bash
# .env.local (for local development only)
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=DocFlow
VITE_APP_URL=http://localhost:5173
```

**Note:** This file is gitignored and won't be committed.

---

## Production Checklist

- [ ] Set `VITE_API_URL` in frontend service
- [ ] Set `CORS_ORIGIN` in backend service
- [ ] Backend database variables configured
- [ ] Test API calls work
- [ ] No CORS errors in browser console
- [ ] All environment variables in Railway (not hardcoded)

---

## Current Configuration

### Frontend URL:
```
https://docflow-schedule-production.up.railway.app
```

### Backend URL:
```
https://doctor-flow-services-production.up.railway.app
```

### API Endpoint:
```
https://doctor-flow-services-production.up.railway.app/api
```

---

**Remember:** Railway automatically redeploys when you change environment variables! 🚀
