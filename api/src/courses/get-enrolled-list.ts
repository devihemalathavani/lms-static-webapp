import { RequestHandler } from "express";
import { z } from "zod";
import { authzManagementClient } from "../common/authz-client";
import { db } from "../common/db";
import { IdSchema } from "../common/zod-schemas";
import { EnrolledStudentsPage } from "../types/users";

export const getEnrolledUsers: RequestHandler = async (req, res, next) => {
  try {
    const courseId = IdSchema.parse(req.params.courseId);
    const page = z
      .string()
      .optional()
      .default("0")
      .transform((v) => parseInt(v))
      .parse(req.query.page);

    const data = await db.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        enrolledBy: true,
      },
    });

    if (!data?.enrolledBy.length) {
      return res.status(200).json([]);
    }

    // Get user name, email from auth0 for each user in enrolledBy
    const per_page = 10;
    const searchQuery = data.enrolledBy
      .slice(page * per_page, page * per_page + 10) // TODO: temp fix
      .map((u) => `user_id:"${u}"`)
      .join(" OR ");

    const enrolledUsers = await authzManagementClient.getUsers({
      q: searchQuery,
      fields: "user_id,name,email",
      sort: "updated_at:1",
      page: 0,
      include_totals: true,
      per_page,
    });

    const pageData: EnrolledStudentsPage = {
      ...enrolledUsers,
      users: enrolledUsers.users.map((user) => {
        return {
          id: user.user_id as string,
          name: user.name as string,
          email: user.email as string,
        };
      }),
    };

    return res.json({ ...pageData, total: data.enrolledBy.length });
  } catch (error) {
    next(error);
  }
};
