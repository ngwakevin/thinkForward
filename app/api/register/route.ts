import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth"; // Adjusted to match project structure
import { isCosmosAvailable, getBootcampRegistrationsContainer, getUsersContainer } from "../../../lib/cosmos";
import { verifyCosmosDBConnection } from "../../../lib/azure/cosmos-config";

// Bootcamp ID map
const BOOTCAMPS = {
  "Cloud Foundation": "cloud-foundation",
  "Cloud Engineering": "cloud-engineering",
  "Cloud Solution Architect": "cloud-solution-architect",
  "Cloud Networking": "cloud-networking",
  "DevOps Foundations": "devops-foundations",
} as const;

type BootcampTrack = keyof typeof BOOTCAMPS;

interface RegistrationPayload {
  name: string;
  email: string;
  track: BootcampTrack;
  createAccount?: boolean;
}

export async function POST(req: Request) {
  try {
    const body: RegistrationPayload = await req.json();

    console.log("Received bootcamp registration request with payload:", body);

    const { name, email, track, createAccount } = body;

    // Validate required fields
    if (!email || !track || !name) {
      console.error("Registration validation failed. Missing fields:", { name, email, track });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Map track to bootcampId
    const bootcampId = BOOTCAMPS[track];
    if (!bootcampId) {
      console.error("Invalid bootcamp track provided:", track);
      return NextResponse.json({ error: "Invalid bootcamp track" }, { status: 400 });
    }

    // Verify Cosmos DB connection
    try {
      const connected = await verifyCosmosDBConnection();
      if (!connected && !isCosmosAvailable()) {
        throw new Error('Cosmos DB unavailable');
      }
      console.log("Connected to Cosmos DB database: thinkforward");
    } catch (connectionError) {
      console.error('Failed Cosmos DB connectivity check', connectionError);
      return NextResponse.json({ ok: false, error: 'Database service temporarily unavailable.' }, { status: 503 });
    }

    const registrationsContainer = await getBootcampRegistrationsContainer();
    
    // Check if already registered
    const { resources: existing } = await registrationsContainer.items
      .query({
        query: "SELECT * FROM c WHERE c.email = @email AND c.bootcampId = @bootcampId",
        parameters: [
          { name: "@email", value: email },
          { name: "@bootcampId", value: bootcampId },
        ],
      })
      .fetchAll();

    if (existing.length > 0) {
      console.log(`User ${email} already registered for ${bootcampId}`);
      return NextResponse.json({
        message: `Already registered for ${track}`,
      });
    }

    // Create registration record
    const registration = {
      id: uuidv4(),
      type: "bootcamp-registration",
      name,
      email: email.toLowerCase(),
      track,
      bootcampId,
      createdAt: new Date().toISOString(),
      // Additional fields for schema consistency
      paymentStatus: "Pending",
      completionStatus: "Not Started",
      paymentReference: `BC-${bootcampId.substring(0, 3).toUpperCase()}-${uuidv4().substring(0, 8)}-${Date.now().toString().substring(0, 8)}`,
      updatedAt: new Date().toISOString()
    };

    // Create the registration
    await registrationsContainer.items.create(registration);
    console.log("✅ Bootcamp registration created:", registration);

    // Auto-create user if needed
    let userId: string | undefined;
    
    const usersContainer = await getUsersContainer();
    const { resources: existingUsers } = await usersContainer.items
      .query({
        query: "SELECT * FROM c WHERE c.email = @email",
        parameters: [{ name: "@email", value: email.toLowerCase() }],
      })
      .fetchAll();

    if (existingUsers.length === 0 && createAccount) {
      const newUser = {
        id: uuidv4(),
        email: email.toLowerCase(),
        name,
        createdAt: new Date().toISOString(),
        // Additional fields required for user schema
        provider: "credentials",
        signInIdentity: email.toLowerCase(),
        username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, ''),
        isMentor: false,
        profile: {
          displayName: name
        }
      };
      await usersContainer.items.create(newUser);
      console.log("👤 Created new user:", newUser);
      userId = newUser.id;

      // Update registration with userId
      await registrationsContainer.items.upsert({
        ...registration,
        userId
      });
      console.log(`Updated registration with userId: ${userId}`);
    } else if (existingUsers.length > 0) {
      userId = existingUsers[0].id;
      console.log(`Existing user found: ${userId}`);
      
      // Update registration with userId
      await registrationsContainer.items.upsert({
        ...registration,
        userId
      });
      console.log(`Updated registration with userId: ${userId}`);
    }

    // Optional: Auto-login if account created
    if (createAccount) {
      try {
        const session = await getServerSession(authOptions);
        if (!session) {
          // Note: For credential-based login, you'd redirect to NextAuth signin endpoint
          console.log("Auto-login not triggered server-side. Let frontend call /api/auth/signin.");
        } else {
          console.log(`Auto-login successful for ${email}`);
        }
      } catch (err) {
        console.warn("Auto-login skipped:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Registered successfully for ${track}`,
      registration: {
        id: registration.id,
        paymentReference: registration.paymentReference,
        createdAt: registration.createdAt,
        status: registration.paymentStatus,
        track,
        name,
        email
      },
      bootcampId,
      userId,
      user: userId ? {
        id: userId,
        email: email.toLowerCase(),
        name
      } : undefined,
      // Auth info for client-side auto-login
      auth: createAccount ? {
        email: email.toLowerCase(),
        timestamp: new Date().toISOString(),
        callbackUrl: '/profile?tab=bootcamps',
      } : undefined
    });
  } catch (error: any) {
    console.error("Error in /api/register:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}