import React, { useEffect, useState, useCallback } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggedInUser } from '@/types/userSchema';
import { useRouter } from 'expo-router';
import { FeedCard } from '@/components/FeedCard';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '@/config/firebaseConfig';
import { Listing } from '@/data/demoListings';

export default function HistoryScreen() {
  const router = useRouter();
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [chatListings, setChatListings] = useState<Listing[]>([]);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [viewMode, setViewMode] = useState<'listings contacted' | 'your listings'>('listings contacted');

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

  const fetchChatListings = useCallback(async () => {
    if (user) {
        const chatsRef = ref(database, 'chats');
        let snapshot = await get(chatsRef);
        let lidList : String[] = []
        if (snapshot.exists()) {
        const data = snapshot.val();
        const userId = user.uid; 
        const listings: Listing[] = [];

            for (const lid in data) {
            const chat = data[lid];
            // Check if the chat contains messages for the current user
            for (const messageKey in chat) {
                const messages = chat[messageKey];
                if (messageKey.startsWith(userId)) {
                    // Check if the message key starts with the user's ID
                lidList.push(lid); 
                    break
                }
            } 
        }
    }
    const listingsRef = ref(database, 'listings');
    const queryRef = query(listingsRef, orderByChild('seller/uid'));
    
    const snapshotListings = await get(queryRef);
        if (snapshotListings.exists()) {
            const data = snapshotListings.val();
            const listings: Listing[] = Object.values(data);
            const filteredListings = Object.values(listings).filter(item => lidList.includes(item.lid));
            setChatListings(filteredListings);
        }
    }
  }, [user]);

  const fetchUserListings = useCallback(async () => {
    if (user) {
      const listingsRef = ref(database, 'listings');
      const queryRef = query(listingsRef, orderByChild('seller/uid'), equalTo(user.uid));
      const snapshot = await get(queryRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const listings: Listing[] = Object.values(data);
        setUserListings(listings);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchChatListings();
    fetchUserListings();
  }, [fetchChatListings, fetchUserListings]);

  const filteredListings = viewMode === 'listings contacted' ? chatListings : userListings;

  const renderListView = () => (
    <FlatList
      data={filteredListings}
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
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`px-4 pt-2 pb-4`}>
        <View style={tw`flex-row items-center justify-between mb-4`}>
          <Text style={tw`text-xl font-bold text-gray-800`}>History</Text>
          <TouchableOpacity 
            onPress={() => router.push('/')}
            style={tw`p-2 bg-[#ACA592] rounded-full`}
          >
            <Ionicons name="home" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={tw`flex-row mt-4 bg-gray-200 rounded-lg p-1`}>
          <TouchableOpacity 
            style={tw`flex-1 p-2 rounded-lg ${viewMode === 'listings contacted' ? 'bg-white' : ''}`}
            onPress={() => setViewMode('listings contacted')}
          >
            <Text style={tw`text-center ${viewMode === 'listings contacted' ? 'text-gray-800' : 'text-gray-600'}`}>Listings Contacted</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={tw`flex-1 p-2 rounded-lg ${viewMode === 'your listings' ? 'bg-white' : ''}`}
            onPress={() => setViewMode('your listings')}
          >
            <Text style={tw`text-center ${viewMode === 'your listings' ? 'text-gray-800' : 'text-gray-600'}`}>Your Listings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {renderListView()}
    </SafeAreaView>
  );
} 