// Azure Blob Storage initialization
import { blobServiceClient, blobStorageConfig } from './storage-config';

/**
 * Initialize Blob Storage containers
 */
export async function initializeBlobStorage() {
  try {
    console.log('Initializing Blob Storage...');

    // Create the main content container if it doesn't exist
    const containerClient = blobServiceClient.getContainerClient(blobStorageConfig.containerName);
    await containerClient.createIfNotExists({
      access: 'container' // Public access level: 'container', 'blob', or undefined (private)
    });
    console.log(`Container '${blobStorageConfig.containerName}' initialized`);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to initialize Blob Storage:', error);
    return { success: false, error };
  }
}

/**
 * Setup additional containers for different types of content
 */
export async function setupAdditionalContainers() {
  try {
    const containersToCreate = [
      { name: 'videos', access: 'blob' as const },
      { name: 'images', access: 'blob' as const },
      { name: 'documents', access: 'blob' as const },
      { name: 'avatars', access: 'blob' as const }
    ];

    for (const containerDef of containersToCreate) {
      const containerClient = blobServiceClient.getContainerClient(containerDef.name);
      await containerClient.createIfNotExists({
        access: containerDef.access
      });
      console.log(`Container '${containerDef.name}' initialized with access level '${containerDef.access}'`);
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to setup additional containers:', error);
    return { success: false, error };
  }
}

export default {
  initializeBlobStorage,
  setupAdditionalContainers
};