import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Button, ActivityIndicator, Alert, ScrollView, Modal, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import tw from 'twrnc';
import { useRouter } from "expo-router";
import { UserUpload } from '@/types/userSchema';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import { uploadImageToCloud } from '@/api/imageUploadAPI';
import { useLoadUser } from '@/hooks/useLoadUser';
import { useCamera } from '@/hooks/useCamera';
import { getCurrentLocation, uploadListing } from './_functions';
import { Picker } from "@react-native-picker/picker";
import { CONDITIONS_VALUES, CATEGORIES_VALUES } from "@/types/priceSuggestionFormSchema";

const ConditionPickerValues = ["", ...Object.values(CONDITIONS_VALUES)];
const CategoryPickerValues = ["", ...Object.values(CATEGORIES_VALUES)];

type SellPageProps = {
  scrollToInput: (y: number) => void;
}

//Notes: when switching screens, need to make sure to turn showCamera false

export function SellPage({ scrollToInput }: SellPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showConditionPicker, setShowConditionPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const { user, loadUser } = useLoadUser(setIsLoading);

  const {
    facing,
    permission,
    requestPermission,
    showCamera,
    photo,
    cameraRef,
    toggleCameraFacing,
    takePicture,
    setShowCamera,
    setPhoto
  } = useCamera();

  useEffect(() => {
    loadUser();
  }, []);

  const [uploadData, setData] = useState<UserUpload>({
    title: '',
    price: '',
    address: '',
    city: '',
    postal: '',
    description: '',
    imageUrl: '',
    latitude: 44.6488, // Halifax Latitude
    longitude: -63.5752, // Halifax Longitude
    type: '',
    condition: 'Used',
    category: 'Furniture',
    boughtInYear: 0,
  })

  const selectPhoto = async () => {
    if (photo) {
      const imageUrl = await uploadImageToCloud(photo) ?? ""
      setData({ ...uploadData, imageUrl: imageUrl })
    }
    // Set Camera off and set photo to null
    setShowCamera(false);
    setPhoto(null);
  }

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

  const handleUpload = async () => {
    await uploadListing(uploadData, setData, setError, setIsLoading);
  }

  if (!permission) {
    // Loading Camera permissions
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={tw`flex-1 justify-center items-center p-4`}>
        <Text style={tw`text-[#ACA592] text-center mb-4`}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }
  return (
    <ScrollView style={tw`flex-1 bg-gray-100 px-7 mb-20`}>
      <SafeAreaView>
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

          {/* Expo Camera */}
          <TouchableOpacity
            onPress={() => setShowCamera(!showCamera)}
            style={tw`p-2 w-10 bg-[#ACA592] rounded-full`}>
            <Ionicons name="camera" size={25} color="white" />
          </TouchableOpacity>
        </View>

        {/* Title Price Input */}
        <View style={tw`mt-5`}>
          {/* Title Input */}
          <View style={tw`shadow-md mb-8`}>
            <Text style={tw`text-gray-600 font-medium mb-1 ml-1`}>Title</Text>
            <TextInput
              style={tw`w-full px-4 py-3 bg-white rounded-lg border border-gray-200`}
              placeholder="Title"
              value={String(uploadData.title)}
              onChangeText={(text) =>
                setData(prev => ({ ...prev, title: text }))
              }
              placeholderTextColor={tw.color('gray-500')}
              keyboardType="default"
            />
          </View>

          {/* Description */}
          <View style={tw`flex-col mb-7 shadow-md`}>
            <Text style={tw`text-gray-600 font-medium mb-1 ml-1`}>Description</Text>
            <TextInput
              style={tw`w-full h-40 px-3 pb-28 bg-white rounded-lg border border-gray-200`}
              placeholder="Description of item . . ."
              value={uploadData.description}
              onChangeText={(text) =>
                setData(prev => ({ ...prev, description: text }))
              }
              placeholderTextColor={tw.color('gray-500')}
            >
            </TextInput>
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Year Bought</Text>
            <TextInput
              style={tw`w-full p-3 shadow-md rounded-lg bg-white`}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, '');
                setData(prev => ({ ...prev, boughtInYear: numericValue ? parseInt(numericValue) : 0 }));
              }}
              placeholder="Year bought"
              keyboardType="number-pad"
              maxLength={4}
              onFocus={() => scrollToInput(400)}
            />
          </View>

          <View style={tw`mb-8 gap-4`}>
            <View>
              <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Condition</Text>
              <Pressable
                style={tw`w-full p-3 shadow-md rounded-lg bg-white`}
                onPress={() => setShowConditionPicker(true)}
              >
                <Text>{uploadData.condition || 'Select condition'}</Text>
              </Pressable>
              <Modal
                visible={showConditionPicker}
                transparent
                animationType="slide"
              >
                <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
                  <View style={tw`bg-white w-full`}>
                    <View style={tw`flex-row justify-end p-2 border-b border-gray-200`}>
                      <Pressable
                        onPress={() => setShowConditionPicker(false)}
                        style={tw`px-4 py-2`}
                      >
                        <Text style={tw`text-blue-600 font-medium`}>Done</Text>
                      </Pressable>
                    </View>
                    <Picker
                      selectedValue={uploadData.condition}
                      onValueChange={(itemValue) => {
                        setData(prev => ({ ...prev, condition: itemValue }));
                      }}
                    >
                      {ConditionPickerValues.map((condition) => (
                        <Picker.Item
                          key={condition}
                          label={condition.charAt(0).toUpperCase() + condition.slice(1)}
                          value={condition}
                          color="black"
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              </Modal>
            </View>

            <View>
              <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Category</Text>
              <Pressable
                style={tw`w-full p-3 shadow-md rounded-lg bg-white`}
                onPress={() => setShowCategoryPicker(true)}
              >
                <Text>{uploadData.category || 'Select category'}</Text>
              </Pressable>
              <Modal
                visible={showCategoryPicker}
                transparent
                animationType="slide"
              >
                <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
                  <View style={tw`bg-white w-full`}>
                    <View style={tw`flex-row justify-end p-2 border-b border-gray-200`}>
                      <Pressable
                        onPress={() => setShowCategoryPicker(false)}
                        style={tw`px-4 py-2`}
                      >
                        <Text style={tw`text-blue-600 font-medium`}>Done</Text>
                      </Pressable>
                    </View>
                    <Picker
                      selectedValue={uploadData.category}
                      onValueChange={(itemValue) => {
                        setData(prev => ({ ...prev, category: itemValue }));
                      }}
                    >
                      {CategoryPickerValues.map((category) => (
                        <Picker.Item
                          key={category}
                          label={category.charAt(0).toUpperCase() + category.slice(1)}
                          value={category}
                          color="black"
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              </Modal>
            </View>
          </View>

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
                  setData((prev) => ({ ...prev, address: text }))
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
                  onChangeText={(text) => setData((prev: any) => ({ ...prev, city: text }))}
                  placeholderTextColor={tw.color('gray-500')}
                  onFocus={() => scrollToInput(700)}
                />
                <TextInput
                  style={tw`w-[48%] px-4 py-3 bg-white rounded-lg border border-gray-200`}
                  placeholder="Postal"
                  value={uploadData.postal}
                  onChangeText={(text) => setData((prev: any) => ({ ...prev, postal: text }))}
                  placeholderTextColor={tw.color('gray-500')}
                  onFocus={() => scrollToInput(700)}
                />
              </View>
            </>
          )}
        </View>

        {/* Photo Preview */}
        <Text style={tw`text-gray-600 font-medium mb-1 ml-1`}>Photo</Text>
        {uploadData.imageUrl ? (
          <View style={tw`mb-7 items-center`}>
            <View style={tw`w-full h-80 rounded-lg overflow-hidden shadow-md`}>
              <Image
                source={{ uri: uploadData.imageUrl }}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
            </View>
            <TouchableOpacity
              style={tw`mt-2 p-2 bg-red-500 rounded-full`}
              onPress={() => setData({ ...uploadData, imageUrl: '' })}>
              <Ionicons name="trash-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={tw`mb-7 items-center`}>
            <Text style={tw`text-gray-500 mb-2`}>No photo selected</Text>
            <View style={tw`w-full h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center`}>
              <Text style={tw`text-gray-400`}>Tap the camera icon to add a photo</Text>
            </View>
          </View>
        )}

        {/* Price Input */}
        <View style={tw`shadow-md mb-8`}>
          <Text style={tw`text-gray-600 font-medium mb-1 ml-1`}>Price</Text>
          <TextInput
            style={tw`w-full px-4 py-3 bg-white rounded-lg border border-gray-200`}
            placeholder="Price"
            value={String(uploadData.price)}
            onChangeText={(text) => {
              // Only allow numbers and one decimal point
              const regex = /^\d*\.?\d*$/;
              if (text === '' || regex.test(text)) {
                setData(prev => ({ ...prev, price: text }))
              }
            }}
            placeholderTextColor={tw.color('gray-500')}
            keyboardType="decimal-pad"
            onFocus={() => scrollToInput(700)}>
          </TextInput>
          {/* Ask AI for price suggestion */}
          <View>
            <TouchableOpacity style={tw`flex-row mt-2`} onPress={() => router.push('/(price-suggestion)/request-price')}>
              <Feather name="info" size={20} color="black" />
              <Text style={[tw`underline ml-1`, { color: '#3f698d' }]}>Don't know the price? Ask our AI</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upload Button */}
        <View style={tw`items-center`}>
          <TouchableOpacity
            style={tw`h-11 justify-center items-center w-2/4 py-3 px-4 bg-[#ACA592] rounded-lg`}
            onPress={handleUpload}
            activeOpacity={0.8}>
            <Text style={tw`text-white text-center text-4.6`}>Upload</Text>
          </TouchableOpacity>
        </View>

        {showCamera && !photo && (
          <View style={tw`absolute top-10 left-0 right-0 bottom-0 w-100%`}>
            <CameraView style={tw`h-180 w-100%`} facing={facing} ref={cameraRef}>
              <View style={tw`absolute bottom-5 left-14 right-0 flex-row justify-center`}>
                {/* Take Picture */}
                <TouchableOpacity
                  style={tw`p-3 bg-white rounded-full`}
                  onPress={takePicture}>
                  <Ionicons name="camera" size={30} color="black" />
                </TouchableOpacity>

                {/* Flip Camera Facing */}
                <TouchableOpacity
                  style={tw`mt-2 p-3 ml-5 bg-white rounded-full`}
                  onPress={toggleCameraFacing}>
                  <Ionicons name="repeat" size={25} color="black" />
                </TouchableOpacity>
              </View>
            </CameraView>

            {/* Close Camera */}
            <TouchableOpacity
              style={tw`absolute top-5 right-5 p-3 bg-red-500 rounded-full`}
              onPress={() => setShowCamera(false)}>
              <Ionicons name="close" size={25} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Photo Preview and Selection*/}
        {photo && (
          <View style={tw`absolute top-10 left-0 right-0 bottom--10 flex-1 justify-center items-center z-10 bg-gray-100`}>
            <Image source={{ uri: photo }} style={tw`w-full h-40% rounded-lg`} />
            <View style={tw`flex-row justify-between mt-4`}>
              <TouchableOpacity onPress={() => setPhoto(null)} style={tw`p-3 mr-10 bg-gray-400 rounded-full`}>
                <Ionicons name="close" size={25} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={selectPhoto} style={tw`p-3 bg-green-500 rounded-full`}>
                <Ionicons name="checkmark" size={25} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  )
}