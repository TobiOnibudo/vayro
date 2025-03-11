import { TouchableOpacity, Text, View } from "react-native";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export function SellHeader() {
  const router = useRouter();

  return (
    <>
      {/* Back Button*/}
      <View style={tw`px-4 pt-2 pb-4 flex-row justify-between`}>
        <TouchableOpacity
          onPress={() => router.push('/')}
          style={[tw`w-13 h-7 bg-[#ACA592] rounded-full flex-row items-center justify-center`, { marginLeft: -10 }]}>
          <Ionicons name="arrow-back" size={18} color="white" />
        </TouchableOpacity>
        {/* Ask Gemini Price Suggestion Button */}
        <TouchableOpacity
          onPress={() => router.push('/(price-suggestion)/request-price')}
          style={tw`p-2 bg-blue-500 rounded-full`}>
          <MaterialIcons name="price-check" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={tw`flex-row justify-between px-4 pt-2`}>
        <Text style={[tw`text-6 pt-3`, { fontWeight: '400' }]}>Sell</Text>
      </View>
    </>
  );
}