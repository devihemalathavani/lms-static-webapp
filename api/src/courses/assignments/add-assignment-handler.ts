import { RequestHandler } from "express";
import formidable from "formidable";
import { saveFileToAzureStorage } from "../../common/azure-blob-storage";
import { db } from "../../common/db";
import { IdSchema } from "../../common/zod-schemas";

export const addAssignmentHandler: RequestHandler = async (req, res, next) => {
  try {
    const courseId = IdSchema.parse(req.params.courseId);

    // Check if user is enrolled in course
    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (!course.enrolledBy.includes(req.user.sub)) {
      return res.status(403).json({
        message: "You are not enrolled in this course",
      });
    }

    const form = formidable({
      maxFiles: 1,
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          message: "Invalid request format",
        });
      }

      if (!files.assignmentFile) {
        return res.status(400).json({
          message: "Assignment file is required.",
        });
      }

      // Save assignment file to azure block blob storage
      const assignmentFile = Array.isArray(files.assignmentFile)
        ? files.assignmentFile[0]
        : files.assignmentFile;
      const assignmentFileUrl = await saveFileToAzureStorage({
        path: assignmentFile.filepath,
        name: assignmentFile.originalFilename || assignmentFile.newFilename,
        mimetype: assignmentFile.mimetype || "application/octet-stream",
        access: "private",
      });

      // Save to course
      const assignment = await db.assignment.create({
        data: {
          file: assignmentFileUrl,
          courseId,
          userId: req.user.sub,
        },
      });

      return res.status(201).json(assignment);
    });
  } catch (error) {
    next(error);
  }
};
