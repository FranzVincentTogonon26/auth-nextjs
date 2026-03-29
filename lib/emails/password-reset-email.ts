import { Resend } from 'resend';
import { EmailResetPasswordTemplate } from '@/app/auth/emails/password-reset-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export function sendPasswordResetEmail({
    user,
    url,
} : {
    user: { email: string; name: string }
    url: string
}) {

    return resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: user.email,
      subject: "Reset your password",
      react: EmailResetPasswordTemplate({ user, url }),
    });

}