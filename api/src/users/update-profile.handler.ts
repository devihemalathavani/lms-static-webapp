import { RequestHandler } from "express";
import formidable from "formidable";
import createHttpError from "http-errors";
import { z } from "zod";
import { authzManagementClient } from "../common/authz-client";
import { saveFileToAzureStorage } from "../common/azure-blob-storage";

const profileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export const updateProfileHandler: RequestHandler = (req, res, next) => {
  const form = formidable({
    maxFiles: 1,
  });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        message: "Invalid request format",
      });
    }

    // Validate input
    try {
      const data = profileSchema.parse({
        name: fields.name,
        email: fields.email,
      });

      // Save picture to azure block blob storage
      let pictrue: string | undefined;
      if (files.pictrue) {
        const pictrueFile = Array.isArray(files.pictrue)
          ? files.pictrue[0]
          : files.pictrue;
        pictrue = await saveFileToAzureStorage({
          path: pictrueFile.filepath,
          name: data.name,
          mimetype: pictrueFile.mimetype || "image/jpg",
          access: "public",
        });
      }

      // Save to authz
      // req.user.sub is user id.

      try {
        const user = await authzManagementClient.updateUser(
          {
            id: req.user.sub,
          },
          {
            email: data.email,
            name: data.name,
            picture: pictrue,
          }
        );
        res.json({
          name: user.name,
          email: user.email,
          pictrue: user.picture,
          email_verified: user.email_verified,
        });
      } catch (error) {
        next(
          createHttpError(500, "Something went wrong, please contact support.")
        );
      }
    } catch (error) {
      next(error);
    }
  });
};
