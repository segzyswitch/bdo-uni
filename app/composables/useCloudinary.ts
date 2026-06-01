export const useCloudinary = () => {
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      // Ensure environment variables are defined
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

      const formData = new FormData();
      formData.append("file", file)
      formData.append("upload_preset", uploadPreset)

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData
        }
      )

      if (!res.ok) throw new Error("Upload failed")

      const data = await res.json()
      return data.secure_url as string
    } catch (err) {
      console.error("Cloudinary upload error:", err)
      return null
    }
  }

  return { uploadImage }
}
