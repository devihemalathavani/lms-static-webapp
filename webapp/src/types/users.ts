import { Course } from "./courses";

export interface UserInfo {
  name: string;
  email: string;
  id: string;
  lastLogin: string;
  courses: Pick<Course, "id" | "title">[];
}
