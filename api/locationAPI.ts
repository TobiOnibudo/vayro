import axios from 'axios';

interface GeocodeResponse {
  lat: string;
  lon: string;
}

interface ReverseGeocodeResponse {
  address: {
    [key: string]: string;
  };
  display_name: string;
}

const locationUrl = process.env.EXPO_PUBLIC_LOCATION_API_URL ?? ""

// Function to get coordinates from an address
export const getCoordinates = async (address: string): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    const response = await axios.get<GeocodeResponse[]>(`${locationUrl}/search`, {
      params: {
        q: address,
        format: 'jsonv2',
      },
      headers: {
        'User-Agent': 'ReactNativeApp',
      },
    });

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      console.log(`Coordinates for ${address}:`, lat, lon);
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      console.log('No results found.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};

// Function to get an address from coordinates
export const getAddress = async (lat: number, lon: number): Promise<{ address: string | null, postalCode: string | null, city: string | null , displayName : string | null } | null> => {
  try {
    const response = await axios.get<ReverseGeocodeResponse>(`${locationUrl}/reverse`, {
      params: {
        lat,
        lon,
        format: 'json',  // Explicitly specifying the format
        addressdetails: 1, // Include detailed address information
      },
      headers: {
        'User-Agent': 'ReactNativeApp', // Avoid API restrictions
      },
    });

    const address = response.data.address;
    if (!address) {
      return null; // Return null if there's no address
    }

    const houseNumber = address.house_number ? `${address.house_number}` : null;
    const road = address.road ? `${address.road}` : null;

    // Some if else statements to format the address since the API format is not always consistent
    let formattedAddress = '';
    if (houseNumber && road) {
      formattedAddress = `${houseNumber}, ${road}`;
    } else if (houseNumber) {
      formattedAddress = houseNumber;
    } else if (road) {
      formattedAddress = road;
    } else {
      formattedAddress = 'Address not available';
    }
    
    const postalCode = address.postcode || null;
    const city = address.city || null;
    const displayName = response.data.display_name 
    // Log the values for debugging
    console.log('Formatted Address:', formattedAddress);
    console.log('Postal Code:', postalCode);
    console.log('City:', city);
    console.log('Display Name:', displayName)

    return {
      address: formattedAddress,
      postalCode,
      city,
      displayName,
    };
  } catch (error) {
    console.error('Error fetching address:', error);
    return null; // Return null in case of an error
  }
};
