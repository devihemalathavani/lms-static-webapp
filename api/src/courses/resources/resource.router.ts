import { Router } from "express";
import { permissions } from "../../common/constants/permissions";
import { checkPermissions } from "../../middleware/authz.middleware";
import { addResourceHandler } from "./add-resource-handler";
import { deleteResourceHandler } from "./delete-resource.handler";

const resourceRouter = Router({
  mergeParams: true, // merge params from parent router
});

resourceRouter
  .route("/")
  .post(checkPermissions(permissions.update_course), addResourceHandler)
  .delete(checkPermissions(permissions.update_course), deleteResourceHandler); // Takes resourceFile as param

export default resourceRouter;
