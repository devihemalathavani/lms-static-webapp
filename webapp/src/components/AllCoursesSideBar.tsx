import { Link } from "@tanstack/react-location";
import { useState } from "react";
import useGetAllCourses from "../hooks/useGetAllCourses";
import { matchSorter } from "match-sorter";
import { CourseNavListItem } from "../types/courses";

const getSearchResults = (data: CourseNavListItem[], query: string) => {
  return matchSorter(data, query, {
    keys: ["title"],
  });
};

function AllCoursesSideBar() {
  const courses = useGetAllCourses();
  const [search, setSearch] = useState<string>("");

  if (!courses.data) {
    return null;
  }

  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <div className="pb-2">
        <input
          type="text"
          name="search"
          onChange={handleSearch}
          id="search"
          placeholder="Search courses"
          className="input input-primary w-full rounded-none focus:outline-none"
        />
      </div>
      {getSearchResults(courses.data, search).map((course) => (
        <div key={course.id} className="flex h-12 items-center border-b px-4">
          <Link
            to={course.id}
            className={course.archived ? "text-gray-400" : ""}
            getActiveProps={() => ({
              className: "text-primary underline",
            })}
          >
            {course.title}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default AllCoursesSideBar;
