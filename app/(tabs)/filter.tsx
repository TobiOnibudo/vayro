import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import Slider from '@react-native-community/slider';
import { useBottomTabSpacing } from '@/hooks/useBottomTabSpacing';
import { CATEGORIES_VALUES, Category } from '@/types/priceSuggestionFormSchema';

const itemTypes = Object.keys(CATEGORIES_VALUES);

export default function FilterScreen() {
  const router = useRouter();
  const [priceRange, setPriceRange] = React.useState([0, 1000]);
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]);
  const [radius, setRadius] = React.useState(10); // km
  const bottomSpacing = useBottomTabSpacing();
  const defaultCategories: Category[] = Object.keys(CATEGORIES_VALUES) as Category[];
  const toggleItemType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const applyFilters = () => {
    router.replace({
      pathname: '/(tabs)/buy',
      params: {
        minPrice: priceRange[0],
        maxPrice: Math.round(priceRange[1]),
        itemTypes: selectedTypes.length > 0 ? selectedTypes.join(',') : defaultCategories.join(','),
        radius: Math.round(radius)
      }
    });
  };

  return (
    <SafeAreaView style={[tw`flex-1 bg-gray-50`, { marginBottom: bottomSpacing }]}>
      <View style={tw`px-4 pt-2 flex-1`}>
        {/* Header */}
        <View style={tw`flex-row items-center justify-between mb-6`}>
          <TouchableOpacity onPress={() => router.replace('/buy')}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold`}>Filters</Text>
          <TouchableOpacity onPress={() => {
            setPriceRange([0, 1000]);
            setSelectedTypes([]);
            setRadius(10);
          }}>
            <Text style={tw`text-sm text-blue-500`}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={tw`flex-1`}
          contentContainerStyle={tw`pb-[${bottomSpacing}px]`}
        >
          {/* Price Range */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-lg font-semibold mb-2`}>Price Range</Text>
            <Slider
              style={tw`h-6`}
              minimumValue={0}
              maximumValue={1000}
              value={priceRange[1]}
              onValueChange={value => setPriceRange([priceRange[0], value])}
              minimumTrackTintColor="#ACA592"
              maximumTrackTintColor="#d3d3d3"
            />
            <Text style={tw`text-center mt-2`}>
              ${priceRange[0]} - ${Math.round(priceRange[1])}
            </Text>
          </View>

          {/* Item Types */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-lg font-semibold mb-2`}>Item Type</Text>
            <View style={tw`flex-row flex-wrap gap-2`}>
              {itemTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={tw`px-4 py-2 rounded-full border ${
                    selectedTypes.includes(type) ? 'bg-[#ACA592] border-[#ACA592]' : 'bg-white border-gray-300'
                  }`}
                  onPress={() => toggleItemType(type)}
                >
                  <Text style={tw`${selectedTypes.includes(type) ? 'text-white' : 'text-gray-800'}`}>
                    {CATEGORIES_VALUES[type as keyof typeof CATEGORIES_VALUES]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location Radius */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-lg font-semibold mb-2`}>Distance</Text>
            <Slider
              style={tw`h-6`}
              minimumValue={1}
              maximumValue={50}
              value={radius}
              onValueChange={setRadius}
              minimumTrackTintColor="#ACA592"
              maximumTrackTintColor="#d3d3d3"
            />
            <Text style={tw`text-center mt-2`}>
              Within {Math.round(radius)}km
            </Text>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View style={tw`py-4`}>
          <TouchableOpacity
            style={tw`bg-[#ACA592] py-3 rounded-lg`}
            onPress={applyFilters}
          >
            <Text style={tw`text-white text-center font-semibold text-lg`}>
              Apply Filters
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
} 