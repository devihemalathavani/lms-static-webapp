import { format } from "date-fns";

/**
 * The date-fns format for 17 June 2022, 12:23 AM would be: "YYYY-MM-DDTHH:mm:ss.SSSZ"
 * @param date string
 * @returns string
 */
export function formTimeAndDate(date: string) {
  let dateObject;
  try {
    dateObject = new Date(date);
    return format(dateObject, "PPpp");
  } catch (error) {
    console.log("🚀 ~ file: date.ts:14 ~ formTimeAndDate ~ error", error);
    return null;
  }
}
