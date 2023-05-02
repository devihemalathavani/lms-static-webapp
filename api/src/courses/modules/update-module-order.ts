import { RequestHandler } from "express";
import { z } from "zod";
import { db } from "../../common/db";
import { IdSchema } from "../../common/zod-schemas";

export const updateModuleOrderHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const queryParams = await z
      .object({
        order: z.union([z.literal("up"), z.literal("down")]),
      })
      .parseAsync(req.query);

    const moduleId = await IdSchema.parseAsync(req.params.moduleId);
    const courseId = await IdSchema.parseAsync(req.params.courseId);

    const courseData = await db.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        modulesOrder: true,
      },
    });

    if (!courseData) {
      return res.sendStatus(400);
    }

    const { modulesOrder } = courseData;

    const moduleIndex = modulesOrder.findIndex((id) => id === moduleId);

    if (moduleIndex === -1) {
      return res.sendStatus(400);
    }

    // Swap module with the one above or below
    if (queryParams.order === "up") {
      // If module is already first, return error
      if (moduleIndex === 0) {
        return res.sendStatus(400);
      }

      // Swap module with the one above
      const moduleToSwap = modulesOrder[moduleIndex - 1];
      modulesOrder[moduleIndex - 1] = moduleId;
      modulesOrder[moduleIndex] = moduleToSwap;
    } else {
      // If module is already last, return error
      if (moduleIndex === modulesOrder.length - 1) {
        return res.sendStatus(400);
      }

      // Swap module with the one below
      const moduleToSwap = modulesOrder[moduleIndex + 1];
      modulesOrder[moduleIndex + 1] = moduleId;
      modulesOrder[moduleIndex] = moduleToSwap;
    }

    await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        modulesOrder,
      },
    });

    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
