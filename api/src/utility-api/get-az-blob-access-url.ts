import { RequestHandler } from "express";
import { z } from "zod";
import { getAzureBlobAccessUrl } from "../common/azure-blob-storage";

export const getAzBlobAccessUrlHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const azureFileUrl = z.string().url().parse(req.query.azureFileUrl);

    let url = null;
    try {
      url = await getAzureBlobAccessUrl(azureFileUrl);
    } catch (error) {
      return res.status(404).json({
        message: "File not found.",
      });
    }
    return res.send(url);
  } catch (error) {
    next(error);
  }
};
