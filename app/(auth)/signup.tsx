import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import tw from 'twrnc';
import { useRouter } from "expo-router";
import { SignUpUser } from '@/types/userSchema'; // Assume this type exists
import { Ionicons } from '@expo/vector-icons';
import { auth } from '@/config/firebaseConfig';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { ref, set } from 'firebase/database';
import { database } from '@/config/firebaseConfig';  // Make sure database is exported from your config
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCoordinates } from '@/api/locationAPI';
import { useScrollToInput } from '@/hooks/useScrollToInput';

export default function SignUp() {
  const router = useRouter();
  const { scrollToInput, scrollViewRef } = useScrollToInput();
  const [userData, setUserData] = useState<SignUpUser>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    address: '',
    phone: '',
  });
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [fieldError, setFieldError] = useState<{ [key: string]: string | null }>({}); // State for field-specific error messages

  const handleSignUp = async () => {
    // Validate email, password, and other fields
    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
      setError("All fields are required.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userData.email)) {
      setError("Invalid email format.");
      return;
    }

    if (userData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      console.log("user: " + userData)

      // get geolocation data from address
      const userLocation = await getCoordinates(userData.address)

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      console.log(userCredential)
      const user = userCredential.user;
      const userDetails = {
        uid: user?.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        address: userData.address,
        lat: userLocation?.latitude,
        lon: userLocation?.longitude,
        phone: userData.phone,
        createdAt: new Date().toISOString(),
      }

      // Save user data to Realtime Database
      await set(ref(database, '/users/' + user.uid), userDetails);

      // Save essential user data to AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(userDetails));

      console.log("User registered and data saved successfully");
      router.push('/');
    } catch (error: any) {
      console.error("Signup error:", error.message);
      setError("Signup error: " + error.message);
    }
  };

  const validateField = (field: string) => {
    if (field === 'Email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(userData.email)) {
        setFieldError(prev => ({ ...prev, email: "Invalid email format." }));
      } else {
        setFieldError(prev => ({ ...prev, email: null })); // Clear error if valid
      }
    } else if (field === 'Password') {
      if (userData.password.length < 6) {
        setFieldError(prev => ({ ...prev, password: "Password must be at least 6 characters long." }));
      } else {
        setFieldError(prev => ({ ...prev, password: null })); // Clear error if valid
      }
    } else if (field === 'Phone') {
      const phonePattern = /^[0-9]{10}$/; // Example pattern for 10-digit phone numbers
      if (!phonePattern.test(userData.phone)) {
        setFieldError(prev => ({ ...prev, phone: "Invalid phone number format." }));
      } else {
        setFieldError(prev => ({ ...prev, phone: null })); // Clear error if valid
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      style={tw`flex-1`}
    >
      <ScrollView
        ref={scrollViewRef}
        style={tw`bg-neutral-100`}
        contentContainerStyle={tw`flex-grow`}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={tw`flex-1 bg-gray-100 px-7`}>
            <SafeAreaView>
              {/* Error Message */}
              {error && <Text style={tw`text-red-500 text-center mb-4`}>{error}</Text>}

              {/* Back Button */}
              <View style={tw`flex-row items-center mt-1`}>
                <TouchableOpacity
                  onPress={() => router.push('/login')}
                  style={[tw`w-13 h-7 bg-[#ACA592] rounded-full flex-row items-center justify-center`, { marginLeft: -10 }]}>
                  <Ionicons name="arrow-back" size={18} color="white" />
                </TouchableOpacity>
              </View>

              <Text style={[tw`text-7 mt-6`, { fontWeight: '200' }]}>Registration</Text>

              {/* Sign Up Form */}
              <View style={tw`flex-row mt-8 shadow-md`}>
                {/* First Name and Last Name */}
                <TextInput
                  style={tw`w-[48%] px-4 py-3 bg-white rounded-lg border border-gray-200 mr-3`}
                  placeholder="First Name"
                  value={userData.firstName}
                  onChangeText={(text) => setUserData((prev: any) => ({ ...prev, firstName: text }))}
                  placeholderTextColor={tw.color('gray-500')}
                />
                <TextInput
                  style={tw`w-[48%] px-4 py-3 bg-white rounded-lg border border-gray-200`}
                  placeholder="Last Name"
                  value={userData.lastName}
                  onChangeText={(text) => setUserData((prev: any) => ({ ...prev, lastName: text }))}
                  placeholderTextColor={tw.color('gray-500')}
                />
              </View>
              <View style={tw`mt-10`}>
                {/* Other Inputs */}
                {['Username', 'Email', 'Password', 'Address', 'Phone'].map((field, index) => (
                  <View style={tw`shadow-md mb-12`} key={index}>
                    <TextInput
                      style={tw`w-full px-4 py-3 bg-white rounded-lg border border-gray-200`}
                      placeholder={field}
                      value={userData[field.toLowerCase() as keyof SignUpUser]}
                      onChangeText={(text) =>
                        setUserData(prev => ({ ...prev, [field.toLowerCase()]: text }))
                      }
                      secureTextEntry={field === 'Password'}
                      placeholderTextColor={tw.color('gray-500')}
                      keyboardType={field === 'Email' ? 'email-address' : (field === 'Phone' ? 'phone-pad' : 'default')}
                      onBlur={() => validateField(field)}
                    />
                    {/* Field-Specific Error Message */}
                    {fieldError[field.toLowerCase()] && (
                      <Text style={tw`text-red-500 text-sm mt-1`}>{fieldError[field.toLowerCase()]}</Text>
                    )}
                  </View>
                ))}
              </View>
              {/* Register Button */}
              <View style={tw`items-center mb-15`}>
                <TouchableOpacity
                  style={tw`h-12 justify-center items-center w-2/4 py-3 px-4 bg-[#ACA592] rounded-lg`}
                  onPress={handleSignUp}
                  activeOpacity={0.8}>
                  <Text style={tw`text-white text-center text-4.6`}>Register</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}