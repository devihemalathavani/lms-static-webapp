import useGetAzureSasUrl from "../hooks/useGetAzureSasUrl";
import { getFileNameFromBlobUrl } from "../lib/strings";

type DownloadFileProps = {
  azureFileUrl: string;
  className?: string;
};

function DownloadFile(props: DownloadFileProps) {
  const query = useGetAzureSasUrl(props.azureFileUrl, true);
  const downloadFile = async () => {
    await query.refetch();
  };

  return (
    <button className={props.className} onClick={downloadFile}>
      {getFileNameFromBlobUrl(props.azureFileUrl)}
    </button>
  );
}

export default DownloadFile;
