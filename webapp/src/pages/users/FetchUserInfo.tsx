import { Link } from "@tanstack/react-location";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import clsx from "clsx";
import { useRef, useState } from "react";
import { MdPersonRemove } from "react-icons/md";
import { toast } from "react-toastify";
import { formTimeAndDate } from "../../lib/date";
import { axiosAPIErrorHandler } from "../../lib/errors";
import axiosInstance from "../../lib/http-client";
import { EmailSchema } from "../../lib/zod-schemas";
import { APIError } from "../../types/common";
import { UserInfo } from "../../types/users";

function FetchUserInfo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const userInfoQuery = useQuery({
    queryKey: ["user-info", userEmail],
    queryFn: async () => {
      const res = await axiosInstance.get<UserInfo>("/users/user-info", {
        params: {
          userEmail,
        },
      });
      return res.data;
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast((error.response?.data as APIError).message, {
          type: "error",
        });
      }
    },
    enabled: !!userEmail,
  });

  const fetchUserInformation = () => {
    if (!inputRef.current) {
      return;
    }

    const emailZodResult = EmailSchema.safeParse(inputRef.current.value);

    if (!emailZodResult.success) {
      toast("Please enter valid email.", {
        type: "warning",
      });
      return;
    }

    setUserEmail(emailZodResult.data);
  };

  const unenrollStudentMutation = useMutation({
    mutationKey: ["unenrollStudentMutation"],
    mutationFn: async (params: { studentId: string; courseId: number }) => {
      try {
        await axiosInstance.delete(
          `/courses/${params.courseId}/enrolled/${params.studentId}`
        );
      } catch (error) {
        axiosAPIErrorHandler(error);
      }
    },
    onSuccess: () => {
      userInfoQuery.refetch();
    },
  });

  const handleRemoveStudent = async (courseId: number, studentId: string) => {
    unenrollStudentMutation.reset();
    unenrollStudentMutation.mutate({
      courseId,
      studentId,
    });
  };

  return (
    <div className="mt-16">
      <h1 className="my-4 text-center text-2xl capitalize">
        Find user information
      </h1>
      <div className="mt-4">
        <div>
          <label className="label justify-start">Enter user email</label>
          <input
            type={"email"}
            className="input input-primary w-full rounded-none"
            placeholder="student_name@digital-lync.com"
            ref={inputRef}
          />
          {userInfoQuery.isSuccess ? (
            <div className="mt-4 flex flex-col gap-2">
              <div>
                <b>Name: </b>
                <span>{userInfoQuery.data.name}</span>
              </div>
              <div>
                <b>Last login: </b>
                <span>{formTimeAndDate(userInfoQuery.data.lastLogin)}</span>
              </div>
              <div>
                <b>Email: </b>
                <span>{userInfoQuery.data.email}</span>
              </div>
              <b>Enrolled courses:</b>
            </div>
          ) : null}
          <div className="mt-4 overflow-x-auto">
            {userInfoQuery.data && userInfoQuery.data.courses.length > 0 ? (
              <div>
                <table className="table-zebra table border">
                  <thead>
                    <tr>
                      <th className="rounded-none capitalize">Course</th>
                      <th className="rounded-none capitalize">Unenroll</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userInfoQuery.data.courses.map((course) => (
                      <tr key={course.id}>
                        <td className="rounded-none">
                          <Link
                            className="link link-primary"
                            to={`/admin/courses/${course.id}`}
                          >
                            {course.title}
                          </Link>
                        </td>

                        <td className="text-end rounded-none">
                          <button
                            className={clsx("btn btn-error btn-square btn-sm", {
                              loading:
                                unenrollStudentMutation.isLoading &&
                                course.id ===
                                  unenrollStudentMutation.variables?.courseId,
                            })}
                            onClick={() =>
                              handleRemoveStudent(
                                course.id,
                                userInfoQuery.data.id
                              )
                            }
                            disabled={unenrollStudentMutation.isLoading}
                          >
                            <MdPersonRemove className="text-lg" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : userInfoQuery.isSuccess ? (
              <span>User not enrolled in any course.</span>
            ) : null}
          </div>

          <div className="mt-4">
            <button
              onClick={() => fetchUserInformation()}
              type="submit"
              disabled={!!userEmail && userInfoQuery.isLoading}
              className={clsx("btn btn-primary capitalize", {
                loading: !!userEmail && userInfoQuery.isLoading,
              })}
            >
              Find user
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FetchUserInfo;
