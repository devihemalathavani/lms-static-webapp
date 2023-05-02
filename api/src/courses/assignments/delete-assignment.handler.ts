import { RequestHandler } from "express";
import { deleteFileFromAzureStorage } from "../../common/azure-blob-storage";
import { db } from "../../common/db";
import { IdSchema } from "../../common/zod-schemas";

export const deleteAssignmentHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const courseId = IdSchema.parse(req.params.courseId);
    const assignmentId = IdSchema.parse(req.params.assignmentId);

    // Check if user is enrolled in course
    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (!course.enrolledBy.includes(req.user.sub)) {
      return res.status(403).json({
        message: "You are not enrolled in this course",
      });
    }

    // Check if assignment exists
    const assignment = await db.assignment.findUnique({
      where: {
        id: assignmentId,
      },
    });

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    // Check if assignment is submitted by user
    if (assignment.userId !== req.user.sub) {
      return res.status(403).json({
        message: "You are not allowed to delete this assignment",
      });
    }

    // Delete assignment
    await db.assignment.delete({
      where: {
        id: assignmentId,
      },
    });

    // Delete assignment file from azure block blob storage
    await deleteFileFromAzureStorage(assignment.file);

    return res.status(200).json({
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
