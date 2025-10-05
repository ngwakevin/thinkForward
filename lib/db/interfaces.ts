/**
 * Repository interfaces for data access
 * These interfaces define the standard operations for different entity types
 */

/**
 * Base repository interface with common CRUD operations
 * @template T - The entity type
 */
export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}

/**
 * User entity interface
 */
export interface IUser {
  id: string;
  email: string;
  name?: string;
  provider: string;
  providerAccountId: string;
  passwordHash?: string;
  isMentor: boolean;
  badges?: string[];
  objectId?: string;
  upn?: string;
  signInIdentity?: string;
  phoneNumber?: string;
  pendingPhoneNumber?: string;
  phoneVerifiedAt?: Date;
  emailVerifiedAt?: Date;
  isDisabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastSignInAt?: Date;
  failedSignInCount: number;
  lastFailedSignInAt?: Date;
  loyaltyNumber?: string;
  preferredLanguage?: string;
  customerTier?: string;
  firstName?: string;
  lastName?: string;
}

/**
 * User repository interface with additional user-specific operations
 */
export interface IUserRepository extends IRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findByProviderAccount(provider: string, providerAccountId: string): Promise<IUser | null>;
  incrementFailedSignIn(id: string): Promise<void>;
  updateLastSignIn(id: string): Promise<void>;
}

/**
 * User progress entity interface
 */
export interface IProgress {
  id: string;
  userId: string;
  courseId: string;
  moduleId: string;
  lessonId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  score?: number;
  completedAt?: Date;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Progress repository interface with progress-specific operations
 */
export interface IProgressRepository extends IRepository<IProgress> {
  findByUserId(userId: string): Promise<IProgress[]>;
  findByCourse(userId: string, courseId: string): Promise<IProgress[]>;
  markAsCompleted(id: string, score?: number): Promise<IProgress>;
}

/**
 * Security audit log entity interface
 */
export interface ISecurityAuditLog {
  id: string;
  timestamp: Date;
  userId?: string;
  eventType: string;
  eventDetails: string;
  ipAddress?: string;
  userAgent?: string;
  severity: string;
  metadata?: Record<string, any>;
}

/**
 * Security audit repository interface
 */
export interface ISecurityAuditRepository extends IRepository<ISecurityAuditLog> {
  findByUserId(userId: string): Promise<ISecurityAuditLog[]>;
  findByEventType(eventType: string): Promise<ISecurityAuditLog[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<ISecurityAuditLog[]>;
}