import { UserUpload } from "@/types/userSchema";
import { Alert, ActivityIndicator, Text, TextInput, View, TouchableOpacity } from "react-native";
import { getCurrentLocation } from "../functions";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

type LocationAreaProps = {
  uploadData: UserUpload;
  setData: (data: UserUpload) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
  scrollToInput: (y: number) => void;
}

export function LocationArea({
  uploadData,
  isLoading,
  setData,
  setIsLoading,
  scrollToInput
}: LocationAreaProps) {

  const getLocation = async () => {
    setIsLoading(true);
    const location = await getCurrentLocation();
    if (location) {
      setData({ ...uploadData, ...location.coords, address: location.address ?? "", postal: location.postal ?? "", city: location.city ?? "" });
    }
    else {
      Alert.alert('Error getting location:', 'Please try again');
    }
    setIsLoading(false);
  }

  return (
    <>
      {/* Adding option to get current location */}
      <View>
        <TouchableOpacity style={tw`flex-row mb-2`} onPress={getLocation}>
          <Ionicons name="paper-plane" size={20} color="black" />
          <Text style={[tw`underline ml-1`, { color: '#3f698d' }]}>Get Current Location</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={tw`flex-col my-8 items-center justify-center gap-2`}>
          <ActivityIndicator
            size="large"
            color="#ACA592"
          />
          <Text style={tw`text-center text-gray-500`}>Getting your location...</Text>
        </View>
      ) : (
        <>
          {/* Address Input */}
          <Text style={tw`text-gray-600 font-medium mb-1 ml-1`}>Street Address</Text>
          <TextInput
            style={tw`w-full shadow-md mb-4 px-4 py-3 bg-white rounded-lg border border-gray-200`}
            placeholder="Address"
            value={uploadData.address}
            onChangeText={(text) =>
              setData({ ...uploadData, address: text })
            }
            placeholderTextColor={tw.color('gray-500')}
            keyboardType="default"
            onFocus={() => scrollToInput(700)}
          />

          {/* City & Postal Form */}
          <View style={tw`flex-row justify-between mb-2`}>
            <Text style={tw`text-gray-600 font-medium ml-1 w-[48%]`}>City</Text>
            <Text style={tw`text-gray-600 font-medium ml-1 w-[48%]`}>Postal Code</Text>
          </View>
          <View
            style={tw`flex-row shadow-md mb-8`}>
            <TextInput
              style={tw`w-[48%] px-4 py-3 mr-3 bg-white rounded-lg border border-gray-200 `}
              placeholder="City"
              value={uploadData.city}
              onChangeText={(text) => setData({ ...uploadData, city: text })}
              placeholderTextColor={tw.color('gray-500')}
              onFocus={() => scrollToInput(800)}
            />
            <TextInput
              style={tw`w-[48%] px-4 py-3 bg-white rounded-lg border border-gray-200`}
              placeholder="Postal"
              value={uploadData.postal}
              onChangeText={(text) => setData({ ...uploadData, postal: text })}
              placeholderTextColor={tw.color('gray-500')}
              onFocus={() => scrollToInput(800)}
            />
          </View>
        </>
      )}
    </>
  )
}