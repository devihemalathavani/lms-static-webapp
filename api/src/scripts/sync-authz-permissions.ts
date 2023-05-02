import { permissions } from "../common/constants/permissions";
import { getConfig } from "../common/config";
import { authzManagementClient } from "../common/authz-client";
import { z } from "zod";

// This script adds permissions to authz
async function syncPermissions() {
  console.log("Scope (permissions) sync in progress");
  try {
    await authzManagementClient.updateResourceServer(
      {
        id: getConfig().AUTH0_API_APP_RESOURCE_ID,
      },
      {
        scopes: Object.values(permissions),
      }
    );

    // Get admin role
    const adminRole = await authzManagementClient.getRoles({
      name_filter: "admin",
    });
    const adminRoleId = adminRole[0].id;

    // Add permissions to admin role
    await authzManagementClient.addPermissionsInRole(
      {
        id: z.string().parse(adminRoleId),
      },
      {
        permissions: Object.values(permissions).map((permission) => ({
          permission_name: permission.value,
          resource_server_identifier: getConfig().AUTH0_API_APP_IDENTIFIER,
        })),
      }
    );

    console.log("Scope (permissions) sync completed");
  } catch (error) {
    console.log("Scope (permissions) sync failed", error);
  }
}

export default syncPermissions;
