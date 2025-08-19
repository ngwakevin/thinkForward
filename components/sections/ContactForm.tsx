"use client";
import { useState } from 'react';

interface FormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

interface FieldErrors { [k: string]: string | undefined }

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>({ status: 'idle' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [messageValue, setMessageValue] = useState('');

  function validate(form: HTMLFormElement) {
    const newErrors: FieldErrors = {};
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const subject = (form.elements.namedItem('subject') as HTMLInputElement).value.trim();
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim();
    if (!name) newErrors.name = 'Required';
    if (!email) newErrors.email = 'Required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) newErrors.email = 'Invalid email';
    if (!subject) newErrors.subject = 'Required';
    if (!message) newErrors.message = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (formState.status === 'loading') return;
    const form = e.currentTarget;
    if (!validate(form)) return;
    // honeypot
    if ((form.elements.namedItem('website') as HTMLInputElement)?.value) return; // bot
    const data = new FormData(form);
    setFormState({ status: 'loading' });
    try {
      const res = await fetch('https://formsubmit.co/ajax/ngwakevin@gmail.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data
      });
      if (!res.ok) throw new Error('Request failed');
      const json = await res.json();
      if (json.success === 'true' || json.message) {
        setFormState({ status: 'success', message: 'Message sent successfully. We will respond within 1 business day.' });
        form.reset();
        setMessageValue('');
        setErrors({});
      } else throw new Error('Unknown response');
    } catch {
      setFormState({ status: 'error', message: 'Could not send message. Please retry.' });
    }
  }

  const inputBase = "w-full rounded-md border border-border/60 bg-bg-alt/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/40 text-fg placeholder:text-fg-muted/60 transition";
  const errorText = "text-[11px] text-danger mt-1";
  const labelBase = "flex items-center justify-between text-xs font-medium uppercase tracking-wide text-fg-muted";

  return (
    <div className="space-y-6">
      <div aria-live="polite" className="space-y-3">
        {formState.status === 'success' && (
          <div role="status" className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {formState.message}
          </div>
        )}
        {formState.status === 'error' && (
          <div role="alert" className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {formState.message}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-7" noValidate>
        <input type="hidden" name="_captcha" value="false" />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className={labelBase}>Name {errors.name && <span className="text-danger normal-case">{errors.name}</span>}</label>
            <input name="name" required placeholder="Your name" className={inputBase + (errors.name ? ' border-danger/60 focus:ring-danger/40' : '')} />
          </div>
          <div>
            <label className={labelBase}>Email {errors.email && <span className="text-danger normal-case">{errors.email}</span>}</label>
            <input name="email" type="email" required placeholder="you@example.com" className={inputBase + (errors.email ? ' border-danger/60 focus:ring-danger/40' : '')} />
          </div>
          <div>
            <label className={labelBase}>Organization <span className="opacity-40 normal-case">Optional</span></label>
            <input name="organization" placeholder="Company / School" className={inputBase} />
          </div>
          <div>
            <label className={labelBase}>Phone <span className="opacity-40 normal-case">Optional</span></label>
            <input name="phone" type="tel" placeholder="+1 555 123 4567" className={inputBase} />
          </div>
        </div>
        <div>
          <label className={labelBase}>Subject {errors.subject && <span className="text-danger normal-case">{errors.subject}</span>}</label>
          <input name="subject" required placeholder="How can we help?" className={inputBase + (errors.subject ? ' border-danger/60 focus:ring-danger/40' : '')} />
        </div>
        <div>
          <label className={labelBase}>
            <span>Message</span>
            <span className="text-[10px] font-normal text-fg-muted/70">{messageValue.length}/1500</span>
          </label>
          <textarea
            name="message"
            required
            rows={7}
            maxLength={1500}
            placeholder="Provide context, goals, timelines..."
            value={messageValue}
            onChange={e => setMessageValue(e.target.value)}
            className={"w-full resize-none rounded-md border border-border/60 bg-bg-alt/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/40 text-fg placeholder:text-fg-muted/60" + (errors.message ? ' border-danger/60 focus:ring-danger/40' : '')}
          />
          {errors.message && <p className={errorText}>{errors.message}</p>}
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <button
            type="submit"
            disabled={formState.status==='loading'}
            className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-alt disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {formState.status === 'loading' ? 'Sending…' : 'Send Message'}
          </button>
          <p className="text-[10px] text-fg-muted/70 leading-relaxed">
            We respect your privacy. By submitting you consent to contact regarding training & mentorship. No spam — unsubscribe anytime.
          </p>
        </div>
      </form>
    </div>
  );
}
