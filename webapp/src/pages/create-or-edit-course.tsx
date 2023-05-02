import { useMatch, useNavigate } from "@tanstack/react-location";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import clsx from "clsx";
import { toast } from "react-toastify";
import useGetCourse from "../hooks/useGetCourse";
import axiosInstance from "../lib/http-client";
import { Course } from "../types/courses";

function CreateOrEditCourse() {
  const match = useMatch();
  const { courseId } = match.params;
  const { data } = useGetCourse(match.params.courseId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationKey: ["createCourse"],
    mutationFn: async (data: FormData) => {
      try {
        const res = await axiosInstance[courseId ? "put" : "post"]<Course>(
          courseId ? `/courses/${courseId}` : "/courses",
          data
        );
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return Promise.reject(error.response?.data);
        }
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["getAllCourses"]);
      toast("Course created successfully", {
        type: "success",
      });

      navigate({
        to: courseId ? "/admin/courses/" + courseId : `../${data?.id}`,
      });

      return;
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    mutation.mutate(formData);
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="pb-4 text-xl">
        {courseId ? "Update Course" : "Create Course "}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-y-4">
          <label htmlFor="title" className="flex flex-col">
            Title
            <input
              type="text"
              id="title"
              required
              name="title"
              defaultValue={data?.title}
              placeholder="Title"
              className="input input-primary rounded-none"
            />
          </label>

          <label htmlFor="description" className="flex flex-col">
            Description
            <textarea
              id="description"
              name="description"
              defaultValue={data?.description}
              required
              placeholder="Description"
              rows={10}
              className="textarea textarea-primary rounded-none"
            />
          </label>

          <label htmlFor="pictrue" className="flex flex-col">
            {courseId ? "New Pictrue" : "Pictrue"}
            <input
              type="file"
              name="pictrue"
              id="pictrue"
              required={!courseId}
              className="file-input capitalize"
              accept="image/png, image/jpeg"
            />
          </label>

          <div>
            <span>Current picture</span>
            {data?.pictrue ? <img src={data.pictrue} alt={data.title} /> : null}
          </div>

          <button
            type="submit"
            className={clsx("btn btn-primary", {
              loading: mutation.isLoading,
            })}
            disabled={mutation.isLoading}
          >
            {courseId ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateOrEditCourse;
