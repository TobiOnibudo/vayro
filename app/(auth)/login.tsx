import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import tw from 'twrnc';
import { useRouter } from "expo-router";
import { LoginUser } from '@/types/userSchema';

export default function LoginPage() {
  const router = useRouter();

  const [credentials, setCredentials] = useState<LoginUser>({
    username: '',
    password: '',
  });

  const handleSubmit = async () => {
    // Add your login logic here
    // TODO: reset useState to empty strings when done
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
          {/* Username Input */}
          <View style={tw`shadow-md mb-6`}>
            <TextInput
              style={tw`w-full px-4 py-3 bg-white rounded-lg border border-gray-200`}
              placeholder="Username"
              value={credentials.username}
              onChangeText={(text) =>
                setCredentials(prev => ({ ...prev, username: text }))
              }

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