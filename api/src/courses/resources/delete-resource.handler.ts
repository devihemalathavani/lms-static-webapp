import { RequestHandler } from "express";
import { z } from "zod";
import { deleteFileFromAzureStorage } from "../../common/azure-blob-storage";
import { db } from "../../common/db";
import { IdSchema } from "../../common/zod-schemas";

export const deleteResourceHandler: RequestHandler = async (req, res, next) => {
  try {
    const courseId = IdSchema.parse(req.params.courseId);
    const resourceFile = z.string().url().parse(req.query.resourceFile);

    // Fetch course from db
    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        resourceFiles: true,
      },
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    // Delete from course
    await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        resourceFiles: course.resourceFiles.filter(
          (file) => file !== resourceFile
        ),
      },
    });

    res.json({ courseId, resourceFile });

    // Delete resource file from azure block blob storage
    await deleteFileFromAzureStorage(resourceFile);
  } catch (error) {
    next(error);
  }
};
