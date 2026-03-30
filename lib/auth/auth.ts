import { db } from "@/drizzle/db"; 
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/api";

import { sendPasswordResetEmail } from "../emails/password-reset-email"
import { sendEmailVerificationEmail } from "../emails/email-verification"
import { sendWelcomeEmail } from "../emails/welcome-email";
import { sendDeleteAccountVerificationEmail } from "../emails/delete-account-verification";

export const auth = betterAuth({
    user: {
        changeEmail: {
            enabled: true
        },
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({ user, url }) => {
                await sendDeleteAccountVerificationEmail({ user, url })
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            await sendPasswordResetEmail({ user, url })
        },
    },
    emailVerification: {
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendEmailVerificationEmail({ user, url })
        },
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60, // 1 minute
        },
    },
    plugins: [
        nextCookies(),
        
    ],
    database: drizzleAdapter(db, {
        provider: "pg", 
    }),
    hooks: {
        after: createAuthMiddleware(async ctx => {
        if (ctx.path.startsWith("/sign-up")) {
            const user = ctx.context.newSession?.user ?? {
                name: ctx.body.name,
                email: ctx.body.email,
            }

            if (user != null && user.email && user.name) {
                await sendWelcomeEmail({ user })
            }
        }
        }),
    },
});
