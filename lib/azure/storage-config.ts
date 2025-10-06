// Azure Blob Storage configuration
import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from "@azure/storage-blob";

// Configuration for Azure Blob Storage
export const blobStorageConfig = {
  accountName: process.env.STORAGE_ACCOUNT_NAME || '',
  accountKey: process.env.STORAGE_ACCOUNT_KEY || '',
  containerName: process.env.STORAGE_CONTAINER_NAME || 'content',
  sasExpiryMinutes: 60 // Default SAS token expiry in minutes
};

// Create the Blob Service Client
const sharedKeyCredential = new StorageSharedKeyCredential(
  blobStorageConfig.accountName, 
  blobStorageConfig.accountKey
);

export const blobServiceClient = new BlobServiceClient(
  `https://${blobStorageConfig.accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

// Get container client for the default container
export const containerClient = blobServiceClient.getContainerClient(blobStorageConfig.containerName);

// Verify Blob Storage connection
export const verifyBlobStorageConnection = async () => {
  try {
    // Try to get container properties to verify connection
    await containerClient.getProperties();
    console.log('Connected to Blob Storage container:', blobStorageConfig.containerName);
    return true;
  } catch (error) {
    console.error('Error connecting to Blob Storage:', error);
    return false;
  }
};

export default {
  blobServiceClient,
  containerClient,
  blobStorageConfig,
  verifyBlobStorageConnection
};