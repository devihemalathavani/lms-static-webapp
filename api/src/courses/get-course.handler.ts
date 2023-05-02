import { RequestHandler } from "express";
import { db } from "../common/db";
import { IdSchema } from "../common/zod-schemas";
import { Prisma } from "@prisma/client";

export const getCourseHandler: RequestHandler = async (req, res, next) => {
  try {
    const courseId = IdSchema.parse(req.params.courseId);
    let data = null;

    data = await getCourseData(courseId, req.user);
    return res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getCourseData = async (courseId: number, user: Express.User) => {
  const where: Prisma.CourseWhereInput = {
    id: courseId,
  };

  if (!user.permissions.includes("read:course")) {
    where.enrolledBy = {
      has: user.sub, //  If user doesn't have read:course permission, only return course data if user is enrolled in the course.
    };
  }

  const data = await db.course.findFirst({
    where,
    select: {
      id: true,
      title: true,
      description: true,
      pictrue: true,
      liveLink: true,
      archived: true,
      modulesOrder: true,
      modules: {
        select: {
          id: true,
          title: true,
          topics: {
            select: {
              id: true,
              title: true,
              videoLink: true,
            },
          },
        },
      },
      projectFiles: true,
      resourceFiles: true,
      assignments: {
        select: {
          id: true,
          file: true,
        },
        where: {
          userId: user.sub,
        },
      },
      resumeFiles: true,
    },
  });

  return data;
};
