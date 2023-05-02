import { RequestHandler } from "express";
import formidable from "formidable";
import { z } from "zod";
import { saveFileToAzureStorage } from "../common/azure-blob-storage";
import { db } from "../common/db";
import { IdSchema } from "../common/zod-schemas";

const updateCourseSchema = z.object({
  description: z.string().min(1),
  title: z.string().min(1),
});

export const updateCourseHandler: RequestHandler = async (req, res, next) => {
  const form = formidable({
    maxFiles: 1,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        message: "Invalid request format",
      });
    }

    if (!files.pictrue) {
      return res.status(400).json({
        message: "Image is required.",
      });
    }

    // Validate input
    try {
      const data = updateCourseSchema.parse({
        title: fields.title,
        description: fields.description,
      });
      const courseId = IdSchema.parse(req.params.courseId);

      const foundCourse = await db.course.findUnique({
        where: {
          id: courseId,
        },
      });

      if (!foundCourse) {
        return res.status(404).json({
          message: "Course not found.",
        });
      }

      // Save picture to azure block blob storage
      const pictrueFile = Array.isArray(files.pictrue)
        ? files.pictrue[0]
        : files.pictrue;
      let pictrue = null;

      if (pictrueFile.size > 0) {
        pictrue = await saveFileToAzureStorage({
          path: pictrueFile.filepath,
          name: data.title,
          mimetype: pictrueFile.mimetype || "image/jpg",
          access: "public",
        });
      }

      // Save to db
      const course = await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          ...data,
          pictrue: pictrue || foundCourse.pictrue,
        },
      });

      res.json(course);
    } catch (error) {
      next(error);
    }
  });
};
