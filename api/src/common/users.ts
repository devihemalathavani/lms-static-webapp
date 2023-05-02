import { authzManagementClient } from "./authz-client";

// Get id of 'student' role
export const getStudentRoleId = async () => {
  const roles = await authzManagementClient.getRoles();
  const studentRole = roles.find((role) => role.name === "student");
  return studentRole?.id;
};

