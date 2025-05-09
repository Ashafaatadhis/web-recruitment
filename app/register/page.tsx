// /app/register/page.tsx

"use client";

import action from "./action";
import z from "zod";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("email is invalid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
});

const RegisterPage = () => {
  const { push } = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const name = data.get("name") as string;

    await action({ email, password, name, username: name });

    try {
      const schemaResult = schema.safeParse({ email, password, name });
      if (!schemaResult.success) {
        throw new Error(schemaResult.error.errors[0].message);
      }

      const res = await action({
        ...schemaResult.data,
        username: schemaResult.data.name,
      });
      if (res && !res?.status) {
        // toast error
        return;
      }
      push("/login");
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" type="text" />
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" />
      <button type="submit">Login</button>
    </form>
  );
};

export default RegisterPage;
