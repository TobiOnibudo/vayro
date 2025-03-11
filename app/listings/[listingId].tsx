import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import tw from 'twrnc';
import { demoListings, Listing } from '@/data/demoListings';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabSpacing } from '@/hooks/useBottomTabSpacing';
import { database } from '@/config/firebaseConfig';
import { equalTo, get, orderByChild, query, ref, set } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { LoggedInUser } from '@/types/userSchema';
import { useScrollToInput } from '@/hooks/useScrollToInput';
import { CameraView } from 'expo-camera';
import { uploadImageToCloud } from '@/api/imageUploadAPI';
import { useCamera } from '@/hooks/useCamera';

export default function ListingDetailPage() {
  const router = useRouter();
  const { listingId } = useLocalSearchParams<{ listingId: any }>();
  const [listing, setListing] = useState<Listing | null>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedListing, setEditedListing] = useState<Listing | null>();
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const { scrollToInput, scrollViewRef } = useScrollToInput();
  

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




  // Add user loading effect
  useEffect(() => {
    const loadUser = async () => {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUser(userData);
      }
    };
    loadUser();
  }, []);

  useEffect( () => {

    const loadUser = async () => {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUser(userData);
      }
    };
    loadUser();

    const getListing = async () => {
      const localListing = demoListings.find(item => item.lid === listingId);
      if (localListing) 
        {
          setListing(localListing)
          return 
        }
        
      const listingsRef = ref(database,'listings/' + listingId)

      const queryRef = query(listingsRef)

      const snapshot = await get(queryRef)

      if (snapshot.exists()) {
        const data = snapshot.val(); 
        setListing(data)
      }
    }
    
    getListing() 
  },[])

  const handleSave = async () => {
    if (!editedListing) return;
    
    try {
      const listingRef = ref(database, 'listings/' + listingId);
      await set(listingRef, editedListing);
      setListing(editedListing);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating listing:', error);
      Alert.alert('Error', 'Failed to update listing');
    }
  };

  if (!listing) {
    return (
      <SafeAreaView style={[tw`flex-1 bg-gray-50`]}>
        <View style={tw`flex-1 justify-center items-center px-4`}>
          <Text style={tw`text-xl text-gray-800 mb-4`}>Listing not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={tw`bg-[#ACA592] py-2 px-4 rounded-lg`}>
            <Text style={tw`text-white font-semibold`}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isOwner = user?.uid === listing.seller.uid;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1`}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <SafeAreaView style={tw`flex-1 bg-gray-50`}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            ref={scrollViewRef}
            contentContainerStyle={tw`p-4 pb-20`}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header with Back Button and Edit/Camera Buttons */}
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>
              {isOwner && (
                <View style={tw`flex-row gap-2`}>
                  {isEditing && (
                    <>
                      <TouchableOpacity
                        onPress={() => setShowCamera(!showCamera)}
                        style={tw`bg-[#ACA592] py-2 px-4 rounded-lg`}
                      >
                        <Ionicons name="camera" size={24} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setIsEditing(false);
                          setEditedListing(null);
                        }}
                        style={tw`bg-red-500 py-2 px-4 rounded-lg`}
                      >
                        <Text style={tw`text-white font-semibold`}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  <TouchableOpacity 
                    onPress={() => {
                      if (isEditing) {
                        handleSave();
                      } else {
                        setEditedListing({...listing});
                        setIsEditing(true);
                      }
                    }}
                    style={tw`bg-[#ACA592] py-2 px-4 rounded-lg`}
                  >
                    <Text style={tw`text-white font-semibold`}>
                      {isEditing ? 'Save' : 'Edit'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Camera View */}
            {showCamera && !photo && (
              <View style={tw`absolute z-10 top-15 left-4 right-0 bottom-0 w-100%`}>
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

            {/* Photo Preview */}
            {photo && (
              <View style={tw`absolute top-0 left-0 right-0 bottom-0 z-50 bg-black bg-opacity-95`}>
                <SafeAreaView style={tw`flex-1 justify-center items-center`}>
                  <Image 
                    source={{ uri: photo }} 
                    style={tw`w-90% h-70%`} 
                    resizeMode="contain"
                  />
                  <View style={tw`flex-row justify-center mt-6 gap-8`}>
                    <TouchableOpacity
                      onPress={() => {
                        setPhoto(null);
                        setShowCamera(true);
                      }}
                      style={tw`p-4 bg-red-500 rounded-full shadow-md`}
                    >
                      <Ionicons name="close" size={28} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={async () => {
                        if (photo) {
                          const imageUrl = await uploadImageToCloud(photo) ?? "";
                          setEditedListing(prev => prev ? {...prev, imageUrl} : null);
                        }
                        setShowCamera(false);
                        setPhoto(null);
                      }}
                      style={tw`p-4 bg-green-500 rounded-full shadow-md`}
                    >
                      <Ionicons name="checkmark" size={28} color="white" />
                    </TouchableOpacity>
                  </View>
                </SafeAreaView>
              </View>
            )}

            {/* Listing Details */}
            <Image 
              source={{ uri: isEditing ? editedListing?.imageUrl : listing.imageUrl }} 
              style={tw`w-full h-72 rounded-lg mb-4`} 
            />
            {isEditing ? (
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-600 font-medium mb-1`}>Title</Text>
                <TextInput
                  value={editedListing?.title}
                  onChangeText={(text) => setEditedListing(prev => prev ? {...prev, title: text} : null)}
                  style={tw`text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 p-2`}
                  onFocus={() => scrollToInput(0)}
                />
                
                <Text style={tw`text-gray-600 font-medium mb-1`}>Price</Text>
                <View style={tw`flex-row items-center mb-4 border-b border-gray-300`}>
                  <TextInput
                    value={editedListing?.price.toString()}
                    onChangeText={(text) => setEditedListing(prev => prev ? {...prev, price: parseFloat(text) || 0} : null)}
                    keyboardType="numeric"
                    style={tw`text-xl text-[#ACA592] font-bold p-2 flex-1`}
                    onFocus={() => scrollToInput(100)}
                  />
                </View>

                <Text style={tw`text-gray-600 font-medium mb-1`}>Description</Text>
                <TextInput
                  value={editedListing?.description}
                  onChangeText={(text) => setEditedListing(prev => prev ? {...prev, description: text} : null)}
                  multiline
                  numberOfLines={2}
                  style={tw`text-gray-700 mb-2 border border-gray-300 p-2 rounded min-h-[60px]`}
                  onFocus={() => scrollToInput(200)}
                  placeholder="Enter listing description"
                />
              </View>
            ) : (
              <View>
                <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>{listing.title}</Text>
                <Text style={tw`text-xl text-[#ACA592] font-bold mb-4`}>${listing.price}</Text>
                <Text style={tw`text-gray-700 mb-4`}>{listing.description}</Text>
              </View>
            )}

            {/* Seller Info */}
            <View style={tw`border-t border-gray-300 pt-4`}>
              <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>Seller Information</Text>
              <Text style={tw`text-gray-600`}>Name: {listing.seller.name}</Text>
              <Text style={tw`text-gray-600`}>Email: {listing.seller.email}</Text>
              
              {/* Show different buttons based on whether user is seller or buyer */}
              {user?.uid === listing.seller.uid ? (
                // Seller View - Show View Chats button
                <TouchableOpacity 
                  onPress={() => {
                    router.push({
                      pathname: `/listings/seller-chats/${listing.lid}`,
                      params: { listingId: listing.lid }
                    });
                  }}
                  style={tw`mt-4 bg-[#ACA592] py-3 px-4 rounded-lg`}
                >
                  <Text style={tw`text-white font-semibold text-center`}>View All Chats</Text>
                </TouchableOpacity>
              ) : (
                // Buyer View - Show Chat with Seller button
                <TouchableOpacity 
                  onPress={() => {
                    router.push({
                      pathname: `/listings/chats/${listing.lid}`, 
                      params: { 
                        listingId: listing.lid, 
                        sellerId: listing.seller.uid,
                        sellerName: listing.seller.name
                      }
                    });
                  }}
                  style={tw`mt-4 bg-[#ACA592] py-3 px-4 rounded-lg`}
                >
                  <Text style={tw`text-white font-semibold text-center`}>Chat with Seller</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
} 