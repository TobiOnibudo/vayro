import { GeminiResponseData, getPriceSuggestion } from "@/api/geminiAPI";
import { useState, useEffect } from "react";

type PriceSuggestionState = {
  data: GeminiResponseData | null;
  isLoading: boolean;
  error: string | null;
};

// Custom hook for price suggestion
export function usePriceSuggestion(inputData: string) {
  const [priceSuggestionState, setPriceSuggestionState] = useState<PriceSuggestionState>({
    data: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    async function fetchPriceSuggestion() {
      try {
        const jsonData = JSON.parse(inputData);
        const response = await getPriceSuggestion(jsonData);

        if (!response.success || !response.data) {
          setPriceSuggestionState(prev => ({ 
            ...prev, 
            error: response.error || 'An error occurred',
            isLoading: false
          }));

        } else {
          setPriceSuggestionState({
            data: response.data,
            isLoading: false,
            error: null
          });
        }

      } catch (err) {
        setPriceSuggestionState(prev => ({ 
          ...prev, 
          error: err instanceof Error ? err.message : 'An error occurred',
          isLoading: false
        }));
      }
    }

    fetchPriceSuggestion();
  }, [inputData]);

  return priceSuggestionState;
}