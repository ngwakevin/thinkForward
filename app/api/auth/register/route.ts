import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import cosmosService from '@/lib/azure/cosmos-service';
import { createBootcampRegistration } from '@/lib/db/bootcamps';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const email = String(payload.email || '').trim().toLowerCase();
    const name = String(payload.name || '').trim();
    const password = String(payload.password || '').trim();
    const callbackUrl = String(payload.callbackUrl || '/profile?tab=bootcamps');

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Email and password are required.' }, { status: 400 });
    }

    // Check if user exists
    let user = await cosmosService.getUserByEmail(email);
    let createdUser = false;

    if (!user) {
      // Create new user with hashed password
      const passwordHash = await bcrypt.hash(password, 12);
      user = await cosmosService.createUser({
        provider: 'credentials',
        providerAccountId: crypto.randomUUID(),
        email,
        username: name || email.split('@')[0],
        name,
        passwordHash,
        signInIdentity: email,
        lastSignInAt: new Date(),
        isMentor: false,
      });
      createdUser = true;
    }

    // Optional: create bootcamp registration if bootcampId is provided
    let registration = null as any;
    if (payload.bootcampId) {
      registration = await createBootcampRegistration({
        userId: user.id,
        email: user.email ?? email,
        name: user.name || name || 'Bootcamp User',
        bootcampId: String(payload.bootcampId).toLowerCase().replace(/\s+/g, '-'),
        bootcampName: payload.bootcampName || undefined,
        track: payload.track || undefined,
        type: 'bootcamp-registration',
        paymentStatus: 'Pending',
        completionStatus: 'Not Started',
      });
    }

    // Return safe response for auto-login
    return NextResponse.json({
      ok: true,
      createdUser,
      user: { id: user.id, email: user.email, name: user.name, username: user.username },
      registration,
      auth: {
        // We no longer put password in URL — client-side form will use signIn()
        callbackUrl,
      },
    }, { status: 201 });

  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ ok: false, error: 'Unable to register user at this time.' }, { status: 500 });
  }
}
