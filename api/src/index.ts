import app from "./app";
import { getConfig } from "./common/config";
import syncPermissions from "./scripts/sync-authz-permissions";

if (!getConfig().PORT) {
  process.exit(1);
}

const PORT: number = parseInt(getConfig().PORT, 10);

async function main() {
  // Sync permissions with authz and skipt it locally
  if (getConfig().MODE !== "local") {
    await syncPermissions();
  }

  // Start the server
  app.listen(PORT, () => {
    console.log(`🚀 App started in ${getConfig().MODE} mode on port ${PORT}.`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
