import registerUser from "@/actions/auth/register";
import { LoginPayload, RegisterPayload } from "@/lib/types/auth";
import { getAuthErrorMessage } from "@/lib/utils/auth-errors";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // atau react-toastify

export const useAuth = () => {
  const router = useRouter();
  const handleSubmit = async (data: LoginPayload) => {
    const { email, password } = data;

    try {
      const response = await signIn("credentials", {
        redirect: false,
        callbackUrl: "/",
        email,
        password,
      });

      if (response?.error) {
        toast.error(getAuthErrorMessage(response.code));
      } else {
        toast.success("Login successful!");
        router.push("/");
      }
    } catch (error) {
      toast.error(getAuthErrorMessage());
      console.error("Login error:", error);
    }
  };

  const handleGoogleSignIn = async (
    setIsGoogleLoading: (val: boolean) => void
  ) => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google Sign-In error:", error);
      toast.error("Could not initiate Google Sign-In. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const register = async (data: RegisterPayload) => {
    try {
      const res = await registerUser({
        ...data,
        username: data.name,
      });

      if (!res?.status) {
        toast.error(res?.error || "Registration failed");
        return false;
      }

      toast.success(res.message);
      router.push("/login");
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
      console.error(message);
      return false;
    }
  };

  return { handleSubmit, handleGoogleSignIn, register };
};
