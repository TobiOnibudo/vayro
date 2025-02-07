import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

export const FeedCard = () => (
  <View style={tw`bg-white rounded-lg p-4 mx-4 mb-4 shadow-md`}>
    <Text style={tw`text-gray-700`}>Feed</Text>
  </View>
); 