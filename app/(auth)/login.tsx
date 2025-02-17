import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import tw from 'twrnc';
import { useRouter } from "expo-router";
import { LoginUser } from '@/types/userSchema';
import { auth } from '@/config/firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, get } from 'firebase/database';
import { database } from '@/config/firebaseConfig';

export default function LoginPage() {
  const router = useRouter();

  const [credentials, setCredentials] = useState<LoginUser>({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    try {
      // Authenticate user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      const user = userCredential.user;
      
      // Fetch user details from Realtime Database
      const userRef = ref(database, 'users/' + user.uid);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        
        // Save user data to AsyncStorage
        const userDetails = {
          uid: user.uid,
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          email: userData.email,
          address: userData.address,
          phone: userData.phone,
          createdAt: userData.createdAt,
        };

        await AsyncStorage.setItem('userData', JSON.stringify(userDetails));
        console.log("User data saved to AsyncStorage:", userDetails);
        
        // Reset form
        setCredentials({ email: '', password: '' });
        
        // Navigate to home
        router.push('/');
      } else {
        console.error("No user data found in database");
        // Handle the case where user data doesn't exist
      }
    } catch (error: any) {
      console.error("Login error:", error.message);
      // Here you might want to add error handling UI
      // For example, showing an alert or error message to the user
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-100 px-7`}>
      <SafeAreaView>

        {/* Logo and Brand */}
        <View style={tw`flex-row items-center justify-center mt-25`}>
          <Image
            source={require('@/assets/images/logo_and_name.png')}
            style={tw`w-60 h-20`}
            resizeMode="contain"
          />
        </View>

        {/* Login Form */}
        <View style={tw`mt-10`}>
          {/* Email Input */}
          <View style={tw`shadow-md mb-6`}>
            <TextInput
              style={tw`w-full px-4 py-3 bg-white rounded-lg border border-gray-200`}
              placeholder="Email"
              value={credentials.email}
              onChangeText={(text) =>
                setCredentials(prev => ({ ...prev, email: text }))
              }
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={tw.color('gray-500')}
            />
          </View>

          {/* Password Input */}
          <View style={tw`shadow-md mb-6`}>
            <TextInput
              style={tw`w-full px-4 py-3 bg-white rounded-lg border border-gray-200`}
              placeholder="Password"
              value={credentials.password}
              onChangeText={(text) =>
                setCredentials(prev => ({ ...prev, password: text }))
              }
              secureTextEntry
              placeholderTextColor={tw.color('gray-500')}
            />
          </View>
        </View>

        {/* Register Link */}
        <View style={tw`items-center mb-15`}>
          <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={[tw`underline`, { color: '#3f698d' }]}>Register/Sign Up</Text>
          </TouchableOpacity>
        </View>


        {/* Login Button */}
        <View style={tw`items-center`}>
          <TouchableOpacity
            // HEX color value copied from Figma
            style={tw`justify-center items-center w-2/3 py-3 px-4 bg-[#ACA592] rounded-lg`}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={tw`text-white text-center font-medium`}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}