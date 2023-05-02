import { RequestHandler } from "express";
import { z } from "zod";
import { db } from "../common/db";
import formidable from "formidable";
import { saveFileToAzureStorage } from "../common/azure-blob-storage";
import { Prisma } from "@prisma/client";

export const createCourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  archived: z.preprocess(
    (value) => value === "true",
    z.boolean().default(false)
  ),
  // liveLink: z.string().url(),
});

/**
 * Save to db
 */
export const createCourse = async (
  data: Prisma.CourseCreateInput,
  createdBy: string
) => {
  const course = await db.course.create({
    data: {
      ...data,
      enrolledBy: {
        set: createdBy,
      },
    },
    select: {
      archived: true,
      description: true,
      liveLink: true,
      title: true,
      id: true,
      pictrue: true,
    },
  });
  return course;
};

export const createCourseHandler: RequestHandler = async (req, res, next) => {
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
      const data = createCourseSchema.parse({
        title: fields.title,
        description: fields.description,
        archived: fields.archived,
        liveLink: fields.liveLink,
      });

      // Save picture to azure block blob storage
      const pictrueFile = Array.isArray(files.pictrue)
        ? files.pictrue[0]
        : files.pictrue;
      let pictrue = null;
      pictrue = await saveFileToAzureStorage({
        path: pictrueFile.filepath,
        name: data.title,
        mimetype: pictrueFile.mimetype || "image/jpg",
        access: "public",
      });

      // Save to db
      const course = await createCourse(
        {
          ...data,
          pictrue,
        },
        req.user.sub
      );

      res.json(course);
    } catch (error) {
      next(error);
    }
  });
};
