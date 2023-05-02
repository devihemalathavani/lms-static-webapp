export interface EnrolledStudentsPage {
  start: number;
  limit: number;
  length: number;
  users: Student[];
  total: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
}
