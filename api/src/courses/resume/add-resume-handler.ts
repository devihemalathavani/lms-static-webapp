import { RequestHandler } from "express";
import formidable from "formidable";
import { saveFileToAzureStorage } from "../../common/azure-blob-storage";
import { db } from "../../common/db";
import { IdSchema } from "../../common/zod-schemas";

export const addResumeHandler: RequestHandler = async (req, res, next) => {
  try {
    const courseId = IdSchema.parse(req.params.courseId);

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

      if (!files.resumeFile) {
        return res.status(400).json({
          message: "Resume file is required.",
        });
      }

      // Save resume file to azure block blob storage
      const resumeFile = Array.isArray(files.resumeFile)
        ? files.resumeFile[0]
        : files.resumeFile;
      const resumeFileUrl = await saveFileToAzureStorage({
        path: resumeFile.filepath,
        name: resumeFile.originalFilename || resumeFile.newFilename,
        mimetype: resumeFile.mimetype || "application/octet-stream",
        access: "private",
      });

      // Save to course
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          resumeFiles: {
            push: resumeFileUrl,
          },
        },
      });

      return res.sendStatus(200);
    });
  } catch (error) {
    next(error);
  }
};
