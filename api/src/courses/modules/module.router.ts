import { Router } from "express";
import { permissions } from "../../common/constants/permissions";
import { checkPermissions } from "../../middleware/authz.middleware";
import { createModuleHandler } from "./create-module.handler";
import { deleteModuleHandler } from "./delete-module.handler";
import { updateModuleOrderHandler } from "./update-module-order";
import { updateModuleHandler } from "./update-module.handler";

const moduleRouter = Router({
  mergeParams: true, // If this is not true params from parent router are dropped.
  // https://expressjs.com/en/4x/api.html#express.router
});

moduleRouter.post(
  "/",
  checkPermissions(permissions.create_module),
  createModuleHandler
);

moduleRouter
  .route("/:moduleId")
  .delete(checkPermissions(permissions.update_module), deleteModuleHandler)
  .put(checkPermissions(permissions.update_module), updateModuleHandler)
  .patch(checkPermissions(permissions.update_module), updateModuleOrderHandler);

export default moduleRouter;
