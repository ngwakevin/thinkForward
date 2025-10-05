// MSAL Node basic singleton (scaffold). Real implementation will configure
// authority & client credentials once Entra External ID is provisioned.
import { flags } from '../flags';

let _placeholder: any = null;

export function getMsalClient() {
  if (!flags.authMsal) {
    throw new Error('MSAL feature flag disabled. Set FEATURE_AUTH_MSAL=true to enable.');
  }
  if (_placeholder) return _placeholder;
  // Defer actual import until needed to avoid adding heavy deps prematurely.
  _placeholder = { initialized: true };
  return _placeholder;
}
