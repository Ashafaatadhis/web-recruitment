"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProfileAvatar } from "./profile-avatar";
import { ProfileForm } from "./profile-form";
import { ProfileSkeleton } from "./profile-skeleton";

import { useTemporaryImageCleanup } from "@/hooks/use-temporary-image-cleanup";
import { deleteImage } from "@/lib/utils/image-upload";
import { updateUserProfile } from "@/actions/user/update-profile";

import { User } from "@/lib/types/models/user";

type FormValues = {
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  location?: string;
  linkedinProfile?: string;
  portfolioUrl?: string;
};

export function ProfileClient({ user }: { user: User }) {
  const router = useRouter();
  const { data: session, update, status } = useSession();
  const [temporaryImage, setTemporaryImage] = useState<string | null>(null);

  useTemporaryImageCleanup(temporaryImage);

  if (status === "loading") return <ProfileSkeleton />;
  if (!session) {
    router.push("/login");
    return null;
    // Atau tampilkan pesan:
    // return <div>Unauthorized</div>;
  }

  const handleProfileUpdate = async (data: FormValues) => {
    const newImage = temporaryImage;

    setTemporaryImage(null);
    const oldImage = session?.user?.image;

    const result = await updateUserProfile({
      id: session?.user?.id,
      name: data.name,
      image: newImage,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      location: data.location,
      linkedinProfile: data.linkedinProfile,
      portfolioUrl: data.portfolioUrl,
    });

    if (!result.error) {
      await update({ user: { name: data.name, image: newImage } });
      if (oldImage) {
        await deleteImage(oldImage);
      }
    }
  };

  const handleAvatarChange = (url: string) => {
    if (temporaryImage) {
      console.log(temporaryImage, "KRIKK");
      deleteImage(temporaryImage);
    }
    setTemporaryImage(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <ProfileAvatar
          currentImage={user.image || ""}
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
        user={user}
        onSubmit={handleProfileUpdate}
        hasAvatarChanges={!!temporaryImage}
      />
    </div>
  );
}
