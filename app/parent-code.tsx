import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from './_layout';
import { PARENT_CODE_LENGTH } from '../constants/Config';

export default function ParentCodeScreen() {
  const router = useRouter();
  const { themeColor } = useContext(ThemeContext);
  const { exerciseName } = useLocalSearchParams<{ exerciseName?: string }>();
  const [code, setCode] = useState('');

  // Navigate to the recording screen once a full code is entered.
  // NOTE: the code is not verified yet; any PARENT_CODE_LENGTH-digit code is accepted.
  useEffect(() => {
    if (code.length === PARENT_CODE_LENGTH) {
      router.replace({ pathname: '/play', params: exerciseName ? { exerciseName } : {} });
    }
  }, [code]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColor }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={32} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Parent Verification</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Parent Code Required</Text>
          <Text style={styles.subtitle}>
            Please enter the {PARENT_CODE_LENGTH}-digit parent verification code
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={`Enter ${PARENT_CODE_LENGTH}-digit code`}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={PARENT_CODE_LENGTH}
              autoFocus
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 48,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
}); 