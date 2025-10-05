/** Simple feature flag utility.
 * Flags are sourced from process.env at runtime.
 * Extend with remote config (App Configuration) later.
 */
export const flags = {
  authMsal: (process.env.FEATURE_AUTH_MSAL || 'false').toLowerCase() === 'true'
};

export function isEnabled(name: keyof typeof flags): boolean {
  return !!flags[name];
}
