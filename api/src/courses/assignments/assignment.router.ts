import { Router } from "express";
import { permissions } from "../../common/constants/permissions";
import { checkPermissions } from "../../middleware/authz.middleware";
import { addAssignmentHandler } from "./add-assignment-handler";
import { deleteAssignmentHandler } from "./delete-assignment.handler";

const assignmentRouter = Router({
  mergeParams: true, // merge params from parent router
});

assignmentRouter
  .route("/")
  .post(checkPermissions(permissions.read_course), addAssignmentHandler); // Student should be able to upload assignment files

assignmentRouter
  .route("/:assignmentId")
  .delete(checkPermissions(permissions.update_course), deleteAssignmentHandler); // Takes assignmentFile as param

export default assignmentRouter;
