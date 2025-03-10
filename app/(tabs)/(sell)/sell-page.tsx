import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Button, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import tw from 'twrnc';
import { useRouter } from "expo-router";
import { UserUpload } from '@/types/userSchema';
import { Ionicons, Feather } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import { uploadImageToCloud } from '@/api/imageUploadAPI';
import { useLoadUser } from '@/hooks/useLoadUser';
import { useCamera } from '@/hooks/useCamera';
import { uploadListing } from './functions';
import { LocationArea } from './_components/location-area';
import { ItemArea } from './_components/item-area';
import { SellHeader } from './_components/sell-header';

type SellPageProps = {
  scrollToInput: (y: number) => void;
}

//Notes: when switching screens, need to make sure to turn showCamera false

export function SellPage({ scrollToInput }: SellPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleUpload = async () => {
    await uploadListing(uploadData, setData, setError, setIsLoading);
  }

  const handlePriceSuggestion = async () => {
    await router.push({
      pathname: "./(price-assistant)/price-assistant",
      params: {
        paramsData: JSON.stringify(uploadData)
      }
    });
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
        <SellHeader />

        {/* Expo Camera */}
        <View style={tw`flex-row justify-end`}>
          <TouchableOpacity
            onPress={() => setShowCamera(!showCamera)}
            style={tw`p-2 w-10 bg-[#ACA592] rounded-full mr-4`}>
            <Ionicons name="camera" size={25} color="white" />
          </TouchableOpacity>
        </View>

        <ItemArea
          uploadData={uploadData}
          setData={setData}
          setError={setError}
          setIsLoading={setIsLoading}
          scrollToInput={scrollToInput}
        />

        {/* Location */}
        <LocationArea
          uploadData={uploadData}
          setData={setData}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          scrollToInput={scrollToInput}
        />

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
            onFocus={() => scrollToInput(1000)}>
          </TextInput>
          {/* Ask AI for price suggestion */}
          <View>
            <TouchableOpacity style={tw`flex-row mt-2`} onPress={handlePriceSuggestion}>
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
          <View style={tw`absolute top-8% bottom-10% left-0 right-0 justify-start items-center z-10 bg-white bg-opacity-95 h-50% p-2`}>
            <Image source={{ uri: photo }} style={tw`w-90% h-80% rounded-lg`} />
            <View style={tw`flex-row justify-center mt-4 w-full`}>
              <TouchableOpacity 
                onPress={() => setPhoto(null)} 
                style={tw`p-4 mr-10 bg-red-500 rounded-full shadow-md`}>
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={selectPhoto} 
                style={tw`p-4 bg-green-500 rounded-full shadow-md`}>
                <Ionicons name="checkmark" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  )
}