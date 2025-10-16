# Simplified Bootcamp Registration Flow

This document outlines the new simplified bootcamp registration system implemented in ThinkForward.

## Overview

The simplified registration system provides a more direct approach to bootcamp registrations with:
- Direct Cosmos DB connection
- Clear mapping between human-readable track names and system bootcampIds
- Streamlined registration process
- Optional automatic account creation
- Improved error handling

## Key Components

1. **API Endpoint**:
   - `/api/register` - Handles registration requests

2. **Client Components**:
   - `SimpleRegistrationForm.tsx` - React component for registration
   - `/bootcamps/register/simple/page.tsx` - Page using the simplified form

3. **Data Structure**:
   - Consistent bootcamp track mapping
   - Schema-compliant Cosmos DB documents
   - User and registration linking

## How It Works

1. **Track Mapping**:
   The system uses a predefined mapping to convert human-readable track names to bootcampIds:

   ```typescript
   const BOOTCAMPS = {
     "Cloud Foundation": "cloud-foundation",
     "Cloud Engineering": "cloud-engineering",
     "Cloud Solution Architect": "cloud-solution-architect",
     "Cloud Networking": "cloud-networking",
     "DevOps Foundations": "devops-foundations",
   };
   ```

2. **Registration Process**:
   - Validate required fields
   - Check for existing registrations
   - Create registration record
   - Create user account if needed
   - Auto-login if account created

3. **Schema Consistency**:
   The system ensures all required fields are present:
   - `id`: Unique UUID
   - `type`: Always "bootcamp-registration"
   - `bootcampId`: Kebab-case identifier
   - `track`: Human-readable track name
   - `userId`: Linked to user account
   - `paymentStatus`: Default "Pending"

## Testing

Use the provided test script to verify functionality:

```bash
node scripts/test-registration.js
```

## Implementation Notes

1. **Auto-Login Flow**:
   - After registration, client redirects to `/auth/auto-login`
   - Uses localStorage for temporary credentials storage
   - Preserves session across page loads

2. **Error Handling**:
   - Detailed validation errors
   - Comprehensive error logging
   - Client-friendly error messages

## Migration Path

Existing registrations can be accessed through the new system without modification. The system is backward compatible with the previous registration format while enforcing schema consistency for new registrations.