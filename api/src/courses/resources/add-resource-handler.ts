import { RequestHandler } from "express";
import formidable from "formidable";
import { saveFileToAzureStorage } from "../../common/azure-blob-storage";
import { db } from "../../common/db";
import { IdSchema } from "../../common/zod-schemas";

export const addResourceHandler: RequestHandler = async (req, res, next) => {
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

      if (!files.resourceFile) {
        return res.status(400).json({
          message: "Resource file is required.",
        });
      }

      // Save resource file to azure block blob storage
      const resourceFile = Array.isArray(files.resourceFile)
        ? files.resourceFile[0]
        : files.resourceFile;
      const resourceFileUrl = await saveFileToAzureStorage({
        path: resourceFile.filepath,
        name: resourceFile.originalFilename || resourceFile.newFilename,
        mimetype: resourceFile.mimetype || "application/octet-stream",
        access: "private",
      });

      // Save to course
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          resourceFiles: {
            push: resourceFileUrl,
          },
        },
      });

      return res.sendStatus(200);
    });
  } catch (error) {
    next(error);
  }
};
