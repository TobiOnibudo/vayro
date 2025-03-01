import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import tw from "twrnc";
import { usePriceSuggestion } from "@/hooks/usePriceSuggestion";
import { ResponseLayout } from "./_components/response-layout";

export default function GeminiResponseScreen() {
  const { paramsData } = useLocalSearchParams<{ paramsData: string }>();
  const { data, isLoading, error } = usePriceSuggestion(paramsData);

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
      style={tw`flex-1 bg-white`}
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
          <ResponseLayout data={data} />
        ))}
    </ScrollView>
  );
}