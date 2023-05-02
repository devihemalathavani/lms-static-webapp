import { RequestHandler } from "express";
import { authzManagementClient } from "../common/authz-client";

export const verifyEmailHandler: RequestHandler = async (req, res, next) => {
  try {
    const userInfo = await authzManagementClient.getUser({
      id: req.user.sub,
    });
    if (userInfo.email_verified) {
      return res.status(400).json({
        message: "Email is already verified.",
      });
    }
    authzManagementClient.sendEmailVerification({
      user_id: req.user.sub,
    });
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
