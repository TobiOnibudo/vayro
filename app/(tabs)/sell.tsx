import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useState } from 'react';
import tw from 'twrnc';
import { useRouter } from "expo-router";
import { LoggedInUser, userUpload} from '@/types/userSchema';
import { Ionicons } from '@expo/vector-icons';


export default function TabTwoScreen() {
  const router = useRouter();
  const [user, setUser] = React.useState<LoggedInUser | null>(null);

  //Handle user authentication and link with firebase for user

    const [uploadData, setData] = useState<userUpload>({
        title: '',
        price: '',
        address: '',
        city: '',
        postal: '',
        description: '',
    })


    const handleUpload = async () => {
        //toDo: handle putting into firebase
    }

  return (
    <View style={tw`flex-1 bg-gray-100 px-7`}>
    <SafeAreaView>
        {/* Back Button*/}
          <View style={tw`px-4 pt-2 pb-4`}>
              <TouchableOpacity
                  onPress={() => router.push('/')}
                  style={[tw`w-13 h-7 bg-[#ACA592] rounded-full flex-row items-center justify-center`, { marginLeft: -10 }]}>
                  <Ionicons name="arrow-back" size={18} color="white" />
              </TouchableOpacity>
          </View>


         <View style={tw`flex-row justify-between px-4 pt-2`}>
          <Text style={[tw`text-6 pt-3`, { fontWeight: '400' }]}>Sell</Text>

          <TouchableOpacity 
                  onPress={() => router.push('..')}
                  style={tw`p-2 w-10 bg-[#ACA592] rounded-full`}>
                  <Ionicons name="camera" size={25} color="white" />
              </TouchableOpacity>

         </View> 


        

        {/* Other Inputs */}
        <View style={tw`mt-5`}>
          {['Title', 'Price', 'Address'].map((field, index) => (
            <View style={tw`shadow-md mb-10`} key={index}>
              <TextInput
                style={tw`w-full px-4 py-3 bg-white rounded-lg border border-gray-200`}
                placeholder={field}
                value={uploadData[field.toLowerCase() as keyof userUpload]}
                onChangeText={(text) =>
                setData(prev => ({ ...prev, [field.toLowerCase()]: text }))
                }
                secureTextEntry={field === 'Password'}
                placeholderTextColor={tw.color('gray-500')}
                keyboardType={field === 'Email' ? 'email-address' : (field === 'Phone' ? 'phone-pad' : 'default')}
                />
            </View>
          ))}       
        </View>


          {/* City & Postal Form */}
          <View style={tw`flex-row shadow-md mb-10`}>
              {/* First Name and Last Name */}
              <TextInput
                style={tw`w-[48%] px-4 py-3 mr-3 bg-white rounded-lg border border-gray-200 `}
                placeholder="City"
                value={uploadData.city}
                onChangeText={(text) => setData((prev: any) => ({ ...prev, city: text }))}
                placeholderTextColor={tw.color('gray-500')}
              />
              <TextInput
                style={tw`w-[48%] px-4 py-3 bg-white rounded-lg border border-gray-200`}
                placeholder="Postal"
                value={uploadData.postal}
                onChangeText={(text) => setData((prev: any) => ({ ...prev, Postal: text }))}
                placeholderTextColor={tw.color('gray-500')}
              />
          </View>

          {/* Description */}     
          <View style={tw`flex-column mb-7 shadow-md`}>
            <TextInput
            style={tw`w-full h-40 px-3 pb-28 bg-white rounded-lg border border-gray-200`}
            placeholder="Description of item . . ."
            value={uploadData.description}
            onChangeText={(text) =>
              setData(prev => ({ ...prev, description: text }))
            }
            placeholderTextColor={tw.color('gray-500')}>
            </TextInput>
          </View>    

          {/* Upload Button */} 
          <View style={tw`items-center`}>
            <TouchableOpacity
              style={tw`h-11 justify-center items-center w-2/4 py-3 px-4 bg-[#ACA592] rounded-lg`}
              onPress={handleUpload}
              activeOpacity={0.8}>
              <Text style={tw`text-white text-center text-4.6`}>Upload</Text>
            </TouchableOpacity>
          </View>

    </SafeAreaView>
</View>
  )
    
}


