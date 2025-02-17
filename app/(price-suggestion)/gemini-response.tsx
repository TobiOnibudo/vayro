import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { getPriceSuggestion } from "@/api/geminiAPI";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import tw from "twrnc";

export default function GeminiResponseScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const [price, setPrice] = useState<number| null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPriceSuggestion() {
      try {
        const jsonData = JSON.parse(data);
        const response = await getPriceSuggestion(jsonData);

        if (!response.success || !response.data) {
          setError(response.error || 'An error occurred');
        } else {
          setPrice(response.data.price);
          setReason(response.data.reason);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPriceSuggestion();
  }, [data]);

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
        <View style={tw`gap-6`}>
          <View style={tw`bg-stone-100 rounded-xl p-6`}>
            <Text style={tw`text-lg font-semibold text-gray-900 mb-2`}>
              Suggested Price
            </Text>
            <Text style={tw`text-3xl font-bold text-blue-500`}>
              ${price?.toLocaleString()}
            </Text>
          </View>

          <View style={tw`bg-gray-50 rounded-xl p-6`}>
            <Text style={tw`text-lg font-semibold text-gray-900 mb-2`}>
              Price Analysis
            </Text>
            <Text style={tw`text-base text-gray-700 leading-6`}>
              {reason}
            </Text>
          </View>

          <View style={tw`bg-yellow-50 rounded-xl p-6`}>
            <Text style={tw`text-sm text-gray-600 italic text-center`}>
              This is an AI-generated suggestion based on the information provided. 
              Actual market prices may vary.
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}