// Azure Cosmos DB service for user operations
import { container, database } from './cosmos-config';

// Define a User interface that matches our schema
export interface User {
  id: string;
  provider: string;
  providerAccountId: string;
  email?: string | null;
  name?: string | null;
  passwordHash?: string | null;
  isMentor: boolean;
  badges?: string | null;
  objectId?: string | null;
  upn?: string | null;
  signInIdentity?: string | null;
  phoneNumber?: string | null;
  pendingPhoneNumber?: string | null;
  phoneVerifiedAt?: Date | null;
  emailVerifiedAt?: Date | null;
}

// Define interfaces to match our database schema
export interface CosmosUser extends Omit<User, 'createdAt' | 'updatedAt'> {
  createdAt?: string;
  updatedAt?: string;
  _etag?: string;
  _rid?: string;
  _self?: string;
  _ts?: number;
}

export class CosmosDBService {
  /**
   * Create a new user in Cosmos DB
   * @param user User data to create
   */
  async createUser(user: Omit<User, 'id'>): Promise<CosmosUser> {
    const now = new Date().toISOString();
    const newUser = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    
    const { resource } = await container.items.create(newUser);
    if (!resource) {
      throw new Error('Failed to create user in Cosmos DB');
    }
    return resource as CosmosUser;
  }

  /**
   * Get user by ID
   * @param id User ID
   */
  async getUserById(id: string): Promise<CosmosUser | null> {
    try {
      const { resource } = await container.item(id, id).read();
      return resource || null;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }

  /**
   * Get user by email
   * @param email User email
   */
  async getUserByEmail(email: string): Promise<CosmosUser | null> {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.email = @email',
      parameters: [
        {
          name: '@email',
          value: email.toLowerCase()
        }
      ]
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources.length > 0 ? resources[0] : null;
  }

  /**
   * Get user by provider and provider account ID
   * @param provider Auth provider name
   * @param providerAccountId Provider's account ID
   */
  async getUserByProviderAccountId(provider: string, providerAccountId: string): Promise<CosmosUser | null> {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.provider = @provider AND c.providerAccountId = @providerAccountId',
      parameters: [
        {
          name: '@provider',
          value: provider
        },
        {
          name: '@providerAccountId',
          value: providerAccountId
        }
      ]
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources.length > 0 ? resources[0] : null;
  }

  /**
   * Update user data
   * @param id User ID
   * @param userData Partial user data to update
   */
  async updateUser(id: string, userData: Partial<User>): Promise<CosmosUser | null> {
    try {
      // First get the current user
      const { resource: existingUser } = await container.item(id, id).read();
      
      if (!existingUser) return null;
      
      // Update the user with new data
      const updatedUser = {
        ...existingUser,
        ...userData,
        updatedAt: new Date().toISOString()
      };
      
      // Replace the item in Cosmos DB
      const { resource } = await container.item(id, id).replace(updatedUser);
      return resource;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  /**
   * Delete user by ID
   * @param id User ID
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      await container.item(id, id).delete();
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  /**
   * List users with pagination
   * @param pageSize Number of users per page
   * @param continuationToken Token for continuing from a previous query
   */
  async listUsers(pageSize: number = 50, continuationToken?: string): Promise<{
    users: CosmosUser[];
    continuationToken?: string;
  }> {
    const querySpec = {
      query: 'SELECT * FROM c ORDER BY c.createdAt DESC',
      parameters: []
    };

    const options = {
      maxItemCount: pageSize,
      continuationToken
    };

    const { resources, continuationToken: nextToken } = await container.items.query(querySpec, options).fetchNext();
    
    return {
      users: resources,
      continuationToken: nextToken
    };
  }
}

// Export a singleton instance
export const cosmosService = new CosmosDBService();
export default cosmosService;