import React from 'react';
import { View, TextInput, ScrollView, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggedInUser } from '@/types/userSchema';
import { useRouter } from 'expo-router';
import { FeedCard } from '@/components/FeedCard';

export default function BuyScreen() {
  const router = useRouter();
  const [user, setUser] = React.useState<LoggedInUser | null>(null);


  // Get user data??
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

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      {/* Header with Logo, Search, and Home Button */}
      <View style={tw`px-4 pt-2 pb-4`}>
        {/* Logo and Brand */}
        <View style={tw`flex-row items-center justify-between mb-4`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-xl font-bold text-gray-800`}>Buy</Text>
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

    </SafeAreaView>
  );
}
