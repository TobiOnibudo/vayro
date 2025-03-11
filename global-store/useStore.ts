import { create } from 'zustand';

type PriceState = {
  suggestedPrice: number | null;
  priceRange: number[] | null;
  confidence: number | null;
  reason: string[] | string | null;
  recommendedDescription: string | null;
  
  // Actions
  setSuggestedPrice: (price: number) => void;
  setPriceRange: (range: number[]) => void;
  setConfidence: (confidence: number) => void;
  setReason: (reason: string[] | string) => void;
  setPriceData: (data: {
    suggestedPrice: number;
    priceRange: number[];
    confidence: number;
    reason: string[] | string;
  }) => void;
  resetPriceData: () => void;
  setRecommendedDescription: (description: string) => void;
}

export const useStore = create<PriceState>((set) => ({
  suggestedPrice: null,
  priceRange: null,
  confidence: null,
  reason: null,
  recommendedDescription: null,
  
  // Action implementations
  setSuggestedPrice: (price) => set({ suggestedPrice: price }),
  setPriceRange: (range) => set({ priceRange: range }),
  setConfidence: (confidence) => set({ confidence: confidence }),
  setReason: (reason) => set({ reason: reason }),
  setRecommendedDescription: (recommendedDescription) => set({ recommendedDescription: recommendedDescription }),
  // Set all price data at once
  setPriceData: (data) => set({
    suggestedPrice: data.suggestedPrice,
    priceRange: data.priceRange,
    confidence: data.confidence,
    reason: data.reason,
  }),
  
  // Reset all price data
  resetPriceData: () => set({
    suggestedPrice: null,
    priceRange: null,
    confidence: null,
    reason: null,
    recommendedDescription: null,
  }),
}));
