import { Module } from "../types/courses";

export const getOrderedModules = (
  modules: Module[],
  modulesOrder: number[]
) => {
  return modulesOrder
    .map((moduleId) => {
      return modules.find((module) => module.id === moduleId);
    })
    .filter((module) => module !== undefined) as Module[];
};
