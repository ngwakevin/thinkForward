import { NextRequest, NextResponse } from 'next/server';
import { container } from '../../../../lib/azure/cosmos-config';

// Mark as dynamic since it modifies data
export const dynamic = 'force-dynamic';

// Restrict access to this endpoint
const ADMIN_SECRET = process.env.ADMIN_API_SECRET || 'thinkforward-admin-2025';

export async function GET(req: NextRequest) {
  // Basic authentication check
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.replace('Bearer ', '') !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Query for registrations with missing fields
    const { resources } = await container.items
      .query("SELECT * FROM c WHERE (NOT IS_DEFINED(c.type) OR NOT IS_DEFINED(c.bootcampId)) AND IS_DEFINED(c.email)")
      .fetchAll();

    console.log(`Found ${resources.length} records that need fixing`);
    
    const fixed = [];
    
    // Process each record that needs fixing
    for (const item of resources) {
      console.log(`🧹 Fixing registration: ${item.id} for ${item.email}`);
      
      // Set default values for missing fields
      const fixed_item = {
        ...item,
        type: item.type || "bootcamp-registration",
        bootcampId: item.bootcampId || "cloud-foundation",
        bootcampName: item.bootcampName || "Cloud Foundation",
        bootcampStartDate: item.bootcampStartDate || new Date().toISOString(),
        userId: item.userId || `user-${item.id}`,
        paymentStatus: item.paymentStatus || "Pending",
        completionStatus: item.completionStatus || "Not Started",
        paymentReference: item.paymentReference || `BC-CLOUDFDN-${item.id.substring(0, 6)}-${Date.now()}`,
        certificateUrl: item.certificateUrl || null,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fixedAt: new Date().toISOString(),
      };
      
      try {
        // Replace the item in the container
        const { resource: updatedItem } = await container.item(item.id, item.id).replace(fixed_item);
        fixed.push({
          id: updatedItem.id,
          email: updatedItem.email,
          type: updatedItem.type,
          bootcampId: updatedItem.bootcampId
        });
      } catch (error) {
        console.error(`Error updating item ${item.id}:`, error);
      }
    }
    
    return NextResponse.json({ 
      fixed: fixed.length,
      items: fixed
    });
  } catch (error) {
    console.error('Error in fix-registrations endpoint:', error);
    return NextResponse.json({ error: 'Failed to fix registrations' }, { status: 500 });
  }
}