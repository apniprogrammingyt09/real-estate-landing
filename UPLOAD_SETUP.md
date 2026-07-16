# Setting Up Image Upload for Agent Profiles

The agent profile photo upload functionality uses Vercel Blob Storage. Here's how to set it up:

## 1. Create a Vercel Blob Store

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to the "Storage" section
3. Click "Create" and select "Blob"
4. Give your store a name (e.g., "real-estate-images")
5. Copy the `BLOB_READ_WRITE_TOKEN` that is generated

## 2. Set Up Environment Variables

1. Copy the `.env.example` file to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Replace the placeholder values in `.env.local`:

   ```env
   # Replace with your actual MongoDB connection string
   MONGODB_URI=mongodb://localhost:27017/real-estate
   MONGODB_DB=real-estate
   
   # Replace with your actual Vercel Blob token
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_YOUR_ACTUAL_TOKEN_HERE
   
   # Your app URL
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ADMIN_EMAIL=admin@Elite Group.com
   ```

## 3. Alternative Solutions

If you don't want to use Vercel Blob Storage, you can:

### Option A: Use Local File Storage (Development Only)

You can modify the upload endpoint to save files locally in the `public` folder.

### Option B: Use Other Cloud Storage

You can replace the Vercel Blob integration with:

- AWS S3
- Google Cloud Storage
- Cloudinary
- Any other file storage service

## 4. Troubleshooting

### Common Issues

1. **"File upload is not configured" error**
   - Make sure `BLOB_READ_WRITE_TOKEN` is set in your `.env.local` file
   - Restart your development server after adding environment variables

2. **Upload fails silently**
   - Check the browser console for error messages
   - Check the server logs for detailed error information

3. **File size too large**
   - The current limit is 2MB per file
   - You can adjust this in `/app/api/upload/agent-avatar/route.ts`

### Testing the Upload

1. Create a new agent
2. Try uploading a small image (< 2MB)
3. Check the browser console for any error messages
4. If upload fails, the agent will still be created with a default placeholder image

## 5. Default Behavior

- If image upload fails or is not configured, agents will use a default placeholder
- The system will continue to work without image upload functionality
- Users will see helpful error messages if upload fails

## 6. Current Implementation

The upload system:

- Validates file type (images only)
- Validates file size (max 2MB)
- Generates unique filenames to prevent conflicts
- Provides detailed error messages
- Falls back gracefully when upload is not available
