import { RequestHandler } from "express";
import { z } from "zod";
import { deleteFileFromAzureStorage } from "../../common/azure-blob-storage";
import { db } from "../../common/db";
import { IdSchema } from "../../common/zod-schemas";

export const deleteProjectHandler: RequestHandler = async (req, res, next) => {
  try {
    const courseId = IdSchema.parse(req.params.courseId);
    const projectFile = z.string().url().parse(req.query.projectFile);

    // Fetch course from db
    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        projectFiles: true,
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
        projectFiles: course.projectFiles.filter(
          (file) => file !== projectFile
        ),
      },
    });

    res.json({ courseId, projectFile });

    // Delete project file from azure block blob storage
    await deleteFileFromAzureStorage(projectFile);
  } catch (error) {
    next(error);
  }
};
