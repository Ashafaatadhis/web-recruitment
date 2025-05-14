import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { users, accounts } from "./lib/db/schema";
import { CredentialsSignin } from "@auth/core/errors";

class UserNotFoundError extends CredentialsSignin {
  code = "user_not_found";
  message = "user_not_found";
}

class InvalidPasswordError extends CredentialsSignin {
  code = "invalid_password";
  message = "invalid_password";
}

class InvalidAccountError extends CredentialsSignin {
  code = "invalid_account";
  message = "invalid_account";
}

class EmailNotVerifiedError extends CredentialsSignin {
  code = "EmailNotVerified";
  message = "EmailNotVerified";
}

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" }, // Changed from username to email
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) {
          throw new CredentialsSignin("missing_credentials");
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, email), // Query by email
        });

        if (!user) {
          throw new UserNotFoundError(); // "user_not_found"
        }

        if (!user.password) {
          throw new InvalidAccountError(); // "invalid_account"
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new InvalidPasswordError(); // "invalid_password"
        }

        if (!user.emailVerified) {
          throw new EmailNotVerifiedError(); // "EmailNotVerified"
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error", // Add an error page for better error handling
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    // Add this new callback to handle account linking
    async signIn({ user, account, profile }) {
      // Only proceed for OAuth sign-ins (like Google)

      if (account?.provider === "google" && profile?.email) {
        // Check if a user with this email already exists
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, profile.email as string),
        });

        if (existingUser) {
          // Check if this Google account is already linked to the user
          const linkedAccount = await db.query.accounts.findFirst({
            where: (account) =>
              and(
                eq(account.userId, existingUser.id),
                eq(account.provider, "google")
              ),
          });

          // If no linked account exists, create one
          if (!linkedAccount) {
            // Link the Google account to the existing user

            await db.insert(accounts).values({
              userId: existingUser.id,
              type: "oauth",
              provider: "google",
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
            });

            // After linking, set the user object to match the existing user
            // This ensures NextAuth recognizes this as a valid sign-in
            if (user) {
              user.id = existingUser.id;
              user.email = existingUser.email;
              user.name = existingUser.name || user.name;
              user.image = existingUser.image || user.image;
            }
          }

          return true;
        }
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
