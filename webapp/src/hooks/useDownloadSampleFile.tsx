import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosInstance from "../lib/http-client";

const downloadFile = async (endpoint: string) => {
  try {
    const res = await axiosInstance.get(endpoint, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sample-file.csv");
    document.body.appendChild(link);
    link.click();

    return res.data;
  } catch (error) {
    toast("Failed to download sample file, please contact support.");
    console.error(error);
  }
};

function useDownloadSampleFile(url: string) {
  const query = useQuery({
    queryKey: ["downloadSampleFile", url],
    queryFn: () => downloadFile(url),
    enabled: false,
  });
  return query;
}

export default useDownloadSampleFile;
