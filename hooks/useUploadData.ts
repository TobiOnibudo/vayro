import { UserUpload } from "@/types/userSchema";
import { useState } from "react";
import type { Condition, Category } from "@/types/priceSuggestionFormSchema";

const defaultUploadData: UserUpload = {
  title: "",
  price: 0,
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
    setUploadData(prevData => ({
      ...prevData,
      title
    }));
  };

  const setPrice = (price: number) => {
    setUploadData(prevData => ({
      ...prevData,
      price
    }));
  };

  const setDescription = (description: string) => {
    setUploadData(prevData => ({
      ...prevData,
      description
    }));
  };

  const setCondition = (condition: Condition) => {
    setUploadData(prevData => ({
      ...prevData,
      condition
    }));
  };

  const setCategory = (category: Category) => {
    setUploadData(prevData => ({
      ...prevData,
      category
    }));
  };

  const setBoughtInYear = (boughtInYear: number) => {
    setUploadData(prevData => ({
      ...prevData,
      boughtInYear
    }));
  };

  const setImageUrl = (imageUrl: string) => {
    setUploadData(prevData => ({
      ...prevData,
      imageUrl
    }));
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
    setCondition,
    setCategory,
    setBoughtInYear,
    setImageUrl,
    resetUploadData
  };
}