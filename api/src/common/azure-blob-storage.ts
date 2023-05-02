import { BlobSASPermissions, BlobServiceClient } from "@azure/storage-blob";
import { getConfig } from "./config";
import signale from "signale";
import { randomUUID } from "crypto";

const getBlobServiceClient = () => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    getConfig().AZURE_STORAGE_CONNECTION_STRING
  );
  return blobServiceClient;
};

const getContainerName = (access: "private" | "public") => {
  let containerName = "";
  const mode = getConfig().MODE;

  if (["local", "staging", "dev", "qa"].includes(mode)) {
    containerName += "local-staging-";
  }

  if (mode === "production") {
    containerName += "prod-";
  }

  return containerName + access;
};

interface IUploadFile {
  path: string;
  mimetype: string;
  name: string;
  access: "private" | "public";
}
export const saveFileToAzureStorage = async ({
  path,
  name,
  mimetype,
  access = "private",
}: IUploadFile) => {
  const PUBLIC_BLOB_CONTAINER_NAME = getContainerName(access);

  if (!PUBLIC_BLOB_CONTAINER_NAME) {
    throw Error("Azure Storage Connection string not found");
  }

  // Create the BlobServiceClient object which will be used to create a container client
  const blobClient = getBlobServiceClient()
    .getContainerClient(PUBLIC_BLOB_CONTAINER_NAME)
    .getBlockBlobClient(randomUUID() + "-UUIDv4-" + name);

  try {
    await blobClient.uploadFile(path, {
      blobHTTPHeaders: {
        blobContentType: mimetype,
      },
    });
    return blobClient.url;
  } catch (error) {
    console.error(error);
    throw Error("Failed to upload image.");
  }
};

export const getAzureBlobAccessUrl = async (privateUrl: string) => {
  // Example privateUrl: https://prodlms.blob.core.windows.net/local-staging-private/4075905.jpg

  const url = new URL(privateUrl);
  const containerName = url.pathname.split("/")[1];
  const blobName = decodeURIComponent(url.pathname.split("/")[2]);

  const blobClient = getBlobServiceClient()
    .getContainerClient(containerName)
    .getBlockBlobClient(blobName);

  // Create a SAS token that expires in one hour
  return await blobClient.generateSasUrl({
    permissions: BlobSASPermissions.parse("r"),
    expiresOn: new Date(Date.now() + 60 * 60 * 1000),
  });
};

export const deleteFileFromAzureStorage = async (url: string) => {
  const urlObj = new URL(url);
  const containerName = urlObj.pathname.split("/")[1];
  const blobName = decodeURIComponent(urlObj.pathname.split("/")[2]);

  signale.info("Deleteting blob", blobName);

  const blobClient = getBlobServiceClient()
    .getContainerClient(containerName)
    .getBlockBlobClient(blobName);

  try {
    await blobClient.delete();
  } catch (error) {
    console.error(error);
    throw Error("Failed to delete image.");
  }
};
