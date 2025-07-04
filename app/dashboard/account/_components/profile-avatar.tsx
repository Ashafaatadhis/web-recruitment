"use client";

import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useImageUpload } from "@/hooks/use-image-upload";

import { useTemporaryImageCleanup } from "@/hooks/use-temporary-image-cleanup";

interface ProfileAvatarProps {
  currentImage: string;
  onImageChange: (url: string) => void;
  userName?: string;
}

export function ProfileAvatar({
  currentImage,
  onImageChange,
  userName = "",
}: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [oldImageUrl, setOldImageUrl] = useState(currentImage);

  const { previewImage, isUploading, uploadedImageUrl, handleUpload } =
    useImageUpload((url) => {
      setOldImageUrl(url);
      onImageChange(url);
      toast.success("Image uploaded successfully!");
    });

  const handleImageClick = () => fileInputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleUpload(file, oldImageUrl);
  };

  useTemporaryImageCleanup(uploadedImageUrl);

  return (
    <div className="relative">
      <Avatar
        className="h-20 w-20 cursor-pointer hover:opacity-80"
        onClick={handleImageClick}
      >
        <AvatarImage src={previewImage || currentImage || ""} />
        <AvatarFallback>
          {userName.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity">
          <UploadCloud className="h-8 w-8 text-white" />
        </div>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
            <span className="h-8 w-8 animate-spin border-4 border-white border-t-transparent rounded-full" />
          </div>
        )}
      </Avatar>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />
    </div>
  );
}
