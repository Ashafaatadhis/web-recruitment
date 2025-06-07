// schemas/job-form.ts
import * as z from "zod";
import { SerializedEditorState } from "lexical";

export const initialValue = {
  root: {
    children: [
      {
        type: "paragraph",
        version: 1,
        children: [
          {
            type: "text",
            version: 1,
            text: "Welcome to Lexical, a powerful new way to build editor.",
            format: 0,
            mode: "normal",
            style: "",
            detail: 0,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

export const jobFormSchema = z.object({
  title: z.string().min(3, { message: "Title is required" }),
  description: z.any().refine(
    (val) => {
      try {
        return JSON.stringify(val).includes('"text":"');
      } catch {
        return false;
      }
    },
    { message: "Description is required" }
  ),
  requirements: z.any(),
  location: z.string().optional(),
  jobType: z.enum(["full-time", "part-time", "contract"], {
    required_error: "Job type is required",
  }),
  status: z.enum(["open", "closed", "draft"]),
  questions: z
    .array(
      z.object({ question: z.string().min(1, "Question cannot be empty") })
    )
    .optional(),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;
