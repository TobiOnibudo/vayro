import React from 'react';
import { View, Text, Image, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import tw from 'twrnc';
import { demoListings, Listing } from '@/data/demoListings';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabSpacing } from '@/hooks/useBottomTabSpacing';

export default function ListingDetailPage() {
  const router = useRouter();
  const { listingId } = useLocalSearchParams<{ listingId: any }>();
  console.log(listingId)

  // Find the listing based on listingId
  const listing: Listing | undefined = demoListings.find(item => item.id === listingId);

  if (!listing) {
    return (
      <SafeAreaView style={[tw`flex-1 bg-gray-50`]}>
        <View style={tw`flex-1 justify-center items-center px-4`}>
          <Text style={tw`text-xl text-gray-800 mb-4`}>Listing not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={tw`bg-[#ACA592] py-2 px-4 rounded-lg`}>
            <Text style={tw`text-white font-semibold`}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[tw`flex-1 bg-gray-50`, ]}>
      <ScrollView contentContainerStyle={tw`p-4 ]`}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={tw`mb-4`}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>

        {/* Listing Details */}
        <Image source={{ uri: listing.image }} style={tw`w-full h-72 rounded-lg mb-4`} />
        <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>{listing.title}</Text>
        <Text style={tw`text-xl text-[#ACA592] font-bold mb-4`}>${listing.price}</Text>
        <Text style={tw`text-gray-700 mb-4`}>{listing.description}</Text>

        {/* Seller Info */}
        <View style={tw`border-t border-gray-300 pt-4`}>
          <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>Seller Information</Text>
          <Text style={tw`text-gray-600`}>Name: {listing.seller.name}</Text>
          <Text style={tw`text-gray-600`}>Email: {listing.seller.email}</Text>
          {/* Add more seller info here if needed */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 