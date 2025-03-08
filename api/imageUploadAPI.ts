import axios from "axios";
import * as FileSystem from "expo-file-system";

export const uploadImageToCloud = async (imageUri: string): Promise<string | null> => {
  try {
    // Read the file and convert to base64
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Prepare form data
    const formData = new FormData();
    console.log(process.env.EXPO_PUBLIC_IMAGE_API_URL)
    formData.append("key", String(process.env.EXPO_PUBLIC_IMAGE_API_KEY));
    formData.append("image", base64Image);

    // Make API request
    const response = await axios.post(String(process.env.EXPO_PUBLIC_IMAGE_API_URL), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response)

    // After upload, delete the local file
    // await FileSystem.deleteAsync(imageUri, { idempotent: true });

    // Return the image URL
    return response.data.data.url;
  } catch (error) {
    console.error("Image upload failed:", error);
    return null;
  }
};
