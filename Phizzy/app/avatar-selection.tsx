import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAvatars } from '../firebase/avatars';
import { StorageKeys } from '../constants/Config';

export default function AvatarSelectionScreen() {
  const [avatars, setAvatars] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  // Avatars live in Firebase Storage so the home screen can show the same image by index.
  useEffect(() => {
    fetchAvatars()
      .then(setAvatars)
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarSelect = async (index: number) => {
    setSelectedAvatar(index);
    try {
      await AsyncStorage.setItem(StorageKeys.selectedAvatar, index.toString());
    } catch (error) {
      console.error('Error saving avatar selection:', error);
    }
  };

  const handleContinue = () => {
    if (selectedAvatar !== null) {
      router.push('/(tabs)/home');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={32} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Select Your Hero</Text>
          </View>

          {loading && <ActivityIndicator size="large" color="white" />}
          {!loading && avatars.length === 0 && (
            <Text style={styles.emptyText}>No avatars found. Upload images to the avatars folder in Firebase Storage.</Text>
          )}
          <View style={styles.avatarGrid}>
            {avatars.map((avatar, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.avatarContainer,
                  selectedAvatar === index && styles.selectedAvatarContainer
                ]}
                onPress={() => handleAvatarSelect(index)}
              >
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
                {selectedAvatar === index && (
                  <View style={styles.selectedHighlight} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              selectedAvatar === null && styles.disabledButton
            ]}
            onPress={handleContinue}
            disabled={selectedAvatar === null}
          >
            <Text style={styles.continueButtonText}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A2DBB',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
    marginRight: 40,
  },
  emptyText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    gap: 20,
  },
  avatarContainer: {
    width: '40%',
    aspectRatio: 1,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedAvatarContainer: {
    borderColor: '#4A2DBB',
    borderWidth: 3,
    borderRadius: 25,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  selectedHighlight: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FF6B6B',
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    zIndex: 1,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#4A2DBB',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  continueButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.5)',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 