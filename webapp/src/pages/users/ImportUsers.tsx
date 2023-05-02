import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useRef } from "react";
import { toast } from "react-toastify";
import useDownloadSampleFile from "../../hooks/useDownloadSampleFile";
import axiosInstance from "../../lib/http-client";

function ImportUsers() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const downloadSampleFileQuery = useDownloadSampleFile("/users/sample-file");

  const importUsersMutation = useMutation({
    mutationKey: ["import-users"],
    mutationFn: async (data: FormData) => {
      const res = await axiosInstance.post(`/users/import`, data);
      return res.data;
    },
    onSuccess: (data) => {
      toast(`Users imported successfully`, {
        type: "success",
      });
    },
  });

  const importUsers = () => {
    if (fileInputRef.current?.files && fileInputRef.current?.files[0]) {
      const formData = new FormData();
      formData.append("file", fileInputRef.current?.files[0]);
      importUsersMutation.mutate(formData);
    }
  };

  return (
    <>
      <h1 className="my-4 text-center text-2xl capitalize">Import users</h1>
      <div className="mt-4">
        <div className="form-control">
          <label className="label justify-start">
            Upload users file
            <button
              className="link link-primary font-ligh m-0 ml-2 inline p-0 text-sm capitalize"
              onClick={() => downloadSampleFileQuery.refetch()}
            >
              (Download sample file)
            </button>
          </label>
          <input
            type="file"
            ref={fileInputRef}
            className="file-input file-input-bordered file-input-info max-w-md rounded-none capitalize"
          />

          <div className="mt-4">
            <button
              onClick={() => importUsers()}
              type="submit"
              disabled={importUsersMutation.isLoading}
              className={clsx("btn btn-primary capitalize", {
                loading: importUsersMutation.isLoading,
              })}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ImportUsers;
