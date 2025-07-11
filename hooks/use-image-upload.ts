import { uploadImage } from "@/lib/utils/image-upload";
import { useState } from "react";

export function useImageUpload(onSuccess: (url: string) => void) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File, location: string) => {
    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        setPreviewImage(result);

        const newUrl = await uploadImage(file, location);

        setUploadedImageUrl(newUrl);
        onSuccess(newUrl);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload error:", err);
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  return { previewImage, isUploading, uploadedImageUrl, handleUpload };
}
