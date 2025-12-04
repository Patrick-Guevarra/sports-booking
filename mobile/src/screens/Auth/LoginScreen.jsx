// src/screens/Auth/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { login } from "../../config/api";
import { useRole } from "../../RoleContext";
import { COLORS } from "../../constants/colors";
import AppButton from "../../components/AppButton";

export default function LoginScreen({ navigation }) {
  const { setRole, setUserId, setFullName, setEmail } = useRole();

  const [email, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const user = await login({ email, password });
      // user = { user_id, email, role, full_name }

      setRole(user.role);
      setUserId(user.user_id);
      setFullName(user.full_name);
      setEmail(user.email);

      // No navigation.reset here; RootNavigator reacts to userId/role
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Login failed", err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center", backgroundColor: COLORS.bg }}>
      <Text style={{ fontSize: 26, fontWeight: "800", marginBottom: 6, color: COLORS.text }}>
        Welcome back
      </Text>
      <Text style={{ color: COLORS.muted, marginBottom: 20 }}>
        Sign in to manage your training sessions.
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmailInput}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
          marginBottom: 10,
          borderColor: COLORS.border,
          color: COLORS.text,
          backgroundColor: COLORS.card,
        }}
        placeholderTextColor={COLORS.muted}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
          marginBottom: 16,
          borderColor: COLORS.border,
          color: COLORS.text,
          backgroundColor: COLORS.card,
        }}
        placeholderTextColor={COLORS.muted}
      />

      <AppButton title="Log In" onPress={handleLogin} loading={loading} />

      <TouchableOpacity
        onPress={() => navigation.navigate("Signup")}
        style={{ marginTop: 16 }}
      >
        <Text style={{ textAlign: "center", color: COLORS.secondary, fontWeight:"600" }}>
          New here? Create an account
        </Text>
      </TouchableOpacity>
    </View>
  );
}
