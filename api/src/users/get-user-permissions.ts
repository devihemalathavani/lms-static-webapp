import { RequestHandler } from "express";

export const getUserPermissionsHandler: RequestHandler = (req, res) => {
  const permissions = req.user.permissions || [];
  res.json(permissions);
};
