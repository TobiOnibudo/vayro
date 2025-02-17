import React from 'react';
import { View, TextInput, ScrollView, SafeAreaView, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggedInUser } from '@/types/userSchema';
import { useRouter } from 'expo-router';
import { FeedCard } from '@/components/FeedCard';
import MapView, { Marker } from 'react-native-maps';
import { demoListings, Listing } from '@/data/demoListings';
import { useBottomTabSpacing } from '@/hooks/useBottomTabSpacing';
import * as Location from 'expo-location';

export default function BuyScreen() {
  const router = useRouter();
  const [user, setUser] = React.useState<LoggedInUser | null>(null);
  const bottomSpacing = useBottomTabSpacing();
  const [userLocation, setUserLocation] = React.useState({
    latitude: 51.5074,
    longitude: -0.1278,
  });
  const [mapRegion, setMapRegion] = React.useState({
    latitude: 44.6488, // Halifax Latitude
    longitude: -63.5752, // Halifax Longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedListingId, setSelectedListingId] = React.useState<string | null>(null);

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

  React.useEffect(() => {
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
          setMapRegion(newRegion); // Update mapRegion with user's location if available

          console.log('Set map region to user location:', newRegion);
        } else {
          console.log('Location permission not granted, using default Halifax location.');
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }
    })();
  }, []);

  const [viewMode, setViewMode] = React.useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = React.useState('');

  const renderListView = () => (
    <ScrollView 
      style={tw`flex-1`}
      contentContainerStyle={tw`pb-[${bottomSpacing}px]`}
    >
      {demoListings.map((listing) => (
        <FeedCard 
          key={listing.id}
          title={listing.title}
          price={listing.price}
          image={listing.image}
          seller={listing.seller}
        />
      ))}
    </ScrollView>
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
      onPress={() => setSelectedListingId(null)}
    >
      {demoListings.map((listing: Listing) => (
        <Marker
          key={listing.id}
          coordinate={listing.location}
          title={listing.title}
          description={`$${listing.price}`}
          onPress={() => {
            setSelectedListingId(selectedListingId === listing.id ? null : listing.id);
          }}
        >
          {selectedListingId === listing.id ? (
            <View style={{ backgroundColor: 'white', padding: 8, borderRadius: 6, elevation: 3, shadowColor: '#000', shadowOpacity: 0.2, position: 'absolute', bottom: 0, left: -50, width: 100 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>{listing.title}</Text>
              <Text style={{ color: 'green', fontWeight: 'bold', textAlign: 'center' }}>${listing.price}</Text>
              <Text style={{ fontSize: 12, color: 'gray', textAlign: 'center' }}>{listing.description}</Text>
            </View>
          ) : null}
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
