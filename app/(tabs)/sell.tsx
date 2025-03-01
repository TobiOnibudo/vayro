import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Button, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ref, set } from 'firebase/database';
import { database } from '@/config/firebaseConfig';
import React, { useState, useRef } from 'react';
import tw from 'twrnc';
import { useRouter } from "expo-router";
import { LoggedInUser, UserUpload } from '@/types/userSchema';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import 'react-native-get-random-values';
import { v1 as uuidv1 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { uploadImageToCloud } from '@/api/imageUploadAPI';
import * as Location from 'expo-location';
import { getAddress, getCoordinates } from '@/api/locationAPI';
//import { useBottomTabSpacing } from '@/hooks/useBottomTabSpacing';
import { useScrollToInput } from '@/hooks/useScrollToInput';


//Notes: when switching screens, need to make sure to turn showCamera false

export default function SellScreen() {
  const router = useRouter();
  const [user, setUser] = React.useState<LoggedInUser | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const [error, setError] = useState<string | null>(null);
  //const bottomSpacing = useBottomTabSpacing();

  const [isLoading, setIsLoading] = useState(false);
  const { scrollToInput, scrollViewRef } = useScrollToInput();

  React.useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUser(userData);
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  //Handle user authentication and link with firebase for user

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

  const handleUpload = async () => {
    // Set Camera off and set photo to null
    setShowCamera(false);
    setPhoto(null);
    setIsLoading(true);
    const userData = await AsyncStorage.getItem("userData") ?? ""
    const user = JSON.parse(userData)
    if (photo) {
      const imageUrl = await uploadImageToCloud(photo) ?? ""
      setData({ ...uploadData, imageUrl: imageUrl })
    }

    // ensure coordinates match inputted address
    if (uploadData.address && uploadData.city && uploadData.postal) {
      const displayName = `${uploadData.address} ${uploadData.city} ${uploadData.postal}`
      const coords = await getCoordinates(displayName) || { latitude: uploadData.latitude, longitude: uploadData.longitude };

      setData({
        ...uploadData,
        latitude: coords.latitude,
        longitude: coords.longitude
      });
    }
    console.log("url: " + uploadData.imageUrl)
    try {
      const listingDetails = {
        lid: uuidv1(),
        title: uploadData.title,
        price: uploadData.price,
        address: uploadData.address,
        city: uploadData.city,
        postal: uploadData.postal,
        description: uploadData.description,
        imageUrl: uploadData.imageUrl,
        createdAt: new Date().toISOString(),
        seller: {
          uid: user?.uid,
          name: user?.username,
          email: user?.email,
        },
        location: {
          latitude: uploadData.latitude,
          longitude: uploadData.longitude,
        },
        type: uploadData.type,
      }

      console.log(`listingDetails : ${listingDetails}`)
      // Save upload to database
      await set(ref(database, '/listings/' + listingDetails.lid), listingDetails);

      router.push(`/listings/${listingDetails.lid}`)
    } catch (error: any) {
      console.error("Uploading error:", error.message);
      setError("Uploading error: " + error.message);
    }
    setIsLoading(false);
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photoData: CameraCapturedPicture | undefined = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: false,
      });

      if (photoData) {
        setPhoto(photoData.uri);
        console.log('Photo Taken: ', photoData.uri);
      } else {
        console.warn('Failed to take picture: photoData is undefined');
      }
    }
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

  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') { // Only proceed if permission is granted
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        console.log('Got user location:', location);

        const addressDetails = await getAddress(location.coords.latitude, location.coords.longitude)
        const address = addressDetails?.address ?? ""
        const postal = addressDetails?.postalCode ?? ""
        const city = addressDetails?.city ?? ""

        // add coordinates and address details
        setData({ ...uploadData, ...location.coords, address, postal, city })
      }
    }
    catch (error) {
      console.error('Error getting location:', error);
    }
    setIsLoading(false);
  }


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      style={tw`flex-1`}
    >
      <ScrollView
        ref={scrollViewRef}
        style={tw`bg-neutral-100`}
        contentContainerStyle={tw`flex-grow pb-5`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={tw`flex-1 bg-gray-100 px-7`}>
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
                  <TouchableOpacity style={tw`flex-row`} onPress={getCurrentLocation}>
                    <Ionicons name="paper-plane" size={20} color="black" />
                    <Text style={[tw`underline ml-1`, { color: '#3f698d' }]}>Get Current Location</Text>
                  </TouchableOpacity>
                </View>

                {isLoading ? (
                  <View style={tw`flex-col my-8 items-center justify-center`}>
                    <ActivityIndicator
                      size="large"
                      color="#0000ff"
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
                  onFocus={() => scrollToInput(400)}>
                </TextInput>
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
                  <CameraView style={tw`flex-1 w-100%`} facing={facing} ref={cameraRef}>
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
                  <Image source={{ uri: photo }} style={tw`w-full h-80% rounded-lg`} />
                  <View style={tw`flex-row justify-between mt-4`}>
                    <TouchableOpacity onPress={() => setPhoto(null)} style={tw`p-3 mr-10 bg-gray-400 rounded-full`}>
                      <Ionicons name="close" size={25} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleUpload} style={tw`p-3 bg-green-500 rounded-full`}>
                      <Ionicons name="checkmark" size={25} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </SafeAreaView>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

