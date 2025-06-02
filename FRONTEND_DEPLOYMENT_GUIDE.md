# Frontend Deployment Guide - Vercel

## Issues Fixed

✅ **Removed problematic homepage field** from package.json
✅ **Added proper Vercel configuration** with SPA routing
✅ **Fixed environment variables** for API base URL
✅ **Added vercel-build script** for proper building
✅ **Removed proxy configuration** that was causing conflicts

## Prerequisites

1. **Backend Deployed**: Your backend should be deployed first
2. **Backend URL**: Get your backend URL from Vercel dashboard
3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## Step 1: Update Environment Variables

Before deploying, update your environment variables:

### For Local Development:
In `client/.env`:
```env
REACT_APP_API_BASE_URL=http://localhost:5001
REACT_APP_ENVIRONMENT=development
```

### For Production (Set in Vercel Dashboard):
```env
REACT_APP_API_BASE_URL=https://your-backend-domain.vercel.app
REACT_APP_ENVIRONMENT=production
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Navigate to client directory**:
```bash
cd client
```

3. **Login and Deploy**:
```bash
vercel login
vercel
```

4. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - Project name: `blog-app-frontend` (or your choice)
   - Directory: `./` (current directory)

### Option B: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set **Root Directory** to `client`
5. **Framework Preset**: Create React App
6. Click "Deploy"

## Step 3: Configure Environment Variables in Vercel

In Vercel Dashboard → Project → Settings → Environment Variables:

```env
REACT_APP_API_BASE_URL=https://your-backend-domain.vercel.app
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
```

**Important**: Replace `your-backend-domain.vercel.app` with your actual backend URL.

## Step 4: Update Backend CORS

After getting your frontend URL, update your backend environment variables:

In your backend Vercel project → Settings → Environment Variables:
```env
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## Step 5: Test Your Deployment

1. **Visit your frontend URL**
2. **Test API connectivity**:
   - Try logging in
   - Create a blog post
   - Upload an image
   - Add comments

## Troubleshooting

### Common Issues:

1. **"Unexpected token '<'" Error**:
   ✅ **Fixed**: Removed homepage field and added proper routing

2. **API Calls Failing**:
   - Check `REACT_APP_API_BASE_URL` environment variable
   - Ensure backend CORS allows your frontend domain
   - Verify backend is deployed and accessible

3. **404 on Page Refresh**:
   ✅ **Fixed**: Added SPA routing in vercel.json

4. **Build Failures**:
   - Check for any TypeScript errors
   - Ensure all dependencies are in package.json
   - Check build logs in Vercel dashboard

### Debug Steps:

1. **Check Environment Variables**:
   ```bash
   # In your deployed app console
   console.log(process.env.REACT_APP_API_BASE_URL)
   ```

2. **Check Network Tab**:
   - Open browser dev tools
   - Check if API calls are going to correct URL
   - Look for CORS errors

3. **Check Build Logs**:
   - Go to Vercel dashboard
   - Check deployment logs for errors

## File Structure After Setup

```
client/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── components/
│   ├── utils/
│   ├── config.js          # Updated with env vars
│   └── App.js
├── package.json           # Fixed homepage and scripts
├── vercel.json           # SPA routing configuration
├── .env                  # Local environment variables
├── .env.example          # Template for env vars
├── .vercelignore         # Files to exclude
└── .gitignore           # Git ignore rules
```

## Performance Optimizations

1. **Source Maps**: Disabled in production for security
2. **Bundle Analysis**: Use `npm run build` to check bundle size
3. **Code Splitting**: React lazy loading for large components
4. **Image Optimization**: Vercel automatically optimizes images

## Security Checklist

✅ **Environment Variables**: API URLs in environment variables
✅ **Source Maps**: Disabled in production
✅ **HTTPS**: Vercel provides HTTPS by default
✅ **CORS**: Properly configured on backend

## Post-Deployment

1. **Test All Features**: Verify complete functionality
2. **Performance Testing**: Check loading times
3. **Mobile Testing**: Test on different devices
4. **SEO**: Add meta tags if needed

## Your Frontend URLs

After deployment:
- **Production**: `https://your-project-name.vercel.app`
- **Preview**: Vercel creates preview URLs for each commit

## Next Steps

1. **Custom Domain** (Optional): Add your own domain in Vercel
2. **Analytics**: Enable Vercel Analytics
3. **Monitoring**: Set up error tracking
4. **CI/CD**: Automatic deployments on Git push

Your frontend is now ready for production! 🚀

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check browser console for errors
