"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { JobWithQuestions } from "@/lib/types/job";
import { createApplication } from "@/actions/application";

type Props = {
  job: JobWithQuestions;
};

type FormValues = {
  resumeUrl: string;
  coverLetter: string;
  [key: `question-${number}`]: string;
};

export default function ApplyJobClient({ job }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    const answers =
      job.questions?.map((question, index) => ({
        questionId: question.id,
        answer: data[`question-${index}`],
      })) || [];

    startTransition(async () => {
      try {
        await createApplication({
          jobId: job.id,
          resumeUrl: data.resumeUrl,
          coverLetter: data.coverLetter,
          answers,
        });
        toast.success("Lamaran berhasil dikirim!");
        router.push("/dashboard/applications/my");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Gagal mengirim lamaran"
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Resume URL */}
      <div className="space-y-1">
        <Label htmlFor="resumeUrl">Resume URL</Label>
        <Input
          id="resumeUrl"
          type="url"
          {...register("resumeUrl", { required: "Wajib diisi" })}
        />
        {errors.resumeUrl && (
          <p className="text-sm text-red-500">{errors.resumeUrl.message}</p>
        )}
      </div>

      {/* Cover Letter */}
      <div className="space-y-1">
        <Label htmlFor="coverLetter">Cover Letter</Label>
        <Textarea
          id="coverLetter"
          rows={4}
          {...register("coverLetter", { required: "Wajib diisi" })}
        />
        {errors.coverLetter && (
          <p className="text-sm text-red-500">{errors.coverLetter.message}</p>
        )}
      </div>

      {/* Dynamic Questions */}
      {job.questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Application Questions</h3>
          {job.questions.map((question, index) => (
            <div key={index} className="space-y-1">
              <Label htmlFor={`question-${index}`}>{question.question}</Label>
              <Textarea
                id={`question-${index}`}
                rows={3}
                {...register(`question-${index}`, { required: "Wajib diisi" })}
              />
              {errors[`question-${index}`] && (
                <p className="text-sm text-red-500">
                  {errors[`question-${index}`]?.message}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Mengirim..." : "Submit Application"}
      </Button>
    </form>
  );
}
