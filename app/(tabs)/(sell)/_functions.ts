import { getAddress } from '@/api/locationAPI';
import * as Location from 'expo-location';

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