import React, { useEffect, useState, useCallback } from 'react';
import { View, TextInput, ScrollView, SafeAreaView, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggedInUser } from '@/types/userSchema';
import { useRouter, useFocusEffect } from 'expo-router';
import { FeedCard } from '@/components/FeedCard';
import { equalTo, get, off, orderByChild, query, ref, remove } from 'firebase/database';
import { auth, database } from '@/config/firebaseConfig';
import { demoListings, Listing } from '@/data/demoListings';
import { useBottomTabSpacing } from '@/hooks/useBottomTabSpacing';

export default function SellHistoryScreen() {
  const router = useRouter();
  const [user, setUser] = React.useState<LoggedInUser | null>(null);
  const [listings, setListings] = useState<Listing[]>()
  const bottomSpacing = useBottomTabSpacing();

  useFocusEffect(
    useCallback (() => {
    const getUserListings = async () => {
      try {
        if (user) {
          const listingsRef = ref(database, 'listings')
          const queryRef = query(listingsRef, orderByChild('seller/uid'), equalTo(user?.uid))
          off(queryRef) // Clears any cached data
          const snapshot = await get(queryRef)
          if (snapshot.exists()) {
            const data = snapshot.val() as Record<string, Listing>;
            // convert to list
            const listingData: Listing[] = Object.values(data)
            console.log(listingData.length)
            setListings(listingData)
          }
        }
      }
      catch (err) {
        console.error('Error fetching data:', err);
      }
    }

    getUserListings()
  }, [user]))


  // Get user data??
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

  return (
    <SafeAreaView style={[tw`flex-1 bg-gray-50`, { marginBottom: bottomSpacing }]}>
      {/* Header with Logo, Search, and Home Button */}
      <View style={tw`px-4 pt-2 pb-4`}>
        {/* Logo and Brand */}
        <View style={tw`flex-row items-center justify-between mb-4`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-xl font-bold text-gray-800`}>History</Text>
          </View>

          {/* Home Button */}
          <TouchableOpacity
            onPress={() => router.push('/')}
            style={tw`p-2 bg-[#ACA592] rounded-full`}
          >
            <Ionicons name="home" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={tw`flex-row items-center bg-white rounded-lg px-3 shadow-sm border border-gray-200`}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={tw`flex-1 py-2 px-2`}
            placeholder="Search..."
            placeholderTextColor="#999"
          />
        </View>
      </View>
      {listings ?
        <FlatList
          data={listings}
          keyExtractor={(item) => item.lid}
          renderItem={({ item }) => (
            <FeedCard
              listingId={item.lid}
              title={item.title}
              price={item.price}
              image={item.imageUrl}
              seller={item.seller}
              description={item.description}
            />
          )}
        />
        :
        <View style={tw`flex-1 items-center justify-center`}>
          <Text style={tw`text-[#ACA592] text-lg`}>
            No History...
          </Text>
        </View>
      }

    </SafeAreaView>
  );
}
