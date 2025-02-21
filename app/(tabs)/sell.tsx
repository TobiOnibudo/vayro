import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView, Alert, Button } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ref, set } from 'firebase/database';
import { database } from '@/config/firebaseConfig';
import React, { useState, useRef} from 'react';
import tw from 'twrnc';
import { useRouter } from "expo-router";
import { LoggedInUser, userUpload} from '@/types/userSchema';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import 'react-native-get-random-values';
import { v1 as uuidv1 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';


//Notes: when switching screens, need to make sure to turn showCamera false

export default function TabTwoScreen() {
  const router = useRouter();
  const [user, setUser] = React.useState<LoggedInUser | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const loadUser = async () => {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUser(userData);
      }
    };
    loadUser();
  }, []);

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  //Handle user authentication and link with firebase for user

    const [uploadData, setData] = useState<userUpload>({
        title: '',
        price: '',
        address: '',
        city: '',
        postal: '',
        description: '',
        url: '',
    })

    const handleUpload = async () => {
      // Set Camera off and set photo to null
      setShowCamera(false);
      setPhoto(null);

      //toDo: handle putting into firebase
      try {
        console.log("user: " + uploadData);
        const listingDetails = {
          lid: uuidv1(),
          title: uploadData.title,
          price: uploadData.price,
          address: uploadData.address,
          city: uploadData.city,
          postal: uploadData.postal,
          description: uploadData.description,
          url: uploadData.url,
          createAt: new Date().toISOString(),
        }

        // Save upload to database
        await set(ref(database, '/listings/' + listingDetails.lid), listingDetails);
      } catch (error: any) {
        console.error("Uploading error:", error.message);
        setError("Uploading error: " + error.message);
      }
    }

    const takePicture = async () => {
      if(cameraRef.current) {
        const photoData: CameraCapturedPicture | undefined = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: false,
        });
        
        if(photoData) {
          setPhoto(photoData.uri);
          console.log('Photo Taken: ', photoData.uri);
        }else{
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
        <View>
          <Text>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      );
    }

    const getCurrentLocation = () => {
      //Todo: get location
    }

  return (
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
                value={uploadData[field.toLowerCase() as keyof userUpload]}
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
            <TouchableOpacity style={tw`flex-row`} onPress={() => router.push('..') }>
              <Ionicons name="paper-plane" size={20} color="black"/>
              <Text style={[tw`underline ml-1`, { color: '#3f698d' }]}>Get Current Location</Text>
            </TouchableOpacity>
          </View>

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
          />
        </View>

          {/* City & Postal Form */}
          <View style={tw`flex-row shadow-md mb-8`}>
              {/* First Name and Last Name */}
              <TextInput
                style={tw`w-[48%] px-4 py-3 mr-3 bg-white rounded-lg border border-gray-200 `}
                placeholder="City"
                value={uploadData.city}
                onChangeText={(text) => setData((prev: any) => ({ ...prev, city: text }))}
                placeholderTextColor={tw.color('gray-500')}
              />
              <TextInput
                style={tw`w-[48%] px-4 py-3 bg-white rounded-lg border border-gray-200`}
                placeholder="Postal"
                value={uploadData.postal}
                onChangeText={(text) => setData((prev: any) => ({ ...prev, postal: text }))}
                placeholderTextColor={tw.color('gray-500')}
              />
          </View>

          {/* Description */}     
          <View style={tw`flex-column mb-7 shadow-md`}>
            <TextInput
            style={tw`w-full h-40 px-3 pb-28 bg-white rounded-lg border border-gray-200`}
            placeholder="Description of item . . ."
            value={uploadData.description}
            onChangeText={(text) =>
              setData(prev => ({ ...prev, description: text }))
            }
            placeholderTextColor={tw.color('gray-500')}>
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
                    <Ionicons name="camera" size={30} color="black"/>
                  </TouchableOpacity>

                  {/* Flip Camera Facing */}
                  <TouchableOpacity
                    style={tw`mt-2 p-3 ml-5 bg-white rounded-full`}
                    onPress={toggleCameraFacing}>
                    <Ionicons name="repeat" size={25} color="black"/>
                  </TouchableOpacity>
                </View>
              </CameraView>

              {/* Close Camera */}
              <TouchableOpacity
                style={tw`absolute top-5 right-5 p-3 bg-red-500 rounded-full`}
                onPress={() => setShowCamera(false)}>
                <Ionicons name="close" size={25} color="white"/>
              </TouchableOpacity>
            </View>
          )}

          {/* Photo Preview and Selection*/}
          {photo && (
            <View style={tw`absolute top-10 left-0 right-0 bottom--10 flex-1 justify-center items-center z-10 bg-gray-100`}>
              <Image source={{ uri:photo }} style={tw`w-full h-80% rounded-lg`}/>
              <View style={tw`flex-row justify-between mt-4`}>
                <TouchableOpacity onPress={() => setPhoto(null)} style={tw`p-3 mr-10 bg-gray-400 rounded-full`}>
                  <Ionicons name="close" size={25} color="white"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleUpload} style={tw`p-3 bg-green-500 rounded-full`}>
                  <Ionicons name="checkmark" size={25} color="white"/>
                </TouchableOpacity>
              </View>
            </View>
          )}

         
    </SafeAreaView>
</View>
  )
    
}

