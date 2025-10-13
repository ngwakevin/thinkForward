// Azure Cosmos DB service for community module operations
import { CosmosClient, Container } from '@azure/cosmos';
import { cosmosConfig, client, database, verifyCosmosDBConnection } from './cosmos-config';

// Define interfaces for community models
export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  isSticky?: boolean;
  isClosed?: boolean;
  viewCount?: number;
  lastReplyAt?: string;
  lastReplyUserId?: string;
}

export interface Post {
  id: string;
  content: string;
  threadId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  isEdited?: boolean;
}

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
  createdById: string;
}

export interface ThreadTag {
  id: string;
  threadId: string;
  tagId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  relatedItemId?: string;
  relatedItemType?: string;
  createdAt: string;
}

// Create or ensure containers exist
async function setupCommunityContainers() {
  try {
    // Categories container
    const categoryContainerDef = {
      id: 'categories',
      partitionKey: { paths: ['/id'] }
    };
    
    // Threads container
    const threadContainerDef = {
      id: 'threads',
      partitionKey: { paths: ['/id'] }
    };
    
    // Posts container
    const postContainerDef = {
      id: 'posts',
      partitionKey: { paths: ['/id'] }
    };
    
    // Tags container
    const tagContainerDef = {
      id: 'tags',
      partitionKey: { paths: ['/id'] }
    };
    
    // Thread tags container
    const threadTagContainerDef = {
      id: 'threadTags',
      partitionKey: { paths: ['/id'] }
    };
    
    // Notifications container
    const notificationContainerDef = {
      id: 'notifications',
      partitionKey: { paths: ['/id'] }
    };

    // Create containers if they don't exist
    await database.containers.createIfNotExists(categoryContainerDef);
    await database.containers.createIfNotExists(threadContainerDef);
    await database.containers.createIfNotExists(postContainerDef);
    await database.containers.createIfNotExists(tagContainerDef);
    await database.containers.createIfNotExists(threadTagContainerDef);
    await database.containers.createIfNotExists(notificationContainerDef);
    
    console.log('Community containers created or confirmed existing');
    return true;
  } catch (error) {
    console.error('Error setting up community containers:', error);
    return false;
  }
}

// Get container references
const categoryContainer = database.container('categories');
const threadContainer = database.container('threads');
const postContainer = database.container('posts');
const tagContainer = database.container('tags');
const threadTagContainer = database.container('threadTags');
const notificationContainer = database.container('notifications');

export class CommunityService {
  // Initialize containers
  async initialize() {
    return setupCommunityContainers();
  }

  // Category Methods
  async getAllCategories(): Promise<Category[]> {
    const querySpec = {
      query: 'SELECT * FROM c ORDER BY c.name ASC'
    };
    
    const { resources } = await categoryContainer.items.query(querySpec).fetchAll();
    return resources;
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.slug = @slug',
      parameters: [{ name: '@slug', value: slug }]
    };
    
