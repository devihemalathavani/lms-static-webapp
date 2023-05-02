import { RequestHandler } from "express";
import { db } from "../common/db";

export const getAllCoursesHandler: RequestHandler = async (req, res, next) => {
  try {
    const data = await db.course.findMany({
      select: {
        id: true,
        title: true,
        archived: true,
      },
      orderBy: {
        archived: "asc",
      },
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};
