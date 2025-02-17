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
    email: string;
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
      email: 'john.doe@example.com'
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
      longitude: -63.5700
    },
    seller: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com'
    }
  },
  // Add more demo items with different locations as needed
  {
    id: '3',
    title: 'Antique Book Collection',
    price: 250,
    description: 'Rare collection of antique books, perfect for collectors.',
    image: 'https://picsum.photos/200/300',
    location: {
      latitude: 44.6495,
      longitude: -63.5720
    },
    seller: {
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com'
    }
  },
  {
    id: '4',
    title: 'Leather Messenger Bag',
    price: 120,
    description: 'Stylish and durable leather messenger bag, ideal for everyday use.',
    image: 'https://picsum.photos/200/300',
    location: {
      latitude: 44.6510,
      longitude: -63.5740
    },
    seller: {
      name: 'Bob Williams',
      email: 'bob.williams@example.com'
    }
  },
]; 