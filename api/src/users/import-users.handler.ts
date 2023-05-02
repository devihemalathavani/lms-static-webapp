import { RequestHandler } from "express";
import * as fs from "fs";
import csv from "csv-parser";
import formidable from "formidable";
import { authzManagementClient } from "../common/authz-client";
import { getStudentRoleId } from "../common/users";
import { z } from "zod";

interface User {
  name: string;
  email: string;
}

const userSchema = z.object({
  name: z.string().min(1).trim(),
  email: z.string().transform((v) => v.toLowerCase().trim()),
});

const usersSchema = z.array(userSchema).min(1);

const createUser = async (user: User, studentRoleId: string) => {
  const { name, email } = user;
  try {
    const { user_id } = await authzManagementClient.createUser({
      name,
      email,
      email_verified: true,
      connection: "Username-Password-Authentication",
      password: "welcome@123",
    });

    // Add student role to user
    if (user_id) {
      authzManagementClient.assignRolestoUser(
        {
          id: user_id,
        },
        {
          roles: [studentRoleId],
        }
      );
    }

    return user_id;
  } catch (error) {
    console.log("ERROR: can't add user ", { name, email });
    console.error(error);
  }
};

export const importUsersHandler: RequestHandler = (req, res, next) => {
  try {
    const form = formidable({
      maxFiles: 1,
      maxFileSize: 500 * 1024, // 500kb
    });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          message: "Invalid request format",
        });
      }

      const studentRoleId = await getStudentRoleId();
      if (!studentRoleId) {
        return res.status(400).json({
          message: "Can't find student role",
        });
      }

      const users: User[] = [];
      const csvFile = Array.isArray(files.file) ? files.file[0] : files.file;
      fs.createReadStream
        .bind(fs)(csvFile.filepath)
        .pipe(csv())
        .on("data", (data) => users.push(data))
        .on("end", async () => {
          const usersZodResult = usersSchema.safeParse(users);
          if (!usersZodResult.success) {
            return res.status(400).json({
              message: "Invalid csv file.",
              errors: usersZodResult.error,
            });
          }
          const userIds = await Promise.all(
            usersZodResult.data.map((user) => createUser(user, studentRoleId))
          );
          res.json({ userIds });
        });
    });
  } catch (error) {
    next(error);
  }
};
