import { RequestHandler } from "express";
import { db } from "../common/db";

export const getEnrolledCourses = async (userId: string) => {
  const data = await db.course.findMany({
    where: {
      enrolledBy: {
        has: userId,
      },
      archived: false,
    },
    select: {
      id: true,
      title: true,
      description: true,
      pictrue: true,
      liveLink: true,
    },
  });

  return data;
};

export const getMyCoursesHandler: RequestHandler = async (req, res, next) => {
  try {
    const data = await getEnrolledCourses(req.user.sub);
    return res.json(data);
  } catch (error) {
    next(error);
  }
};
