import { v4 as uuidv4 } from 'uuid';
import { getBootcampRegistrationsContainer, isCosmosAvailable } from '../cosmos';

export type PaymentStatus = 'Pending' | 'Confirmed' | 'Rejected';
export type CompletionStatus = 'Not Started' | 'In Progress' | 'Completed';

export type BootcampRegistrationInput = {
  userId?: string;
  type?: string; // Add type field to allow setting it explicitly
  bootcampId?: string;
  bootcampName?: string;
  bootcampStartDate?: string;
  paymentStatus?: PaymentStatus;
  paymentConfirmedAt?: string | null;
  completionStatus?: CompletionStatus;
  certificateUrl?: string | null;
  metadata?: Record<string, unknown>;
  // User information
  name?: string;
  email?: string;
  phone?: string;
  provider?: string;
  inIt?: string;
  currentRole?: string;
  experience?: string;
  goal?: string;
  exposure?: string;
  notes?: string;
  track?: string;
};

export type BootcampRegistration = BootcampRegistrationInput & {
  id: string;
  type: string; // Add type field to interface
  paymentStatus: PaymentStatus;
  paymentConfirmedAt: string | null;
  completionStatus: CompletionStatus;
  certificateUrl: string | null;
  paymentReference: string;
  createdAt: string;
  updatedAt: string;
};

const memoryRegistrationStore: Map<string, BootcampRegistration> = new Map();

function normalizeForReference(value: string | undefined, fallback: string) {
  return (value ?? fallback).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

function generatePaymentReference(bootcampId?: string, userId?: string): string {
  const prefix = 'BC';
  const bootcampPart = normalizeForReference(bootcampId, 'GEN').slice(0, 8) || 'GEN';
  const userPart = normalizeForReference(userId, uuidv4()).slice(-6) || 'USER';
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 12);
  return `${prefix}-${bootcampPart}-${userPart}-${timestamp}`;
}

async function getWritableContainer() {
  const container = await getBootcampRegistrationsContainer();
  return container;
}

export async function createBootcampRegistration(input: BootcampRegistrationInput): Promise<BootcampRegistration> {
  // Enhanced validation for required fields
  if (!input.email) {
    throw new Error('Email is required for bootcamp registration');
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.email)) {
    throw new Error('Valid email format is required for bootcamp registration');
  }
  
  const normalizedEmail = input.email.toLowerCase().trim();
  const now = new Date().toISOString();
  const id = uuidv4();
  
  // Ensure critical fields have values with clear fallbacks
  const fallbackUserId = input.userId ?? `anon-${id}`;
  const fallbackBootcampId = input.bootcampId ?? (typeof input.metadata?.bootcampSlug === 'string' ? 
    input.metadata.bootcampSlug : (input.track ? `${input.track}`.toLowerCase().replace(/\s+/g, '-') : 'cloud-foundation'));
  
  // Format bootcamp name from bootcampId if not provided
  const fallbackBootcampName = input.bootcampName ?? (typeof input.metadata?.bootcampName === 'string' ? 
    input.metadata.bootcampName : fallbackBootcampId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
    
  const fallbackStartDate = input.bootcampStartDate ?? new Date().toISOString();
  
  // Log all validated fields for better debugging
  console.log(`Creating bootcamp registration with validated fields:
    - email: ${input.email}
    - bootcampId: ${fallbackBootcampId}
    - userId: ${fallbackUserId}
    - name: ${input.name || 'Not provided'}
  `);
  
  // Create a fully-validated registration object with all required fields
  const registration: BootcampRegistration = {
    id,
    // Use input.type if provided, otherwise default to 'bootcamp-registration'
    type: input.type || 'bootcamp-registration', // Required type field for querying
    userId: fallbackUserId,
    bootcampId: fallbackBootcampId,
    bootcampName: fallbackBootcampName,
    bootcampStartDate: fallbackStartDate,
    paymentStatus: input.paymentStatus ?? 'Pending',
    paymentConfirmedAt: input.paymentConfirmedAt ?? null,
    completionStatus: input.completionStatus ?? 'Not Started',
    certificateUrl: input.certificateUrl ?? null,
    metadata: input.metadata,
    paymentReference: generatePaymentReference(fallbackBootcampId, fallbackUserId),
    createdAt: now,
    updatedAt: now,
    // Include user information fields
    name: input.name,
    email: normalizedEmail,
    phone: input.phone,
    provider: input.provider,
    inIt: input.inIt,
    currentRole: input.currentRole,
    experience: input.experience,
    goal: input.goal,
    exposure: input.exposure,
    notes: input.notes,
    track: input.track,
  };

  try {
    if (!isCosmosAvailable()) {
      memoryRegistrationStore.set(id, registration);
      return registration;
    }

    const container = await getWritableContainer();
    if (!('items' in container)) {
      memoryRegistrationStore.set(id, registration);
      return registration;
    }

    const { resource } = await container.items.create(registration);
    return (resource as unknown as BootcampRegistration) ?? registration;
  } catch (error) {
    console.error('Failed to persist bootcamp registration, falling back to memory store:', error);
    memoryRegistrationStore.set(id, registration);
    return registration;
  }
}



