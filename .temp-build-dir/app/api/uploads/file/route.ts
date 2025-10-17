// API route for file uploads to Azure Blob Storage
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { blobStorage } from '../../../../lib/azure/storage-service';
import { withTelemetry } from '../../../../lib/azure/with-telemetry';
import crypto from 'crypto';

/**
 * Handle file upload to Azure Blob Storage
 * @param req NextRequest object
 */
async function handler(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure it's a POST request with multipart/form-data
    if (req.method !== 'POST') {
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }

    // Parse the FormData
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Get other form data
    const folder = formData.get('folder') as string || 'uploads';
    const userEmail = session.user.email;
    const userId = (session.user as any).id;
    
    // Generate a unique filename to avoid collisions
    const fileExtension = file.name.split('.').pop();
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const fileName = `${folder}/${userId || userEmail}/${uniqueId}-${file.name}`;

    // Determine content type
    const contentType = file.type || 'application/octet-stream';
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Azure Blob Storage
    const result = await blobStorage.uploadFile(fileName, buffer, {
      contentType,
      metadata: {
        uploadedBy: userEmail || '',
        originalName: file.name,
        size: file.size.toString()
      },
      cacheControl: 'max-age=3600'
    });

    // Generate a SAS URL for the uploaded file (time-limited access)
    const sasUrl = blobStorage.generateSasUrl(fileName, {
      expiryMinutes: 60 * 24 // 24 hours
    });

    return NextResponse.json({
      success: true,
      fileName,
      url: result.url,
      sasUrl,
      contentType,
      size: file.size
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'File upload failed', message: (error as Error).message },
      { status: 500 }
    );
  }
}

// Export the handler with telemetry wrapper
export const POST = withTelemetry(handler);