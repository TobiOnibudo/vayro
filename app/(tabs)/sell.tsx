import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { FeedCard } from '@/components/FeedCard';
import { useRouter } from 'expo-router';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggedInUser } from '@/types/userSchema';

export default function SellScreen() {
  const router = useRouter();
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
      {/* Header with Logo, Search, and Home Button */}
      <View style={tw`px-4 pt-2 pb-4`}>
        {/* Logo and Brand */}
        <View style={tw`flex-row items-center justify-between mb-4`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-xl font-bold text-gray-800`}>Sell</Text>
          </View>

          {/* Ask Gemini Price Suggestion Button */}
          <TouchableOpacity 
            onPress={() => router.push('/(price-suggestion)/request-price')}
            style={tw`p-2 bg-blue-500 rounded-full`}
          >
            <MaterialIcons name="price-check" size={24} color="white" />
          </TouchableOpacity>
          
          {/* Home Button */}
          <TouchableOpacity 
            onPress={() => router.push('/')}
            style={tw`p-2 bg-[#ACA592] rounded-full`}
          >
            <Ionicons name="home" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
      </View>

      {/* Feed Content */}
      <ScrollView style={tw`flex-1`}>
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
      </ScrollView>
    </SafeAreaView>
  );
}
