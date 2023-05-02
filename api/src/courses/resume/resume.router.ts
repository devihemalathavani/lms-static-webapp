import { Router } from "express";
import { permissions } from "../../common/constants/permissions";
import { checkPermissions } from "../../middleware/authz.middleware";
import { addResumeHandler } from "./add-resume-handler";
import { deleteResumeHandler } from "./delete-resume.handler";

const resumeRouter = Router({
  mergeParams: true, // merge params from parent router
});

resumeRouter
  .route("/")
  .post(checkPermissions(permissions.update_course), addResumeHandler)
  .delete(checkPermissions(permissions.update_course), deleteResumeHandler); // Takes resumeFile as param

export default resumeRouter;
