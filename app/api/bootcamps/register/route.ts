import { NextRequest, NextResponse } from 'next/server';
import { createBootcampRegistration } from '../../../../lib/db/bootcamps';

const REQUIRED_FIELDS = ['name', 'email'];

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const missing = REQUIRED_FIELDS.filter(field => !payload?.[field]);

    if (missing.length > 0) {
      return NextResponse.json(
        { ok: false, error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    const normalizedEmail = String(payload.email).trim().toLowerCase();
    if (!validateEmail(normalizedEmail)) {
      return NextResponse.json(
        { ok: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const registration = await createBootcampRegistration({
      name: String(payload.name),
      email: normalizedEmail,
      phone: payload.phone ? String(payload.phone) : undefined,
      provider: payload.provider ? String(payload.provider) : undefined,
      inIt: payload.inIt ? String(payload.inIt) : undefined,
      currentRole: payload.current_role ? String(payload.current_role) : undefined,
      experience: payload.experience ? String(payload.experience) : undefined,
      goal: payload.goal ? String(payload.goal) : undefined,
      exposure: payload.exposure ? String(payload.exposure) : undefined,
      notes: payload.notes ? String(payload.notes) : undefined,
      track: payload.track ? String(payload.track) : undefined
    });

    return NextResponse.json(
      {
        ok: true,
        registration: {
          id: registration.id,
          paymentReference: registration.paymentReference,
          createdAt: registration.createdAt,
          status: registration.status,
          track: registration.track,
          name: registration.name,
          email: registration.email
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to process bootcamp registration request', error);
    return NextResponse.json(
      { ok: false, error: 'Unable to submit registration at this time. Please try again later.' },
      { status: 500 }
    );
  }
}
