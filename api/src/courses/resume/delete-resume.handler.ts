import { RequestHandler } from "express";
import { z } from "zod";
import { deleteFileFromAzureStorage } from "../../common/azure-blob-storage";
import { db } from "../../common/db";
import { IdSchema } from "../../common/zod-schemas";

export const deleteResumeHandler: RequestHandler = async (req, res, next) => {
  try {
    const courseId = IdSchema.parse(req.params.courseId);
    const resumeFile = z.string().url().parse(req.query.resumeFile);

    // Fetch course from db
    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        resumeFiles: true,
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
        resumeFiles: course.resumeFiles.filter((file) => file !== resumeFile),
      },
    });

    res.json({ courseId, resumeFile });

    // Delete resume file from azure block blob storage
    await deleteFileFromAzureStorage(resumeFile);
  } catch (error) {
    next(error);
  }
};
