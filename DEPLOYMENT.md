# 🚀 Deployment Guide

## MongoDB Atlas (Free)
1. Create account: https://cloud.mongodb.com
2. Create M0 cluster (free)
3. Create database user
4. Whitelist IP: 0.0.0.0/0 (allow all)
5. Get connection string

## Vercel Deployment
1. Push code to GitHub
2. Import to Vercel: https://vercel.com
3. Add environment variables
4. Deploy!

## Environment Variables
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/reports-dashboard
ADMIN_PASSWORD=your_secure_password
GEMINI_API_KEY=your_key (optional)
```

## Commands
```bash
# Build locally
npm run build

# Start production
npm start

# Deploy to Vercel
vercel --prod
```

## Post-Deployment
- Test all features
- Check MongoDB connection
- Verify environment variables
- Test admin login