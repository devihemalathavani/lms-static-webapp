import { getConfig } from "../common/config";
import { AuthenticationClient, ManagementClient } from "auth0";

export const authzManagementClient = new ManagementClient({
  domain: getConfig().AUTH0_DEFAULT_DOMAIN,
  clientId: getConfig().AUTH0_MGMT_CLIENT_ID,
  clientSecret: getConfig().AUTH0_MGMT_CLIENT_SECRET,
});

export const authzAuthenticationClient = new AuthenticationClient({
  domain: getConfig().AUTH0_DEFAULT_DOMAIN,
  clientId: getConfig().AUTH0_MGMT_CLIENT_ID,
  clientSecret: getConfig().AUTH0_MGMT_CLIENT_SECRET,
});
