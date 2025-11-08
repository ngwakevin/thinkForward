# Bootcamp Enrollment Service - Usage Guide

This guide explains how to use the bootcamp enrollment system.

## Overview

The bootcamp system allows users to:
- Enroll in bootcamps
- Track progress
- Complete bootcamps and earn certificates
- View enrolled bootcamps on their profile

## Architecture

```
User Profile → learningData.bootcamps[] → Cosmos DB
                      ↓
            Bootcamp Service Functions
                      ↓
              REST API Endpoints
```

## Service Functions

### Located in: `lib/azure/bootcamp-service.ts`

### 1. Enroll in Bootcamp
```typescript
import { enrollInBootcamp } from '@/lib/azure/bootcamp-service';

const bootcamp = {
  id: 'cloud-devops-2025',
  title: 'Cloud DevOps Bootcamp',
  description: 'Intensive 12-week program covering Docker, Kubernetes, CI/CD, and cloud infrastructure',
  status: 'enrolled',
  startDate: 'January 15, 2025',
  endDate: 'April 15, 2025',
  progress: 0,
  cohort: 'Winter 2025',
  instructors: ['John Doe', 'Jane Smith'],
  schedule: 'Mon/Wed 6-9pm PST',
  location: 'online',
  topics: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Monitoring'],
};

const success = await enrollInBootcamp(userId, bootcamp);
```

### 2. Update Progress
```typescript
import { updateBootcampProgress } from '@/lib/azure/bootcamp-service';

// Update to 45% and auto-update status to 'in-progress'
await updateBootcampProgress(userId, 'cloud-devops-2025', 45, true);
```

### 3. Complete Bootcamp
```typescript
import { completeBootcamp } from '@/lib/azure/bootcamp-service';

// Complete and issue certificate
await completeBootcamp(userId, 'cloud-devops-2025', true);
```

### 4. Get User Bootcamps
```typescript
import { getUserBootcamps, getBootcampsByStatus } from '@/lib/azure/bootcamp-service';

// Get all bootcamps
const allBootcamps = await getUserBootcamps(userId);

// Get only in-progress bootcamps
const activeBootcamps = await getBootcampsByStatus(userId, 'in-progress');
```

## REST API Endpoints

### Located in: `app/api/user/bootcamps/route.ts`

### 1. Get User's Bootcamps
```bash
GET /api/user/bootcamps
GET /api/user/bootcamps?status=in-progress
```

**Response:**
```json
{
  "bootcamps": [
    {
      "id": "cloud-devops-2025",
      "title": "Cloud DevOps Bootcamp",
      "status": "in-progress",
      "progress": 45,
      "startDate": "January 15, 2025",
      "endDate": "April 15, 2025",
      "cohort": "Winter 2025",
      "instructors": ["John Doe", "Jane Smith"],
      "topics": ["Docker", "Kubernetes", "CI/CD"],
      "schedule": "Mon/Wed 6-9pm PST",
      "location": "online"
    }
  ]
}
```

### 2. Enroll in Bootcamp
```bash
POST /api/user/bootcamps
Content-Type: application/json

{
  "id": "cloud-devops-2025",
  "title": "Cloud DevOps Bootcamp",
  "description": "Intensive 12-week program",
  "status": "enrolled",
  "startDate": "January 15, 2025",
  "endDate": "April 15, 2025",
  "progress": 0,
  "cohort": "Winter 2025",
  "instructors": ["John Doe", "Jane Smith"],
  "schedule": "Mon/Wed 6-9pm PST",
  "location": "online",
  "topics": ["Docker", "Kubernetes", "CI/CD"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully enrolled in bootcamp",
  "bootcamp": { ... }
}
```

### 3. Update Bootcamp Progress
```bash
PATCH /api/user/bootcamps
Content-Type: application/json

{
  "bootcampId": "cloud-devops-2025",
  "action": "update-progress",
  "progress": 75,
  "updateStatus": true
}
```

### 4. Complete Bootcamp
```bash
PATCH /api/user/bootcamps
Content-Type: application/json

{
  "bootcampId": "cloud-devops-2025",
  "action": "complete",
  "issueCertificate": true
}
```

### 5. Update Bootcamp Status
```bash
PATCH /api/user/bootcamps
Content-Type: application/json

{
  "bootcampId": "cloud-devops-2025",
  "action": "update-status",
  "status": "in-progress"
}
```

### 6. Update Bootcamp Details
```bash
PATCH /api/user/bootcamps
Content-Type: application/json

{
  "bootcampId": "cloud-devops-2025",
  "action": "update-details",
  "schedule": "Tue/Thu 7-10pm PST",
  "cohort": "Spring 2025"
}
```

### 7. Unenroll from Bootcamp
```bash
DELETE /api/user/bootcamps?bootcampId=cloud-devops-2025
```

## Frontend Usage Examples

### React Component
```typescript
'use client';
import { useState } from 'react';

function BootcampEnrollButton({ bootcamp }) {
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/bootcamps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: bootcamp.id,
          title: bootcamp.title,
          description: bootcamp.description,
          status: 'enrolled',
          startDate: bootcamp.startDate,
          endDate: bootcamp.endDate,
          progress: 0,
          cohort: bootcamp.cohort,
          instructors: bootcamp.instructors,
          schedule: bootcamp.schedule,
          location: bootcamp.location,
          topics: bootcamp.topics,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Successfully enrolled!');
        window.location.href = '/profile?tab=bootcamps';
      }
    } catch (error) {
      console.error('Enrollment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleEnroll} disabled={loading}>
      {loading ? 'Enrolling...' : 'Enroll Now'}
    </button>
  );
}
```

### Update Progress
```typescript
async function updateProgress(bootcampId: string, newProgress: number) {
  const response = await fetch('/api/user/bootcamps', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bootcampId,
      action: 'update-progress',
      progress: newProgress,
      updateStatus: true,
    }),
  });

  const data = await response.json();
  return data.success;
}
```

## Achievements

The system automatically awards achievements:
- **Bootcamp Graduate** (🎓) - Complete first bootcamp
- **Bootcamp Champion** (🏆) - Complete 3 bootcamps

## Data Structure in Cosmos DB

User document structure:
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "learningData": {
    "stats": {
      "coursesCompleted": 5,
      "certificationsCount": 2
    },
    "bootcamps": [
      {
        "id": "cloud-devops-2025",
        "title": "Cloud DevOps Bootcamp",
        "status": "in-progress",
        "progress": 45,
        "startDate": "January 15, 2025",
        "endDate": "April 15, 2025",
        "cohort": "Winter 2025",
        "instructors": ["John Doe", "Jane Smith"],
        "topics": ["Docker", "Kubernetes"],
        "enrolledAt": "2025-01-10T00:00:00Z"
      }
    ]
  }
}
```

## Profile Display

Bootcamps automatically appear on the user's profile under the "Bootcamps" tab with:
- Status badge (enrolled, in-progress, upcoming, completed)
- Progress bar
- Cohort and format information
- Start/end dates
- Schedule
- Topics covered
- Instructors
- Context-aware action buttons

## Next Steps

To enable bootcamp enrollment in your app:

1. **Add enrollment button to bootcamp catalog pages**
2. **Import and use the service functions**
3. **Call the API endpoints from your components**
4. **Test the full flow**: enroll → progress → complete → view certificate
