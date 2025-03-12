import React, { useState, useCallback, useEffect } from 'react';
import { View, SafeAreaView, TextInput, TouchableOpacity, Text, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { database } from '@/config/firebaseConfig';
import { ref, push, onValue, off } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggedInUser } from '@/types/userSchema';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

interface Message {
  _id: string;
  text: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
  };
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const { 
    listingId, 
    sellerId, 
    sellerName,
    buyerId,
    buyerName 
  } = useLocalSearchParams<{ 
    listingId: string;
    sellerId: string;
    sellerName: string;
    buyerId?: string;
    buyerName?: string;
  }>();
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
  }, [])


  useEffect(() => {
    if (!user) return;
    
    // Determine the chat path based on whether we're the buyer or seller
    const chatPath = buyerId 
      ? `chats/${listingId}/${buyerId}_${sellerId}`
      : `chats/${listingId}/${user.uid}_${sellerId}`;
      
    const chatRef = ref(database, chatPath);
    
    // Set up real-time chat listener
    onValue(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messageList = Object.values(data).map((msg: any) => ({
          _id: msg._id,
          text: msg.text,
          createdAt: msg.createdAt,
          user: {
            _id: msg.user._id,
            name: msg.user.name,
          },
        }));
        setMessages(messageList.reverse());
      }
    });

    return () => {
      off(chatRef);
    };
  }, [sellerId, user, buyerId]);

  const sendMessage = useCallback(() => {
    if (!user || !newMessage.trim()) return;

    const chatPath = buyerId 
      ? `chats/${listingId}/${buyerId}_${sellerId}`
      : `chats/${listingId}/${user.uid}_${sellerId}`;
      
    const chatRef = ref(database, chatPath);
    
    const message = {
      _id: Date.now().toString(),
      text: newMessage.trim(),
      createdAt: new Date().toISOString(),
      user: {
        _id: user.uid,
        name: user.username,
      },
    };

    push(chatRef, message);
    setNewMessage('');
  }, [user, newMessage, listingId, sellerId, buyerId]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.user._id === user?.uid;

    return (
      <View style={[
        tw`mx-3 my-1 max-w-[80%] rounded-lg p-3`,
        isCurrentUser ? tw`bg-[#ACA592] self-end` : tw`bg-gray-200 self-start`
      ]}>
        {!isCurrentUser && (
          <Text style={tw`text-xs text-gray-600 mb-1`}>{item.user.name}</Text>
        )}
        <Text style={[
          tw`text-base`,
          isCurrentUser ? tw`text-white` : tw`text-gray-800`
        ]}>{item.text}</Text>
        <Text style={[
          tw`text-xs mt-1`,
          isCurrentUser ? tw`text-gray-100` : tw`text-gray-500`
        ]}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`flex-row items-center p-4 border-b border-gray-200`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`mr-4`}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold`}>
          Chat with {buyerId ? buyerName : sellerName}
        </Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item._id}
        inverted
        style={tw`flex-1`}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={tw`flex-row items-center p-2 border-t border-gray-200 bg-white`}>
          <TextInput
            style={tw`flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2`}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            multiline
          />
          <TouchableOpacity 
            onPress={sendMessage}
            style={tw`bg-[#ACA592] w-10 h-10 rounded-full items-center justify-center`}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 