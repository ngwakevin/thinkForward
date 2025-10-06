import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import prisma from '../../../lib/prisma';
import { ensureUserFromOidc } from '../../../lib/db/users';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const sess: any = session.user;
    let user = null;
    // Highest priority: internal user id if present
    if (sess.id) {
      user = await prisma.user.findUnique({ where: { id: sess.id }, include: { profile: true } });
    }
    // Next: provider account id
    if (!user && sess.providerAccountId) {
      user = await prisma.user.findUnique({ where: { providerAccountId: sess.providerAccountId }, include: { profile: true } });
    }
    // Fallback: email
    if (!user && session.user.email) {
      user = await prisma.user.findFirst({ where: { email: session.user.email.toLowerCase() }, include: { profile: true } });
    }
    // Fallback: Azure objectId via session.oid
    if (!user && (sess as any)?.oid) {
      user = await prisma.user.findFirst({ where: ({ objectId: (sess as any).oid } as any), include: { profile: true } });
    }
    if (!user && sess.provider === 'azure-ad' && session.user.email) {
      // Attempt auto-provision then re-fetch by providerAccountId (azure ad only)
      await ensureUserFromOidc({
        sub: sess.oid,
        email: session.user.email,
        name: session.user.name,
        provider: 'azure-ad',
        providerAccountId: sess.providerAccountId,
      });
      if (sess.providerAccountId) {
        user = await prisma.user.findUnique({
          where: { providerAccountId: sess.providerAccountId },
          include: { profile: true },
        });
      }
    }
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });
    const u: any = user;
    return Response.json({
      id: u.id,
      email: u.email,
      name: u.name,
      objectId: u.objectId,
      upn: u.upn,
      signInIdentity: u.signInIdentity,
      firstName: u.firstName,
      lastName: u.lastName,
      phoneNumber: u.phoneNumber,
      emailVerifiedAt: u.emailVerifiedAt,
      phoneVerifiedAt: u.phoneVerifiedAt,
      isDisabled: u.isDisabled,
      lastSignInAt: u.lastSignInAt,
      loyaltyNumber: u.loyaltyNumber,
      preferredLanguage: u.preferredLanguage,
      customerTier: u.customerTier,
      createdAt: u.createdAt,
      profile: u.profile,
    });
  } catch (e: any) {
    const message = e?.code === 'P1001' ? 'Database unreachable' : 'Internal error';
    return Response.json({ error: message, detail: process.env.NODE_ENV === 'development' ? String(e) : undefined }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json().catch(() => ({}));
    if (process.env.NODE_ENV !== 'production') {
      console.log('[profile][PATCH] incoming body', body);
    }
    const {
      displayName,
      bio,
      avatarUrl,
      phoneNumber,
      firstName,
      lastName,
      loyaltyNumber,
      preferredLanguage,
      customerTier,
      // New profile extension fields
      headline,
      location,
      timezone,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
  accentColor,
  coverImageUrl,
  galleryImages,
      learningGoals,
      skills,
      currentTitle,
      currentCompany,
      education,
      experience,
      showProfilePublic,
    } = body as any;

    const sess: any = session.user;
    let user = null;
    if (sess.id) {
      user = await prisma.user.findUnique({ where: { id: sess.id } });
    }
    if (!user && sess.providerAccountId) {
      user = await prisma.user.findUnique({ where: { providerAccountId: sess.providerAccountId } });
    }
    if (!user && session.user.email) {
      user = await prisma.user.findFirst({ where: { email: session.user.email.toLowerCase() } });
    }
    // Only attempt auto-provision if azure-ad and we have both providerAccountId + oid
    if (!user && sess.provider === 'azure-ad' && sess.providerAccountId && sess.oid && session.user.email) {
      try {
        await ensureUserFromOidc({
          sub: sess.oid,
          email: session.user.email,
          name: session.user.name,
          provider: 'azure-ad',
          providerAccountId: sess.providerAccountId,
        });
        user = await prisma.user.findUnique({ where: { providerAccountId: sess.providerAccountId } });
      } catch (e: any) {
        // Swallow unique violations (user already exists with email) and attempt fallback by email again
        if (session.user.email) {
          user = await prisma.user.findFirst({ where: { email: session.user.email.toLowerCase() } });
        }
      }
    }
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    // Update editable user scalar fields (exclude identity & status flags here)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        phoneNumber: phoneNumber ?? undefined,
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
        loyaltyNumber: loyaltyNumber ?? undefined,
        preferredLanguage: preferredLanguage ?? undefined,
        customerTier: customerTier ?? undefined,
      } as any,
    });

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        displayName: displayName ?? undefined,
        bio: bio ?? undefined,
        avatarUrl: avatarUrl ?? undefined,
        headline: headline ?? undefined,
        location: location ?? undefined,
        timezone: timezone ?? undefined,
        githubUrl: githubUrl ?? undefined,
        linkedinUrl: linkedinUrl ?? undefined,
        portfolioUrl: portfolioUrl ?? undefined,
  accentColor: accentColor ?? undefined,
  coverImageUrl: coverImageUrl ?? undefined,
  galleryImages: galleryImages ?? undefined,
        learningGoals: learningGoals ?? undefined,
        skills: skills ?? undefined,
        currentTitle: currentTitle ?? undefined,
        currentCompany: currentCompany ?? undefined,
        education: education ?? undefined,
        experience: experience ?? undefined,
        showProfilePublic: typeof showProfilePublic === 'boolean' ? showProfilePublic : undefined,
      } as any,
      create: {
        userId: user.id,
        displayName: displayName ?? undefined,
        bio: bio ?? undefined,
        avatarUrl: avatarUrl ?? undefined,
        headline: headline ?? undefined,
        location: location ?? undefined,
        timezone: timezone ?? undefined,
        githubUrl: githubUrl ?? undefined,
        linkedinUrl: linkedinUrl ?? undefined,
        portfolioUrl: portfolioUrl ?? undefined,
  accentColor: accentColor ?? undefined,
  coverImageUrl: coverImageUrl ?? undefined,
  galleryImages: galleryImages ?? undefined,
        learningGoals: learningGoals ?? undefined,
        skills: skills ?? undefined,
        currentTitle: currentTitle ?? undefined,
        currentCompany: currentCompany ?? undefined,
        education: education ?? undefined,
        experience: experience ?? undefined,
        showProfilePublic: typeof showProfilePublic === 'boolean' ? showProfilePublic : false,
      } as any,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('[profile][PATCH] persisted profile', { userId: user.id, updatedProfile });
    }

    return Response.json({ ok: true, profile: updatedProfile });
  } catch (e: any) {
    const message = e?.code === 'P1001' ? 'Database unreachable' : 'Internal error';
    return Response.json({ error: message, detail: process.env.NODE_ENV === 'development' ? String(e) : undefined }, { status: 500 });
  }
}