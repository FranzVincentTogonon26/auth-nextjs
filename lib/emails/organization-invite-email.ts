import { Resend } from 'resend';
import { InviteOrganizationTemplate } from '@/app/auth/emails/email-invite-organization';

const resendApiKey = process.env.RESEND_API_KEY!;
const resendFromEmail = process.env.RESEND_FROM_EMAIL!;

if (!resendApiKey || !resendFromEmail) {
  throw new Error('Missing RESEND_API_KEY or RESEND_FROM_EMAIL');
}

const resend = new Resend(resendApiKey);

export async function sendOrganizationInviteEmail({
    invitation,
    inviter,
    organization,
    email,
} : {
    invitation: { id: string }
    inviter: { name: string }
    organization: { name: string }
    email: string
}) {

  try {
    await resend.emails.send({
      from: resendFromEmail,
      to: email,
      subject: `You're invited to join the ${organization.name} organization`,
      react: InviteOrganizationTemplate({ organization, inviter, invitation }),
    });
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Failed to send email", err);
    throw err;
  }

}