    const { resources } = await categoryContainer.items.query(querySpec).fetchAll();
    return resources.length > 0 ? resources[0] : null;
  }
  
  async createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const now = new Date().toISOString();
    const newCategory = {
      ...category,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    
    const { resource } = await categoryContainer.items.create(newCategory);
    return resource as Category;
  }

  // Thread Methods
  async getThreads(options: { 
    categoryId?: string;
    limit?: number; 
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  } = {}): Promise<Thread[]> {
    const { 
      categoryId,
      limit = 50, 
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search = ''
    } = options;
    
    let query = 'SELECT * FROM c';
    const parameters: { name: string; value: any }[] = [];
    
    if (categoryId) {
      query += ' WHERE c.categoryId = @categoryId';
      parameters.push({ name: '@categoryId', value: categoryId });
      
      if (search) {
        query += ' AND CONTAINS(LOWER(c.title), LOWER(@search))';
        parameters.push({ name: '@search', value: search.toLowerCase() });
      }
    } else if (search) {
      query += ' WHERE CONTAINS(LOWER(c.title), LOWER(@search))';
      parameters.push({ name: '@search', value: search.toLowerCase() });
    }
    
    query += ` ORDER BY c.${sortBy} ${sortOrder.toUpperCase()}`;
    
    const querySpec = {
      query,
      parameters
    };
    
    const { resources } = await threadContainer.items.query(querySpec).fetchAll();
    
    // Apply client-side pagination (offset/limit)
    return resources.slice(offset, offset + limit);
  }
  
  async getThreadById(id: string): Promise<Thread | null> {
    try {
      const { resource } = await threadContainer.item(id, id).read();
      return resource || null;
    } catch (error) {
      console.error('Error fetching thread by ID:', error);
      return null;
    }
  }
  
  async createThread(thread: Omit<Thread, 'id' | 'createdAt' | 'updatedAt'>): Promise<Thread> {
    const now = new Date().toISOString();
    const newThread = {
      ...thread,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      viewCount: 0
    };
    
    const { resource } = await threadContainer.items.create(newThread);
    return resource as Thread;
  }
  
  async incrementThreadViewCount(id: string): Promise<Thread | null> {
    try {
      const { resource: thread } = await threadContainer.item(id, id).read();
      if (!thread) return null;
      
      const updatedThread = {
        ...thread,
        viewCount: (thread.viewCount || 0) + 1,
        updatedAt: new Date().toISOString()
      };
      
      const { resource } = await threadContainer.item(id, id).replace(updatedThread);
      return resource;
    } catch (error) {
      console.error('Error incrementing thread view count:', error);
      return null;
    }
  }

  // Post Methods
  async getPostsByThreadId(threadId: string): Promise<Post[]> {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.threadId = @threadId ORDER BY c.createdAt ASC',
      parameters: [{ name: '@threadId', value: threadId }]
    };
    
    const { resources } = await postContainer.items.query(querySpec).fetchAll();
    return resources;
  }
  
  async createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    const now = new Date().toISOString();
    const newPost = {
      ...post,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      isEdited: false
    };
    
    const { resource } = await postContainer.items.create(newPost);
    
    // Update the last reply info on the thread
    await this.updateThreadLastReply(post.threadId, newPost.id, post.authorId);
    
    return resource as Post;
  }

  private async updateThreadLastReply(threadId: string, postId: string, userId: string): Promise<void> {
    try {
      const { resource: thread } = await threadContainer.item(threadId, threadId).read();
      if (!thread) return;
      
      const updatedThread = {
        ...thread,
        lastReplyAt: new Date().toISOString(),
        lastReplyUserId: userId,
        updatedAt: new Date().toISOString()
      };
      
      await threadContainer.item(threadId, threadId).replace(updatedThread);
    } catch (error) {
      console.error('Error updating thread last reply:', error);
    }
  }

  // Tag Methods
  async getTags(): Promise<Tag[]> {
    const querySpec = {
      query: 'SELECT * FROM c ORDER BY c.name ASC'
    };
    
    const { resources } = await tagContainer.items.query(querySpec).fetchAll();
    return resources;
  }
  
  async getTagByName(name: string): Promise<Tag | null> {
    const querySpec = {
      query: 'SELECT * FROM c WHERE LOWER(c.name) = LOWER(@name)',
      parameters: [{ name: '@name', value: name.toLowerCase() }]
    };
    
    const { resources } = await tagContainer.items.query(querySpec).fetchAll();
    return resources.length > 0 ? resources[0] : null;
  }
  
  async createTag(name: string, createdById: string): Promise<Tag> {
    const now = new Date().toISOString();
    const newTag = {
      id: crypto.randomUUID(),
      name,
      createdAt: now,
      createdById
    };
    
    const { resource } = await tagContainer.items.create(newTag);
    return resource as Tag;
  }

  // Thread Tags Methods
  async getTagsByThreadId(threadId: string): Promise<Tag[]> {
    // First get the thread-tag associations
    const threadTagQuery = {
      query: 'SELECT * FROM c WHERE c.threadId = @threadId',
      parameters: [{ name: '@threadId', value: threadId }]
    };
    
    const { resources: threadTags } = await threadTagContainer.items.query(threadTagQuery).fetchAll();
    
    // If no tags, return empty array
    if (threadTags.length === 0) return [];
    
    // Build a query to get all the tag details
    const tagIds = threadTags.map(tt => tt.tagId);
    
    // Get tags one by one (Cosmos DB doesn't support IN operator well)
    const tags: Tag[] = [];
    for (const tagId of tagIds) {
      try {
        const { resource } = await tagContainer.item(tagId, tagId).read();
        if (resource) tags.push(resource);
      } catch (error) {
        console.error(`Error fetching tag ${tagId}:`, error);
      }
    }
    
    return tags;
  }
  
  async setThreadTags(threadId: string, tagIds: string[]): Promise<boolean> {
    try {
      // First delete all existing thread-tag associations
      const threadTagQuery = {
        query: 'SELECT * FROM c WHERE c.threadId = @threadId',
        parameters: [{ name: '@threadId', value: threadId }]
      };
      
      const { resources: existingThreadTags } = await threadTagContainer.items.query(threadTagQuery).fetchAll();
      
      // Delete existing thread-tag associations
      for (const tt of existingThreadTags) {
        await threadTagContainer.item(tt.id, tt.id).delete();
      }
      
      // Create new thread-tag associations
      const now = new Date().toISOString();
      for (const tagId of tagIds) {
        const threadTag = {
          id: crypto.randomUUID(),
          threadId,
          tagId,
          createdAt: now
        };
        
        await threadTagContainer.items.create(threadTag);
      }
      
      return true;
    } catch (error) {
      console.error('Error setting thread tags:', error);
      return false;
    }
  }

  // Notification Methods
  async getNotificationsByUserId(userId: string, limit = 50): Promise<Notification[]> {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.userId = @userId ORDER BY c.createdAt DESC',
      parameters: [{ name: '@userId', value: userId }]
    };
    
    const { resources } = await notificationContainer.items.query(querySpec).fetchAll();
    return resources.slice(0, limit);
  }
  
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const now = new Date().toISOString();
    const newNotification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: now
    };
    
    const { resource } = await notificationContainer.items.create(newNotification);
    return resource as Notification;
  }
  
  async markNotificationAsRead(id: string): Promise<Notification | null> {
    try {
      const { resource: notification } = await notificationContainer.item(id, id).read();
      if (!notification) return null;
      
      const updatedNotification = {
        ...notification,
        isRead: true
      };
      
      const { resource } = await notificationContainer.item(id, id).replace(updatedNotification);
      return resource as Notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return null;
    }
  }
  
  async deleteNotification(id: string): Promise<boolean> {
    try {
      await notificationContainer.item(id, id).delete();
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }
  
  // User thread/post methods
  async getThreadsByUserId(userId: string): Promise<Thread[]> {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.authorId = @userId ORDER BY c.createdAt DESC',
      parameters: [{ name: '@userId', value: userId }]
    };
    
    const { resources } = await threadContainer.items.query(querySpec).fetchAll();
    return resources;
  }
  
  async getPostsByUserId(userId: string): Promise<Post[]> {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.authorId = @userId ORDER BY c.createdAt DESC',
      parameters: [{ name: '@userId', value: userId }]
    };
    
    const { resources } = await postContainer.items.query(querySpec).fetchAll();
    return resources;
  }
}

// Export a singleton instance
export const communityService = new CommunityService();
export default communityService;