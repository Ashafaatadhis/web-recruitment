"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadCloud } from "lucide-react";

import { toast } from "sonner";

interface ProfileAvatarProps {
  currentImage: string;
  onImageChange: (imageUrl: string) => void;
  userName?: string; // Add userName prop
}

export function ProfileAvatar({
  currentImage,
  onImageChange,
  userName = "", // Default to empty string
}: ProfileAvatarProps) {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const [oldImageUrl, setOldImageUrl] = useState(currentImage);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);

    // Create a preview
    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      setPreviewImage(result);

      try {
        // Create FormData and append the file
        const formData = new FormData();
        formData.append("file", file);

        // Use fetch to call the API endpoint for uploading the file
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        // Hapus gambar lama jika ada dan beda dengan yang baru
        if (oldImageUrl && oldImageUrl !== data.url) {
          await fetch("/api/upload/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: oldImageUrl }),
          });
        }

        setUploadedImageUrl(data.url);
        setOldImageUrl(data.url); // update oldImageUrl ke yang baru
        onImageChange(data.url); // Pass the uploaded image URL to the parent
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image:", error);
        setPreviewImage(null); // Reset preview on error
        toast.error("Failed to upload image."); // Show error toast
      } finally {
        setIsUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (uploadedImageUrl) {
        try {
          await fetch("/api/upload/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: uploadedImageUrl }),
          });
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [uploadedImageUrl]);

  return (
    <div className="relative">
      <Avatar
        className="h-20 w-20 cursor-pointer ring-offset-background transition-opacity hover:opacity-80"
        onClick={handleImageClick}
      >
        <AvatarImage src={previewImage || currentImage || ""} alt="Profile" />
        <AvatarFallback>
          {userName ? userName.charAt(0).toUpperCase() : "U"}
        </AvatarFallback>

        {/* Overlay for upload icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity">
          <UploadCloud className="h-8 w-8 text-white" />
        </div>

        {/* Loading spinner when uploading */}
        {isUploadingImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
          </div>
        )}
      </Avatar>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
    </div>
  );
}
