import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView} from 'react-native';
import { auth } from '@/config/firebaseConfig'; 
import { updatePassword } from 'firebase/auth';
import tw from 'twrnc';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const UpdatePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');

    const handleUpdatePassword = async () => {
        const user = auth.currentUser;
        console.log(user)

        if (user) {
            if (!confirmPassword || !newPassword) {
                Alert.alert("Error", "Please fill in all fields.");
                return;
            }

            try {
                console.log(user)
                await updatePassword(user, newPassword);
                Alert.alert("Success", "Password updated successfully!");
                router.back()
            } catch (error: any) {
                if (error.code === 'auth/wrong-password') {
                    Alert.alert("Error", "Current password is incorrect.");
                } else {
                    Alert.alert("Error", error.message);
                }
            }
        } else {
            Alert.alert("Error", "No user is currently logged in.");
        }
    };

    const handleConfirmPasswordBlur = () => {
        if (newPassword !== confirmPassword) {
            setPasswordMatchError("Passwords do not match.");
        } else {
            setPasswordMatchError("");
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-100 px-7`}>
            <View style={tw`flex-row items-center justify-between mt-4`}>
                <TouchableOpacity onPress={() => router.back()} style={tw`ml-3`}>
                    <Ionicons name="arrow-back" size={24} color="#ACA592" />
                </TouchableOpacity>
            </View>

            <View style={tw`relative top-40 left-0 right-0 items-center`}>
                <View style={tw`mb-4`}>
                    <Text style={tw`text-2xl font-bold text-center mt-4`}>Update Password</Text>
                </View>
            </View>

            <View style={tw`flex-2 justify-center items-center`}>
                <View style={tw`mt-4 w-4/5`}>
                    <TextInput
                        style={tw`w-full px-4 py-3 bg-white rounded-lg border border-gray-200`}
                        placeholder="New Password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        placeholderTextColor="#A9A9A9"
                    />
                </View>
                <View style={tw`mt-4 w-4/5`}>
                    <TextInput
                        style={tw`w-full px-4 py-3 bg-white rounded-lg border border-gray-200`}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        onBlur={handleConfirmPasswordBlur}
                        secureTextEntry
                        placeholderTextColor="#A9A9A9"
                    />
                    {passwordMatchError ? (
                        <Text style={tw`text-red-500 text-sm mt-1`}>{passwordMatchError}</Text>
                    ) : null}
                </View>
                <View style={tw`mt-4 w-4/5`}>
                    <TouchableOpacity
                        style={tw`h-12 justify-center items-center w-full py-3 px-4 bg-[#ACA592] rounded-lg`}
                        onPress={handleUpdatePassword}
                        activeOpacity={0.8}>
                        <Text style={tw`text-white text-center`}>Update Password</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default UpdatePassword; 