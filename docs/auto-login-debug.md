# Auto-Login Debug Guide

This document helps diagnose auto-login issues in the ThinkForward platform.

## Common Issues and Solutions

### 1. Auto-login not working after registration

**Check for:**
- JWT_SECRET environment variable is set in Azure
- NextAuth URL configuration is correct
- Auto-login API route is properly deployed
- Client-side storage is working correctly

### 2. Testing Auto-Login Flow

You can test the auto-login flow with the following steps:

1. Register for a bootcamp with valid credentials
2. Check browser console for auto-login debugging messages
3. Check Azure App Service logs for server-side errors

### 3. Manual Testing

Use the following URL pattern to test auto-login manually:

```
/auth/auto-login?email=test@example.com&password=yourpassword&callbackUrl=/profile
```

### 4. API Testing

Test the auto-login API directly:

```javascript
// Test JWT login endpoint
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
})
.then(response => response.json())
.then(data => console.log('JWT login response:', data))
.catch(error => console.error('Error:', error));

// Test auto-login endpoint
fetch('/api/auth/signin/auto-login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    callbackUrl: '/profile?tab=bootcamps'
  })
})
.then(response => response.json())
.then(data => console.log('Auto-login response:', data))
.catch(error => console.error('Error:', error));
```

### 5. Environment Variables

Ensure these variables are correctly set in Azure:
- NEXTAUTH_URL = https://thinkforward-dev.azurewebsites.net
- NEXTAUTH_SECRET (for NextAuth)
- JWT_SECRET (for JWT authentication)

### 6. Session Storage Debug

Use this code in browser console to check local storage:
```javascript
console.log({
  userEmail: localStorage.getItem('userEmail'),
  autoLoginAttempt: localStorage.getItem('autoLoginAttempt'),
  registrationId: localStorage.getItem('registrationId')
});
```

### 7. Test JWT Authentication

```javascript
// Get the stored JWT token
const token = localStorage.getItem('auth_token');

// Test a protected endpoint
fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => console.log('Protected API response:', data))
.catch(error => console.error('Error:', error));
```

## Recent Fixes

1. Added dedicated JWT authentication system
2. Fixed auto-login API route
3. Enhanced auto-login page with dual authentication support
4. Added proper JWT_SECRET environment variable in Azure