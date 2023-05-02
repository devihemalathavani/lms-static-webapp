import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/http-client";

function useGetAzureSasUrl(azureFileUrl: string, download = false) {
  return useQuery({
    queryKey: ["getAzureSasUrl", azureFileUrl],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/utility-api/get-az-blob-access-url?azureFileUrl=${encodeURIComponent(
          azureFileUrl
        )}`
      );
      return response.data;
    },
    enabled: !!azureFileUrl && !download,
    onSuccess: (url) => {
      if (download) {
        // Download the file
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.download = "file";
        link.click();
      }
    },
  });
}

export default useGetAzureSasUrl;
