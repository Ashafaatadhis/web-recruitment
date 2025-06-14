"use client";

import { Button } from "@/components/ui/button";
import { JobWithQuestions } from "@/lib/types/job";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Application } from "@/lib/types/models/job";
import Link from "next/link";

type Props = {
  job: JobWithQuestions;
  application: Application;
};

export default function AlreadyApplied({ job, application }: Props) {
  return (
    <div className="container mx-auto py-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Kamu sudah melamar pekerjaan ini
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>
              Posisi:{" "}
              <span className="font-medium text-foreground">{job.title}</span>
            </p>
            <p>
              Tanggal apply:{" "}
              <span className="font-medium text-foreground">
                {new Date(application.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href={`/dashboard/applications/my/${application.id}`}>
              Lihat Lamaran Saya
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
