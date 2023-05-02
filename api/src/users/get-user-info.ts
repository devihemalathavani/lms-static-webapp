import { RequestHandler } from "express";
import { authzManagementClient } from "../common/authz-client";
import { db } from "../common/db";
import { EmailSchema } from "../common/zod-schemas";

const getUserInfo: RequestHandler = async (req, res, next) => {
  const userEmail = EmailSchema.parse(req.query.userEmail);

  let userAuth0Info;
  try {
    const res = await authzManagementClient.getUsersByEmail(userEmail);
    userAuth0Info = res[0];
  } catch (error) {
    next(error);
  }

  if (!userAuth0Info) {
    res.status(404).json({
      message: `No user found with email ${userEmail}`,
    });
    return;
  }

  let enrolledCourses;
  try {
    enrolledCourses = await db.course.findMany({
      where: {
        enrolledBy: {
          has: userAuth0Info.user_id,
        },
      },
      select: {
        id: true,
        title: true,
      },
    });
  } catch (error) {
    next(error);
  }

  res.json({
    lastLogin: userAuth0Info.last_login,
    name: userAuth0Info.name,
    id: userAuth0Info.user_id,
    email: userAuth0Info.email,
    courses: enrolledCourses || [],
  });
};

export default getUserInfo;
