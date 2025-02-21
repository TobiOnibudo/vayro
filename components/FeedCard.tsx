import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';

interface FeedCardProps {
  title: string;
  price: number;
  image: string;
  seller: {
    name: string;
  };
  description: string;
  listingId: string;
}

export const FeedCard: React.FC<FeedCardProps> = ({ title, price, image, seller, description, listingId }) => {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => {
      console.log("Navigating to listing ID:", listingId);
      router.push(
        `/listings/${listingId}`
      );
    }} style={[tw`bg-white rounded-lg shadow-md mb-10`, { width: '75%', marginHorizontal: '12.5%' }]}>
      <Image
        source={{ uri: image }}
        style={{ width: '100%', height: 130, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
      />
      <View style={tw`p-2`}>
        <Text style={tw`text-sm font-bold text-gray-800 mb-1`} numberOfLines={1} ellipsizeMode='tail'>{title}</Text>
        <Text style={tw`text-xs text-gray-600 mb-1`} numberOfLines={2} ellipsizeMode='tail'>{description}</Text>
        <View style={tw`flex-row items-center justify-between mt-1`}>
          <Text style={tw`text-base font-bold text-[#ACA592]`}>${price}</Text>
          <Text style={tw`text-xs text-gray-500`}> {seller ? 'Seller: {seller?.name ?? "Unknown" }' : ""}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}; 