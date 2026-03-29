import { Resend } from 'resend';
import { EmailResetPasswordTemplate } from '@/app/auth/emails/password-reset-email';

const resendApiKey = process.env.RESEND_API_KEY!;
const resendFromEmail = process.env.RESEND_FROM_EMAIL!;

if (!resendApiKey || !resendFromEmail) {
  throw new Error('Missing RESEND_API_KEY or RESEND_FROM_EMAIL');
}

const resend = new Resend(resendApiKey);

export function sendPasswordResetEmail({
    user,
    url,
} : {
    user: { email: string; name: string }
    url: string
}) {

    return resend.emails.send({
      from: resendFromEmail,
      to: user.email,
      subject: "Reset your password",
      react: EmailResetPasswordTemplate({ user, url }),
    });

}