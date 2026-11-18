import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '../constants/Config';

// Entry route: send signed-in users to Home, everyone else to Login.
export default function Index() {
  const [target, setTarget] = useState<'/login' | '/(tabs)/home' | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(StorageKeys.userId)
      .then((userId) => setTarget(userId ? '/(tabs)/home' : '/login'))
      .catch(() => setTarget('/login'));
  }, []);

  if (!target) return null;
  return <Redirect href={target} />;
}
