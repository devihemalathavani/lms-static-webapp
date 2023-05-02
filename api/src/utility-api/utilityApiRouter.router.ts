import { Router } from "express";
import { getAzBlobAccessUrlHandler } from "./get-az-blob-access-url";

const utilityApiRouter = Router();

utilityApiRouter.get("/get-az-blob-access-url", getAzBlobAccessUrlHandler); // Takes azureFileUrl as query param

export default utilityApiRouter;
