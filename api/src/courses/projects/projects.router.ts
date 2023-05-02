import { Router } from "express";
import { permissions } from "../../common/constants/permissions";
import { checkPermissions } from "../../middleware/authz.middleware";
import { addProjectHandler } from "./add-project-handler";
import { deleteProjectHandler } from "./delete-project.handler";

const projectsRouter = Router({
  mergeParams: true, // merge params from parent router
});

projectsRouter
  .route("/")
  .post(checkPermissions(permissions.update_course), addProjectHandler)
  .delete(checkPermissions(permissions.update_course), deleteProjectHandler); // Takes projectFile as param

export default projectsRouter;
