import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { authCosmosService } from '../../../../lib/azure/auth-cosmos-service';
import { verifyCosmosDBConnection } from '../../../../lib/azure/cosmos-config';
import { generateToken } from '@/lib/jwt';
import { createBootcampRegistration } from '../../../../lib/db/bootcamps';
import { events } from '../../../../data/events';

// Simple in-memory rate limiting (per IP) - NOT for production scale
const rateMap = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000; // 1 minute
const MAX_ATTEMPTS = 10; // per minute

// Simple email regex ( RFC 5322 simplified )
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password policy: min 8 chars, at least 1 letter & 1 digit
const passwordPolicy = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}|\[\]:";'<>?,.\/]{8,}$/;

function findBootcamp(slug?: string | null) {
  if (!slug) return null;
  return events.find((event) => event.type === 'bootcamp' && event.slug === slug);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let { email, password, name, bootcampId } = body as { email?: string; password?: string; name?: string; bootcampId?: string };
    if (email) email = email.trim().toLowerCase();
    if (bootcampId) bootcampId = bootcampId.trim().toLowerCase();

    const fieldErrors: Record<string, string> = {};

    if (!email || !emailRegex.test(email)) {
      fieldErrors.email = 'Valid email is required';
    }
    if (!password) {
      fieldErrors.password = 'Password is required';
    } else if (!passwordPolicy.test(password)) {
      fieldErrors.password = 'Password must be at least 8 characters and include a letter and a number';
    }
    if (!name) {
      fieldErrors.name = 'Name is required';
    }
    if (!bootcampId) {
      fieldErrors.bootcampId = 'Bootcamp selection is required';
    }

    if (Object.keys(fieldErrors).length) {
      return NextResponse.json({ ok: false, fieldErrors }, { status: 400 });
    }

    // Rate limiting by IP (very simple; replace with durable store for production)
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
    const rateNow = Date.now();
    const entry = rateMap.get(ip);
    if (!entry || rateNow - entry.ts > WINDOW_MS) {
      rateMap.set(ip, { count: 1, ts: rateNow });
    } else {
      entry.count += 1;
      if (entry.count > MAX_ATTEMPTS) {
        return NextResponse.json({ ok: false, error: 'Too many attempts, slow down.' }, { status: 429 });
      }
    }

    // Quick connectivity probe (lightweight)
    try {
      const connected = await verifyCosmosDBConnection();
      if (!connected) {
        throw new Error('Cosmos DB connection failed');
      }
    } catch (dbErr) {
      return NextResponse.json({ ok: false, error: 'Service temporarily unavailable (DB unreachable).' }, { status: 503 });
    }

    // Ensure unique by email (normalized lowercase)
    const existing = await authCosmosService.getUserByEmail(email!);
    if (existing) {
      return NextResponse.json({ ok: false, fieldErrors: { email: 'Email already in use' } }, { status: 409 });
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password!, saltRounds);

    const bootcamp = findBootcamp(bootcampId);
    const normalizedBootcampId = bootcamp?.slug ?? bootcampId;

    // Create user with empty profile
    const user = await authCosmosService.createUser({
      provider: 'credentials',
      providerAccountId: crypto.randomUUID(),
      email,
      name: name?.trim() || null,
      passwordHash,
      signInIdentity: email,
      lastSignInAt: new Date(),
      isMentor: false,
      profile: {
        displayName: name?.trim() || null,
      }
    });

    if (normalizedBootcampId) {
      try {
        await createBootcampRegistration({
          userId: user.id,
          email: user.email ?? email!,
          name: user.name ?? name!,
          bootcampId: normalizedBootcampId,
          bootcampName: bootcamp?.title ?? normalizedBootcampId,
          bootcampStartDate: bootcamp?.startDate ?? new Date().toISOString(),
          metadata: { source: 'auth-register-endpoint' },
          track: normalizedBootcampId,
          type: 'bootcamp-registration',
          paymentStatus: 'Pending',
          completionStatus: 'Not Started',
        });
      } catch (registrationError) {
        console.error('[register] failed to create bootcamp registration', registrationError);
      }
    }

    const token = generateToken({ userId: user.id, email: user.email }, process.env.JWT_EXPIRES_IN || '1h');

    return NextResponse.json(
      {
        ok: true,
        message: 'Registration successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name ?? name,
          bootcampId: normalizedBootcampId,
        },
        token,
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.error('[register][error]', e);
    // Prisma known request errors
    const message = e?.message || 'Registration failed';
    const status = /unique/i.test(message) ? 409 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
