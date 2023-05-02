import { z } from "zod";

export const EmailSchema = z
  .string()
  .email()
  .trim()
  .transform((v) => v.toLowerCase());
