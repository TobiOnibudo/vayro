export interface Listing {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  location: {
    latitude: number;
    longitude: number;
  };
  seller: {
    name: string;
    rating: number;
  };
}

export const demoListings: Listing[] = [
  {
    id: '1',
    title: 'Vintage Chair',
    price: 150,
    description: 'Beautiful vintage wooden chair in excellent condition. Perfect for your living room!',
    image: 'https://picsum.photos/200/300',
    location: {
      latitude: 44.6489,
      longitude: -63.5753
    },
    seller: {
      name: 'John Doe',
      rating: 4.5
    }
  },
  {
    id: '2',
    title: 'Modern Lamp',
    price: 75,
    description: 'Contemporary desk lamp with adjustable brightness and sleek design.',
    image: 'https://picsum.photos/200/300',
    location: {
      latitude: 44.6500,
      longitude: -63.5950
    },
    seller: {
      name: 'Jane Smith',
      rating: 4.8
    }
  },
  // Add more demo items with different locations as needed
]; 