import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebaseConfig";
import { DEFAULT_THEME_COLOR, StorageKeys } from "../constants/Config";

const auth = getAuth(app);

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter your email and password.");
      return;
    }
    setSubmitting(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
      // The Firebase UID doubles as the Firestore program document ID.
      await AsyncStorage.setItem(StorageKeys.userId, user.uid);
      const hasAvatar = await AsyncStorage.getItem(StorageKeys.selectedAvatar);
      router.replace(hasAvatar ? "/(tabs)/home" : "/avatar-selection");
    } catch (error: any) {
      console.error("Login failed:", error);
      Alert.alert("Login failed", "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Phizzy</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Enter Phizzy</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: DEFAULT_THEME_COLOR },
  logo: { fontSize: 40, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  input: { width: "80%", backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 10 },
  buttonPrimary: { backgroundColor: "#ff7f50", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, minWidth: 160, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
