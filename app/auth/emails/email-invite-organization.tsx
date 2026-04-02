import {
  Html,
  Body,
  Container,
  Text,
  Heading,
  Button,
} from "@react-email/components";

interface InviteOrganizationTemplateProps {
  organization: {
    name: string;
  };
  inviter: {
    name: string;
  };
  invitation: {
    id: string;
  };
}

export function InviteOrganizationTemplate({
  organization,
  inviter,
  invitation
}: InviteOrganizationTemplateProps) {
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
          <Heading>You{"'"}re invited to join ${organization.name}</Heading>

          <Text>Hello {inviter.name},</Text>

          <Text>
            {inviter.name} invited you to join the {organization.name} organization. Please click the button below to accept/reject the invitation:
          </Text>

          <Button
            href={`${process.env.BETTER_AUTH_URL}/organizations/invites/${invitation.id}`}
            style={{
              backgroundColor: "#000",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            Manage Invitation
          </Button>

          <Text>Best regards,</Text>
          <Text>— Your App Team</Text>
        </Container>
      </Body>
    </Html>
  );
}