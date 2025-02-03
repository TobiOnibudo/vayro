import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import tw from 'twrnc';
import { useRouter } from "expo-router";

export default function LoginPage() {
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async () => {
    // Add your login logic here
  };

  return (
    <View style={tw`flex-1 bg-gray-100 px-7`}>
      <SafeAreaView>

        {/* Logo and Brand */}
        <View style={tw`flex-row items-center justify-center gap-3 mt-25`}>
          {/* <Image
            source={require('../../assets/vayro-icon.png')}
            style={tw`w-8 h-8`}
            resizeMode="contain"
          /> */}
          <Text style={tw`text-3xl font-light text-gray-800`}>Vayro</Text>
        </View>

        {/* Login Form */}
        <View style={tw`mt-10`}>
          {/* Username Input */}
          <View style={tw`shadow-md mb-6`}>
            <TextInput
              style={tw`w-full px-4 py-3 bg-white rounded-lg border border-gray-200`}
              placeholder="Username"
              value={credentials.username}
              onChangeText={(text) =>
                setCredentials(prev => ({ ...prev, username: text }))
              }

              placeholderTextColor="#6B7280"
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
              placeholderTextColor="#6B7280"
            />
          </View>
        </View>

        {/* Register Link */}
        <View style={tw`items-center mb-15`}>
          <Text style={tw`underline`}>Register/Sign Up</Text>
        </View>

        {/* Login Button */}
        <View style={tw`items-center`}>
          <TouchableOpacity
            // HEX color value copied from Figma
            style={tw`justify-center items-center w-2/3 py-3 px-4 bg-[#ACA592] rounded-lg`}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={tw`text-white text-center font-medium`}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}