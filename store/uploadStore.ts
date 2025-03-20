import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserUpload } from "@/types/userSchema";
import type { Condition, Category } from "@/types/priceSuggestionFormSchema";

const defaultUploadData: UserUpload = {
  title: "",
  price: 0,
  description: "",
  imageUrl: "",
  address: "",
  city: "",
  postal: "",
  latitude: 44.6488,
  longitude: -63.5752,
  type: "",
  condition: "Used",
  category: "Other",
  boughtInYear: 0,
}

type UploadStore = {
  uploadData: UserUpload;
  setUploadData: (data: UserUpload) => void;
  setTitle: (title: string) => void;
  setPrice: (price: number) => void;
  setDescription: (description: string) => void;
  setCondition: (condition: Condition) => void;
  setCategory: (category: Category) => void;
  setBoughtInYear: (year: number) => void;
  setImageUrl: (url: string) => void;
  resetUploadData: () => void;
}

export const useUploadStore = create<UploadStore>()(
  persist(
    (set) => ({
      uploadData: defaultUploadData,
      setUploadData: (data) => set({ uploadData: data }),
      setTitle: (title) => set((state) => ({
        uploadData: { ...state.uploadData, title }
      })),
      setPrice: (price) => set((state) => ({
        uploadData: { ...state.uploadData, price }
      })),
      setDescription: (description) => set((state) => ({
        uploadData: { ...state.uploadData, description }
      })),
      setCondition: (condition) => set((state) => ({
        uploadData: { ...state.uploadData, condition }
      })),
      setCategory: (category) => set((state) => ({
        uploadData: { ...state.uploadData, category }
      })),
      setBoughtInYear: (boughtInYear) => set((state) => ({
        uploadData: { ...state.uploadData, boughtInYear }
      })),
      setImageUrl: (imageUrl) => set((state) => ({
        uploadData: { ...state.uploadData, imageUrl }
      })),
      resetUploadData: () => set({ uploadData: defaultUploadData }),
    }),
    {
      name: 'upload-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 