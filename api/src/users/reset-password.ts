import { RequestHandler } from "express";
import createHttpError from "http-errors";
import {
  authzAuthenticationClient,
  authzManagementClient,
} from "../common/authz-client";
import { getConfig } from "../common/config";

export const passwordResetHandler: RequestHandler = async (req, res, next) => {
  try {
    const userInfo = await authzManagementClient.getUser({
      id: req.user.sub,
    });

    if (!userInfo.email_verified) {
      next(createHttpError(400, "Email not verified."));
      return;
    }

    const auth0Identity = userInfo.identities?.find(
      (identity) =>
        identity.provider === "auth0" &&
        identity.connection === "Username-Password-Authentication"
    );

    if (!auth0Identity) {
      next(
        createHttpError(400, "User is not logged in with username & password")
      );
      return;
    }

    await authzAuthenticationClient.requestChangePasswordEmail({
      connection: auth0Identity.connection,
      email: userInfo.email as string,
      client_id: getConfig().AUTH0_FRONT_END_CLIENT_ID,
    });

    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
