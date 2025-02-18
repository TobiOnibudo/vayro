import React, { useEffect, useState } from 'react';
import { View, TextInput, ScrollView, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggedInUser } from '@/types/userSchema';
import { FeedCard } from '@/components/FeedCard';
import { useRouter } from 'expo-router';
import { auth } from '@/config/firebaseConfig';

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<LoggedInUser | null>(null);

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
      <ScrollView style={tw`flex-1`}>
        <FeedCard />
        <FeedCard />
      </ScrollView>
    </SafeAreaView>
  );
}
