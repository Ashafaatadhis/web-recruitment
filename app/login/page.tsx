// /app/login/page.tsx

"use client";

import action from "./action";
import z from "zod";

import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "./_components/login-form";

const schema = z.object({
  email: z.string().email("email is invalid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const schemaResult = schema.safeParse({ email, password });

      if (!schemaResult.success) {
        throw new Error(schemaResult.error.errors[0].message);
      }

      const res = await action(schemaResult.data);
      if (res && !res?.status) {
        // toast error
        return;
      }
    } catch (error: any) {
      console.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Inthernals.
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
