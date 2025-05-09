// /app/login/page.tsx

"use client";

import action from "./action";
import z from "zod";

const schema = z.object({
  email: z.string().email("email is invalid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginForm = () => {
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
    <form onSubmit={handleSubmit} className=" flex flex-col gap-3">
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" />
      <button type="submit" className="w-full">
        <span>Login</span>
      </button>
    </form>
  );
};

export default LoginForm;
