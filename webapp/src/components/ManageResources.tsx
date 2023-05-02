import { useMatch } from "@tanstack/react-location";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useRef } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import axiosInstance from "../lib/http-client";
import { Course } from "../types/courses";
import DownloadFile from "./DownloadFile";

type ManageResourcesProps = {
  course: Course;
};

function ManageResources(props: ManageResourcesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const match = useMatch();
  const queryClient = useQueryClient();

  const invalidateCourseData = () => {
    // Invalidate course data
    queryClient.invalidateQueries(["getCourse", match.params.courseId]);
  };

  const deleteMutation = useMutation({
    mutationKey: ["delete-resource", props.course.id],
    mutationFn: async (resourceFile: string) => {
      const { data } = await axiosInstance.delete(
        `/courses/${
          props.course.id
        }/resources?resourceFile=${encodeURIComponent(resourceFile)}`
      );
      return data;
    },
    onSuccess: (data) => {
      invalidateCourseData();
      toast(`Resource deleted successfully`, {
        type: "success",
      });
    },
  });

  const handleDeleteResources = (resourceFile: string) => {
    deleteMutation.reset();
    deleteMutation.mutate(resourceFile);
  };

  const addResourceMutation = useMutation({
    mutationKey: ["add-resource", props.course.id],
    mutationFn: async (data: FormData) => {
      const res = await axiosInstance.post(
        `/courses/${props.course.id}/resources`,
        data
      );
      return res.data;
    },
    onSuccess: (data) => {
      invalidateCourseData();
      toast(`Resource added successfully`, {
        type: "success",
      });
    },
  });

  const handleAddResource = () => {
    if (fileInputRef.current?.files?.length) {
      const file = fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append("resourceFile", file);
      addResourceMutation.reset();
      addResourceMutation.mutate(formData);

      // Reset file input
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      {props.course.resourceFiles.length > 0 ? (
        <table className="table-zebra table border">
          <thead>
            <tr>
              <th className="rounded-none capitalize">Resource</th>
              <th className="rounded-none capitalize">Delete</th>
            </tr>
          </thead>
          <tbody>
            {props.course.resourceFiles.map((resourceFile) => (
              <tr key={resourceFile}>
                <td>
                  <DownloadFile
                    azureFileUrl={resourceFile}
                    className="link link-primary"
                  />
                </td>
                <td>
                  <button
                    className="btn btn-error btn-square btn-sm"
                    onClick={() => handleDeleteResources(resourceFile)}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info rounded-none shadow-lg">
          <div>
            <FaInfoCircle />
            <span>
              No resources found. You can add resources by uploading them using
              the form below.
            </span>
          </div>
        </div>
      )}

      <div className="mt-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Upload New Resource</span>
          </label>
          <input
            type="file"
            ref={fileInputRef}
            className="file-input file-input-bordered file-input-info max-w-md rounded-none capitalize"
          />

          <div className="mt-4">
            <button
              onClick={() => handleAddResource()}
              disabled={addResourceMutation.isLoading}
              type="submit"
              className={clsx("btn btn-primary capitalize", {
                loading: addResourceMutation.isLoading,
              })}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageResources;
