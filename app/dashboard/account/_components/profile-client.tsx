"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProfileAvatar } from "./profile-avatar";
import { ProfileForm } from "./profile-form";
import { ProfileSkeleton } from "./profile-skeleton";

import { useTemporaryImageCleanup } from "@/hooks/use-temporary-image-cleanup";
import { deleteImage } from "@/lib/utils/image-upload";
import { updateUserProfile } from "@/actions/user/update-profile";

export function ProfileClient() {
  const { data: session, update, status } = useSession();
  const [temporaryImage, setTemporaryImage] = useState<string | null>(null);
  const [committedImage, setCommittedImage] = useState<string>(
    session?.user?.image ?? ""
  );
  // Auto-cleanup if user reloads or leaves without saving
  useTemporaryImageCleanup(temporaryImage);

  const handleProfileUpdate = async (name: string) => {
    const newImage = temporaryImage || committedImage;

    const result = await updateUserProfile({
      id: session?.user?.id!,
      name,
      image: newImage,
    });

    if (!result.error) {
      setCommittedImage(newImage); // commit
      deleteImage(committedImage); // delete temp image if exists
      setTemporaryImage(null); // clear temp
      await update({ user: { name, image: newImage } });
    }
  };

  const handleAvatarChange = (url: string) => {
    deleteImage(temporaryImage ?? "");
    setTemporaryImage(url);
  };

  if (status === "loading") return <ProfileSkeleton />;
  if (!session) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <ProfileAvatar
          currentImage={session.user.image || ""}
          onImageChange={handleAvatarChange}
          userName={session.user.name || ""}
        />
        <div>
          <h3 className="font-medium">{session.user.name}</h3>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
          <div className="mt-2">
            <Badge variant="outline">{session.user.role}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Click on the avatar to change your profile picture
          </p>
        </div>
      </div>

      <Separator />

      <ProfileForm
        initialName={session.user.name || ""}
        initialEmail={session.user.email || ""}
        onSubmit={handleProfileUpdate}
        hasAvatarChanges={!!temporaryImage}
      />
    </div>
  );
}
