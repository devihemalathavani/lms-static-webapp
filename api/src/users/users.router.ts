import { Router } from "express";
import { downloadSampleUsersFileHandler } from "./download-sample-users-file.handler";
import getUserInfo from "./get-user-info";
import { getUserPermissionsHandler } from "./get-user-permissions";
import { importUsersHandler } from "./import-users.handler";
import { passwordResetHandler } from "./reset-password";
import { updateProfileHandler } from "./update-profile.handler";
import { verifyEmailHandler } from "./verify-email";

const usersRouter = Router();

usersRouter.put("/update-profile", updateProfileHandler);
usersRouter.post("/verify-email", verifyEmailHandler);
usersRouter.post("/reset-password", passwordResetHandler);
usersRouter.get("/permissions", getUserPermissionsHandler);
usersRouter.post("/import", importUsersHandler);
usersRouter.get("/sample-file", downloadSampleUsersFileHandler);
usersRouter.get("/user-info", getUserInfo);

export default usersRouter;
