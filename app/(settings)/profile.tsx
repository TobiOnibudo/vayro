import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '@/config/firebaseConfig'; 
import { useRouter } from 'expo-router'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggedInUser } from '@/types/userSchema'; 
import { ref, set } from 'firebase/database';
import { database } from '@/config/firebaseConfig';

export default function Profile() {
    const router = useRouter(); 
    const [newUsername, setNewUsername] = useState(''); 
    const [userData, setUserData] = useState<LoggedInUser | null>(null); 
    const [newAddress, setNewAddress] = useState('');

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString) {
                    const userData = JSON.parse(userDataString) as LoggedInUser;
                    setUserData(userData);
                    setNewUsername(userData.username); // Set initial username
                    setNewAddress(userData.address); // Set initial address
                }
            } catch (error) {
                console.error("Failed to load user data from AsyncStorage", error);
            }
        };
        loadUserData(); 
    }, []);

    const handleChangePassword = () => {
        router.push('/(settings)/update-password'); // Navigate to UpdatePassword screen
    };

    const handleLogout = () => {
        auth.signOut().then(async () => {
            await AsyncStorage.clear(); 
            Alert.alert("Logout", "You have been logged out.");
            router.push('/(auth)/login?fromLogin=true');
        }).catch((error) => {
            Alert.alert("Logout Error", error.message);
        });
    };

    const handleUpdateUserInfo = async () => {
        if (userData) {
            const updatedUserData = { ...userData, username: newUsername, address: newAddress };
            await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
            await set(ref(database, 'users/' + auth.currentUser?.uid), updatedUserData);
            setUserData(updatedUserData);
            Alert.alert("Success", "User info updated successfully!");
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-100 px-7`}>
            <View style={tw`mt-6`}>
                {/* Header with Back Button and Title */}
                <View style={tw`flex-row items-center justify-between w-full`}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={tw`flex-row items-center ml-3`}>
                        <Ionicons name="arrow-back" size={24} color="#ACA592" />
                    </TouchableOpacity>
                    <Text style={[tw`text-2xl`, { fontWeight: 'bold', flex: 1, textAlign: 'center' }]}>User Settings</Text>
                </View>

                {/* Email Display */}
                <View style={tw`mt-4 w-4/5 mx-auto`}>
                    <Text style={tw`text-gray-600`}>Email</Text>
                    <Text style={tw`w-full px-4 py-3 bg-white rounded-lg border border-gray-200`}>
                        {userData?.email}
                    </Text>
                </View>

                {/* Username Input */}
                <View style={tw`mt-4 w-4/5 mx-auto`}>
                    <Text style={tw`text-gray-600`}>Username</Text>
                    <TextInput
                        style={tw`w-full px-4 py-3 bg-white rounded-lg border border-gray-200`}
                        placeholder="Username"
                        value={newUsername}
                        onChangeText={setNewUsername}
                        placeholderTextColor="#A0A0A0"
                    />
                </View>

                {/* New Password Input */}
                <View style={tw`mt-4 w-4/5 mx-auto`}>
                    <Text style={tw`text-gray-600`}>Address</Text>
                    <TextInput
                        style={tw`w-full px-4 py-3 bg-white rounded-lg border border-gray-200`}
                        placeholder="Address"
                        value={newAddress}
                        onChangeText={setNewAddress}
                        placeholderTextColor="#A0A0A0"
                    />
                </View>

                {/* Update User Button */}
                <View style={tw`mt-4 w-4/5 mx-auto`}>
                    <TouchableOpacity
                        style={tw`h-12 justify-center items-center w-full py-3 px-4 bg-[#ACA592] rounded-lg`}
                        onPress={handleUpdateUserInfo}
                        activeOpacity={0.8}>
                        <Text style={tw`text-white text-center`}>Update User Info </Text>
                    </TouchableOpacity>
                </View>
                {/* Change Password Button */}
                <View style={tw`mt-4 w-4/5 mx-auto`}>
                    <TouchableOpacity
                        style={tw`h-12 justify-center items-center w-full py-3 px-4 bg-[#ACA592] rounded-lg`}
                        onPress={handleChangePassword}
                        activeOpacity={0.8}>
                        <Text style={tw`text-white text-center`}>Change Password</Text>
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <View style={tw`mt-4 w-4/5 mx-auto`}>
                    <TouchableOpacity
                        style={tw`h-12 justify-center items-center w-full py-3 px-4 bg-red-500 rounded-lg`}
                        onPress={handleLogout}
                        activeOpacity={0.8}>
                        <Text style={tw`text-white text-center`}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
} 