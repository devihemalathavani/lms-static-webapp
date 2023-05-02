import { useState } from "react";
import CourseInfo from "./CourseInfo";
import clsx from "clsx";
import Projects from "./Projects";
import Resources from "./Resources";
import { TabsList } from "../lib/constants";
import { Course, Tabs } from "../types/courses";
import Protected from "./Protected";
import ManageAssignments from "./ManageAssignments";
import Resumes from "./Resumes";

type CourseInformationTabsProps = {
  course: Course;
  topicId?: number;
};

function CourseInformationTabs(props: CourseInformationTabsProps) {
  const [activeTab, setActiveTab] = useState<Tabs>("Course Info");

  let tabContent = null;
  switch (activeTab) {
    case "Course Info":
      tabContent = <CourseInfo course={props.course} />;
      break;
    case "Resources": {
      tabContent = <Resources resourceFiles={props.course.resourceFiles} />;
      break;
    }
    case "Resume": {
      tabContent = <Resumes resumeFiles={props.course.resumeFiles} />;
      break;
    }
    case "Assignments": {
      tabContent = <ManageAssignments course={props.course} />;
      break;
    }
    case "Projects":
      tabContent = <Projects projectFiles={props.course.projectFiles} />;
      break;
    default:
      break;
  }

  return (
    <div className="mt-5">
      <div className="tabs">
        {TabsList.map((tab) => (
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
      {activeTab === "Course Info" ? null : (
        <Protected permissions={"update:course"}>
          <div className="p-4">
            {/* <UpdateFiles message="please select files with size below 5mb" /> */}
          </div>
        </Protected>
      )}
    </div>
  );
}
export default CourseInformationTabs;
