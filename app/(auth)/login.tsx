import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
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
    <View style={tw`flex-1 bg-white p-4 justify-center`}>
      <View style={tw`w-full max-w-md mx-auto space-y-8`}>
        {/* Logo and Brand */}
        <View style={tw`flex-row items-center justify-center gap-3`}>
          {/* <Image
            source={require('../../assets/vayro-icon.png')}
            style={tw`w-8 h-8`}
            resizeMode="contain"
          /> */}
          <Text style={tw`text-3xl font-light text-gray-800`}>Vayro</Text>
        </View>

        {/* Login Form */}
        <View style={tw`mt-8 space-y-6`}>
          <View style={tw`space-y-4`}>
            {/* Username Input */}
            <View style={tw`shadow-sm`}>
              <TextInput
                placeholder="Username"
                value={credentials.username}
                onChangeText={(text) =>
                  setCredentials(prev => ({ ...prev, username: text }))
                }
                style={tw`w-full px-4 py-3 bg-white rounded-md border border-gray-200`}
                placeholderTextColor="#6B7280"
              />
            </View>

            {/* Password Input */}
            <View style={tw`shadow-sm`}>
              <TextInput
                placeholder="Password"
                value={credentials.password}
                onChangeText={(text) =>
                  setCredentials(prev => ({ ...prev, password: text }))
                }
                secureTextEntry
                style={tw`w-full px-4 py-3 bg-white rounded-md border border-gray-200`}
                placeholderTextColor="#6B7280"
              />
            </View>
          </View>

          {/* Register Link */}
          <View style={tw`items-center`}>
            <Text style={tw`underline`}>Register/Sign Up</Text>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            style={tw`w-full py-3 px-4 bg-[#B3ADA3] rounded-md`}
            activeOpacity={0.8}
          >
            <Text style={tw`text-white text-center font-medium`}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}