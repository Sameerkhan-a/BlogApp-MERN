# Backend Deployment Guide - Vercel

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Set up a cloud MongoDB database
3. **Cloudinary Account**: For image uploads
4. **GitHub Repository**: Push your code to GitHub

## Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist IP addresses (use `0.0.0.0/0` for all IPs)
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/blogapp`

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to server directory:
```bash
cd server
```

3. Login to Vercel:
```bash
vercel login
```

4. Deploy:
```bash
vercel
```

5. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - Project name: `blog-app-backend` (or your choice)
   - Directory: `./` (current directory)

### Option B: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set **Root Directory** to `server`
5. Click "Deploy"

## Step 3: Configure Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables, add:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blogapp
JWT_SECRET=your-super-secret-jwt-key-make-it-very-long-and-random
PORT=5001
CLIENT_URL=http://localhost:3000
FRONTEND_URL=https://your-frontend-domain.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
NODE_ENV=production
```

**Important Notes:**
- Replace `username:password` with your MongoDB Atlas credentials
- Replace `cluster.mongodb.net` with your actual cluster URL
- Generate a strong JWT secret (at least 32 characters)
- Update `FRONTEND_URL` after deploying frontend
- Use your actual Cloudinary credentials

## Step 4: Update CORS After Frontend Deployment

After deploying your frontend, update the environment variable:
```env
FRONTEND_URL=https://your-actual-frontend-domain.vercel.app
```

## Step 5: Test Your Deployment

1. **Health Check**: Visit `https://your-backend-domain.vercel.app/api/health`
2. **API Endpoints**: Test with tools like Postman or curl

Example API endpoints:
- `GET /api/blogs` - Get all blogs
- `POST /api/users/login` - User login
- `GET /api/blogs/tags` - Get all tags

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Check your connection string
   - Ensure IP whitelist includes `0.0.0.0/0`
   - Verify database user credentials

2. **CORS Errors**
   - Update `FRONTEND_URL` environment variable
   - Check allowed origins in server configuration

3. **Function Timeout**
   - Vercel free tier has 10s timeout
   - Optimize database queries
   - Consider upgrading to Pro plan for 60s timeout

4. **Environment Variables Not Working**
   - Redeploy after adding environment variables
   - Check variable names match exactly

### Logs and Debugging:

1. **View Logs**: Vercel Dashboard → Project → Functions → View Logs
2. **Real-time Logs**: Use `vercel logs` command
3. **Local Testing**: Test locally before deploying

## Security Checklist

✅ **Environment Variables**: All secrets in Vercel environment variables
✅ **MongoDB**: Use MongoDB Atlas with authentication
✅ **JWT Secret**: Strong, random secret key
✅ **CORS**: Properly configured allowed origins
✅ **HTTPS**: Vercel provides HTTPS by default

## Performance Tips

1. **Database Indexing**: Ensure proper indexes in MongoDB
2. **Connection Pooling**: Mongoose handles this automatically
3. **Error Handling**: Comprehensive error handling implemented
4. **Caching**: Consider adding Redis for session storage (optional)

## Post-Deployment

1. **Test All Endpoints**: Verify all API functionality
2. **Monitor Performance**: Use Vercel Analytics
3. **Set up Monitoring**: Consider services like Sentry for error tracking
4. **Backup Strategy**: Regular MongoDB Atlas backups

## Your Backend URLs

After deployment, your backend will be available at:
- **Production**: `https://your-project-name.vercel.app`
- **API Base**: `https://your-project-name.vercel.app/api`

## Next Steps

1. Deploy the frontend to Vercel
2. Update frontend API configuration to use production backend URL
3. Update CORS configuration with frontend URL
4. Test the complete application

## Support

If you encounter issues:
1. Check Vercel documentation
2. Review function logs in Vercel dashboard
3. Test API endpoints individually
4. Verify environment variables are set correctly

Your backend is now ready for production! 🚀
