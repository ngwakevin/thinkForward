import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import prisma from '../../../lib/prisma';
import { ensureUserFromOidc } from '../../../lib/db/users';
import { cosmosService } from '../../../lib/azure/cosmos-service';
import { withTelemetry } from '../../../lib/azure/with-telemetry';

// Original GET function with Prisma
async function getWithPrisma() {
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
    return { user, session, sess };
  } catch (error) {
    console.error('Error in getWithPrisma:', error);
    throw error;
  }
}

// New GET function using Cosmos DB with Prisma fallback
async function handler(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const sess: any = session.user;
    let user = null;
    let useCosmosDB = true;
    
    try {
      // Try to get user from Cosmos DB first
      // Highest priority: internal user id if present
      if (sess.id) {
        user = await cosmosService.getUserById(sess.id);
      }
      // Next: email
      if (!user && session.user.email) {
        user = await cosmosService.getUserByEmail(session.user.email.toLowerCase());
      }
      // Next: provider account id
      if (!user && sess.providerAccountId) {
        user = await cosmosService.getUserByProviderAccountId('azure-ad', sess.providerAccountId);
      }
    } catch (error) {
      console.error('Cosmos DB error, falling back to Prisma:', error);
      useCosmosDB = false;
    }
    
    // If Cosmos DB failed or user not found, fall back to Prisma
    if (!user || !useCosmosDB) {
      console.log('Falling back to Prisma for user data');
      const prismaResult = await getWithPrisma();
      if ('user' in prismaResult) {
        user = prismaResult.user;
      
        // If we found a user with Prisma but not with Cosmos, we should migrate this user
        if (user && useCosmosDB) {
          try {
            console.log('Migrating user to Cosmos DB:', user.id);
            // You would call a migration function here
            // await migrateUserToCosmos(user);
          } catch (migrateError) {
            console.error('Failed to migrate user to Cosmos DB:', migrateError);
          }
        }
      } else {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    }
    
    // Return user data
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Remove sensitive fields
    const { passwordHash, ...userData } = user;
    
    // Extract first and last name from the name field if no firstName/lastName provided
    const firstName = userData.firstName || userData.name?.split(' ')?.[0] || '';
    const lastName = userData.lastName || (userData.name?.split(' ')?.slice(1)?.join(' ') || '');
    
    return NextResponse.json({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      objectId: userData.objectId,
      upn: userData.upn,
      signInIdentity: userData.signInIdentity,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: userData.phoneNumber,
      emailVerifiedAt: userData.emailVerifiedAt,
      phoneVerifiedAt: userData.phoneVerifiedAt,
      isDisabled: userData.isDisabled || false,
      lastSignInAt: userData.lastSignInAt,
      badges: userData.badges,
      preferredLanguage: userData.preferredLanguage,
      customerTier: userData.customerTier,
      createdAt: userData.createdAt,
      profile: userData.profile,
    });
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    const message = (error as any)?.code === 'P1001' ? 'Database unreachable' : 'Internal error';
    return NextResponse.json({ 
      error: message, 
      detail: process.env.NODE_ENV === 'development' ? String(error) : undefined 
    }, { status: 500 });
  }
}

// Export the GET handler wrapped with telemetry
export const GET = withTelemetry(handler);

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