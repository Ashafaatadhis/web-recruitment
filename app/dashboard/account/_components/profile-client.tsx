"use client";

import { useSession } from "next-auth/react";
import { ProfileAvatar } from "./profile-avatar";
import { ProfileForm } from "./profile-form";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { updateUserProfile } from "./action";
import { toast } from "sonner";

export function ProfileClient() {
  const { data: session, update, status } = useSession();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleProfileUpdate = async (name: string) => {
    try {
      if (!session?.user?.id) {
        toast.error("User ID not found");
        return;
      }

      const result = await updateUserProfile({
        id: session?.user?.id,
        name,
        // Use existing image if avatarUrl is null
        image: avatarUrl ?? session.user?.image ?? null,
      });

      setAvatarUrl(null);

      if (result.error) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      await update({
        user: {
          name,
          // Use existing image if avatarUrl is null
          image: avatarUrl || session.user.image,
        },
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleAvatarChange = (url: string) => {
    // Store the new avatar URL temporarily
    setAvatarUrl(url);
  };

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-5 w-16 mt-1" />
          </div>
        </div>
        <Skeleton className="h-px w-full" /> {/* Separator skeleton */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>

          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <ProfileAvatar
          currentImage={session.user?.image || ""}
          onImageChange={handleAvatarChange}
          userName={session.user?.name || ""}
        />

        <div>
          <h3 className="font-medium">{session.user?.name}</h3>
          <p className="text-sm text-muted-foreground">{session.user?.email}</p>
          <div className="mt-2">
            <Badge variant="outline">{session.user?.role}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Click on the avatar to change your profile picture
          </p>
        </div>
      </div>

      <Separator />
      {session?.user?.name}
      <ProfileForm
        initialName={session.user?.name || ""}
        initialEmail={session.user?.email || ""}
        onSubmit={async (name: string) => {
          await handleProfileUpdate(name);
        }}
        hasAvatarChanges={!!avatarUrl}
      />
    </div>
  );
}
