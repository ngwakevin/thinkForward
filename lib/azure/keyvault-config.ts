// Azure Key Vault configuration
import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential, ManagedIdentityCredential } from "@azure/identity";

// Configuration for Azure Key Vault
export const keyVaultConfig = {
  vaultUrl: process.env.KEY_VAULT_URL || '',
  useLocalDevelopmentCredentials: process.env.NODE_ENV !== 'production'
};

// Choose the appropriate credential based on environment
// For production (Azure environment), use ManagedIdentityCredential
// For local development, use DefaultAzureCredential
let credential;
if (keyVaultConfig.useLocalDevelopmentCredentials) {
  // For local development - will use environment variables, VS Code credentials, etc.
  credential = new DefaultAzureCredential();
  console.log('Using DefaultAzureCredential for local development');
} else {
  // For production - will use Managed Identity assigned to the Azure resource
  credential = new ManagedIdentityCredential();
  console.log('Using ManagedIdentityCredential for production');
}

// Create the Secret Client for Key Vault
export const secretClient = new SecretClient(keyVaultConfig.vaultUrl, credential);

// Verify Key Vault connection
export const verifyKeyVaultConnection = async () => {
  if (!keyVaultConfig.vaultUrl) {
    console.error('Key Vault URL not configured');
    return false;
  }
  
  try {
    // Try to get a secret to verify connection (need at least one secret in the vault)
    const testSecretName = 'test-connection';
    try {
      await secretClient.getSecret(testSecretName);
      console.log('Successfully connected to Key Vault');
      return true;
    } catch (error: any) {
      // If the error is just that the secret doesn't exist, that's okay - we're still connected
      if (error.code === 'SecretNotFound') {
        console.log('Successfully connected to Key Vault (test secret not found but connection works)');
        return true;
      }
      throw error; // Re-throw if it's a different error
    }
  } catch (error) {
    console.error('Error connecting to Key Vault:', error);
    return false;
  }
};

export default {
  secretClient,
  keyVaultConfig,
  verifyKeyVaultConnection
};