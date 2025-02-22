import React, { useEffect, useState } from 'react';
import { View, TextInput, ScrollView, SafeAreaView, Text, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggedInUser } from '@/types/userSchema';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FeedCard } from '@/components/FeedCard';
import MapView, { Marker, Callout } from 'react-native-maps';
import { demoListings, Listing } from '@/data/demoListings';
import { useBottomTabSpacing } from '@/hooks/useBottomTabSpacing';
import * as Location from 'expo-location';
import { get, off, query, ref } from 'firebase/database';
import { database } from '@/config/firebaseConfig';

export default function BuyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
      minPrice?: string;
      maxPrice?: string;
      itemTypes?: string;
      radius?: string;
    }>();

  // Convert params to the correct types
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const radius = params.radius ? Number(params.radius) : undefined;
  const itemTypes = params.itemTypes ?  String(params.itemTypes): undefined;

  const [user, setUser] = useState<LoggedInUser | null>(null);
  const bottomSpacing = useBottomTabSpacing();
  const [mapRegion, setMapRegion] = useState({
    latitude: 44.6488, // Halifax Latitude
    longitude: -63.5752, // Halifax Longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  let selectedTypes = itemTypes ? itemTypes.split(',') : [];
  // search listings 
  const [listings, setListings] = useState<Listing[]>(demoListings)

  const getUserListings = async () => {
    try {
      if(user) {
        console.log(user.uid)
      const listingsRef = ref(database,'listings')

      const queryRef = query(listingsRef)

      // Clears cached data
      off(queryRef)
      const snapshot = await get(queryRef)
      if (snapshot.exists()) {
        const data = snapshot.val() as Record<string, Listing>;
        let listingData : Listing[] = Object.values(data)
        
        listingData = listingData.filter((listing) => {
            return listing.seller?.uid !== user.uid
        })
        console.log(listingData)
        console.log(listingData)
        listingData = [...listingData, ...demoListings]
        return listingData
      }}}
    catch (err) {
    console.error('Error fetching data:', err);
  }}

  useEffect(() => {
    const loadPage = async () => {
    console.log('refresh')
    const userListings = await getUserListings() ?? demoListings
     setListings(userListings)
  }
  loadPage()
  },[user])

  // Set initial price range and selected types based on params
  useEffect(() => {
    
    const filterListings = async () => { 
    if (minPrice !== undefined && maxPrice !== undefined) {
      setPriceRange([minPrice, maxPrice]);
    }
    if (itemTypes) {
      selectedTypes = itemTypes.split(',');
    }
   
    let filteredListings = await getUserListings()  ?? demoListings; // Start with all listings
    // Apply search query filter
    if (searchQuery) {
      filteredListings = filteredListings.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price and type filters only if minPrice, maxPrice, or itemTypes are defined
    if (minPrice !== undefined || maxPrice !== undefined || itemTypes) {
      filteredListings = filteredListings.filter(listing => {

        const withinPriceRange =
          (minPrice === undefined || listing.price >= minPrice) &&
          (maxPrice === undefined || listing.price <= maxPrice);

        const matchesType =
          !itemTypes || selectedTypes.includes(listing?.type.toLowerCase());

        return withinPriceRange && matchesType;
      });
    }

    console.log("Filtered Listings Count:", filteredListings.length);
    setListings(filteredListings);
  }
  filterListings()
  }, [minPrice, maxPrice, itemTypes, searchQuery]);
  

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
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') { // Only proceed if permission is granted
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          console.log('Got user location:', location.coords);

          const newRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };

          // Update mapRegion with user's location if available
          setMapRegion(newRegion); 

          console.log('Set map region to user location:', newRegion);
        } else {
          console.log('Location permission not granted, using default Halifax location.');
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }
    })
  }, []);


  const renderListView = () => (
    <FlatList
      data={listings}
      keyExtractor={(item) => item.lid}
      renderItem={({ item }) => (
        <FeedCard
          listingId={item.lid}
          title={item.title}
          price={item.price}
          image={item.imageUrl}
          seller={item.seller}
          description={item.description}
        />
      )}
    />
  );

  const renderMapView = () => (
    <MapView
      style={{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 150 - bottomSpacing,
      }}
      initialRegion={{
        ...mapRegion,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      }}
      showsUserLocation={true}
    >
      {listings.map((listing: Listing) => (
        <Marker
          key={listing.lid}
          coordinate={listing.location}
        >
          <Callout onPress={() => {
              console.log("Navigating to listing ID:", listing.lid); 
              router.push(`/listings/${listing.lid}`);
            }}>
            <View style={{ 
                backgroundColor: 'white', 
                padding: 6, 
                borderRadius: 6, 
                elevation: 2, 
                shadowColor: '#000', 
                shadowOpacity: 0.2,
                width: 140, 
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: 60, 
              }}>
              <Text style={{ fontWeight: 'bold', fontSize: 14, textAlign: 'center' }}>{listing.title}</Text>
              <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 12, textAlign: 'center' }}>${listing.price}</Text>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );

  return (
    <SafeAreaView style={[tw`flex-1 bg-gray-50`, { marginBottom: bottomSpacing }]}>
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
        
        {/* Search and Filter Row */}
        <View style={tw`flex-row items-center gap-2`}>
          {/* Search Bar */}
          <View style={tw`flex-1 flex-row items-center bg-white rounded-lg px-3 shadow-sm border border-gray-200`}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              style={tw`flex-1 py-2 px-2`}
              placeholder="Search..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          {/* Filter Button */}
          <TouchableOpacity 
            onPress={() => router.push('/filter')}
            style={tw`p-2 bg-[#ACA592] rounded-lg`}
          >
            <MaterialIcons name="filter-list" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* View Toggle */}
        <View style={tw`flex-row mt-4 bg-gray-200 rounded-lg p-1`}>
          <TouchableOpacity 
            style={tw`flex-1 p-2 rounded-lg ${viewMode === 'map' ? 'bg-white' : ''}`}
            onPress={() => setViewMode('map')}
          >
            <Text style={tw`text-center ${viewMode === 'map' ? 'text-gray-800' : 'text-gray-600'}`}>Map</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={tw`flex-1 p-2 rounded-lg ${viewMode === 'list' ? 'bg-white' : ''}`}
            onPress={() => setViewMode('list')}
          >
            <Text style={tw`text-center ${viewMode === 'list' ? 'text-gray-800' : 'text-gray-600'}`}>List</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {viewMode === 'map' ? renderMapView() : renderListView()}
    </SafeAreaView>
  );
}
