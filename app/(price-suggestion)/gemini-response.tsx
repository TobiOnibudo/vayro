import { View, Text } from "react-native";
import { getPriceSuggestion } from "@/api/geminiAPI";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

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
      <View>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text>Suggested Price: {price}</Text>
          <Text>Reason: {reason}</Text>
        </>
      )}
    </View>
  );
}