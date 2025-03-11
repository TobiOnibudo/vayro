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

export default function ListingDetailPage() {
  const router = useRouter();
  const { listingId } = useLocalSearchParams<{ listingId: any }>();
  const [listing, setListing] = useState<Listing | null>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedListing, setEditedListing] = useState<Listing | null>();
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const { scrollToInput, scrollViewRef } = useScrollToInput();

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
            {/* Header with Back Button and Edit Button */}
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>
              {isOwner && (
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
              )}
            </View>

            {/* Listing Details */}
            <Image source={{ uri: listing.imageUrl }} style={tw`w-full h-72 rounded-lg mb-4`} />
            {isEditing ? (
              <View style={tw`mb-4`}>
                <TextInput
                  value={editedListing?.title}
                  onChangeText={(text) => setEditedListing(prev => prev ? {...prev, title: text} : null)}
                  style={tw`text-2xl font-bold text-gray-800 mb-2 border-b border-gray-300 p-2`}
                  onFocus={() => scrollToInput(0)}
                />
                <TextInput
                  value={editedListing?.price.toString()}
                  onChangeText={(text) => setEditedListing(prev => prev ? {...prev, price: parseFloat(text) || 0} : null)}
                  keyboardType="numeric"
                  style={tw`text-xl text-[#ACA592] font-bold mb-4 border-b border-gray-300 p-2`}
                  onFocus={() => scrollToInput(100)}
                />
                <TextInput
                  value={editedListing?.description}
                  onChangeText={(text) => setEditedListing(prev => prev ? {...prev, description: text} : null)}
                  multiline
                  numberOfLines={2}
                  style={tw`text-gray-700 mb-2 border border-gray-300 p-2 rounded min-h-[100px]`}
                  onFocus={() => scrollToInput(200)}
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
            <View style={tw`border-t border-gray-300 pt-4 mb-10`}>
              <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>Seller Information</Text>
              <Text style={tw`text-gray-600`}>Name: {listing.seller.name}</Text>
              <Text style={tw`text-gray-600`}>Email: {listing.seller.email}</Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
} 