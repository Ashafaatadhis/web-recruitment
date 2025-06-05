"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { JobWithQuestions } from "@/lib/types/job";
import { createApplication } from "@/actions/application";

type Props = {
  job: JobWithQuestions;
};

export default function ApplyJobClient({ job }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const answers =
      job.questions?.map((question, index) => ({
        questionId: question.id,
        answer: formData.get(`question-${index}`) as string,
      })) || [];

    startTransition(async () => {
      try {
        await createApplication({
          jobId: job.id,
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {job.questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Application Questions</h3>
          {job.questions.map((question, index) => (
            <div key={index}>
              <label className="block mb-1">{question.question}</label>
              <Textarea name={`question-${index}`} rows={3} required />
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
