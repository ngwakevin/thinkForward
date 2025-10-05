import { Container } from '@azure/cosmos';
import CosmosClientInstance, { containers } from './cosmos';
import { IProgress, IProgressRepository } from './interfaces';

/**
 * ProgressRepository implementation using Azure Cosmos DB
 * Provides data access operations for user progress entities
 */
export class ProgressRepository implements IProgressRepository {
  private container: Container;

  constructor() {
    // Get the client instance and access the progress container
    const client = CosmosClientInstance.getInstance();
    const database = client.database(process.env.COSMOS_DATABASE_ID || 'thinkforward');
    this.container = database.container(containers.progress);
  }

  /**
   * Find a progress record by ID
   * @param id Progress ID
   * @returns Progress entity or null if not found
   */
  async findById(id: string): Promise<IProgress | null> {
    try {
      const { resource } = await this.container.item(id, id).read();
      return resource as IProgress || null;
    } catch (error) {
      if ((error as any).code === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Find all progress records
   * @returns Array of progress entities
   */
  async findAll(): Promise<IProgress[]> {
    const query = 'SELECT * FROM c';
    const { resources } = await this.container.items.query(query).fetchAll();
    return resources as IProgress[];
  }

  /**
   * Create a new progress record
   * @param progress Progress entity to create
   * @returns Created progress entity
   */
  async create(progress: IProgress): Promise<IProgress> {
    // Ensure required fields
    if (!progress.id) {
      progress.id = crypto.randomUUID();
    }
    
    if (!progress.createdAt) {
      progress.createdAt = new Date();
    }
    
    progress.updatedAt = new Date();
    
    // Set default values
    progress.attempts = progress.attempts || 0;
    progress.status = progress.status || 'not-started';
    
    const { resource } = await this.container.items.create(progress);
    return resource as IProgress;
  }

  /**
   * Update an existing progress record
   * @param id Progress ID
   * @param progress Partial progress entity with fields to update
   * @returns Updated progress entity
   */
  async update(id: string, progress: Partial<IProgress>): Promise<IProgress> {
    // Get the current progress
    const currentProgress = await this.findById(id);
    if (!currentProgress) {
      throw new Error(`Progress record with ID ${id} not found`);
    }
    
    // Update with new values and set updatedAt
    const updatedProgress = {
      ...currentProgress,
      ...progress,
      updatedAt: new Date()
    };
    
    // Replace the item
    const { resource } = await this.container.item(id, id).replace(updatedProgress);
    return resource as IProgress;
  }

  /**
   * Delete a progress record
   * @param id Progress ID
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
   * Find all progress records for a specific user
   * @param userId User ID
   * @returns Array of progress entities
   */
  async findByUserId(userId: string): Promise<IProgress[]> {
    const query = `SELECT * FROM c WHERE c.userId = @userId`;
    const { resources } = await this.container.items
      .query({
        query,
        parameters: [{ name: '@userId', value: userId }]
      })
      .fetchAll();
    
    return resources as IProgress[];
  }

  /**
   * Find all progress records for a specific user and course
   * @param userId User ID
   * @param courseId Course ID
   * @returns Array of progress entities
   */
  async findByCourse(userId: string, courseId: string): Promise<IProgress[]> {
    const query = `SELECT * FROM c WHERE c.userId = @userId AND c.courseId = @courseId`;
    const { resources } = await this.container.items
      .query({
        query,
        parameters: [
          { name: '@userId', value: userId },
          { name: '@courseId', value: courseId }
        ]
      })
      .fetchAll();
    
    return resources as IProgress[];
  }

  /**
   * Mark a progress record as completed
   * @param id Progress ID
   * @param score Optional score for the completed lesson/module
   * @returns Updated progress entity
   */
  async markAsCompleted(id: string, score?: number): Promise<IProgress> {
    const progress = await this.findById(id);
    if (!progress) {
      throw new Error(`Progress record with ID ${id} not found`);
    }
    
    return this.update(id, {
      status: 'completed',
      completedAt: new Date(),
      score: score !== undefined ? score : progress.score,
      attempts: progress.attempts + 1
    });
  }
}

// Export a singleton instance of the repository
export const progressRepository = new ProgressRepository();