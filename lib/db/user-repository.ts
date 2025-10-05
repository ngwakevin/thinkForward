import { Container } from '@azure/cosmos';
import CosmosClientInstance, { containers } from './cosmos';
import { IUser, IUserRepository } from './interfaces';

/**
 * UserRepository implementation using Azure Cosmos DB
 * Provides data access operations for user entities
 */
export class UserRepository implements IUserRepository {
  private container: Container;

  constructor() {
    // Get the client instance and access the users container
    const client = CosmosClientInstance.getInstance();
    const database = client.database(process.env.COSMOS_DATABASE_ID || 'thinkforward');
    this.container = database.container(containers.users);
  }

  /**
   * Find a user by ID
   * @param id User ID
   * @returns User entity or null if not found
   */
  async findById(id: string): Promise<IUser | null> {
    try {
      const { resource } = await this.container.item(id, id).read();
      return resource as IUser || null;
    } catch (error) {
      if ((error as any).code === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Find all users
   * @returns Array of user entities
   */
  async findAll(): Promise<IUser[]> {
    const query = 'SELECT * FROM c';
    const { resources } = await this.container.items.query(query).fetchAll();
    return resources as IUser[];
  }

  /**
   * Create a new user
   * @param user User entity to create
   * @returns Created user entity
   */
  async create(user: IUser): Promise<IUser> {
    // Ensure required fields
    if (!user.id) {
      user.id = crypto.randomUUID();
    }
    
    if (!user.createdAt) {
      user.createdAt = new Date();
    }
    
    user.updatedAt = new Date();
    
    const { resource } = await this.container.items.create(user);
    return resource as IUser;
  }

  /**
   * Update an existing user
   * @param id User ID
   * @param user Partial user entity with fields to update
   * @returns Updated user entity
   */
  async update(id: string, user: Partial<IUser>): Promise<IUser> {
    // Get the current user
    const currentUser = await this.findById(id);
    if (!currentUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    // Update with new values and set updatedAt
    const updatedUser = {
      ...currentUser,
      ...user,
      updatedAt: new Date()
    };
    
    // Replace the item
    const { resource } = await this.container.item(id, id).replace(updatedUser);
    return resource as IUser;
  }

  /**
   * Delete a user
   * @param id User ID
   * @returns True if deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    try {
      await this.container.item(id, id).delete();
      return true;
    } catch (error) {
      if ((error as any).code === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Find a user by email address
   * @param email Email address
   * @returns User entity or null if not found
   */
  async findByEmail(email: string): Promise<IUser | null> {
    const query = `SELECT * FROM c WHERE c.email = @email`;
    const { resources } = await this.container.items
      .query({
        query,
        parameters: [{ name: '@email', value: email.toLowerCase() }]
      })
      .fetchAll();
    
    return resources.length > 0 ? (resources[0] as IUser) : null;
  }

  /**
   * Find a user by provider and provider account ID
   * @param provider Authentication provider (e.g., 'azure-ad', 'credentials')
   * @param providerAccountId Provider-specific account ID
   * @returns User entity or null if not found
   */
  async findByProviderAccount(provider: string, providerAccountId: string): Promise<IUser | null> {
    const query = `SELECT * FROM c WHERE c.provider = @provider AND c.providerAccountId = @providerAccountId`;
    const { resources } = await this.container.items
      .query({
        query,
        parameters: [
          { name: '@provider', value: provider },
          { name: '@providerAccountId', value: providerAccountId }
        ]
      })
      .fetchAll();
    
    return resources.length > 0 ? (resources[0] as IUser) : null;
  }

  /**
   * Increment failed sign-in count and update last failed sign-in timestamp
   * @param id User ID
   */
  async incrementFailedSignIn(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    await this.update(id, {
      failedSignInCount: (user.failedSignInCount || 0) + 1,
      lastFailedSignInAt: new Date()
    });
  }

  /**
   * Update last sign-in timestamp and reset failed sign-in count
   * @param id User ID
   */
  async updateLastSignIn(id: string): Promise<void> {
    await this.update(id, {
      lastSignInAt: new Date(),
      failedSignInCount: 0
    });
  }
}

// Export a singleton instance of the repository
export const userRepository = new UserRepository();