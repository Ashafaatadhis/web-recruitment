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

import { cn } from "@/lib/utils";

import { Suspense } from "react";
import LoadingFallback from "@/components/loading-fallback";
import useVerifyToken from "@/hooks/use-verify-token";

export default function VerifyToken({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { setOtp, isLoading, handleResend, handleSubmit } = useVerifyToken();

  return (
    <Suspense fallback={<LoadingFallback />}>
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
