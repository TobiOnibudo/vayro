import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { GeminiResponseData } from "@/api/geminiAPI";
import { useStore } from "@/global-store/useStore";
import { router } from "expo-router";

export function ResponseLayout({ data }: { data: GeminiResponseData }) {
  const {
    setRecommendedDescription,
    setSuggestedPrice
  } = useStore();

  function addToSellPage() {
    setRecommendedDescription(data.recommendedDescription);
    setSuggestedPrice(data.suggestedPrice);

    router.push({
      pathname: "/(tabs)/(sell)/sell-wrapper",
    });
  }

  return (
    <View style={tw`gap-6 mb-20`}>
      <View style={tw`bg-stone-100 rounded-xl p-6`}>
        <Text style={tw`text-lg font-semibold text-gray-900 mb-2`}>
          Suggested Price
        </Text>
        <Text style={tw`text-3xl font-bold text-blue-500`}>
          ${data.suggestedPrice.toLocaleString()}
        </Text>
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
                ${data.priceRange[0].toLocaleString()}
              </Text>
            </View>

            <View style={tw`absolute right-0 top-9 w-20 items-end`} pointerEvents="none">
              <Text style={tw`text-xs text-gray-600 mt-1`}>
                ${data.priceRange[1].toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
        <View style={tw`mt-6`}>
          <View style={tw`flex-row items-center mb-2`}>
            <Text style={tw`text-sm text-gray-600`}>
              Confidence Level:
            </Text>
            <Text style={tw`text-base font-bold ml-1 text-gray-800`}>
              {(data.confidence * 100).toFixed(0)}%
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
                  width: `${data.confidence * 100}%`,
                  backgroundColor: data.confidence < 0.4
                    ? '#ef4444' // red-500 for low confidence
                    : data.confidence < 0.7
                      ? '#f59e0b' // amber-500 for medium confidence
                      : '#22c55e' // green-500 for high confidence
                }
              ]}
            />
          </View>
        </View>
      </View>

      <View style={tw`bg-green-50 rounded-xl p-6`}>
        <Text style={tw`text-lg font-semibold text-gray-900 mb-2`}>
          Recommended Description
        </Text>
        <Text style={tw`text-base text-gray-700 leading-6`}>
          {data.recommendedDescription}
        </Text>
      </View>

      <View style={tw`bg-gray-50 rounded-xl p-6`}>
        <Text style={tw`text-lg font-semibold text-gray-900 mb-2`}>
          Price Analysis
        </Text>
        {Array.isArray(data.reason) ? (
          <View style={tw`gap-2`}>
            {data.reason.map((point, index) => (
              <View key={index} style={tw`flex-row`}>
                <Text style={tw`text-gray-700 mr-2`}>•</Text>
                <Text style={tw`text-base text-gray-700 flex-1`}>
                  {point}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          // Fallback for when reason is not an array
          <Text style={tw`text-base text-gray-700 leading-6`}>
            {data.reason}
          </Text>
        )}
      </View>


      <TouchableOpacity style={tw`bg-blue-500 rounded-xl p-4`} onPress={addToSellPage}>
        <Text style={tw`text-white text-center`}>
          Add to Sell Page
        </Text>
      </TouchableOpacity>


      <View style={tw`bg-yellow-50 rounded-xl p-6`}>
        <Text style={tw`text-sm text-gray-600 italic text-center`}>
          This is an AI-generated suggestion based on the information provided.
          Actual market prices may vary.
        </Text>
      </View>
    </View>
  );
}