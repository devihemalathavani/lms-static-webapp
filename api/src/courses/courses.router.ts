import { Router } from "express";
import { permissions } from "../common/constants/permissions";
import { checkPermissions } from "../middleware/authz.middleware";
import { createCourseHandler } from "./create-course.handler";
import { enrollStudentHandler } from "./enroll-student.handler";
import { getAllCoursesHandler } from "./get-all-courses.handler";
import { getCourseHandler } from "./get-course.handler";
import { getEnrolledUsers } from "./get-enrolled-list";
import { getMyCoursesHandler } from "./get-my-courses.handler";
import moduleRouter from "./modules/module.router";
import { archiveCourseHandler } from "./archieve-course-handler";
import { updateCourseFilesHandler } from "./update-course-files";
import { updateCourseHandler } from "./update-course.handler";
import projectsRouter from "./projects/projects.router";
import { updateLiveLinkHandler } from "./update-live-link.handler";
import { unenrollStudentHandler } from "./unenroll-student.handler";
import resourceRouter from "./resources/resource.router";
// import assignmentRouter from "./assignments/assignment.router";
import resumeRouter from "./resume/resume.router";

const coursesRouter = Router();

coursesRouter
  .route("/")
  .post(checkPermissions([permissions.create_course]), createCourseHandler)
  .get(checkPermissions([permissions.read_my_courses]), getMyCoursesHandler);

coursesRouter.get(
  "/all",
  checkPermissions([permissions.read_course]),
  getAllCoursesHandler
);

coursesRouter
  .route("/:courseId")
  .get(
    checkPermissions(
      [permissions.read_course, permissions.read_my_courses],
      false
    ),
    getCourseHandler
  )
  .put(checkPermissions([permissions.update_course]), updateCourseHandler);

coursesRouter.get(
  "/:courseId/enrolled",
  checkPermissions(permissions.read_enrolled),
  getEnrolledUsers
);

coursesRouter.put(
  "/:courseId/enrolled",
  checkPermissions(permissions.update_enrolled),
  enrollStudentHandler
);

coursesRouter.delete(
  "/:courseId/enrolled/:studentId",
  checkPermissions(permissions.update_enrolled),
  unenrollStudentHandler
);

coursesRouter.patch(
  "/:courseId/archieved",
  checkPermissions(permissions.update_course),
  archiveCourseHandler
);

coursesRouter.patch(
  "/:courseId/live-link",
  checkPermissions(permissions.update_course),
  updateLiveLinkHandler
);

coursesRouter.put(
  "/update-files",
  checkPermissions([permissions.update_course]),
  updateCourseFilesHandler
);

// Modules
coursesRouter.use("/:courseId/modules", moduleRouter);

// Projects
coursesRouter.use("/:courseId/projects", projectsRouter);

// Resources
coursesRouter.use("/:courseId/resources", resourceRouter);

// Assignments
// coursesRouter.use("/:courseId/assignments", assignmentRouter);

// Resumes
coursesRouter.use("/:courseId/resumes", resumeRouter);

export default coursesRouter;
