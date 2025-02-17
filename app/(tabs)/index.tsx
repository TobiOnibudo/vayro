import React from 'react';
import { View, TextInput, ScrollView, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggedInUser } from '@/types/userSchema';
import { FeedCard } from '@/components/FeedCard';
import { auth } from '@/config/firebaseConfig';

export default function HomeScreen() {
  const [user, setUser] = React.useState<LoggedInUser | null>(null);

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
      {/* Header with Logo and Search */}
      <View style={tw`px-4 pt-2 pb-4`}>

        <View style={tw`flex-row items-center justify-between`}>
          {/* Logo and Brand */}
          <View style={tw`flex-row items-center mb-4`}>
            <Text style={tw`text-xl font-bold text-gray-800`}>Vayro</Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity onPress={() => auth.signOut()}>
            <Text style={tw`text-red-500`}>Logout</Text>
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

      {/* Feed Content */}
      <ScrollView style={tw`flex-1`}>
        <FeedCard />
        <FeedCard />

      </ScrollView>
    </SafeAreaView>
  );
}
