import { useMatch } from "@tanstack/react-location";
import clsx from "clsx";
import { useState } from "react";
import CourseInfo from "../components/CourseInfo";
import Enrolled from "../components/Enrolled";
import ManageProjects from "../components/ManageProjects";
import ManageResources from "../components/ManageResources";
import ManageResume from "../components/ManageResume";
import Modules from "../components/Modules";
import useGetCourse from "../hooks/useGetCourse";
import { getOrderedModules } from "../lib/utils";
import { Tabs } from "../types/courses";

export const CourseTabsList: Tabs[] = [
  "Course Info",
  "Modules",
  "Projects",
  "Resources",
  "Enrolled",
  "Resume",
];

// type ManageCourseProps = {};

function ManageCourse() {
  const [activeTab, setActiveTab] = useState<Tabs>("Course Info");
  const match = useMatch();
  const { data } = useGetCourse(match.params.courseId);

  if (!data) {
    return null;
  }

  let tabContent = null;
  switch (activeTab) {
    case "Course Info":
      tabContent = <CourseInfo course={data} />;
      break;
    case "Modules":
      tabContent = (
        <Modules modules={getOrderedModules(data.modules, data.modulesOrder)} />
      );
      break;
    case "Enrolled":
      tabContent = <Enrolled course={data} />;
      break;
    case "Projects":
      tabContent = <ManageProjects course={data} />;
      break;
    case "Resources":
      tabContent = <ManageResources course={data} />;
      break;
    case "Resume":
      tabContent = <ManageResume course={data} />;
      break;
    default:
      break;
  }

  return (
    <div className="mt-5">
      <div className="tabs">
        {CourseTabsList.map((tab) => (
          <button
            key={tab}
            className={clsx("tab tab-bordered tab-lg pb-0", {
              "tab-active": tab === activeTab,
            })}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-4">{tabContent}</div>
    </div>
  );
}
export default ManageCourse;
