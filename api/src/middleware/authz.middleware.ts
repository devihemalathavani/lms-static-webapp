import { expressjwt as jwt, GetVerificationKey } from "express-jwt";
import jwksRsa from "jwks-rsa";
import * as dotenv from "dotenv";
import jwtAuthz from "express-jwt-authz";
import { getConfig } from "../common/config";
import { AuthZPermission } from "../types";

dotenv.config();

// Authentication
export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${getConfig().AUTH0_DOMAIN}/.well-known/jwks.json`,
  }) as GetVerificationKey,

  audience: getConfig().AUTH0_API_AUDIENCE,
  issuer: `https://${getConfig().AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
  requestProperty: "user",
});

// Authorization
export const checkPermissions = (
  permissions: AuthZPermission | AuthZPermission[],
  checkAllScopes = true
) => {
  let permissionsToCheck = Array.isArray(permissions)
    ? permissions.map((permission) => permission.value)
    : [permissions.value];

  // During development don't check for permissions
  if (getConfig().MODE === "local") {
    permissionsToCheck = [];
  }

  return jwtAuthz(permissionsToCheck, {
    checkAllScopes,
    customScopeKey: "permissions",
    failWithError: true, // Calls error handling middleware if permissions check fails.
  });
};
