import nodemailer from 'nodemailer';

interface EmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Send an email notification
 */
export async function sendEmail({ to, subject, text, html }: EmailParams): Promise<boolean> {
  try {
    // For production, configure with real SMTP credentials
    // For development/testing, use a service like Mailtrap or ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || testAccount.user,
        pass: process.env.SMTP_PASS || testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || '"ThinkForward Team" <noreply@thinkforward.com>',
      to,
      subject,
      text,
      html: html || text,
    });

    console.log(`Email sent: ${info.messageId}`);
    
    // If using Ethereal for testing, log the URL where you can preview the email
    if (!process.env.SMTP_HOST) {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}