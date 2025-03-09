import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggedInUser } from '@/types/userSchema';

/**
 * Hook to load user data from AsyncStorage
 * @param setIsLoading - External function to set loading state
 * @returns Object containing user data and a function to reload user data
 */
export function useLoadUser(
  setIsLoading: Dispatch<SetStateAction<boolean>>
) {
  const [user, setUser] = useState<LoggedInUser | null>(null);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return { user, loadUser };
}
