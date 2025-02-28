import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { getPriceSuggestion } from "@/api/geminiAPI";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import tw from "twrnc";

export default function GeminiResponseScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const [price, setPrice] = useState<number| null>(null);
  const [reason, setReason] = useState<string[] | null>(null);
  const [recommendedDescription, setRecommendedDescription] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<number[] | null>(null);
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
          setPrice(response.data.suggestedPrice);
          setReason(response.data.reason);
          setRecommendedDescription(response.data.recommendedDescription);
          setConfidence(response.data.confidence);
          setPriceRange(response.data.priceRange);
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
            {priceRange && (
              <View style={tw`mt-4`}>
                <Text style={tw`text-sm text-gray-600 mb-2`}>
                  Suggested Price Range
                </Text>
                <View style={tw`relative h-12`}>
                  {/* Price range bar background */}
                  <View style={tw`h-2 bg-gray-200 rounded-full w-full absolute top-3`} />
                  
                  {/* Colored track between pins */}
                  <View style={tw`h-2 bg-blue-300 rounded-full w-full absolute top-3`} />
                  
                  {/* Min price vertical bar */}
                  <View style={tw`absolute left-0 top-0`}>
                    <View style={tw`h-8 w-1.5 bg-blue-500 rounded-full`} />
                  </View>
                  
                  {/* Max price vertical bar */}
                  <View style={tw`absolute right-0 top-0`}>
                    <View style={tw`h-8 w-1.5 bg-blue-500 rounded-full`} />
                  </View>
                  
                  {/* Price labels - positioned independently */}
                  <View style={tw`absolute left-0 top-9 w-20 items-start`} pointerEvents="none">
                    <Text style={tw`text-xs text-gray-600 mt-1`}>
                      ${priceRange[0].toLocaleString()}
                    </Text>
                  </View>
                  
                  <View style={tw`absolute right-0 top-9 w-20 items-end`} pointerEvents="none">
                    <Text style={tw`text-xs text-gray-600 mt-1`}>
                      ${priceRange[1].toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            {confidence && (
              <View style={tw`mt-6`}>
                <View style={tw`flex-row items-center mb-2`}>
                  <Text style={tw`text-sm text-gray-600`}>
                    Confidence Level: 
                  </Text>
                  <Text style={tw`text-base font-bold ml-1 text-gray-800`}>
                    {(confidence * 100).toFixed(0)}%
                  </Text>
                </View>
                <View style={tw`relative h-4`}>
                  {/* Confidence bar background */}
                  <View style={tw`h-2 bg-gray-200 rounded-full w-full`} />
                  
                  {/* Confidence level fill */}
                  <View 
                    style={[
                      tw`h-2 rounded-full absolute top-0 left-0`,
                      { 
                        width: `${confidence * 100}%`,
                        backgroundColor: confidence < 0.4 
                          ? '#ef4444' // red-500 for low confidence
                          : confidence < 0.7 
                            ? '#f59e0b' // amber-500 for medium confidence
                            : '#22c55e' // green-500 for high confidence
                      }
                    ]} 
                  />
                </View>
              </View>
            )}
          </View>

          {recommendedDescription && (
            <View style={tw`bg-green-50 rounded-xl p-6`}>
              <Text style={tw`text-lg font-semibold text-gray-900 mb-2`}>
                Recommended Description
              </Text>
              <Text style={tw`text-base text-gray-700 leading-6`}>
                {recommendedDescription}
              </Text>
            </View>
          )}

          <View style={tw`bg-gray-50 rounded-xl p-6`}>
            <Text style={tw`text-lg font-semibold text-gray-900 mb-2`}>
              Price Analysis
            </Text>
            {Array.isArray(reason) ? (
              <View style={tw`gap-2`}>
                {reason.map((point, index) => (
                  <View key={index} style={tw`flex-row`}>
                    <Text style={tw`text-gray-700 mr-2`}>•</Text>
                    <Text style={tw`text-base text-gray-700 flex-1`}>
                      {point}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={tw`text-base text-gray-700 leading-6`}>
                {reason}
              </Text>
            )}
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