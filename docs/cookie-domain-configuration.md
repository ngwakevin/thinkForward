# Cookie Domain Configuration

This document explains how cookie domains are configured in the ThinkForward application.

## Overview

The COOKIE_DOMAIN environment variable is used to control the domain scope of cookies set by the application. This is important for:

1. **Cross-subdomain authentication**: Allowing cookies to be shared across subdomains
2. **Security**: Properly scoping cookies to prevent access from unauthorized domains
3. **Session persistence**: Ensuring authentication state is maintained across the application

## Implementation

The application has been configured to use the COOKIE_DOMAIN environment variable in the following places:

1. **NextAuth.js Configuration**: In `lib/auth.ts` for session cookies
2. **JWT Authentication**: In the auto-login routes for JWT tokens
3. **Logout Functionality**: In the logout route to properly clear cookies
4. **Login Handlers**: In the login route for setting refresh tokens

## Configuration

### Azure Web App

The COOKIE_DOMAIN has been set to `.azurewebsites.net` in your Azure Web App configuration. This allows cookies to be shared across all subdomains of azurewebsites.net.

If you deploy to a custom domain, you should update the COOKIE_DOMAIN to match your domain structure, for example:

- `.yourdomain.com` - for sharing cookies across all subdomains
- `yourdomain.com` - for limiting cookies to only the main domain

### Local Development

For local development, the COOKIE_DOMAIN is typically not set, which defaults to the current domain.

### GitHub Actions

The GitHub Actions workflow has been updated to set the COOKIE_DOMAIN during the build process.

## Management Tools

A helper script has been created to manage cookie-related settings:

```bash
scripts/configure-cookie-settings.sh
```

This script allows you to:

1. Configure COOKIE_DOMAIN for different environments
2. Set additional cookie settings like COOKIE_SECURE and COOKIE_SAME_SITE
3. Apply these settings to your Azure Web App

## Troubleshooting Cookie Issues

If you encounter issues with cookies not being set or recognized:

1. **Check domain configuration**: Ensure COOKIE_DOMAIN is set correctly for your environment
2. **Verify HTTPS**: Cookie settings like 'secure' require HTTPS connections
3. **Browser inspection**: Use browser developer tools to inspect cookies and their attributes
4. **Clear existing cookies**: Sometimes clearing existing cookies can resolve conflicts

## Cookie Security Best Practices

1. Always use HTTPS in production (secure flag)
2. Use HttpOnly for sensitive cookies that don't need client-side access
3. Configure appropriate SameSite policies (lax is generally a good default)
4. Set specific domain scopes rather than allowing cookies for all subdomains when possible