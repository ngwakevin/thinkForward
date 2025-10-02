import nodemailer, { Transporter } from 'nodemailer';

let cached: Transporter | null = null;

export function getMailTransport() {
  if (cached) return cached;
  if (process.env.EMAIL_DISABLE_SEND === 'true') {
    // Use a stub transport that just logs.
    cached = {
      sendMail: async (opts: any) => {
        console.log('[email:disabled]', opts.subject, 'to', opts.to);
        return { messageId: 'disabled' } as any;
      }
    } as Transporter;
    return cached;
  }
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const forceSecure = process.env.SMTP_SECURE === 'true';
  const requireTLS = process.env.SMTP_REQUIRE_TLS === 'true';
  if (!host || !user || !pass) {
    console.warn('[email] SMTP not fully configured, falling back to disabled mode');
    cached = {
      sendMail: async (opts: any) => {
        console.log('[email:fallback-not-configured]', opts.subject, 'to', opts.to);
        return { messageId: 'not-configured' } as any;
      }
    } as Transporter;
    return cached;
  }
  cached = nodemailer.createTransport({
    host,
    port,
    secure: forceSecure || port === 465,
    auth: { user, pass },
    tls: requireTLS ? { rejectUnauthorized: true } : undefined
  });
  cached.verify().then(() => {
    console.log('[email] SMTP transport verified', host + ':' + port);
  }).catch(err => {
    console.warn('[email] SMTP transport verification failed', err?.message);
  });
  return cached;
}