export async function listBootcampRegistrations(limit = 100): Promise<BootcampRegistration[]> {
  if (!isCosmosAvailable()) {
    return Array.from(memoryRegistrationStore.values()).slice(0, limit);
  }

  try {
    const container = await getWritableContainer();
    if (!('items' in container)) {
      return Array.from(memoryRegistrationStore.values()).slice(0, limit);
    }

    const query = {
      query: 'SELECT * FROM c ORDER BY c.createdAt DESC',
      parameters: []
    };
    const { resources } = await container.items.query(query).fetchAll();
    return (resources as BootcampRegistration[])?.slice(0, limit) ?? [];
  } catch (error) {
    console.error('Failed to fetch bootcamp registrations, returning memory results:', error);
    return Array.from(memoryRegistrationStore.values()).slice(0, limit);
  }
}

export async function getBootcampRegistrationsByUserId(userId: string): Promise<BootcampRegistration[]> {
  if (!isCosmosAvailable()) {
    return Array.from(memoryRegistrationStore.values()).filter((reg) => reg.userId === userId);
  }

  try {
    const container = await getWritableContainer();
    if (!('items' in container)) {
      return Array.from(memoryRegistrationStore.values()).filter((reg) => reg.userId === userId);
    }

    const query = {
      query: "SELECT * FROM c WHERE c.type = 'bootcamp-registration' AND c.userId = @userId ORDER BY c.createdAt DESC",
      parameters: [{ name: '@userId', value: userId }]
    };

    const { resources } = await container.items.query(query).fetchAll();
    
    // Ensure all returned records have the required fields with defaults if needed
    const registrations = (resources as BootcampRegistration[])?.map(reg => ({
      ...reg,
      type: reg.type || 'bootcamp-registration',
      bootcampId: reg.bootcampId || reg.track || 'cloud-foundation',
      bootcampName: reg.bootcampName || (reg.bootcampId ? `${reg.bootcampId}`.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Cloud Foundation'),
      userId: reg.userId || userId,
      paymentStatus: reg.paymentStatus || 'Pending',
      completionStatus: reg.completionStatus || 'Not Started',
    })) ?? [];
    
    return registrations;
  } catch (error) {
    console.error('Failed to fetch bootcamp registrations by user, returning memory results:', error);
    return Array.from(memoryRegistrationStore.values()).filter((reg) => reg.userId === userId);
  }
}

export async function getBootcampRegistrationsByEmail(email: string): Promise<BootcampRegistration[]> {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) return [];

  if (!isCosmosAvailable()) {
    return Array.from(memoryRegistrationStore.values()).filter(
      (reg) => (reg.email || '').toLowerCase() === normalizedEmail
    );
  }

  try {
    const container = await getWritableContainer();
    if (!('items' in container)) {
      return Array.from(memoryRegistrationStore.values()).filter(
        (reg) => (reg.email || '').toLowerCase() === normalizedEmail
      );
    }

    const query = {
      query: "SELECT * FROM c WHERE c.type = 'bootcamp-registration' AND IS_DEFINED(c.email) AND LOWER(c.email) = @email ORDER BY c.createdAt DESC",
      parameters: [{ name: '@email', value: normalizedEmail }],
    };

    const { resources } = await container.items.query(query).fetchAll();
    const registrations =
      (resources as BootcampRegistration[])?.map((reg) => ({
        ...reg,
        type: reg.type || 'bootcamp-registration',
        email: reg.email?.toLowerCase() || normalizedEmail,
        bootcampId: reg.bootcampId || reg.track || 'cloud-foundation',
        bootcampName: reg.bootcampName
          ? reg.bootcampName
          : reg.bootcampId
          ? `${reg.bootcampId}`.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
          : 'Cloud Foundation',
        paymentStatus: reg.paymentStatus || 'Pending',
        completionStatus: reg.completionStatus || 'Not Started',
      })) ?? [];

    return registrations;
  } catch (error) {
    console.error('Failed to fetch bootcamp registrations by email, returning memory results:', error);
    return Array.from(memoryRegistrationStore.values()).filter(
      (reg) => (reg.email || '').toLowerCase() === normalizedEmail
    );
  }
}

export async function updateBootcampRegistrationStatus(
  id: string,
  status: PaymentStatus,
  paymentConfirmedAt?: string | null
): Promise<BootcampRegistration | null> {
  try {
    if (!isCosmosAvailable()) {
      const existing = memoryRegistrationStore.get(id);
      if (!existing) return null;
      const next: BootcampRegistration = {
        ...existing,
        paymentStatus: status,
        paymentConfirmedAt: status === 'Confirmed' ? (paymentConfirmedAt ?? new Date().toISOString()) : null,
        updatedAt: new Date().toISOString()
      };
      memoryRegistrationStore.set(id, next);
      return next;
    }

    const container = await getWritableContainer();
    if (!('item' in container)) {
      const existing = memoryRegistrationStore.get(id);
      if (!existing) return null;
      const fallback: BootcampRegistration = {
        ...existing,
        paymentStatus: status,
        paymentConfirmedAt: status === 'Confirmed' ? (paymentConfirmedAt ?? new Date().toISOString()) : null,
        updatedAt: new Date().toISOString()
      };
      memoryRegistrationStore.set(id, fallback);
      return fallback;
    }

    const { resource } = await container.item(id, id).read<BootcampRegistration>();
    if (!resource) return null;

    const next: BootcampRegistration = {
      ...resource,
      paymentStatus: status,
      paymentConfirmedAt: status === 'Confirmed' ? (paymentConfirmedAt ?? new Date().toISOString()) : null,
      updatedAt: new Date().toISOString()
    };

    const { resource: updated } = await container.items.upsert(next);
    // Cast through unknown first to avoid type issues
    return (updated as unknown as BootcampRegistration) ?? next;
  } catch (error) {
    console.error('Failed to update bootcamp registration status', error);
    return null;
  }
}
