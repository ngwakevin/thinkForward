// Azure Blob Storage service for file operations
import { BlockBlobClient, BlobSASPermissions, generateBlobSASQueryParameters } from '@azure/storage-blob';
import { blobStorageConfig, containerClient, blobServiceClient } from './storage-config';
import { Readable } from 'stream';

export interface BlobUploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  cacheControl?: string;
}

export interface BlobDownloadOptions {
  // Additional download options can be added here
}

export interface GenerateSasUrlOptions {
  permissions?: BlobSASPermissions;
  expiryMinutes?: number;
}

export class BlobStorageService {
  /**
   * Upload a file to Blob Storage
   * @param blobName The name to give the blob in storage
   * @param content The content to upload (Buffer, ArrayBuffer, string, or stream)
   * @param options Upload options
   */
  async uploadFile(
    blobName: string,
    content: Buffer | ArrayBuffer | string | Readable,
    options: BlobUploadOptions = {}
  ): Promise<{ url: string; name: string }> {
    try {
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      
      const uploadOptions = {
        blobHTTPHeaders: {
          blobContentType: options.contentType,
          blobCacheControl: options.cacheControl
        },
        metadata: options.metadata
      };
      
      await blockBlobClient.upload(content, Buffer.byteLength(content as Buffer), uploadOptions);
      
      return {
        url: blockBlobClient.url,
        name: blobName
      };
    } catch (error) {
      console.error('Error uploading file to Blob Storage:', error);
      throw new Error(`Failed to upload file: ${(error as Error).message}`);
    }
  }

  /**
   * Download a file from Blob Storage
   * @param blobName The name of the blob to download
   * @param options Download options
   */
  async downloadFile(
    blobName: string,
    options: BlobDownloadOptions = {}
  ): Promise<Buffer> {
    try {
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const downloadResponse = await blockBlobClient.download(0);
      
      // Convert stream to buffer
      const chunks: Uint8Array[] = [];
      const stream = downloadResponse.readableStreamBody;
      
      if (!stream) {
        throw new Error('No readable stream returned from download operation');
      }
      
      return new Promise<Buffer>((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      });
    } catch (error) {
      console.error('Error downloading file from Blob Storage:', error);
      throw new Error(`Failed to download file: ${(error as Error).message}`);
    }
  }

  /**
   * Generate a SAS URL for a blob
   * @param blobName The name of the blob
   * @param options SAS generation options
   */
  generateSasUrl(
    blobName: string,
    options: GenerateSasUrlOptions = {}
  ): string {
    try {
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      
      // Setup SAS permissions
      const permissions = options.permissions || new BlobSASPermissions();
      if (!options.permissions) {
        permissions.read = true; // Default to read-only if no permissions specified
      }
      
      // Calculate expiry time
      const expiryMinutes = options.expiryMinutes || blobStorageConfig.sasExpiryMinutes;
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + expiryMinutes);
      
      // Generate SAS token
      const sasToken = generateBlobSASQueryParameters(
        {
          containerName: blobStorageConfig.containerName,
          blobName,
          permissions,
          expiresOn: expiryTime,
        },
        blobServiceClient.credential as any
      ).toString();
      
      // Return the full SAS URL
      return `${blockBlobClient.url}?${sasToken}`;
    } catch (error) {
      console.error('Error generating SAS URL:', error);
      throw new Error(`Failed to generate SAS URL: ${(error as Error).message}`);
    }
  }

  /**
   * Delete a blob from storage
   * @param blobName The name of the blob to delete
   */
  async deleteFile(blobName: string): Promise<boolean> {
    try {
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.delete();
      return true;
    } catch (error) {
      console.error('Error deleting file from Blob Storage:', error);
      return false;
    }
  }

  /**
   * List all blobs in a container with optional prefix filter
   * @param prefix Optional prefix to filter results
   */
  async listFiles(prefix?: string): Promise<string[]> {
    try {
      const options = prefix ? { prefix } : undefined;
      const blobNames: string[] = [];
      
      // List all blobs and collect their names
      for await (const blob of containerClient.listBlobsFlat(options)) {
        blobNames.push(blob.name);
      }
      
      return blobNames;
    } catch (error) {
      console.error('Error listing files from Blob Storage:', error);
      throw new Error(`Failed to list files: ${(error as Error).message}`);
    }
  }

  /**
   * Check if a blob exists
   * @param blobName The name of the blob to check
   */
  async fileExists(blobName: string): Promise<boolean> {
    try {
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      return await blockBlobClient.exists();
    } catch (error) {
      console.error('Error checking if file exists in Blob Storage:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const blobStorage = new BlobStorageService();
export default blobStorage;