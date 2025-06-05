import { useEffect } from "react";
import { deleteImage } from "@/lib/utils/image-upload";

export function useTemporaryImageCleanup(imageUrl: string | null) {
  useEffect(() => {
    const cleanup = async () => {
      if (imageUrl) {
        try {
          await deleteImage(imageUrl);
        } catch (err) {
          console.error("Failed to delete image:", err);
        }
      }
    };

    window.addEventListener("beforeunload", cleanup);
    return () => window.removeEventListener("beforeunload", cleanup);
  }, [imageUrl]);
}
