import { useRef } from "react";
import { ScrollView } from "react-native";

/**
 * Scrolls to the input field when the keyboard is open and KeyboardAvoidingView is used
 * @returns scrollToInput: function to scroll to the input field
 * @returns scrollViewRef: ref to the scroll view
 */

export function useScrollToInput() {
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToInput = (y: number) => {
    scrollViewRef.current?.scrollTo({ y: y, animated: true });
  };

  return { scrollToInput, scrollViewRef };
}
