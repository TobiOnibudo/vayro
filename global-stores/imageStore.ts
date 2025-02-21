import { create } from 'zustand'
import { ImagePickerAsset } from 'expo-image-picker'

type ImageStore = {
  imageAsset: ImagePickerAsset | null
  setImageAsset: (asset: ImagePickerAsset | null) => void
}

export const useImageStore = create<ImageStore>((set) => ({
  imageAsset: null,
  setImageAsset: (asset) => set({ imageAsset: asset }),
}))