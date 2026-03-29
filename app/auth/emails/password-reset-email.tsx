import {
  Html,
  Body,
  Container,
  Text,
  Heading,
  Button,
} from "@react-email/components";

interface EmailResetPasswordTemplateProps {
  user: {
    name: string;
    email: string;
  };
  url: string;
}

export function EmailResetPasswordTemplate({
  user,
  url,
}: EmailResetPasswordTemplateProps) {
  return (
    <Html>
      <Body style={{ backgroundColor: "#f6f9fc", padding: "20px" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "24px",
            borderRadius: "8px",
          }}
        >
          <Heading>Reset Your Password</Heading>

          <Text>Hello {user.name},</Text>

          <Text>
            You requested to reset your password. Click the button below to reset it:
          </Text>

          <Button
            href={url}
            style={{
              backgroundColor: "#000",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            Reset Password
          </Button>

          <Text>
            If you didn {"'"}t request this, please ignore this email.
          </Text>

          <Text>This link will expire in 24 hours.</Text>

          <Text>— Your App Team</Text>
        </Container>
      </Body>
    </Html>
  );
}