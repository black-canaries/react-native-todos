import { httpRouter } from "convex/server";
import { auth } from "./auth";

/**
 * HTTP Router Configuration
 *
 * Exposes HTTP endpoints for Convex Auth OAuth callbacks.
 *
 * OAuth providers (Google, GitHub) will redirect to:
 * https://[deployment].convex.site/api/auth/callback/[provider]
 *
 * Example callback URLs:
 * - Google: https://your-deployment.convex.site/api/auth/callback/google
 * - GitHub: https://your-deployment.convex.site/api/auth/callback/github
 */
const http = httpRouter();

// Mount auth HTTP routes at /api/auth
auth.addHttpRoutes(http);

export default http;
