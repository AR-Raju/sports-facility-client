export interface ImageBBResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: number;
    height: number;
    size: number;
    time: number;
    expiration: number;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    medium: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export interface UploadResponse {
  url: string;
  display_url: string;
  delete_url: string;
  id: string;
}

export const uploadService = {
  async uploadImage(file: File): Promise<UploadResponse> {
    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data:image/jpeg;base64, prefix
          const base64String = result.split(",")[1];
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const formData = new FormData();
      formData.append("image", base64);
      formData.append("key", process.env.NEXT_PUBLIC_IMAGEBB_API_KEY || "");

      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ImageBBResponse = await response.json();

      if (!data.success) {
        throw new Error("ImageBB upload failed");
      }

      return {
        url: data.data.url,
        display_url: data.data.display_url,
        delete_url: data.data.delete_url,
        id: data.data.id,
      };
    } catch (error) {
      console.error("ImageBB upload error:", error);
      throw new Error("Failed to upload image to ImageBB");
    }
  },

  async deleteImage(deleteUrl: string): Promise<boolean> {
    try {
      const response = await fetch(deleteUrl, {
        method: "GET", // ImageBB uses GET request for deletion via delete_url
      });
      return response.ok;
    } catch (error) {
      console.error("ImageBB delete error:", error);
      return false;
    }
  },

  // Utility function to validate image file
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith("image/")) {
      return { isValid: false, error: "Please select a valid image file" };
    }

    // Check file size (max 32MB for ImageBB)
    const maxSize = 32 * 1024 * 1024; // 32MB
    if (file.size > maxSize) {
      return { isValid: false, error: "Image size must be less than 32MB" };
    }

    // Check supported formats
    const supportedFormats = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
    ];
    if (!supportedFormats.includes(file.type)) {
      return {
        isValid: false,
        error: "Supported formats: JPEG, PNG, GIF, WebP, BMP",
      };
    }

    return { isValid: true };
  },
};
