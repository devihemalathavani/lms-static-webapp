import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useRef, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { MdPersonRemove } from "react-icons/md";
import { toast } from "react-toastify";
import { axiosAPIErrorHandler } from "../lib/errors";
import axiosInstance from "../lib/http-client";
import { APIError, EnrolledStudentsPage } from "../types/common";
import { Course } from "../types/courses";

type EnrolledProps = {
  course: Course;
};

function Enrolled(props: EnrolledProps) {
  const emailsInputRef = useRef<HTMLTextAreaElement>(null);
  const [page, setPage] = useState(0);
  const query = useQuery({
    queryKey: ["enrolledStudents", props.course.id, page],
    queryFn: async () => {
      try {
        return (
          await axiosInstance.get<EnrolledStudentsPage>(
            `/courses/${props.course.id}/enrolled`,
            {
              params: {
                page,
              },
            }
          )
        ).data;
      } catch (error) {
        axiosAPIErrorHandler(error);
      }
    },
  });

  const enrollStudentMutation = useMutation({
    mutationKey: ["enrollStudent", props.course.id],
    mutationFn: async () => {
      try {
        const data = await (
          await axiosInstance.put(`/courses/${props.course.id}/enrolled`, {
            emails: emailsInputRef.current?.value,
          })
        ).data;
        return data;
      } catch (error) {
        axiosAPIErrorHandler(error);
      }
    },
    onSuccess: () => {
      query.refetch();
      toast("Users enrolled successfully", {
        type: "success",
      });
      if (emailsInputRef.current) {
        emailsInputRef.current.value = "";
      }
    },
    onError: (error: APIError) => {
      toast(error.message, { type: "error" });
    },
  });

  const handleEnrollStudent = async () => {
    const emails = emailsInputRef.current?.value;
    if (!emails) {
      return;
    }
    enrollStudentMutation.reset();
    await enrollStudentMutation.mutateAsync();
  };

  const removeStudentMutation = useMutation({
    mutationKey: ["removeStudent", props.course.id],
    mutationFn: async (studentId: string) => {
      try {
        await axiosInstance.delete(
          `/courses/${props.course.id}/enrolled/${studentId}`
        );
      } catch (error) {
        axiosAPIErrorHandler(error);
      }
    },
    onSuccess: () => {
      query.refetch();
    },
  });

  const handleRemoveStudent = async (studentId: string) => {
    removeStudentMutation.reset();
    await removeStudentMutation.mutateAsync(studentId);
  };

  if (!query.data) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        {query.isRefetching ? (
          <div className="my-4">
            <span className="mr-4">
              Updating the list to reflect the changes.
            </span>
            <progress className="progress w-56"></progress>
          </div>
        ) : null}

        {query.data.length > 0 ? (
          <div>
            <table className="table-zebra table border">
              <thead>
                <tr>
                  <th className="rounded-none capitalize">Student</th>
                  <th className="rounded-none capitalize">Email</th>
                  <th className="rounded-none capitalize">Unenroll</th>
                </tr>
              </thead>
              <tbody>
                {query.data.users.map((student) => (
                  <tr key={student.id}>
                    <td className="rounded-none">{student.name}</td>
                    <td className="rounded-none">
                      <a
                        className="link link-primary"
                        href={`mailto:${student.email}`}
                      >
                        {student.email}
                      </a>
                    </td>

                    <td className="text-end rounded-none">
                      <button
                        className={clsx("btn btn-error btn-square btn-sm", {
                          loading:
                            removeStudentMutation.isLoading &&
                            student.id === removeStudentMutation.variables,
                        })}
                        onClick={() => handleRemoveStudent(student.id)}
                        disabled={removeStudentMutation.isLoading}
                      >
                        <MdPersonRemove className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="btn-group mt-4">
              {new Array(Math.floor(query.data.total / 10))
                .fill(null)
                .map((_, index) => (
                  <button
                    key={index}
                    className={clsx("btn", {
                      "btn-active": page === index,
                    })}
                    onClick={() => setPage(index)}
                  >
                    {index}
                  </button>
                ))}
            </div>
          </div>
        ) : (
          <div className="alert alert-info rounded-none shadow-lg">
            <div>
              <FaInfoCircle />
              <span>
                No students enrolled in this course. You can enroll students by
                entering their email.
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="">
        {/* Enroll new student */}
        <textarea
          className="textarea textarea-bordered textarea-primary w-full rounded-none"
          rows={5}
          placeholder="Enter student emails separated by comma"
          id="emails"
          ref={emailsInputRef}
          name="emails"
        />
      </div>
      <button
        className={clsx("btn btn-primary", {
          loading: enrollStudentMutation.isLoading || query.isLoading,
        })}
        onClick={handleEnrollStudent}
        disabled={enrollStudentMutation.isLoading || query.isLoading}
      >
        Enroll
      </button>
    </div>
  );
}

export default Enrolled;
