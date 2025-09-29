# Koyeb Deployment Checklist - Restaurant Intelligence Platform

## Pre-Deployment Checklist

### ✅ Code Preparation
- [x] Toast API integration working locally
- [x] TypeScript compilation successful
- [x] Environment variables configured
- [x] Database connection verified (Koyeb PostgreSQL)
- [x] All dependencies installed

### ✅ Configuration Files
- [x] `koyeb.json` updated with correct build commands
- [x] `Procfile` configured for backend deployment
- [x] `package.json` build scripts working
- [x] Environment variables defined in koyeb.json

### 🔄 Environment Variables to Set in Koyeb
Set these in the Koyeb dashboard:

```bash
DATABASE_URL="postgres://rip_admin:npg_NMFi1o7UZCqL@ep-round-cake-a4ew2cmf.us-east-1.pg.koyeb.app:5432/restaurant_intelligence"
JWT_SECRET="rip_backend_jwt_secret_super_secure_key_min_32_chars_123456789"
API_BASE_URL="https://[your-koyeb-app-name].koyeb.app"
FRONTEND_URL="https://[your-frontend-url]"
CORS_ORIGIN="https://[your-frontend-url]"
TOAST_CLIENT_ID="3g0R0NFYjHIQcVe9bYP8eTbJjwRTvCNV"
TOAST_CLIENT_SECRET="[your-rotated-secret]"
TOAST_RESTAURANT_GUID="d3efae34-7c2e-4107-a442-49081e624706"
```

## Deployment Steps

### 1. Test Local Build
```bash
cd /Users/demetrigregorakis/RIP
npm run build:backend
cd backend && npm start
```

### 2. Verify Toast API Works
```bash
curl "http://localhost:3001/api/toast/test-connection" -H "Accept: application/json"
```

### 3. Deploy to Koyeb
- Push code to GitHub repository
- Connect Koyeb to GitHub repo
- Set environment variables in Koyeb dashboard
- Deploy application

### 4. Post-Deployment Testing
```bash
curl "https://[your-app].koyeb.app/api/toast/test-connection" -H "Accept: application/json"
```

## Expected Results

### Successful Deployment Indicators
- ✅ Build completes without errors
- ✅ Server starts on port 3001
- ✅ Database connection established
- ✅ Toast API authentication successful
- ✅ Restaurant data retrieved successfully

### Health Check Endpoints
- `GET /health` - Basic server health
- `GET /api/toast/test-connection` - Toast API integration test
- `GET /api/test-db` - Database connection test

## Troubleshooting

### Common Issues
1. **Build fails**: Check TypeScript compilation errors
2. **Environment variables missing**: Verify all vars set in Koyeb
3. **Toast API fails**: Check credentials and endpoint URLs
4. **Database connection fails**: Verify DATABASE_URL

### Debug Commands
```bash
# Check logs in Koyeb dashboard
# Test individual endpoints
# Verify environment variables
```

## Success Criteria
- [ ] Application builds successfully
- [ ] Server starts without errors
- [ ] Database connects successfully
- [ ] Toast API integration works
- [ ] All endpoints respond correctly
- [ ] Performance is acceptable