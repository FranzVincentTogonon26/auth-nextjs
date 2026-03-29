import {
  Html,
  Body,
  Container,
  Text,
  Heading,
  Button,
} from "@react-email/components";

interface EmailVerificationTemplateProps {
  user: {
    name: string;
    email: string;
  };
  url: string;
}

export function EmailVerificationTemplate({
  user,
  url,
}: EmailVerificationTemplateProps) {
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
          <Heading>Verify Your Email</Heading>

          <Text>Hello {user.name},</Text>

          <Text>
            Thank you for signing up! Please verify your email address by
            clicking the button below:
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
            Verify Email
          </Button>

          <Text>
            If you didn{"'"}t create an account, you can safely ignore this email.
          </Text>

          <Text>This link will expire in 24 hours.</Text>

          <Text>Franz</Text>
        </Container>
      </Body>
    </Html>
  );
}