import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";
import { adminClient, inferAdditionalFields, organizationClient, twoFactorClient } from "better-auth/client/plugins"
import { passkeyClient } from "@better-auth/passkey/client"
import { ac, admin, user } from "@/components/auth/permissions"

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    passkeyClient(),
    twoFactorClient({
        twoFactorPage: "/auth/2fa"
    }),
    adminClient({
      ac,
        roles: {
            admin,
            user,
        },
    }),
    organizationClient(),
  ],
});