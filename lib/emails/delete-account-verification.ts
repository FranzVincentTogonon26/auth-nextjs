import { Resend } from 'resend';
import { DeleteAccountTemplate } from '@/app/auth/emails/email-delete-account';

const resendApiKey = process.env.RESEND_API_KEY!;
const resendFromEmail = process.env.RESEND_FROM_EMAIL!;

if (!resendApiKey || !resendFromEmail) {
  throw new Error('Missing RESEND_API_KEY or RESEND_FROM_EMAIL');
}

const resend = new Resend(resendApiKey);

export async function sendDeleteAccountVerificationEmail({
  user,
  url,
}: {
  user: { email: string; name: string };
  url: string;
}) {

  try {

    const { error } = await resend.emails.send({
      from: resendFromEmail,
      to: user.email,
      subject: "Delete your account",
      react: DeleteAccountTemplate({ user, url }),
    });

    if (error) {
      console.error("Failed to send delete-account email", error);
      throw error;
    }

  } catch (err) {
    console.error("Failed to send delete-account email", err);
    throw err;
  }

}
