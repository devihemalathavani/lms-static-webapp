export type Tabs =
  | "Course Info"
  | "Resources"
  | "Assignments"
  | "Projects"
  | "Enrolled"
  | "Resume"
  | "Modules";

export type CourseListItem = Pick<
  Course,
  "id" | "title" | "description" | "pictrue"
> & {
  liveLink?: string;
};

export interface Course {
  id: number;
  title: string;
  description: string;
  pictrue: string;
  liveLink: string;
  modules: Module[];
  modulesOrder: number[];
  projectFiles: string[];
  resourceFiles: string[];
  archived: boolean;
  assignments: Assignment[];
  resumeFiles: string[];
}

interface Assignment {
  id: number;
  file: string;
}

export interface CourseNavListItem {
  id: number;
  title: string;
  archived: boolean;
}
export interface ModuleNavListItem {
  id: number;
  title: string;
}

export interface Module {
  id: number;
  title: string;
  topics: Topic[];
}

export interface Topic {
  id: number;
  title: string;
  videoLink: string;
}

export interface TopicInput {
  title: string;
  videoLink?: string;
  id: number | string;
}

export interface ModuleInput {
  title: string;
  topics: TopicInput[];
}
