interface EmailResetPasswordTemplateProps {
  user: {
    name: string
    email: string
  }
  url: string
}

export function EmailResetPasswordTemplate({ user, url, }: EmailResetPasswordTemplateProps) {
  return (
    <div className='m-auto max-w-[600px]'>
        <h2 className='text-3xl font-bold'>Reset Your Password</h2>
        <p>Hello {user.name},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <a href={url} >Reset Password</a>
        <p>If you didn {"'"}t request this, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,Your App Team</p>
    </div>
  );
}