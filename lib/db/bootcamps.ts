import { v4 as uuidv4 } from 'uuid';
import { getBootcampRegistrationsContainer, isCosmosAvailable } from '../cosmos';

export type PaymentStatus = 'Pending' | 'Confirmed' | 'Rejected';
export type CompletionStatus = 'Not Started' | 'In Progress' | 'Completed';

export type BootcampRegistrationInput = {
  userId?: string;
  bootcampId?: string;
  bootcampName?: string;
  bootcampStartDate?: string;
  paymentStatus?: PaymentStatus;
  paymentConfirmedAt?: string | null;
  completionStatus?: CompletionStatus;
  certificateUrl?: string | null;
  metadata?: Record<string, unknown>;
};

export type BootcampRegistration = BootcampRegistrationInput & {
  id: string;
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
  const now = new Date().toISOString();
  const id = uuidv4();
  const fallbackUserId = input.userId ?? `anon-${id}`;
  const fallbackBootcampId = input.bootcampId ?? (typeof input.metadata?.bootcampSlug === 'string' ? input.metadata.bootcampSlug : 'bootcamp');
  const fallbackBootcampName = input.bootcampName ?? (typeof input.metadata?.bootcampName === 'string' ? input.metadata.bootcampName : 'Bootcamp Registration');
  const fallbackStartDate = input.bootcampStartDate ?? new Date().toISOString();
  const registration: BootcampRegistration = {
    id,
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
    return (resource as BootcampRegistration) ?? registration;
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
      query: 'SELECT * FROM c WHERE c.userId = @userId ORDER BY c.createdAt DESC',
      parameters: [{ name: '@userId', value: userId }]
    };

    const { resources } = await container.items.query(query).fetchAll();
    return (resources as BootcampRegistration[]) ?? [];
  } catch (error) {
    console.error('Failed to fetch bootcamp registrations by user, returning memory results:', error);
    return Array.from(memoryRegistrationStore.values()).filter((reg) => reg.userId === userId);
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
    return (updated as BootcampRegistration) ?? next;
  } catch (error) {
    console.error('Failed to update bootcamp registration status', error);
    return null;
  }
}
