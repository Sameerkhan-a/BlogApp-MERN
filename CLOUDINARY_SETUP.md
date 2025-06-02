# Cloudinary Setup Guide

## Step 1: Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your Cloudinary Credentials

1. After logging in, go to your Dashboard
2. You'll see your account details:
   - **Cloud Name**
   - **API Key** 
   - **API Secret**

## Step 3: Update Environment Variables

1. Open `server/.env` file
2. Replace the placeholder values with your actual Cloudinary credentials:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-api-secret
```

## Step 4: Test the Setup

1. Start your server: `cd server && node server.js`
2. Start your client: `cd client && npm start`
3. Go to "Write Blog" page
4. Try uploading an image

## Features Included

✅ **Drag & Drop Upload**: Users can drag images directly onto the upload area
✅ **File Browser**: Click to browse and select files
✅ **Image Preview**: See uploaded images before publishing
✅ **Progress Indicator**: Visual feedback during upload
✅ **Error Handling**: User-friendly error messages
✅ **File Validation**: 
   - Only image files allowed (JPG, PNG, GIF, WebP)
   - Maximum file size: 5MB
✅ **Image Optimization**: Automatic compression and format optimization
✅ **Responsive Design**: Works on all devices
✅ **Dark Mode Support**: Adapts to light/dark themes

## Upload Limits

- **File Size**: Maximum 5MB per image
- **File Types**: JPG, JPEG, PNG, GIF, WebP
- **Image Processing**: Automatic resize to max 1200x800px
- **Quality**: Auto-optimized for web

## Cloudinary Free Tier Limits

- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month
- **Images/Videos**: Unlimited

This should be more than enough for a blog application!

## Troubleshooting

### Common Issues:

1. **Upload fails with 401 error**
   - Check your API credentials in `.env`
   - Make sure there are no extra spaces in the values

2. **Upload fails with 400 error**
   - Check file size (must be under 5MB)
   - Check file type (must be an image)

3. **Images not displaying**
   - Check if the image URL is being saved correctly
   - Verify Cloudinary cloud name is correct

### Testing Credentials:

You can test your Cloudinary setup by making a simple API call:

```bash
curl -X POST \
  https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload \
  -F "upload_preset=YOUR_UPLOAD_PRESET" \
  -F "file=@/path/to/test/image.jpg"
```

## Security Notes

- Never commit your `.env` file to version control
- Keep your API secret secure
- Consider using upload presets for additional security
- Enable auto-moderation if needed for user-generated content
