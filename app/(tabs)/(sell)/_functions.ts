import { getAddress, getCoordinates } from '@/api/locationAPI';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserUpload } from '@/types/userSchema';
import { database } from '@/config/firebaseConfig';
import { router } from 'expo-router';
import { ref, set } from 'firebase/database';
import { v1 as uuidv1 } from 'uuid';
import 'react-native-get-random-values'

interface LocationObject extends Location.LocationObject {
  address: string | null;
  postal: string | null;
  city: string | null;
}

export async function getCurrentLocation(): Promise<LocationObject | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') { // Only proceed if permission is granted
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      console.log('Got user location:', location);

      const addressDetails = await getAddress(location.coords.latitude, location.coords.longitude);

      if (addressDetails) {
        const address = addressDetails.address;
        const postal = addressDetails.postalCode;
        const city = addressDetails.city;

        return { ...location, address, postal, city };
      }

      else {
        console.error('Error getting address details:', addressDetails);
        return null;
      }
    }
  }
  catch (error) {
    console.error('Error getting location:', error);
  }
  return null;
}

export async function uploadListing(
  uploadData: UserUpload,
  setData: (data: UserUpload) => void,
  setError: (error: string) => void,
  setIsLoading: (isLoading: boolean) => void
) {
  const userData = await AsyncStorage.getItem("userData") ?? "";
  const user = JSON.parse(userData)
  console.log(uploadData);

  if (uploadData.address && uploadData.city && uploadData.postal) {
      const displayName = `${uploadData.address} ${uploadData.city} ${uploadData.postal}`
      let coords;
      const coordinatesFromAddress = await getCoordinates(displayName);
      if (coordinatesFromAddress) {
        coords = coordinatesFromAddress;
      } else {
        coords = { latitude: uploadData.latitude, longitude: uploadData.longitude };
      }

      setData({
        ...uploadData,
        latitude: coords.latitude,
        longitude: coords.longitude
      });

      console.log("url: " + uploadData.imageUrl)
      
      try {
      const listingDetails = {
        lid: uuidv1(),
        title: uploadData.title,
        price: uploadData.price,
        address: uploadData.address,
        city: uploadData.city,
        postal: uploadData.postal,
        description: uploadData.description,
        imageUrl: uploadData.imageUrl,
        createdAt: new Date().toISOString(),
        seller: {
          uid: user?.uid,
          name: user?.username,
          email: user?.email,
        },
        location: {
          latitude: uploadData.latitude,
          longitude: uploadData.longitude,
        },
        type: uploadData.type,
      }

      console.log(`listingDetails : ${listingDetails}`)
      // Save upload to database
      await set(ref(database, '/listings/' + listingDetails.lid), listingDetails);

      router.push(`/listings/${listingDetails.lid}`)    
    }
    catch (error: any) {
      console.error("Uploading error:", error.message); 
      setError("Uploading error: " + error.message);
    }
    setIsLoading(false);
  }
}