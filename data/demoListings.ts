export interface Listing {
  lid: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  location: {
    latitude: number;
    longitude: number;
  };
  seller: {
    uid: string;
    name: string;
    email: string;
  };
  type: string;
}

export const demoListings: Listing[] = [
  {
    lid: '1',
    title: 'Vintage Chair',
    price: 150,
    description: 'Beautiful vintage wooden chair in excellent condition. Perfect for your living room!',
    imageUrl: 'https://picsum.photos/200/300',
    location: {
      latitude: 44.6489,
      longitude: -63.5753
    },
    seller: {
      uid: 'user1',
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    type: 'Furniture'
  },
  {
    lid: '2',
    title: 'Modern Lamp',
    price: 75,
    description: 'Contemporary desk lamp with adjustable brightness and sleek design.',
    imageUrl: 'https://picsum.photos/200/300',
    location: {
      latitude: 44.6500,
      longitude: -63.5700
    },
    seller: {
      uid: 'user2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com'
    },
    type: 'Electronics'
  },
  {
    lid: '3',
    title: 'Antique Book Collection',
    price: 250,
    description: 'Rare collection of antique books, perfect for collectors.',
    imageUrl: 'https://picsum.photos/200/300',
    location: {
      latitude: 44.6495,
      longitude: -63.5720
    },
    seller: {
      uid: 'user3',  
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com'
    },
    type: 'Books'
  },
  {
    lid: '4',
    title: 'Leather Messenger Bag',
    price: 120,
    description: 'Stylish and durable leather messenger bag, ideal for everyday use.',
    imageUrl: 'https://picsum.photos/200/300',
    location: {
      latitude: 44.6510,
      longitude: -63.5740
    },
    seller: {
      uid: 'user4',  
      name: 'Bob Williams',
      email: 'bob.williams@example.com'
    },
    type: 'Clothing'
  },
]; 