// app/api/auth/azure/cosmos-service.ts

// Using dynamic import to avoid circular dependencies
const getMainCosmosService = async () => {
  const { cosmosService: mainService } = await import("../../../../lib/azure/cosmos-service");
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
   * Gets a user by ID
   */
  async getUserById(id: string) {
    const service = await getMainCosmosService();
    return service.getUserById(id);
  }
  
  /**
   * Creates a new user
   */
  async createUser(userData: any) {
    const service = await getMainCosmosService();
    return service.createUser(userData);
  }
  
  /**
   * Links a provider account to a user
   */
  async linkUserAccount(userId: string, accountData: any) {
    const service = await getMainCosmosService();
    // If main service doesn't have this method, provide a stub implementation
    console.log(`[auth] Linking account ${accountData.provider} to user ${userId}`);
    
    try {
      // In a real implementation, this would update the user's linked accounts
      // For now, just log it and return the user
      const user = await service.getUserById(userId);
      
      // For now just update some basic user properties we know exist
      const updateData = {
        provider: accountData.provider,
        providerAccountId: accountData.providerAccountId,
      };
      
      // Update the user with whatever fields the service supports
      await service.updateUser(userId, updateData);
      
      return user;
    } catch (error) {
      console.error(`[auth] Failed to link account: ${error}`);
      return null;
    }
  }
}

// Export a singleton instance
export const cosmosService = new AuthCosmosService();