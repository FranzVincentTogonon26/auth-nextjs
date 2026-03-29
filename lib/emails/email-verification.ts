import { Resend } from 'resend';
import { EmailVerificationTemplate } from '@/app/auth/emails/email-verification-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export function sendEmailVerificationEmail({
  user,
  url,
}: {
  user: { email: string; name: string };
  url: string;
}) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: user.email,
    subject: "Verify your email address",
    react: EmailVerificationTemplate({ user, url }),
  });
}
