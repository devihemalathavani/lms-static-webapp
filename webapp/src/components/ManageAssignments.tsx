import { useMatch } from "@tanstack/react-location";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useRef } from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import axiosInstance from "../lib/http-client";
import { Course } from "../types/courses";
import DownloadFile from "./DownloadFile";

type ManageAssignmentsProps = {
  course: Course;
};

function ManageAssignments(props: ManageAssignmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const match = useMatch();
  const queryClient = useQueryClient();

  const invalidateCourseData = () => {
    // Invalidate course data
    queryClient.invalidateQueries(["getCourse", match.params.courseId]);
  };

  const deleteMutation = useMutation({
    mutationKey: ["delete-assignment", props.course.id],
    mutationFn: async (assignmentId: number) => {
      const { data } = await axiosInstance.delete(
        `/courses/${props.course.id}/assignments/${assignmentId}`
      );
      return data;
    },
    onSuccess: (data) => {
      invalidateCourseData();
      toast(`Assignment deleted successfully`, {
        type: "success",
      });
    },
  });

  const handleDeleteAssignments = (assignmentId: number) => {
    deleteMutation.reset();
    deleteMutation.mutate(assignmentId);
  };

  const addAssignmentMutation = useMutation({
    mutationKey: ["add-assignment", props.course.id],
    mutationFn: async (data: FormData) => {
      const res = await axiosInstance.post(
        `/courses/${props.course.id}/assignments`,
        data
      );
      return res.data;
    },
    onSuccess: (data) => {
      invalidateCourseData();
      toast(`Assignment added successfully`, {
        type: "success",
      });
    },
  });

  const handleAddAssignment = () => {
    if (fileInputRef.current?.files?.length) {
      const file = fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append("assignmentFile", file);
      addAssignmentMutation.reset();
      addAssignmentMutation.mutate(formData);

      // Reset file input
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      {props.course.assignments.length > 0 ? (
        <table className="table-zebra table border">
          <thead>
            <tr>
              <th className="rounded-none capitalize">Assignment</th>
              <th className="rounded-none capitalize">Delete</th>
            </tr>
          </thead>
          <tbody>
            {props.course.assignments.map((assignment) => (
              <tr key={assignment.id}>
                <td>
                  <DownloadFile
                    azureFileUrl={assignment.file}
                    className="link link-primary"
                  />
                </td>
                <td>
                  <button
                    className="btn btn-error btn-square btn-sm"
                    onClick={() => handleDeleteAssignments(assignment.id)}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      <div className="mt-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Submit Assignment</span>
          </label>
          <input
            type="file"
            ref={fileInputRef}
            className="file-input file-input-bordered file-input-info max-w-md rounded-none capitalize"
          />

          <div className="mt-4">
            <button
              onClick={() => handleAddAssignment()}
              disabled={addAssignmentMutation.isLoading}
              type="submit"
              className={clsx("btn btn-primary capitalize", {
                loading: addAssignmentMutation.isLoading,
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

export default ManageAssignments;
