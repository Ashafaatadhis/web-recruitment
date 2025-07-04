"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { jobFormSchema, JobFormValues, initialValue } from "@/schemas/job-form";

import { Editor } from "@/components/blocks/editor-00/editor";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateJob } from "@/actions/job";
import { JobWithRelations } from "@/lib/types/models/job";

export default function EditJobForm({ job }: { job: JobWithRelations }) {
  const router = useRouter();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: job?.title ?? "",
      location: job?.location ?? "",
      jobType: job?.jobType ?? "full-time",
      status: job?.status ?? "draft",
      description: job?.description
        ? JSON.parse(job.description)
        : initialValue,
      requirements: job?.requirements
        ? JSON.parse(job.requirements)
        : initialValue,
      questions:
        job?.questions && job.questions.length > 0
          ? job.questions.map((q) => ({ question: q.question }))
          : [{ question: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const onSubmit = async (data: JobFormValues) => {
    try {
      await updateJob(job.id, {
        ...data,
        description: JSON.stringify(data.description || initialValue),
        requirements: JSON.stringify(data.requirements || initialValue),
      });
      toast.success("Job updated successfully!");
      router.push("/dashboard/jobs");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update job. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-2">Edit Job</h1>
      <p className="text-muted-foreground mb-6">
        Update the job details below.
      </p>

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

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Updating..." : "Update Job"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
