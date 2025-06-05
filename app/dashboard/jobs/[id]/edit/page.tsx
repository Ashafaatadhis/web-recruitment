"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useFieldArray } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Editor } from "@/components/blocks/editor-00/editor";
import { SerializedEditorState } from "lexical";
import { toast } from "sonner";
import { getJobById } from "@/app/(landing)/browse-jobs/[id]/action";
import { updateJob } from "./action";

const jobFormSchema = z.object({
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
  jobType: z.string().min(1, { message: "Job type is required" }),
  status: z.enum(["open", "closed", "draft"]),
  questions: z
    .array(
      z.object({ question: z.string().min(1, "Question cannot be empty") })
    )
    .optional(),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

const initialValue = {
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

export default function EditJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const params: { id: string } = useParams();
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      location: "",
      jobType: "full-time",
      status: "draft",
      description: initialValue,
      requirements: initialValue,
      questions: [{ question: "" }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true);
        const jobData = await getJobById(params.id);
        if (!jobData) {
          toast.error("Job not found");
          router.push("/dashboard/jobs");
          return;
        }

        // Set form values from fetched data
        form.reset({
          title: jobData.title,
          description: jobData.description
            ? JSON.parse(jobData.description)
            : initialValue,
          jobType: jobData.jobType || "full-time",
          location: jobData.location || "",
          requirements: jobData.requirements
            ? JSON.parse(jobData.requirements)
            : initialValue,
          status: (jobData.status as "open" | "closed" | "draft") || "draft", // Add type assertion
          questions: jobData.questions || [{ question: "" }],
        });

        // Sync questions with useFieldArray
        if (jobData.questions) {
          replace(jobData.questions);
        }
      } catch (error) {
        console.error("Failed to load job", error);
        toast.error("Failed to load job data");
        router.push("/dashboard/jobs");
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [params.id, form, replace, router]);

  const onSubmit = async (data: JobFormValues) => {
    setIsSubmitting(true);
    try {
      await updateJob(params.id, {
        ...data,
        description: JSON.stringify(data.description || initialValue),
        requirements: JSON.stringify(data.requirements || initialValue),
      });
      toast.success("Job updated successfully!");
      router.push("/dashboard/jobs");
    } catch (err) {
      console.error("Failed to update job", err);
      toast.error("Failed to update job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-6">Loading job data...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Job</h1>
        <p className="text-muted-foreground">Update the job details below.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Frontend Developer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jakarta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requirements</FormLabel>
                    <FormControl>
                      <Editor
                        editorSerializedState={field.value ?? initialValue}
                        onSerializedChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Editor
                        editorSerializedState={field.value ?? initialValue}
                        onSerializedChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Questions Section */}
              <div>
                <label className="block font-semibold mb-2">
                  Application Questions
                </label>
                {fields.map((field, idx) => (
                  <div key={field.id} className="flex items-center gap-2 mb-2">
                    <FormField
                      control={form.control}
                      name={`questions.${idx}.question`}
                      render={({ field }) => (
                        <Input {...field} placeholder={`Question ${idx + 1}`} />
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(idx)}
                      disabled={fields.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => append({ question: "" })}
                  className="mt-2"
                >
                  Add Question
                </Button>
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Job"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
