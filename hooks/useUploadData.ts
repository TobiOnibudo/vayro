import { UserUpload } from "@/types/userSchema";
import { useState } from "react";

const defaultUploadData: UserUpload = {
  title: "",
  price: "",
  description: "",
  imageUrl: "",
  address: "",
  city: "",
  postal: "",
  latitude: 44.6488, // Halifax Latitude as default
  longitude: -63.5752, // Halifax Longitude as default
  type: "",
  condition: "Used",
  category: "Other",
  boughtInYear: 0,
}

// Create a custom hook that manages the upload data state
export function useUploadData() {
  const [uploadData, setUploadData] = useState<UserUpload>(defaultUploadData);

  const setTitle = (title: string) => {
    setUploadData({ ...uploadData, title });
  };

  const setPrice = (price: string) => {
    setUploadData({ ...uploadData, price });
  };

  const setDescription = (description: string) => {
    setUploadData({ ...uploadData, description });
  };

  const setImageUrl = (imageUrl: string) => {
    setUploadData({ ...uploadData, imageUrl });
  };

  const resetUploadData = () => {
    setUploadData(defaultUploadData);
  };

  return {
    uploadData,
    setUploadData,
    setTitle,
    setPrice,
    setDescription,
    setImageUrl,
    resetUploadData
  };
}