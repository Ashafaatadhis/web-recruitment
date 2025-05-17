"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import jwt from "jsonwebtoken";
import { cn } from "@/lib/utils";
import { resendVerificationAction, verifyTokenAction } from "../action";
import { useEffect, useState, Suspense } from "react";

export default function VerifyToken({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cooldown, setCooldown] = useState(0);

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const jwtToken = searchParams?.get("token");
      if (!jwtToken) {
        toast.error("Missing verification token.");
        return;
      }

      const decoded = jwt.decode(jwtToken);
      if (!decoded || typeof decoded === "string") {
        toast.error("Invalid token");
        return;
      }

      const result = await resendVerificationAction(decoded.id);

      if (result.status) {
        toast.success("New verification code sent!");
        setCooldown(30); // Initialize client-side cooldown
      } else {
        if (result.cooldown) {
          setCooldown(result.cooldown);
        }
        toast.error(result.error || "Failed to resend code");
      }
    } catch (error) {
      toast.error("Error resending code");
    } finally {
      setIsLoading(false);
    }
  };

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const jwtToken = searchParams?.get("token");

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
    } catch (error) {
      toast.error("An error occurred during verification.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Verify Your Email</CardTitle>
            <CardDescription>
              Please enter the verification code sent to your email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="mt-6 w-full">
              <InputOTP maxLength={6} className="w-full" onChange={setOtp}>
                <InputOTPGroup className="flex justify-between w-full">
                  <InputOTPSlot index={0} className="flex-1" />
                  <InputOTPSlot index={1} className="flex-1" />
                  <InputOTPSlot index={2} className="flex-1" />
                  <InputOTPSlot index={3} className="flex-1" />
                  <InputOTPSlot index={4} className="flex-1" />
                  <InputOTPSlot index={5} className="flex-1" />
                </InputOTPGroup>
              </InputOTP>
              <Button
                type="submit"
                className="w-full bg-primary mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Verifying...
                  </div>
                ) : (
                  "Verify"
                )}
              </Button>
            </form>
            <p
              onClick={handleResend}
              className="text-blue-600 text-sm mt-1 text-center hover:underline"
            >
              Resend verification code
            </p>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}
