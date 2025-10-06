// Azure Key Vault service for secret management
import { secretClient } from './keyvault-config';
import { KeyVaultSecret } from '@azure/keyvault-secrets';

// In-memory cache for secrets to reduce Key Vault calls
interface CachedSecret {
  value: string;
  expiresAt: number;
}

export class KeyVaultService {
  private secretCache: Map<string, CachedSecret> = new Map();
  private readonly defaultCacheTtlMs = 5 * 60 * 1000; // 5 minutes default TTL

  /**
   * Get a secret from Key Vault
   * @param secretName The name of the secret to retrieve
   * @param useCache Whether to use cached value if available
   * @param cacheTtlMs How long to cache the secret in milliseconds (default: 5 minutes)
   */
  async getSecret(
    secretName: string, 
    useCache: boolean = true,
    cacheTtlMs: number = this.defaultCacheTtlMs
  ): Promise<string> {
    try {
      // Check cache first if enabled
      if (useCache) {
        const cachedSecret = this.secretCache.get(secretName);
        if (cachedSecret && Date.now() < cachedSecret.expiresAt) {
          return cachedSecret.value;
        }
      }

      // Get secret from Key Vault
      const secret = await secretClient.getSecret(secretName);
      
      if (!secret.value) {
        throw new Error(`Secret '${secretName}' value is undefined`);
      }
      
      // Cache the secret if caching is enabled
      if (useCache) {
        this.secretCache.set(secretName, {
          value: secret.value,
          expiresAt: Date.now() + cacheTtlMs
        });
      }
      
      return secret.value;
    } catch (error) {
      console.error(`Error retrieving secret '${secretName}' from Key Vault:`, error);
      throw new Error(`Failed to retrieve secret: ${(error as Error).message}`);
    }
  }

  /**
   * Set a secret in Key Vault
   * @param secretName The name of the secret to set
   * @param secretValue The value of the secret
   * @param options Additional options for the secret
   */
  async setSecret(
    secretName: string,
    secretValue: string,
    options?: {
      contentType?: string;
      enabled?: boolean;
    }
  ): Promise<KeyVaultSecret> {
    try {
      // Clear from cache if it exists
      this.secretCache.delete(secretName);
      
      // Set the secret in Key Vault
      return await secretClient.setSecret(secretName, secretValue, options);
    } catch (error) {
      console.error(`Error setting secret '${secretName}' in Key Vault:`, error);
      throw new Error(`Failed to set secret: ${(error as Error).message}`);
    }
  }

  /**
   * Delete a secret from Key Vault
   * @param secretName The name of the secret to delete
   */
  async deleteSecret(secretName: string): Promise<boolean> {
    try {
      // Clear from cache if it exists
      this.secretCache.delete(secretName);
      
      // Delete the secret from Key Vault
      const poller = await secretClient.beginDeleteSecret(secretName);
      await poller.pollUntilDone();
      return true;
    } catch (error) {
      console.error(`Error deleting secret '${secretName}' from Key Vault:`, error);
      return false;
    }
  }

  /**
   * List all secrets in Key Vault
   */
  async listSecrets(): Promise<string[]> {
    try {
      const secrets: string[] = [];
      
      // Iterate through all secrets and collect their names
      for await (const secretProperties of secretClient.listPropertiesOfSecrets()) {
        secrets.push(secretProperties.name);
      }
      
      return secrets;
    } catch (error) {
      console.error('Error listing secrets from Key Vault:', error);
      throw new Error(`Failed to list secrets: ${(error as Error).message}`);
    }
  }

  /**
   * Clear the secret cache
   */
  clearCache(): void {
    this.secretCache.clear();
  }
}

// Export a singleton instance
export const keyVaultService = new KeyVaultService();
export default keyVaultService;