import { RequestHandler } from "express";
import formidable from "formidable";
import { saveFileToAzureStorage } from "../../common/azure-blob-storage";
import { db } from "../../common/db";
import { IdSchema } from "../../common/zod-schemas";

export const addProjectHandler: RequestHandler = async (req, res, next) => {
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

      if (!files.projectFile) {
        return res.status(400).json({
          message: "Project file is required.",
        });
      }

      // Save project file to azure block blob storage
      const projectFile = Array.isArray(files.projectFile)
        ? files.projectFile[0]
        : files.projectFile;
      const projectFileUrl = await saveFileToAzureStorage({
        path: projectFile.filepath,
        name: projectFile.originalFilename || projectFile.newFilename,
        mimetype: projectFile.mimetype || "application/octet-stream",
        access: "private",
      });

      // Save to course
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          projectFiles: {
            push: projectFileUrl,
          },
        },
      });

      return res.sendStatus(200);
    });
  } catch (error) {
    next(error);
  }
};
