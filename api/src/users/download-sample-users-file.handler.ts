import { RequestHandler } from "express";

export const downloadSampleUsersFileHandler: RequestHandler = (
  req,
  res,
  next
) => {
  try {
    return res.download("src/sample-files/users.csv");
  } catch (error) {
    next(error);
  }
};
