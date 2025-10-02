import { getMailTransport } from './transport';
import type { BootcampRegistrationData } from './templates';
import { bootcampRegistrationTemplate } from './templates';
import { contactMessageTemplate, ContactMessageData } from './templates';

export interface SendResult { ok: boolean; id?: string; disabled?: boolean; error?: string; }

export async function sendBootcampRegistration(data: BootcampRegistrationData): Promise<SendResult> {
  const transport = getMailTransport();
  try {
    const { subject, html, text } = bootcampRegistrationTemplate(data);
    const to = process.env.BOOTCAMP_REGISTRATION_EMAIL || 'bootcamp@cloudegree.com';
    const from = process.env.EMAIL_FROM || 'Cloudegree <no-reply@cloudegree.com>';
    const r: any = await transport.sendMail({ from, to, replyTo: data.email, subject, html, text });
    return { ok: true, id: r?.messageId, disabled: r?.messageId === 'disabled' || r?.messageId === 'not-configured' };
  } catch (e) {
    console.error('[email.send.bootcamp]', e);
    return { ok: false, error: 'SEND_FAILED' };
  }
}

export async function sendContactMessage(data: ContactMessageData) {
  const disabled = process.env.EMAIL_DISABLE_SEND === 'true';
  const inbox = process.env.CONTACT_INBOX || process.env.SUPPORT_EMAIL || 'support@cloudegree.com';
  const { subject, html, text } = contactMessageTemplate(data);
  const transport = getMailTransport();
  if (!transport || disabled) {
    console.log('[email:contact] send disabled or no transport', { disabled, to: inbox, subject });
    return { accepted: [], rejected: [], disabled: true };
  }
  return transport.sendMail({
    to: inbox,
    from: process.env.EMAIL_FROM || 'Cloudegree <no-reply@cloudegree.com>',
    subject,
    text,
    html,
  });
}
