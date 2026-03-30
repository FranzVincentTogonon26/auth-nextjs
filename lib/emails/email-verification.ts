import { Resend } from 'resend';
import { EmailVerificationTemplate } from '@/app/auth/emails/email-verification-template';

const resendApiKey = process.env.RESEND_API_KEY!;
const resendFromEmail = process.env.RESEND_FROM_EMAIL!;

if (!resendApiKey || !resendFromEmail) {
  throw new Error('Missing RESEND_API_KEY or RESEND_FROM_EMAIL');
}

const resend = new Resend(resendApiKey);

export async function sendEmailVerificationEmail({
  user,
  url,
}: {
  user: { email: string; name: string };
  url: string;
}) {

  try {
    await resend.emails.send({
      from: resendFromEmail,
      to: user.email,
      subject: "Verify your email address",
      react: EmailVerificationTemplate({ user, url }),
    });
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Failed to send email", err);
  }

}
