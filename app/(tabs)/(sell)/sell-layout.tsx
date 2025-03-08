import { KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import tw from 'twrnc';
import { useScrollToInput } from '@/hooks/useScrollToInput';
import { SellPage } from './sell-page';

export default function SellScreen() {
  const { scrollToInput, scrollViewRef } = useScrollToInput();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      style={tw`flex-1`}
    >
      <ScrollView
        ref={scrollViewRef}
        style={tw`bg-neutral-100`}
        contentContainerStyle={tw`flex-grow pb-5`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <SellPage scrollToInput={scrollToInput} />
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

