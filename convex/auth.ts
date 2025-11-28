import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

/**
 * Convex Auth Configuration
 *
 * Providers:
 * - Google OAuth: Sign in with Google account
 * - GitHub OAuth: Sign in with GitHub account
 * - Password: Email and password authentication
 *
 * Environment variables required:
 * - AUTH_GOOGLE_ID: Google OAuth client ID
 * - AUTH_GOOGLE_SECRET: Google OAuth client secret
 * - AUTH_GITHUB_ID: GitHub OAuth client ID
 * - AUTH_GITHUB_SECRET: GitHub OAuth client secret
 * - SITE_URL: Your app's URL for OAuth callbacks
 */
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Password,
  ],
});
