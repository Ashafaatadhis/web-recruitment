import { useState, useEffect } from "react";
import { toast } from "sonner";
import jwt from "jsonwebtoken";
import { useRouter, useSearchParams } from "next/navigation";
import {
  resendVerificationAction,
  verifyTokenAction,
} from "@/actions/auth/verify";

export function useVerifyToken() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  const jwtToken = searchParams?.get("token");

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    setIsLoading(true);
    try {
      if (!jwtToken) {
        toast.error("Missing verification token.");
        setIsLoading(false);
        return;
      }

      const decoded = jwt.decode(jwtToken);
      if (!decoded || typeof decoded === "string") {
        toast.error("Invalid token");
        setIsLoading(false);
        return;
      }

      const result = await resendVerificationAction(decoded.id);

      if (result.status) {
        toast.success("New verification code sent!");
        setCooldown(30);
      } else {
        if (result.cooldown) setCooldown(result.cooldown);
        toast.error(result.error || "Failed to resend code");
      }
    } catch {
      toast.error("Error resending code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!jwtToken) {
        toast.error("Missing verification token.");
        setIsLoading(false);
        return;
      }

      const result = await verifyTokenAction(otp, jwtToken);

      if (result.status) {
        toast.success("Email verified successfully!");
        router.push("/login");
      } else {
        toast.error(result.error || "Verification failed.");
      }
    } catch {
      toast.error("An error occurred during verification.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    otp,
    setOtp,
    isLoading,
    cooldown,
    handleResend,
    handleSubmit,
  };
}
export default useVerifyToken;
