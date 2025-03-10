import { View, Text, TextInput, Modal, Pressable } from 'react-native';
import { UserUpload } from "@/types/userSchema";
import { Picker } from "@react-native-picker/picker";
import tw from "twrnc";
import { useState } from "react";
import { CATEGORIES_VALUES, CONDITIONS_VALUES } from '@/types/priceSuggestionFormSchema';

const ConditionPickerValues = ["", ...Object.values(CONDITIONS_VALUES)];
const CategoryPickerValues = ["", ...Object.values(CATEGORIES_VALUES)];

type ItemAreaProps = {
  uploadData: UserUpload;
  setData: (data: UserUpload) => void;
  setError: (error: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  scrollToInput: (y: number) => void;
}

export function ItemArea({ 
  uploadData,
  setData,
  setError,
  setIsLoading,
  scrollToInput
}: ItemAreaProps) {
  const [showConditionPicker, setShowConditionPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  return (
    <>
      {/* Title Input */}
      <View>
        {/* Title Input */}
        <View style={tw`shadow-md mb-8`}>
          <Text style={tw`text-gray-600 font-medium mb-1 ml-1`}>Title</Text>
          <TextInput
            style={tw`w-full px-4 py-3 bg-white rounded-lg border border-gray-200`}
            placeholder="Title"
            value={String(uploadData.title)}
            onChangeText={(text) =>
              setData({ ...uploadData, title: text })
            }
            placeholderTextColor={tw.color('gray-500')}
            keyboardType="default"
          />
        </View>

        {/* Description */}
        <View style={tw`flex-col mb-7 shadow-md`}>
          <Text style={tw`text-gray-600 font-medium mb-1 ml-1`}>Description</Text>
          <TextInput
            style={tw`w-full h-40 px-3 pb-28 bg-white rounded-lg border border-gray-200`}
            placeholder="Description of item . . ."
            value={uploadData.description}
            onChangeText={(text) =>
              setData({ ...uploadData, description: text })
            }
            placeholderTextColor={tw.color('gray-500')}
            onFocus={() => scrollToInput(100)}
          >
          </TextInput>
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Year Bought</Text>
          <TextInput
            style={tw`w-full p-3 shadow-md rounded-lg bg-white`}
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, '');
              setData({ ...uploadData, boughtInYear: numericValue ? parseInt(numericValue) : 0 });
            }}
            placeholder="Year bought"
            keyboardType="number-pad"
            maxLength={4}
            onFocus={() => scrollToInput(400)}
          />
        </View>

        <View style={tw`mb-8 gap-4`}>
          <View>
            <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Condition</Text>
            <Pressable
              style={tw`w-full p-3 shadow-md rounded-lg bg-white`}
              onPress={() => setShowConditionPicker(true)}
            >
              <Text>{uploadData.condition || 'Select condition'}</Text>
            </Pressable>
            <Modal
              visible={showConditionPicker}
              transparent
              animationType="slide"
            >
              <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
                <View style={tw`bg-white w-full`}>
                  <View style={tw`flex-row justify-end p-2 border-b border-gray-200`}>
                    <Pressable
                      onPress={() => setShowConditionPicker(false)}
                      style={tw`px-4 py-2`}
                    >
                      <Text style={tw`text-blue-600 font-medium`}>Done</Text>
                    </Pressable>
                  </View>
                  <Picker
                    selectedValue={uploadData.condition}
                    onValueChange={(itemValue) => {
                      setData({ ...uploadData, condition: itemValue });
                    }}
                  >
                    {ConditionPickerValues.map((condition) => (
                      <Picker.Item
                        key={condition}
                        label={condition.charAt(0).toUpperCase() + condition.slice(1)}
                        value={condition}
                        color="black"
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </Modal>
          </View>

          <View>
            <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Category</Text>
            <Pressable
              style={tw`w-full p-3 shadow-md rounded-lg bg-white`}
              onPress={() => setShowCategoryPicker(true)}
            >
              <Text>{uploadData.category || 'Select category'}</Text>
            </Pressable>
            <Modal
              visible={showCategoryPicker}
              transparent
              animationType="slide"
            >
              <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
                <View style={tw`bg-white w-full`}>
                  <View style={tw`flex-row justify-end p-2 border-b border-gray-200`}>
                    <Pressable
                      onPress={() => setShowCategoryPicker(false)}
                      style={tw`px-4 py-2`}
                    >
                      <Text style={tw`text-blue-600 font-medium`}>Done</Text>
                    </Pressable>
                  </View>
                  <Picker
                    selectedValue={uploadData.category}
                    onValueChange={(itemValue) => {
                      setData({ ...uploadData, category: itemValue });
                    }}
                  >
                    {CategoryPickerValues.map((category) => (
                      <Picker.Item
                        key={category}
                        label={category.charAt(0).toUpperCase() + category.slice(1)}
                        value={category}
                        color="black"
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </View>
    </>
  )
}
