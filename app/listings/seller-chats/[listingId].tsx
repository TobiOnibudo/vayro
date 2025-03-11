import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Text, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { database } from '@/config/firebaseConfig';
import { ref, onValue, off } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggedInUser } from '@/types/userSchema';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

interface ChatPreview {
  buyerId: string;
  buyerName: string;
  lastMessage: string;
  timestamp: string;
}

export default function SellerChatsScreen() {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const { listingId } = useLocalSearchParams<{ listingId: string }>();
  const router = useRouter();

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

  useEffect(() => {
    if (!user) return;

    const chatsRef = ref(database, `chats/${listingId}`);
    onValue(chatsRef, (snapshot) => {
      if (snapshot.exists()) {
        const chatData = snapshot.val();
        const chatPreviews: ChatPreview[] = [];

        Object.entries(chatData).forEach(([chatId, messages]: [string, any]) => {
          // Chat ID format is "buyerId_sellerId"
          const [buyerId] = chatId.split('_');
          
          // Get the last message
          const messageArray = Object.values(messages);
          const lastMessage = messageArray[messageArray.length - 1] as any;

          chatPreviews.push({
            buyerId,
            buyerName: lastMessage.user.name,
            lastMessage: lastMessage.text,
            timestamp: lastMessage.createdAt,
          });
        });

        // Sort by most recent message
        chatPreviews.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setChats(chatPreviews);
      }
    });

    return () => off(chatsRef);
  }, [user, listingId]);

  const navigateToChat = (buyerId: string, buyerName: string) => {
    router.push({
      pathname: `/listings/chats/${listingId}`,
      params: { 
        listingId,
        sellerId: user?.uid,
        sellerName: user?.username,
        buyerId,
        buyerName
      }
    });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`flex-row items-center p-4 border-b border-gray-200`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`mr-4`}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold`}>Listing Chats</Text>
      </View>

      <FlatList
        data={chats}
        keyExtractor={item => item.buyerId}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigateToChat(item.buyerId, item.buyerName)}
            style={tw`flex-row items-center p-4 border-b border-gray-200`}
          >
            <View style={tw`flex-1`}>
              <Text style={tw`font-semibold text-lg`}>{item.buyerName}</Text>
              <Text style={tw`text-gray-600 mt-1`} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
            <Text style={tw`text-gray-400 text-sm`}>
              {new Date(item.timestamp).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={tw`flex-1 justify-center items-center p-4`}>
            <Text style={tw`text-gray-500`}>No chats yet</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
} 