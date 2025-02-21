import React, { useEffect, useState } from 'react';
import { View, TextInput, SafeAreaView, Text, TouchableOpacity, FlatList} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggedInUser } from '@/types/userSchema';
import { FeedCard } from '@/components/FeedCard';
import { useRouter } from 'expo-router';
import { get, off, query, ref} from 'firebase/database';
import { database } from '@/config/firebaseConfig';
import { demoListings, Listing } from '@/data/demoListings';


export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<LoggedInUser | null>(null);


  const [listings, setListings] = useState<Listing[]>(demoListings)

  useEffect(() => {
    const getUserListings = async () => {
      try {
        if(user) {
          console.log(user.uid)
        const listingsRef = ref(database,'listings')
  
        const queryRef = query(listingsRef)

        // Clears cached data
        off(queryRef)
        const snapshot = await get(queryRef)
        if (snapshot.exists()) {
          const data = snapshot.val() as Record<string, Listing>;
          let listingData : Listing[] = Object.values(data)
          
          listingData = listingData.filter((listing) => {
            console.log(listing)
              return listing.seller?.uid !== user.uid
          })
          console.log(listingData.length)
          setListings([...listings,...listingData])
        }}}
      catch (err) {
      console.error('Error fetching data:', err);
    }}
    getUserListings()
  },[user])

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
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      {/* Header with Logo and Search */}
      <View style={tw`px-4 pt-2 pb-4 flex-row items-center justify-between`}>
        {/* Brand */}
        <Text style={tw`text-xl font-bold text-gray-800`}>Vayro</Text>
        
        {/* Profile Icon Button */}
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons name="person-circle" size={30} color="#ACA592" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={tw`w-9/10 m-auto flex-row items-center bg-white rounded-lg px-3 shadow-sm border border-gray-200 mb-4`}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={tw`flex-1 py-2 px-2`}
          placeholder="Search..."
          placeholderTextColor="#999"
        />
      </View>

      {/* Feed Content */}
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
      : <></>}
    </SafeAreaView>
  );
}
