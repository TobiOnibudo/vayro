import axios from 'axios';

interface GeocodeResponse {
  lat: string;
  lon: string;
}

interface ReverseGeocodeResponse {
  display_name: string;
}

// Function to get coordinates from an address
export const getCoordinates = async (address: string): Promise<{ lat: number; lon: number } | null> => {
  try {
    const response = await axios.get<GeocodeResponse[]>('https://nominatim.openstreetmap.org/search', {
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
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
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
export const getAddress = async (lat: number, lon: number): Promise<string | null> => {
  try {
    const response = await axios.get<ReverseGeocodeResponse>('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon,
        format: 'jsonv2',
      },
      headers: {
        'User-Agent': 'ReactNativeApp',
      },
    });

    console.log('Address:', response.data.display_name);
    return response.data.display_name;
  } catch (error) {
    console.error('Error fetching address:', error);
    return null;
  }
};

