# Cloudinary Setup Guide

This guide explains how to configure Cloudinary for image storage in SafeNet.

## Why Cloudinary?

- ✅ **CDN Delivery**: Fast global image delivery
- ✅ **Automatic Optimization**: Auto-format (WebP), auto-quality, responsive images
- ✅ **Scalability**: No storage limits on your server
- ✅ **Transformations**: On-the-fly image resizing and optimization
- ✅ **Security**: Secure URLs and access control

## Setup Steps

### 1. Create Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account (includes 25GB storage and 25GB bandwidth/month)
3. Verify your email

### 2. Get Your Credentials

After signing up, you'll see your dashboard with:
- **Cloud Name**: Your unique cloud identifier
- **API Key**: Your API key
- **API Secret**: Your secret key (keep this secure!)

### 3. Configure Environment Variables

Add these to your `.env` file:

```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Test the Configuration

Start your backend server:

```bash
npm run dev
```

The server will automatically configure Cloudinary on startup.

## How It Works

### Image Upload Flow

1. **Mobile App** → User selects images (max 5)
2. **Backend** → Receives images via multipart/form-data
3. **Multer** → Temporarily stores images in memory (Buffer)
4. **Cloudinary** → Uploads images to cloud storage
5. **MongoDB** → Stores Cloudinary URLs in incident document

### Image Storage Structure

Images are stored in Cloudinary with this structure:
```
safenet/
  └── incidents/
      ├── incident-1234567890-abc123.jpg
      ├── incident-1234567891-def456.png
      └── ...
```

### Image Transformations

All uploaded images are automatically:
- **Resized**: Max 1200x1200px (maintains aspect ratio)
- **Optimized**: Auto quality compression
- **Formatted**: Auto WebP when supported by browser
- **Delivered**: Via secure HTTPS URLs

## API Usage

### Upload Images

When creating an incident with images:

```javascript
// Mobile app sends FormData with images
const formData = new FormData();
formData.append('images', imageFile1);
formData.append('images', imageFile2);
// ... other fields

// Backend automatically uploads to Cloudinary
// Returns incident with image URLs
```

### Image URLs in Response

```json
{
  "incident": {
    "_id": "...",
    "title": "Missing Person",
    "images": [
      "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/safenet/incidents/incident-123.jpg",
      "https://res.cloudinary.com/your-cloud/image/upload/v1234567891/safenet/incidents/incident-456.png"
    ]
  }
}
```

## Image Limits

- **Max Images**: 5 per incident
- **Max File Size**: 10MB per image
- **Supported Formats**: JPEG, PNG, WebP
- **Storage**: Cloudinary free tier (25GB)

## Security

- ✅ Images are uploaded via secure HTTPS
- ✅ URLs are secure (https://res.cloudinary.com/...)
- ✅ API secret is stored in environment variables (never commit to git)
- ✅ File type validation (only images allowed)

## Troubleshooting

### Error: "Cloudinary configuration is missing"

**Solution**: Make sure all three environment variables are set:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Error: "Upload failed: No result from Cloudinary"

**Possible causes**:
- Invalid API credentials
- Network connectivity issues
- File too large (>10MB)
- Invalid file format

**Solution**: Check your Cloudinary dashboard for errors and verify credentials.

### Images not displaying

**Check**:
1. Image URLs are valid (test in browser)
2. CORS is configured correctly
3. Cloudinary account is active (not suspended)

## Cost Considerations

### Free Tier
- 25GB storage
- 25GB bandwidth/month
- Perfect for development and small deployments

### Paid Plans
- Starts at $89/month for 100GB storage + 100GB bandwidth
- Pay-as-you-go options available
- See [Cloudinary Pricing](https://cloudinary.com/pricing)

## Migration from Local Storage

If you were using local file storage before:

1. ✅ **Already Done**: Code updated to use Cloudinary
2. ✅ **Already Done**: Local storage code removed
3. ⚠️ **Action Required**: Add Cloudinary credentials to `.env`
4. ⚠️ **Optional**: Migrate existing local images to Cloudinary (if needed)

## Best Practices

1. **Never commit credentials** to git
2. **Use environment variables** for all Cloudinary config
3. **Monitor usage** in Cloudinary dashboard
4. **Set up alerts** for bandwidth/storage limits
5. **Use transformations** for responsive images (already configured)

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Image Transformations Guide](https://cloudinary.com/documentation/image_transformations)
