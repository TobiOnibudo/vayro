import { View, Text, TextInput, Modal, Pressable, TouchableOpacity, Keyboard, TouchableWithoutFeedback, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import tw from "twrnc";
import { useState } from "react";
import { schema, type FormSchema, CONDITIONS_VALUES, CATEGORIES_VALUES } from "@/types/priceSuggestionFormSchema";
import { useRouter } from "expo-router";
import { useScrollToInput } from "@/hooks/useScrollToInput";

const ConditionPickerValues = ["", ...Object.values(CONDITIONS_VALUES)];
const CategoryPickerValues = ["", ...Object.values(CATEGORIES_VALUES)];

export default function RequestPriceScreen() {
  const router = useRouter();

  //useForm is a hook that allows you to manage the form state and validation with Zod
  const { control, handleSubmit, formState: { errors } } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  const [showConditionPicker, setShowConditionPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const { scrollToInput, scrollViewRef } = useScrollToInput();

  const onSubmit = async (data: FormSchema) => {
    router.push({
      pathname: "/(price-suggestion)/gemini-response",
      params: { paramsData: JSON.stringify(data) },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      style={tw`flex-1`}
    >
      <ScrollView
        ref={scrollViewRef}
        style={tw`bg-neutral-100`}
        contentContainerStyle={tw`flex-grow`}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={tw`p-4`}>
            <Text style={tw`text-2xl font-bold mb-6 text-center text-gray-800`}>
              Ask Gemini
            </Text>

            <View style={tw`gap-4`}>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Title</Text>
                    <TextInput
                      style={tw`w-full p-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white`}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Title"
                      onFocus={() => scrollToInput(0)}
                    />
                    {errors.title && (
                      <Text style={tw`text-red-500 text-sm mt-1`}>{errors.title.message}</Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Description</Text>
                    <TextInput
                      style={tw`w-full p-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white h-24`}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Description"
                      multiline
                      textAlignVertical="top"
                      onFocus={() => scrollToInput(100)}
                    />
                    {errors.description && (
                      <Text style={tw`text-red-500 text-sm mt-1`}>{errors.description.message}</Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="condition"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Condition</Text>
                    <Pressable
                      style={tw`w-full p-3 border ${errors.condition ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white`}
                      onPress={() => setShowConditionPicker(true)}
                    >
                      <Text>{value || 'Select condition'}</Text>
                    </Pressable>
                    {errors.condition && (
                      <Text style={tw`text-red-500 text-sm mt-1`}>{errors.condition.message}</Text>
                    )}
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
                            selectedValue={value}
                            onValueChange={(itemValue) => {
                              onChange(itemValue);
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
                )}
              />

              <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Category</Text>
                    <Pressable
                      style={tw`w-full p-3 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white`}
                      onPress={() => setShowCategoryPicker(true)}
                    >
                      <Text>{value || 'Select category'}</Text>
                    </Pressable>
                    {errors.category && (
                      <Text style={tw`text-red-500 text-sm mt-1`}>{errors.category.message}</Text>
                    )}
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
                            selectedValue={value}
                            onValueChange={(itemValue) => {
                              onChange(itemValue);
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
                )}
              />

              <Controller
                control={control}
                name="boughtInYear"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Year Bought</Text>
                    <TextInput
                      style={tw`w-full p-3 border ${errors.boughtInYear ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white`}
                      onChangeText={(text) => {
                        const numericValue = text.replace(/[^0-9]/g, '');
                        onChange(numericValue ? parseInt(numericValue) : undefined);
                      }}
                      value={value?.toString()}
                      placeholder="Year bought"
                      keyboardType="number-pad"
                      maxLength={4}
                      onFocus={() => scrollToInput(400)}
                    />
                    {errors.boughtInYear && (
                      <Text style={tw`text-red-500 text-sm mt-1`}>{errors.boughtInYear.message}</Text>
                    )}
                  </View>
                )}
              />

              <View style={tw`mt-6`}>
                <TouchableOpacity
                  style={tw`bg-[#ACA592] p-3 rounded-lg mb-10`}
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text style={tw`text-white text-center font-medium`}>Request Price</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}