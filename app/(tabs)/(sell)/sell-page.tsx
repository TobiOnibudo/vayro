import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Button, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import tw from 'twrnc';
import { useRouter } from "expo-router";
import { UserUpload } from '@/types/userSchema';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import { uploadImageToCloud } from '@/api/imageUploadAPI';
import { useLoadUser } from '@/hooks/useLoadUser';
import { useCamera } from '@/hooks/useCamera';
import { getCurrentLocation, uploadListing } from './_functions';
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
          {['Title', 'Price'].map((field, index) => (
            <View style={tw`shadow-md mb-8`} key={index}>
              <TextInput
                style={tw`w-full px-4 py-3 bg-white rounded-lg border border-gray-200`}
                placeholder={field}
                value={String(uploadData[field.toLowerCase() as keyof UserUpload])}
                onChangeText={(text) =>
                  setData(prev => ({ ...prev, [field.toLowerCase()]: text }))
                }
                secureTextEntry={field === 'Password'}
                placeholderTextColor={tw.color('gray-500')}
                keyboardType={field === 'Email' ? 'email-address' : (field === 'Phone' ? 'phone-pad' : 'default')}
              />
            </View>
          ))}

          {/* Adding option to get current location */}
          <View>
            <TouchableOpacity style={tw`flex-row`} onPress={getLocation}>
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
              <TextInput
                style={tw`w-full shadow-md mb-8 px-4 py-3 bg-white rounded-lg border border-gray-200`}
                placeholder="Address"
                value={uploadData.address}
                onChangeText={(text) =>
                  setData((prev) => ({ ...prev, address: text }))
                }
                placeholderTextColor={tw.color('gray-500')}
                keyboardType="default"
                onFocus={() => scrollToInput(100)}
              />

              {/* City & Postal Form */}
              <View
                style={tw`flex-row shadow-md mb-8`}>
                <TextInput
                  style={tw`w-[48%] px-4 py-3 mr-3 bg-white rounded-lg border border-gray-200 `}
                  placeholder="City"
                  value={uploadData.city}
                  onChangeText={(text) => setData((prev: any) => ({ ...prev, city: text }))}
                  placeholderTextColor={tw.color('gray-500')}
                  onFocus={() => scrollToInput(200)}
                />
                <TextInput
                  style={tw`w-[48%] px-4 py-3 bg-white rounded-lg border border-gray-200`}
                  placeholder="Postal"
                  value={uploadData.postal}
                  onChangeText={(text) => setData((prev: any) => ({ ...prev, postal: text }))}
                  placeholderTextColor={tw.color('gray-500')}
                  onFocus={() => scrollToInput(200)}
                />
              </View>
            </>
          )}
        </View>

        {/* Description */}
        <View style={tw`flex-col mb-7 shadow-md`}>
          <TextInput
            style={tw`w-full h-40 px-3 pb-28 bg-white rounded-lg border border-gray-200`}
            placeholder="Description of item . . ."
            value={uploadData.description}
            onChangeText={(text) =>
              setData(prev => ({ ...prev, description: text }))
            }
            placeholderTextColor={tw.color('gray-500')}
            onFocus={() => scrollToInput(300)}>
          </TextInput>
        </View>

        {/* Photo Preview */}
        {uploadData.imageUrl ? (
          <View style={tw`mb-7 items-center`}>
            <Text style={tw`text-gray-700 mb-2`}>Photo Preview:</Text>
            <View style={tw`w-full h-80 rounded-lg overflow-hidden shadow-md`}>
              <Image 
                source={{ uri: uploadData.imageUrl }} 
                style={tw`w-full h-full`} 
                resizeMode="cover"
              />
            </View>
            <TouchableOpacity 
              style={tw`mt-2 p-2 bg-red-500 rounded-full`}
              onPress={() => setData({...uploadData, imageUrl: ''})}>
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