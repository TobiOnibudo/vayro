import { View, Text } from "react-native";
import { UserUpload } from '@/types/userSchema';
import { usePriceSuggestion } from "@/hooks/usePriceSuggestion";
import { type FormSchema } from "@/types/priceSuggestionFormSchema";
import { useLocalSearchParams } from "expo-router";
import tw from "twrnc";

export default function PriceAssistant() {
  const { paramsData } = useLocalSearchParams<{ paramsData: string }>();
  console.log("paramsData", paramsData);
  // const userUploadData: UserUpload = JSON.parse(paramsData);
  // const priceSuggestionForm: FormSchema = {
  //   title: userUploadData.title,
  //   description: userUploadData.description,
  //   condition: userUploadData.condition,
  //   category: userUploadData.category,
  //   boughtInYear: userUploadData.boughtInYear
  // }

  //console.log("hererere"+priceSuggestionForm);

  //const { data, isLoading, error } = usePriceSuggestion(JSON.stringify(priceSuggestionForm));

  // if (isLoading) {
  //   return (
  //     <View>
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

  // if (error) {
  //   return (
  //     <View>
  //       <Text>Error: {error}</Text>
  //     </View> 
  //   );
  // }

  return (
    <View style={tw`flex-1 items-center justify-center bg-white`}>
      <Text style={tw`text-2xl font-bold text-black`}>Price Suggestion Assist</Text>
    </View>
  );
} 