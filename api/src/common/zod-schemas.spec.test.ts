import { describe, expect, it } from "vitest";
import { ZodSchema } from "zod";
import { EmailSchema, IdSchema } from "./zod-schemas";

const errorSnapshot = Symbol("zod error snapshot");
const valueSnapshot = Symbol("zod value snapshot");

const testCases: Array<[ZodSchema, unknown, unknown, string?]> = [
  [IdSchema, undefined, errorSnapshot, "Should not accept undefined value"],
  [IdSchema, null, errorSnapshot, "Should not accept null value"],
  [IdSchema, "ramesh", errorSnapshot, "Should not accept non number values"],
  [IdSchema, {}, errorSnapshot, "Should not accept non number values"],
  [IdSchema, "43", 43, "Should accept number strings"],
  [IdSchema, 32, 32, "shoulud accept numbers"],
  [EmailSchema, "abc@example.com", "abc@example.com", "should accept emails"],
  [
    EmailSchema,
    "abxample.com",
    errorSnapshot,
    "should not accept emails without @",
  ],
];

describe("Common zod schemas", () => {
  it.each(testCases)("%# %s", (schema, data, result) => {
    if (result === errorSnapshot) {
      expect(() => schema.parse(data)).toThrowErrorMatchingSnapshot();
      return;
    }

    if (result === valueSnapshot) {
      expect(schema.parse(data)).toMatchSnapshot();
      return;
    }

    expect(schema.parse(data)).toEqual(result);
  });
});
