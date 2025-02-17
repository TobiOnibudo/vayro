import * as React from 'react';
import { View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useImageStore } from '@/global-stores/imageStore';

export default function TakePictureScreen() {
  const router = useRouter();
  // const { imageAsset, setImageAsset } = useImageStore();

  // useEffect(() => {
  //   openCamera();
  // }, []);

  // async function openCamera() {
  //   try {
  //     const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
  //     if (status === 'granted') {
  //       const result = await ImagePicker.launchCameraAsync({
  //         mediaTypes: ['images'],
  //         quality: 1,
  //         aspect: [4, 3],
  //       });

  //       if (!result.canceled) {
  //         const imagePickerAsset = result.assets[0]
  //         setImageAsset(imagePickerAsset);

  //         // Navigate to photo process screen with the image URI
  //         router.push({
  //           pathname: './request-price-form',
  //         });
  //         return; // Don't go back if we have an image
  //       }
  //     }
      
  //     // Go back to previous screen if no image was taken
  //     router.back();

  //   } catch (error) {
  //     router.back();
  //   }
  // };

  // Empty view while camera is opening
  return <View />;
}
