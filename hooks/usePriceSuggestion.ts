import { GeminiResponseData, getPriceSuggestion } from "@/api/geminiAPI";
import { useState, useEffect, useRef } from "react";
import { FormSchema } from "@/types/priceSuggestionFormSchema";
import { isEqual } from "lodash";

type PriceSuggestionState = {
  data: GeminiResponseData | null;
  isLoading: boolean;
  error: string | null;
};

// Custom hook for price suggestion
export function usePriceSuggestion(inputData: FormSchema) {
  const [priceSuggestionState, setPriceSuggestionState] = useState<PriceSuggestionState>({
    data: null,
    isLoading: true,
    error: null
  });

  const prevInputDataRef = useRef<FormSchema | null>(null);

  useEffect(() => {
    // Skip if the input data hasn't changed
    if (prevInputDataRef.current && isEqual(prevInputDataRef.current, inputData)) {
      return;
    }

    // Update the ref with the current input data
    prevInputDataRef.current = { ...inputData };

    async function fetchPriceSuggestion() {
      setPriceSuggestionState(prev => ({
        ...prev,
        isLoading: true
      }));

      try {
        const response = await getPriceSuggestion(inputData);

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