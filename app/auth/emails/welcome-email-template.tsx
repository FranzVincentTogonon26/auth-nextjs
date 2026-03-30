import {
  Html,
  Body,
  Container,
  Text,
  Heading,
} from "@react-email/components";

interface WelcomeEmailTemplateProps {
  user: {
    name: string;
    email: string;
  }
}

export function WelcomeEmailTemplate({
  user
}: WelcomeEmailTemplateProps) {
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
          <Heading>Welcome to Our App!</Heading>

          <Text>Hello {user.name},</Text>

          <Text>
            Thank you for signing up for our app! We{"'"}re excited to have you on board. Best regards,
          </Text>

          <Text>— Your App Team</Text>
        </Container>
      </Body>
    </Html>
  );
}