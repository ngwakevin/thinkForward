// lib/azure/auth-cosmos-service.ts

// Using dynamic import to avoid circular dependencies
const getMainCosmosService = async () => {
  const { cosmosService: mainService } = await import("./cosmos-service");
  return mainService;
};

/**
 * This service is a thin wrapper around the main cosmos service specifically for auth operations
 */
class AuthCosmosService {
  /**
   * Gets a user by email
   */
  async getUserByEmail(email: string) {
    const service = await getMainCosmosService();
    return service.getUserByEmail(email);
  }
  
  /**
   * Gets a user by provider account
   */
  async getUserByProviderAccount(provider: string, providerAccountId: string) {
    const service = await getMainCosmosService();
    // Adapt to the actual method name in your main service
    return service.getUserByProviderAccountId(provider, providerAccountId);
  }
  
  /**
   * Links a provider account to a user
   */
  async linkProviderToUser(userId: string, provider: string, providerAccountId: string, providerData: any) {
    const service = await getMainCosmosService();
    return service.linkProviderAccount(userId, provider, providerAccountId, providerData);
  }
  
  /**
   * Creates a new user
   */
  async createUser(userData: any) {
    const service = await getMainCosmosService();
    return service.createUser(userData);
  }
  
  /**
   * Updates a user
   */
  async updateUser(userId: string, userData: any) {
    const service = await getMainCosmosService();
    return service.updateUser(userId, userData);
  }
  
  /**
   * Gets a user by ID
   */
  async getUserById(userId: string) {
    const service = await getMainCosmosService();
    return service.getUserById(userId);
  }
  
  /**
   * Gets all linked accounts for a user
   */
  async getAccountsByUserId(userId: string) {
    const service = await getMainCosmosService();
    return service.getAccountsByUserId(userId);
  }
}

// Export a singleton instance
export const authCosmosService = new AuthCosmosService();