import { Container } from '@azure/cosmos';
import CosmosClientInstance, { containers } from './cosmos';
import { ISecurityAuditLog, ISecurityAuditRepository } from './interfaces';

/**
 * SecurityAuditRepository implementation using Azure Cosmos DB
 * Provides data access operations for security audit log entities
 */
export class SecurityAuditRepository implements ISecurityAuditRepository {
  private container: Container;

  constructor() {
    // Get the client instance and access the security audit container
    const client = CosmosClientInstance.getInstance();
    const database = client.database(process.env.COSMOS_DATABASE_ID || 'thinkforward');
    this.container = database.container(containers.security);
  }

  /**
   * Find a security audit log by ID
   * @param id Log entry ID
   * @returns Security audit log entity or null if not found
   */
  async findById(id: string): Promise<ISecurityAuditLog | null> {
    try {
      const { resource } = await this.container.item(id, id).read();
      return resource as ISecurityAuditLog || null;
    } catch (error) {
      if ((error as any).code === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Find all security audit logs
   * @returns Array of security audit log entities
   */
  async findAll(): Promise<ISecurityAuditLog[]> {
    const query = 'SELECT * FROM c ORDER BY c.timestamp DESC';
    const { resources } = await this.container.items.query(query).fetchAll();
    return resources as ISecurityAuditLog[];
  }

  /**
   * Create a new security audit log
   * @param log Security audit log entity to create
   * @returns Created security audit log entity
   */
  async create(log: ISecurityAuditLog): Promise<ISecurityAuditLog> {
    // Ensure required fields
    if (!log.id) {
      log.id = crypto.randomUUID();
    }
    
    if (!log.timestamp) {
      log.timestamp = new Date();
    }
    
    // Convert metadata to string if it's an object
    if (log.metadata && typeof log.metadata === 'object') {
      log.metadata = log.metadata as Record<string, any>;
    }
    
    const { resource } = await this.container.items.create(log);
    return resource as ISecurityAuditLog;
  }

  /**
   * Update an existing security audit log
   * @param id Log entry ID
   * @param log Partial security audit log entity with fields to update
   * @returns Updated security audit log entity
   */
  async update(id: string, log: Partial<ISecurityAuditLog>): Promise<ISecurityAuditLog> {
    // Security audit logs should generally be immutable, but we provide the ability to update
    const currentLog = await this.findById(id);
    if (!currentLog) {
      throw new Error(`Security audit log with ID ${id} not found`);
    }
    
    // Update with new values
    const updatedLog = {
      ...currentLog,
      ...log,
    };
    
    // Replace the item
    const { resource } = await this.container.item(id, id).replace(updatedLog);
    return resource as ISecurityAuditLog;
  }

  /**
   * Delete a security audit log
   * @param id Log entry ID
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
   * Find all security audit logs for a specific user
   * @param userId User ID
   * @returns Array of security audit log entities
   */
  async findByUserId(userId: string): Promise<ISecurityAuditLog[]> {
    const query = `SELECT * FROM c WHERE c.userId = @userId ORDER BY c.timestamp DESC`;
    const { resources } = await this.container.items
      .query({
        query,
        parameters: [{ name: '@userId', value: userId }]
      })
      .fetchAll();
    
    return resources as ISecurityAuditLog[];
  }

  /**
   * Find all security audit logs of a specific event type
   * @param eventType Event type
   * @returns Array of security audit log entities
   */
  async findByEventType(eventType: string): Promise<ISecurityAuditLog[]> {
    const query = `SELECT * FROM c WHERE c.eventType = @eventType ORDER BY c.timestamp DESC`;
    const { resources } = await this.container.items
      .query({
        query,
        parameters: [{ name: '@eventType', value: eventType }]
      })
      .fetchAll();
    
    return resources as ISecurityAuditLog[];
  }

  /**
   * Find all security audit logs within a date range
   * @param startDate Start date
   * @param endDate End date
   * @returns Array of security audit log entities
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<ISecurityAuditLog[]> {
    const query = `
      SELECT * FROM c 
      WHERE c.timestamp >= @startDate AND c.timestamp <= @endDate
      ORDER BY c.timestamp DESC
    `;
    
    const { resources } = await this.container.items
      .query({
        query,
        parameters: [
          { name: '@startDate', value: startDate.toISOString() },
          { name: '@endDate', value: endDate.toISOString() }
        ]
      })
      .fetchAll();
    
    return resources as ISecurityAuditLog[];
  }
}

// Export a singleton instance of the repository
export const securityAuditRepository = new SecurityAuditRepository();