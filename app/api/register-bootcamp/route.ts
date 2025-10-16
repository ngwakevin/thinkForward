import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { events } from '../../../data/events';
import { verifyCosmosDBConnection } from '../../../lib/azure/cosmos-config';
import cosmosService from '../../../lib/azure/cosmos-service';
import { createBootcampRegistration, getBootcampRegistrationsByUserId } from '../../../lib/db/bootcamps';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPolicy = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}|\[\]:";'<>?,.\/]{8,}$/;

function sanitizeString(value: unknown) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

function buildUsername(name: string | null, email: string) {
  if (name) {
    const candidate = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      .slice(0, 32);
    if (candidate.length >= 3) {
      return candidate;
    }
  }
  const [local] = email.split('@');
  return local.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 32) || `user-${crypto.randomUUID().slice(0, 8)}`;
}

function buildMetadata(payload: Record<string, unknown>): Record<string, unknown> {
  const metadata: Record<string, unknown> = {
    track: sanitizeString(payload.track),
    phone: sanitizeString(payload.phone),
    provider: sanitizeString(payload.provider),
    currentlyInIt: sanitizeString(payload.inIt),
    currentRole: sanitizeString(payload.current_role),
    experience: sanitizeString(payload.experience),
    goal: sanitizeString(payload.goal),
    exposure: sanitizeString(payload.exposure),
    notes: sanitizeString(payload.notes),
    consentUpdates: payload.consentUpdates === true || payload.consentUpdates === 'true',
    source: 'bootcamp-register-api'
  };

  Object.keys(metadata).forEach((key) => {
    if (metadata[key] === undefined || metadata[key] === null || metadata[key] === '') {
      delete metadata[key];
    }
  });

  return metadata;
}

function findBootcamp(slug?: string | null) {
  if (!slug) return null;
  return events.find((event) => event.type === 'bootcamp' && event.slug === slug);
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json().catch(() => ({}));
    const name = sanitizeString(payload.name) ?? null;
    const email = sanitizeString(payload.email)?.toLowerCase();
    const password = sanitizeString(payload.password);
    const confirmPassword = sanitizeString(payload.confirmPassword ?? payload.passwordConfirm);
    const bootcampSlug = sanitizeString(payload.bootcampSlug ?? payload.track);

    const fieldErrors: Record<string, string> = {};

    if (!name) {
      fieldErrors.name = 'Full name is required';
    }
    if (!email || !emailRegex.test(email)) {
      fieldErrors.email = 'Valid email is required';
    }
    if (!password) {
      fieldErrors.password = 'Password is required';
    } else if (!passwordPolicy.test(password)) {
      fieldErrors.password = 'Password must be at least 8 characters and include a letter and a number';
    }
    if (!confirmPassword || confirmPassword !== password) {
      fieldErrors.confirmPassword = 'Passwords do not match';
    }
    if (!bootcampSlug) {
      fieldErrors.bootcampSlug = 'Bootcamp selection is required';
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json({ ok: false, fieldErrors }, { status: 400 });
    }

    try {
      const connected = await verifyCosmosDBConnection();
      if (!connected) {
        throw new Error('Cosmos DB unavailable');
      }
    } catch (connectionError) {
      console.error('Failed Cosmos DB connectivity check', connectionError);
      return NextResponse.json({ ok: false, error: 'Service temporarily unavailable.' }, { status: 503 });
    }

    const bootcamp = findBootcamp(bootcampSlug);
    const bootcampName = bootcamp?.title ?? sanitizeString(payload.bootcampName) ?? 'Bootcamp';
    const bootcampStartDate = bootcamp?.startDate ?? new Date().toISOString();

    const existingUser = email ? await cosmosService.getUserByEmail(email) : null;

    let user = existingUser;
    let createdUser = false;

    if (user) {
      if (user.provider !== 'credentials') {
        return NextResponse.json(
          { ok: false, fieldErrors: { email: 'Email already registered via a different sign-in method. Please sign in instead.' } },
          { status: 409 }
        );
      }
      if (!user.passwordHash) {
        return NextResponse.json(
          { ok: false, fieldErrors: { email: 'Account exists but cannot be used with password authentication. Contact support.' } },
          { status: 409 }
        );
      }
      const passwordMatches = await bcrypt.compare(password!, user.passwordHash);
      if (!passwordMatches) {
        return NextResponse.json(
          { ok: false, fieldErrors: { password: 'Incorrect password for existing account.' } },
          { status: 401 }
        );
      }

      if (!user.name && name) {
        await cosmosService.updateUser(user.id, { name, profile: { ...(user.profile ?? {}), displayName: name } });
        user = await cosmosService.getUserById(user.id);
      }
    } else {
      const passwordHash = await bcrypt.hash(password!, 12);
      user = await cosmosService.createUser({
        provider: 'credentials',
        providerAccountId: crypto.randomUUID(),
        username: buildUsername(name, email!),
        email,
        name,
        passwordHash,
        signInIdentity: email,
        lastSignInAt: new Date(),
        isMentor: false,
        profile: {
          displayName: name,
          bio: null,
          avatarUrl: null,
          headline: null,
          location: null,
          timezone: null,
          githubUrl: null,
          linkedinUrl: null,
          portfolioUrl: null,
          accentColor: null,
          coverImageUrl: null,
          galleryImages: null,
          learningGoals: null,
          skills: null,
          currentTitle: null,
          currentCompany: null,
          education: null,
          experience: null,
          showProfilePublic: false
        }
      });
      createdUser = true;
    }

    if (!user) {
      throw new Error('Unable to resolve user record.');
    }

    const existingRegistrations = await getBootcampRegistrationsByUserId(user.id);
    const existingRegistration = existingRegistrations.find((reg) => reg.bootcampId === bootcampSlug);

    if (existingRegistration) {
      return NextResponse.json(
        {
          ok: true,
          alreadyRegistered: true,
          user: { id: user.id, email: user.email, name: user.name },
          registration: existingRegistration
        },
        { status: 200 }
      );
    }

    const metadata = buildMetadata(payload);

    // Make sure we include email and name in the registration to pass validation
    const registration = await createBootcampRegistration({
      userId: user.id,
      email: user.email || email!, // Use user's email or the provided email (non-null assertion as we validate earlier)
      name: user.name || name || 'Bootcamp User', // Provide fallback for name
      bootcampId: bootcampSlug!,
      bootcampName,
      bootcampStartDate,
      metadata,
      track: bootcampSlug // Include track to match the bootcampId
    });

    return NextResponse.json(
      {
        ok: true,
        createdUser,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username ?? buildUsername(user.name ?? null, user.email ?? email!)
        },
        registration,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('register-bootcamp error', error);
    
    // Provide more specific error messages based on the type of error
    if (error instanceof Error && error.message.includes('Email is required')) {
      return NextResponse.json({ 
        ok: false, 
        fieldErrors: { email: 'Email address is required for registration' },
        error: 'Email validation failed' 
      }, { status: 400 });
    }
    
    // Log basic diagnostic information without accessing possibly undefined variables
    console.log('Registration attempt failed. Please check the error log above for details.');
    
    return NextResponse.json({ ok: false, error: 'Unable to process registration right now.' }, { status: 500 });
  }
}
