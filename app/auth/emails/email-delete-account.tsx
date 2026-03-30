import {
  Html,
  Body,
  Container,
  Text,
  Heading,
  Button,
} from "@react-email/components";

interface DeleteAccountTemplateProps {
  user: {
    name: string;
    email: string;
  };
  url: string;
}

export function DeleteAccountTemplate({
  user,
  url,
}: DeleteAccountTemplateProps) {
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
          <Heading>Confirm Account Deletion</Heading>

          <Text>Hello {user.name},</Text>

          <Text>
            We{"'"}re sorry to see you go! Please confirm your account deletion by clicking the button below:
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
            Confirm Deletion
          </Button>

          <Text>
            If you don{"'"}t have an account, please ignore this email.
          </Text>

          <Text>This link will expire in 24 hours.</Text>

          <Text>Best regards,</Text>
          <Text>— Your App Team</Text>
        </Container>
      </Body>
    </Html>
  );
}