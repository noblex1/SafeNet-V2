# Cloudinary URL Structure & Configuration

## Cloudinary URL Format

Cloudinary URLs follow this pattern:

```
https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{VERSION}/{FOLDER}/{FILENAME}
```

### Example URLs

```
https://res.cloudinary.com/demo/image/upload/v1234567890/safenet/incidents/incident-abc123.jpg
https://res.cloudinary.com/your-cloud/image/upload/v1234567891/safenet/incidents/incident-def456.png
```

## URL Components

| Component | Description | Example |
|-----------|-------------|---------|
| `res.cloudinary.com` | Cloudinary CDN domain | Fixed |
| `{CLOUD_NAME}` | Your Cloudinary cloud name | `demo`, `your-cloud` |
| `image/upload` | Resource type and action | Fixed for image uploads |
| `v{version}` | Version number (timestamp) | `v1234567890` |
| `{folder}` | Folder path in Cloudinary | `safenet/incidents` |
| `{filename}` | Image filename | `incident-abc123.jpg` |

## Environment Variables

Add these to your `.env` file:

```bash
# Required Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-secret-key-here
```

### Where to Find These Values

1. **Sign up/Login** to [Cloudinary Dashboard](https://cloudinary.com/console)
2. **Go to Dashboard** → You'll see:
   - **Cloud Name**: Top of dashboard (e.g., `demo`, `myapp`)
   - **API Key**: Under "Account Details"
   - **API Secret**: Click "Reveal" to show (keep secret!)

## How URLs Are Generated

### Automatic Generation

When you upload an image, Cloudinary automatically:
1. Generates a unique filename
2. Creates a version number (timestamp)
3. Stores in the specified folder
4. Returns a `secure_url` (HTTPS URL)

### Code Flow

```typescript
// 1. Image uploaded to Cloudinary
const result = await uploadToCloudinary(fileBuffer, 'safenet/incidents');

// 2. Cloudinary returns:
{
  secure_url: "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/safenet/incidents/incident-abc123.jpg",
  public_id: "safenet/incidents/incident-abc123"
}

// 3. URL stored in MongoDB
images: [
  "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/safenet/incidents/incident-abc123.jpg"
]
```

## URL Storage in MongoDB

### Incident Document Structure

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Missing Person",
  "description": "...",
  "images": [
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/safenet/incidents/incident-abc123.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567891/safenet/incidents/incident-def456.png"
  ],
  "createdAt": "2026-01-15T10:00:00.000Z"
}
```

## URL Transformations

You can add transformations to URLs on-the-fly:

### Original URL
```
https://res.cloudinary.com/your-cloud/image/upload/v1234567890/safenet/incidents/incident-abc123.jpg
```

### With Transformations
```
https://res.cloudinary.com/your-cloud/image/upload/w_400,h_300,c_fill/safenet/incidents/incident-abc123.jpg
```

**Transformation Parameters:**
- `w_400` - Width 400px
- `h_300` - Height 300px
- `c_fill` - Crop fill
- `q_auto` - Auto quality
- `f_auto` - Auto format (WebP)

## Using URLs in Mobile App

### Display Images

```typescript
// React Native
<Image 
  source={{ uri: incident.images[0] }}
  style={{ width: 200, height: 200 }}
/>

// The URL is already a full HTTPS URL, no base URL needed!
```

### Example Response from API

```json
{
  "success": true,
  "data": {
    "incident": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Missing Person",
      "images": [
        "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/safenet/incidents/incident-abc123.jpg"
      ]
    }
  }
}
```

## Configuration Checklist

- [ ] Sign up at [cloudinary.com](https://cloudinary.com)
- [ ] Get your Cloud Name from dashboard
- [ ] Get your API Key from dashboard
- [ ] Get your API Secret (click "Reveal")
- [ ] Add all three to `.env` file:
  ```bash
  CLOUDINARY_CLOUD_NAME=your-cloud-name
  CLOUDINARY_API_KEY=your-api-key
  CLOUDINARY_API_SECRET=your-api-secret
  ```
- [ ] Restart backend server
- [ ] Test image upload

## URL Examples by Cloud Name

If your cloud name is `demo`:
```
https://res.cloudinary.com/demo/image/upload/v1234567890/safenet/incidents/image.jpg
```

If your cloud name is `myapp`:
```
https://res.cloudinary.com/myapp/image/upload/v1234567890/safenet/incidents/image.jpg
```

## Important Notes

1. **Secure URLs**: All URLs use HTTPS (`secure_url`)
2. **No Base URL Needed**: URLs are complete and absolute
3. **CDN Delivery**: Images delivered via Cloudinary's global CDN
4. **Auto-Optimization**: URLs automatically serve optimized images
5. **Version Numbers**: Version numbers prevent caching issues

## Testing URLs

You can test if a URL is valid by:
1. Opening in browser
2. Using curl:
   ```bash
   curl -I https://res.cloudinary.com/your-cloud/image/upload/v1234567890/safenet/incidents/image.jpg
   ```

## Troubleshooting

### URL Not Working
- Check if cloud name is correct
- Verify image exists in Cloudinary dashboard
- Check if URL is complete (has version number)

### Images Not Displaying
- Ensure URL uses `https://` (secure_url)
- Check CORS settings (usually not needed for Cloudinary)
- Verify image format is supported (JPEG, PNG, WebP)
