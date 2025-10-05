import CosmosClientInstance from './cosmos';

/**
 * Initialize the database connection and containers
 * This function should be called during app startup
 */
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('Initializing database connection and containers...');
    await CosmosClientInstance.initialize();
    console.log('Database initialization complete.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    // In production, we might want to fail the app startup if DB init fails
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
}