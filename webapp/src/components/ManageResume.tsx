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

type ManageResumeProps = {
  course: Course;
};

function ManageResume(props: ManageResumeProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const match = useMatch();
  const queryClient = useQueryClient();

  const invalidateCourseData = () => {
    // Invalidate course data
    queryClient.invalidateQueries(["getCourse", match.params.courseId]);
  };

  const deleteMutation = useMutation({
    mutationKey: ["delete-resume", props.course.id],
    mutationFn: async (resumeFile: string) => {
      const { data } = await axiosInstance.delete(
        `/courses/${props.course.id}/resumes?resumeFile=${encodeURIComponent(
          resumeFile
        )}`
      );
      return data;
    },
    onSuccess: (data) => {
      invalidateCourseData();
      toast(`Resume deleted successfully`, {
        type: "success",
      });
    },
  });

  const handleDeleteResume = (resumeFile: string) => {
    deleteMutation.reset();
    deleteMutation.mutate(resumeFile);
  };

  const addResumeMutation = useMutation({
    mutationKey: ["add-resume", props.course.id],
    mutationFn: async (data: FormData) => {
      const res = await axiosInstance.post(
        `/courses/${props.course.id}/resumes`,
        data
      );
      return res.data;
    },
    onSuccess: (data) => {
      invalidateCourseData();
      toast(`Resume added successfully`, {
        type: "success",
      });
    },
  });

  const handleAddResume = () => {
    if (fileInputRef.current?.files?.length) {
      const file = fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append("resumeFile", file);
      addResumeMutation.reset();
      addResumeMutation.mutate(formData);

      // Reset file input
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      {props.course.resumeFiles.length > 0 ? (
        <table className="table-zebra table border">
          <thead>
            <tr>
              <th className="rounded-none capitalize">Resume</th>
              <th className="rounded-none capitalize">Delete</th>
            </tr>
          </thead>
          <tbody>
            {props.course.resumeFiles.map((resumeFile) => (
              <tr key={resumeFile}>
                <td>
                  <DownloadFile
                    azureFileUrl={resumeFile}
                    className="link link-primary"
                  />
                </td>
                <td>
                  <button
                    className="btn btn-error btn-square btn-sm"
                    onClick={() => handleDeleteResume(resumeFile)}
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
              No resumes found. You can add resumes by uploading them using the
              form below.
            </span>
          </div>
        </div>
      )}

      <div className="mt-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Upload New Resume</span>
          </label>
          <input
            type="file"
            ref={fileInputRef}
            className="file-input file-input-bordered file-input-info max-w-md rounded-none capitalize"
          />

          <div className="mt-4">
            <button
              onClick={() => handleAddResume()}
              disabled={addResumeMutation.isLoading}
              type="submit"
              className={clsx("btn btn-primary capitalize", {
                loading: addResumeMutation.isLoading,
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

export default ManageResume;
