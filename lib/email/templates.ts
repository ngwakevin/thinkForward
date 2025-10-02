import { escapeHtml } from './escape';

export interface BootcampRegistrationData {
  [k: string]: string | undefined;
  name?: string;
  email?: string;
  phone?: string;
  provider?: string;
  in_it?: string;
  current_role?: string;
  experience?: string;
  goal?: string;
  exposure?: string;
  notes?: string;
  track?: string;
  plan?: string;
  intent?: string;
  cert?: string;
  ip?: string;
  ua?: string;
  at?: string;
}

export function bootcampRegistrationTemplate(data: BootcampRegistrationData) {
  const entries = Object.entries(data).filter(([_, v]) => v && v.toString().trim() !== '');
  const rowsHtml = entries.map(([k,v]) => `<tr><td style="padding:4px 8px;font-weight:600;text-transform:capitalize">${escapeHtml(k.replace(/_/g,' '))}</td><td style="padding:4px 8px">${escapeHtml(String(v))}</td></tr>`).join('');
  const text = entries.map(([k,v]) => `${k}: ${v}`).join('\n');
  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:#111">
  <h2 style="margin:0 0 12px;font-size:18px">New Bootcamp Registration Interest</h2>
  <p style="margin:0 0 16px">A visitor submitted the bootcamp registration form.</p>
  <table style="border-collapse:collapse;border:1px solid #e2e2e2" width="100%" cellpadding="0" cellspacing="0">
    <tbody>${rowsHtml}</tbody>
  </table>
  <p style="margin-top:20px;font-size:12px;color:#555">Sent automatically from Cloudegree site.</p>
</body></html>`;
  const subject = `Bootcamp Registration: ${data.name || 'Unknown'}`;
  return { subject, html, text };
}

export interface ContactMessageData {
  name: string;
  email: string;
  subject: string;
  message: string;
  organization?: string;
  phone?: string;
  ip?: string;
  ua?: string;
  at?: string;
}

export function contactMessageTemplate(data: ContactMessageData) {
  const entries = ([
    ['name', data.name],
    ['email', data.email],
    ['subject', data.subject],
    ['message', data.message],
    ['organization', data.organization],
    ['phone', data.phone],
    ['ip', data.ip],
    ['ua', data.ua],
    ['at', data.at]
  ] as [string, string | undefined][])
    .filter(([,v]) => v && v.toString().trim() !== '');
  const rowsHtml = entries.map(([k,v]) => `<tr><td style="padding:4px 8px;font-weight:600;text-transform:capitalize">${escapeHtml(k)}</td><td style="padding:4px 8px;white-space:pre-wrap">${escapeHtml(String(v))}</td></tr>`).join('');
  const text = entries.map(([k,v]) => `${k}: ${v}`).join('\n');
  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:#111">
  <h2 style="margin:0 0 12px;font-size:18px">New Contact Form Submission</h2>
  <table style="border-collapse:collapse;border:1px solid #e2e2e2" width="100%" cellpadding="0" cellspacing="0">
    <tbody>${rowsHtml}</tbody>
  </table>
  <p style="margin-top:20px;font-size:12px;color:#555">Sent automatically from Cloudegree contact form.</p>
</body></html>`;
  const subject = `[Contact] ${data.subject || 'No subject'}`;
  return { subject, html, text };
}
