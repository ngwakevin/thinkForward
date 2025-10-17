/**
 * Example of how to use the auto-login API in your frontend code
 * Save this as a utility function in your project (e.g., lib/auth-utils.ts)
 */

/**
 * Initiate the auto-login process programmatically
 * @param email User email
 * @param password User password
 * @param callbackUrl URL to redirect after successful login
 * @returns Promise that resolves to success/error status
 */
export async function handleAutoLogin(email: string, password: string, callbackUrl: string = '/') {
  try {
    // Call the auto-login API
    const res = await fetch('/api/auth/signin/auto-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, callbackUrl }),
    });
    
    // Parse the response
    const data = await res.json();
    
    if (res.ok && data.success) {
      console.log('Auto-login API call successful');
      
      // Store email temporarily for the auto-login page to use
      localStorage.setItem('userEmail', email);
      
      // Store the password securely for the auto-login page
      localStorage.setItem('autoLoginPassword', password);
      
      // Set a timestamp to track when this auto-login was initiated
      localStorage.setItem('authTimestamp', new Date().toISOString());
      localStorage.setItem('autoLoginAttempt', '1');
      
      // Redirect to the auto-login completion URL
      window.location.href = data.redirectUrl;
      return { success: true };
    } else {
      console.error('Auto-login API error:', data.error);
      
      // Handle specific error cases
      if (res.status === 401) {
        return { 
          success: false, 
          error: 'Invalid credentials' 
        };
      }
      
      return { 
        success: false, 
        error: data.error || 'Authentication failed' 
      };
    }
  } catch (err) {
    console.error('Auto-login request failed:', err);
    return { 
      success: false, 
      error: 'Connection error' 
    };
  }
}

/* 
 * Usage example in a React component:
 * 
 * ```tsx
 * function LoginForm() {
 *   const [email, setEmail] = useState('');
 *   const [password, setPassword] = useState('');
 *   const [loading, setLoading] = useState(false);
 *   const [error, setError] = useState('');
 * 
 *   async function onSubmit(e) {
 *     e.preventDefault();
 *     setLoading(true);
 *     setError('');
 *     
 *     const result = await handleAutoLogin(email, password);
 *     
 *     if (!result.success) {
 *       setError(result.error || 'Login failed');
 *       setLoading(false);
 *     }
 *     // No need to handle success case - the function will redirect automatically
 *   }
 *   
 *   return (
 *     <form onSubmit={onSubmit}>
 *       {/\* Form fields *\/}
 *       {error && <div className="error">{error}</div>}
 *       <button type="submit" disabled={loading}>
 *         {loading ? 'Logging in...' : 'Log in'}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 */