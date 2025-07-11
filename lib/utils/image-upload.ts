export async function uploadImage(
  file: File,
  location: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("location", location);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const data = await response.json();

  return data.url;
}

export async function deleteImage(url: string) {
  await fetch("/api/upload/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filePath: url }),
  });
}
