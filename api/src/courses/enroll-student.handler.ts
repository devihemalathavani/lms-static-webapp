import { RequestHandler } from "express";
import { z } from "zod";
import { authzManagementClient } from "../common/authz-client";
import { db } from "../common/db";
import { IdSchema } from "../common/zod-schemas";

export const enrollStudentHandler: RequestHandler = async (req, res, next) => {
  try {
    const courseId = IdSchema.parse(req.params.courseId);

    const emailsSeparatedByComma = z
      .string()
      .min(1)
      .max(10000)
      .parse(req.body.emails);
    // delimiter
    const delimiter = emailsSeparatedByComma.includes(",") ? "," : "\n";

    // Split emails by comma
    const emails = emailsSeparatedByComma.split(delimiter);
    // Trim and convert to lower case
    const emailsTrimmed = emails.map((email) => email.trim().toLowerCase());
    // Remove empty strings
    const emailsFiltered = emailsTrimmed.filter((email) => email.length > 0);
    // Remove duplicates
    const emailsUnique = [...new Set(emailsFiltered)];

    // Validate emails
    const emailSchema = z.string().email();
    for (const email of emailsUnique) {
      emailSchema.parse(email);
    }

    // If no emails, return error
    if (!emailsUnique.length) {
      return res.status(400).json({
        message: "No emails provided",
      });
    }

    // If more than 100 emails, return error
    if (emailsUnique.length > 100) {
      return res.status(400).json({
        message: "Too many emails provided",
      });
    }

    // If course not found, return error
    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        enrolledBy: true,
        title: true,
        description: true,
      },
    });
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    for (const email of emailsUnique) {
      // Find user by email in auth0
      const user = await authzManagementClient.getUsersByEmail(email);

      if (!user.length) {
        // return res.status(404).json({
        //   message: "User not found",
        // });
        continue;
      }

      // If multiple users found, return error
      // if (user.length > 1) {
      //   return res.status(400).json({
      //     message: "Multiple users found with this email",
      //   });
      // }

      if (course?.enrolledBy.includes(user[0].user_id as string)) {
        // return res.status(400).json({
        //   message: "User already enrolled in this course",
        // });
        continue;
      }

      // Add user to course
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          enrolledBy: {
            push: user[0].user_id,
          },
        },
      });

      // Send email to user
      // sendEmail({
      //   to: email,
      //   from: fromEmailAddress,
      //   subject: `You have been enrolled in a course on DigitalLync`,
      //   html: getEmailHtml("student-enrollment", {
      //     courseTitle: course?.title,
      //     courseDescription: course?.description,
      //     courseUrl: `https://learn.konamars.com/${courseId}`,
      //   }),
      // });
    }

    // Return success
    res.json({
      message: "Users enrolled successfully",
    });
  } catch (error) {
    next(error);
  }
};
