import { NextRequest, NextResponse } from 'next/server';
import { createBootcampRegistration } from '../../../../lib/db/bootcamps';
import { sendEmail } from '../../../../lib/email';

const REQUIRED_FIELDS = ['name', 'email'];
const NOTIFICATION_EMAIL = 'bootcamp@cloudegree.com';

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    
    // If createAccount flag is true, forward to the register-bootcamp endpoint
    if (payload.createAccount === true || payload.createAccount === 'true') {
      // Forward the request to the register-bootcamp endpoint
      const registerBotcampResponse = await fetch(new URL('/api/register-bootcamp', req.url), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      return registerBotcampResponse;
    }
    
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

    // Add userId from session if available
    const session = req.cookies.get('next-auth.session-token')?.value;
    let userId;
    
    if (session) {
      try {
        // This is a simple attempt to extract userId, not full JWT validation
        const sessionData = JSON.parse(Buffer.from(session.split('.')[1], 'base64').toString());
        userId = sessionData?.user?.id || sessionData?.id || undefined;
        console.log("Found userId in session:", userId);
      } catch (e) {
        console.log("Could not extract userId from session:", e);
      }
    }
    
    // Extract bootcamp ID if provided
    const bootcampId = payload.bootcampId ? String(payload.bootcampId) : 
                       payload.track ? String(payload.track).toLowerCase().replace(/\s+/g, '-') :
                       'default-bootcamp';
    
    console.log(`Creating bootcamp registration for ${normalizedEmail}, bootcamp: ${bootcampId}, userId: ${userId || 'none'}`);
    
    const registration = await createBootcampRegistration({
      name: String(payload.name),
      email: normalizedEmail,
      userId: userId, // Add userId if found from session
      bootcampId: bootcampId, // Ensure bootcampId is set
      bootcampName: payload.bootcampName ? String(payload.bootcampName) : undefined,
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

    console.log('Created bootcamp registration:', {
      id: registration.id,
      email: registration.email,
      userId: registration.userId,
      bootcampId: registration.bootcampId,
      type: registration.type,
      paymentReference: registration.paymentReference
    });

    // Send notification email to bootcamp admin
    try {
      await sendEmail({
        to: NOTIFICATION_EMAIL,
        subject: `New Bootcamp Registration: ${String(payload.name)}`,
        text: `
New bootcamp registration details:
Name: ${String(payload.name)}
Email: ${normalizedEmail}
Phone: ${payload.phone ? String(payload.phone) : 'Not provided'}
Track: ${payload.track ? String(payload.track) : 'Not specified'}
Payment Reference: ${registration.paymentReference}

Additional Information:
Provider: ${payload.provider ? String(payload.provider) : 'Not provided'}
In IT: ${payload.inIt ? String(payload.inIt) : 'Not provided'}
Current Role: ${payload.current_role ? String(payload.current_role) : 'Not provided'}
Experience: ${payload.experience ? String(payload.experience) : 'Not provided'}
Goal: ${payload.goal ? String(payload.goal) : 'Not provided'}
Exposure: ${payload.exposure ? String(payload.exposure) : 'Not provided'}
Notes: ${payload.notes ? String(payload.notes) : 'None'}
`,
        html: `
<h2>New Bootcamp Registration</h2>
<p><strong>Name:</strong> ${String(payload.name)}</p>
<p><strong>Email:</strong> ${normalizedEmail}</p>
<p><strong>Phone:</strong> ${payload.phone ? String(payload.phone) : 'Not provided'}</p>
<p><strong>Track:</strong> ${payload.track ? String(payload.track) : 'Not specified'}</p>
<p><strong>Payment Reference:</strong> ${registration.paymentReference}</p>

<h3>Additional Information</h3>
<p><strong>Provider:</strong> ${payload.provider ? String(payload.provider) : 'Not provided'}</p>
<p><strong>In IT:</strong> ${payload.inIt ? String(payload.inIt) : 'Not provided'}</p>
<p><strong>Current Role:</strong> ${payload.current_role ? String(payload.current_role) : 'Not provided'}</p>
<p><strong>Experience:</strong> ${payload.experience ? String(payload.experience) : 'Not provided'}</p>
<p><strong>Goal:</strong> ${payload.goal ? String(payload.goal) : 'Not provided'}</p>
<p><strong>Exposure:</strong> ${payload.exposure ? String(payload.exposure) : 'Not provided'}</p>
<p><strong>Notes:</strong> ${payload.notes ? String(payload.notes) : 'None'}</p>
`
      });
      console.log(`Notification email sent to ${NOTIFICATION_EMAIL}`);
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Continue with the registration response even if email fails
    }

    return NextResponse.json(
      {
        ok: true,
        registration: {
          id: registration.id,
          paymentReference: registration.paymentReference,
          createdAt: registration.createdAt,
          paymentStatus: registration.paymentStatus,
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
