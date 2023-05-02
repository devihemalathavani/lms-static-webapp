import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { db } from "../../common/db";
import { IdSchema } from "../../common/zod-schemas";

export const deleteModuleHandler: RequestHandler = async (req, res, next) => {
  try {
    const moduleId = await IdSchema.parseAsync(req.params.moduleId);
    const courseId = await IdSchema.parseAsync(req.params.courseId);

    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { modulesOrder: true },
    });
    if (!course) {
      createHttpError(404, "Course not found");
      return;
    }
    const modulesOrder = course.modulesOrder.filter((id) => id !== moduleId);

    // Delete module and its topics and its id from course modulesOrder
    await db.$transaction(async (tx) => {
      // Delete module
      await tx.module.delete({
        where: {
          id: moduleId,
        },
      });

      // Delete topics
      await tx.topic.deleteMany({
        where: {
          modulesId: moduleId,
        },
      });

      // Delete module id from course modulesOrder
      await tx.course.update({
        where: {
          id: courseId,
        },
        data: {
          modulesOrder,
        },
      });
    });

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
