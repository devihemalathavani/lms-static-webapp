export const permissions = {
  create_course: {
    value: "create:course",
    description: "Create a course",
  },
  read_my_courses: {
    value: "read:my_courses",
    description: "Read enrolled courses.",
  },
  update_course: {
    value: "update:course",
    description: "Update a course data",
  },
  read_course: {
    value: "read:course",
    description: "Read any course data",
  },
  read_enrolled: {
    value: "read:enrolled",
    description: "Read enrolled users list for any course",
  },
  update_enrolled: {
    value: "update:enrolled",
    description: "Update enrolled users list for any course",
  },
  create_module: {
    value: "create:module",
    description: "Create a module for any course",
  },
  update_module: {
    value: "update:module",
    description: "update a module for any course",
  },
  sync_permissions: {
    value: "sync:permissions",
    description: "Sync permissions with auth0",
  },
};
