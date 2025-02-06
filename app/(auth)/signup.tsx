import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import tw from 'twrnc';
import { useRouter } from "expo-router";
import { SignUpUser} from '@/types/userSchema'; // Assume this type exists
import { Ionicons } from '@expo/vector-icons';



export default function SignUp() {
    const router = useRouter();

    const [userData, setUserData] = useState<SignUpUser>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        address: '',
        phone: '',
    });

    const handleSignUp = async () => {
        // Add your registration logic here
        // TODO: reset useState to empty strings when done
    };


    return (
        <View style={tw`flex-1 bg-gray-100 px-7`}>
            <SafeAreaView>
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
                              />
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



    );

}