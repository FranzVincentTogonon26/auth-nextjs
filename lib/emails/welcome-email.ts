import { Resend } from 'resend';
import { WelcomeEmailTemplate } from '@/app/auth/emails/welcome-email-template';

const resendApiKey = process.env.RESEND_API_KEY!;
const resendFromEmail = process.env.RESEND_FROM_EMAIL!;

if (!resendApiKey || !resendFromEmail) {
  throw new Error('Missing RESEND_API_KEY or RESEND_FROM_EMAIL');
}

const resend = new Resend(resendApiKey);

export async function sendWelcomeEmail({
  user
}: {
  user: { email: string; name: string }
}) {

  try {
    await resend.emails.send({
      from: resendFromEmail,
      to: user.email,
      subject: "Verify your email address",
      react: WelcomeEmailTemplate({ user }),
    });
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Failed to send email", err);
    throw err;
  }

}
