import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Button, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import tw from 'twrnc';
import { useRouter, usePathname } from "expo-router";
import { LoginUser } from '@/types/userSchema';
import { auth } from '@/config/firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, get } from 'firebase/database';
import { database } from '@/config/firebaseConfig';
import { useRouteInfo, useSearchParams } from 'expo-router/build/hooks';

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<LoginUser>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null); // State for error messages


  const handleLogin = async () => {
    // Validate email and password
    if (!credentials.email || !credentials.password) {
      setError("Email and password are required.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(credentials.email)) {
      setError("Invalid email format.");
      return;
    }

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
      setError("Login error: " + error.message);
    }
  };

//Consts for animation
const welcomeOpacity = useSharedValue(0);
const logoOpacity = useSharedValue(0);
const logoTranslateY = useSharedValue(50);
const formTranslateY = useSharedValue(50); 
const formOpacity = useSharedValue(0);
const welcomeBgOpacity = useSharedValue(1);
const fromLogin = useSearchParams().get('fromLogin');
const [ intoLogin, setIntoLogin ] = useState(false);
const pathName = usePathname();


useEffect(() => {

  if (intoLogin === true) {
    setIntoLogin(true);
  }
}, [pathName]);


useEffect(() => {
  const { height: screenHeight } = Dimensions.get('window');
  const logoMoveY = -screenHeight * 0.24;
  const formMoveY = -screenHeight * 0.18;

  if(!fromLogin) {
  // Step 1: Show "Welcome to" (fade in)
    welcomeOpacity.value = withTiming(1, { duration: 800 });

    // Step 2: Fade out "Welcome to"
    setTimeout(() => {
      welcomeOpacity.value = withTiming(0, { duration: 800 });
    }, 2000);

    // Step 3: Show logo in center after "Welcome to" disappears
    setTimeout(() => {
      logoOpacity.value = withTiming(1, { duration: 800 });
    }, 2800);

    // Step 4: Move logo and form up together
    setTimeout(() => {
      logoTranslateY.value = withTiming(logoMoveY, { duration: 800 });
      formOpacity.value = withTiming(1, { duration: 800 });
      formTranslateY.value = withTiming(formMoveY, { duration: 800 });
    }, 4000);
  }else {
    // Skip animation if coming from login
    formOpacity.value = withTiming(1, { duration: 0 });
    formTranslateY.value = withTiming(formMoveY, { duration: 0 });
    logoOpacity.value = withTiming(1, { duration: 0 });
    logoTranslateY.value = withTiming(logoMoveY, { duration: 0 });
    welcomeOpacity.value = withTiming(0, { duration: 0 });
  }

}, [fromLogin]);

const welcomeStyle = useAnimatedStyle(() => ({
  opacity: welcomeOpacity.value,
}));

const logoStyle = useAnimatedStyle(() => ({
  opacity: logoOpacity.value,
  transform: [{ translateY: logoTranslateY.value }],
}));

const formStyle = useAnimatedStyle(() => ({
  opacity: formOpacity.value,
  transform: [{ translateY: formTranslateY.value }],
}));

const welcomeBgStyle = useAnimatedStyle(() => ({
  opacity: welcomeBgOpacity.value,
}));

const welcomeTextStyle = useAnimatedStyle(() => ({
  opacity: welcomeOpacity.value,
}));

return (
  <View style={tw`flex-1 bg-[#f8f8f8]`}>
    <SafeAreaView style={tw`flex-1`}>

      {/* "Welcome to" Transition Background */}
      <Animated.View style={[tw`absolute w-full h-full justify-center items-center bg-[#f8f8f8]`, welcomeBgStyle]}>
        <Animated.Text style={[tw`text-4xl font-normal text-black text-center`, welcomeTextStyle]}>
          Welcome to
        </Animated.Text>
      </Animated.View>

      {/* Logo Moves Up */}
      <Animated.View style={[tw`absolute w-full h-full justify-center items-center`, logoStyle]}>
        <Image
          source={require('@/assets/images/logo_and_name.png')}
          style={tw`w-80 h-40`}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Login Form Moves up with Logo */}
      <Animated.View style={[tw`absolute bottom-28 w-full px-7`, formStyle]}>
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

        {/* Error Message */}
        {error && <Text style={tw`text-red-500 text-center mb-2`}>{error}</Text>}

        {/* Register Link */}
        <View style={tw`items-center mb-15`}>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={[tw`underline`, { color: '#3f698d' }]}>Register/Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <View style={tw`items-center`}>
        <TouchableOpacity
            style={tw`justify-center items-center w-2/3 py-3 px-4 bg-[#504a4a] rounded-lg`}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={tw`text-white text-center font-medium`}>Login</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

    </SafeAreaView>
  </View>
);

}