// src/screens/auth/LoginScreen.js
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

export default function LoginScreen({ navigation }) {
  const { setRole } = useRole();
  const [email, setEmail] = useState("");
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

      if (user.role === "coach") {
        navigation.reset({
          index: 0,
          routes: [{ name: "ProviderHome" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Login failed", err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        Log In
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 16 }}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Log In" onPress={handleLogin} />
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate("Signup")}
        style={{ marginTop: 16 }}
      >
        <Text style={{ textAlign: "center", color: "#007bff" }}>
          New here? Create an account
        </Text>
      </TouchableOpacity>
    </View>
  );
}
