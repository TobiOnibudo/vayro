import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { UserUpload } from '@/types/userSchema';
import { usePriceSuggestion } from "@/hooks/usePriceSuggestion";
import { type FormSchema } from "@/types/priceSuggestionFormSchema";
import { useLocalSearchParams } from "expo-router";
import tw from "twrnc";
import { AssistantResponse } from "./assistant-respone";

export default function PriceAssistant() {
  const { paramsData } = useLocalSearchParams<{ paramsData: string }>();

  const userUploadData: UserUpload = JSON.parse(paramsData);
  const priceSuggestionForm: FormSchema = {
    title: userUploadData.title,
    description: userUploadData.description,
    condition: userUploadData.condition,
    category: userUploadData.category,
    boughtInYear: userUploadData.boughtInYear
  }

  const { data, isLoading, error } = usePriceSuggestion(JSON.stringify(priceSuggestionForm));

  if (error) {
    return (
      <View style={tw`flex-1 items-center justify-center p-4 bg-red-50`}>
        <Text style={tw`text-red-600 text-lg font-semibold text-center`}>
          Error: {error}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={tw`flex-1 mb-20 bg-white`}
      contentContainerStyle={tw`p-4`}
    >
      {isLoading ? (
        <View style={tw`flex-1 items-center justify-center min-h-[300px]`}>
          <ActivityIndicator size="large" color="#ACA592" />
          <Text style={tw`mt-4 text-gray-600 text-base`}>
            Analyzing your item...
          </Text>
        </View>
      ) : (
        data && (
          <AssistantResponse data={data} />
        ))}
    </ScrollView>
  );
} 