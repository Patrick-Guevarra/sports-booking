// src/screens/auth/SignupScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { signup } from "../../config/api";
import { useRole } from "../../RoleContext";

export default function SignupScreen({ navigation }) {
  const { role, setRole } = useRole(); // role not used right now, but fine to keep
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleChoice, setRoleChoice] = useState("athlete"); // "athlete" | "coach"
  const [sportSpecialty, setSportSpecialty] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Missing info", "Please fill in full name, email, and password.");
      return;
    }

    setLoading(true);
    try {
      const user = await signup({
        full_name: fullName,
        email,
        password,
        role: roleChoice,
        sport_specialty: sportSpecialty || null,
      });

      // Update global role so RootNavigator switches stack
      setRole(user.role);

      // Decide which screen to go to
      const target = user.role === "coach" ? "ProviderHome" : "Home";

      // Simple navigate – RootNavigator key={role} will remount the stack
      navigation.navigate(target);
    } catch (err) {
      console.error("Signup error:", err);
      Alert.alert("Signup failed", err.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        Create Account
      </Text>

      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 }}
      />

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

      <Text style={{ fontWeight: "600", marginBottom: 6 }}>I am a:</Text>
      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        <TouchableOpacity
          onPress={() => setRoleChoice("athlete")}
          style={{
            flex: 1,
            padding: 10,
            marginRight: 4,
            borderRadius: 8,
            borderWidth: 1,
            backgroundColor: roleChoice === "athlete" ? "#007bff" : "#fff",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: roleChoice === "athlete" ? "#fff" : "#000",
            }}
          >
            Athlete
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setRoleChoice("coach")}
          style={{
            flex: 1,
            padding: 10,
            marginLeft: 4,
            borderRadius: 8,
            borderWidth: 1,
            backgroundColor: roleChoice === "coach" ? "#007bff" : "#fff",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: roleChoice === "coach" ? "#fff" : "#000",
            }}
          >
            Coach
          </Text>
        </TouchableOpacity>
      </View>

      {roleChoice === "coach" && (
        <TextInput
          placeholder="Sport Specialty (e.g. Basketball)"
          value={sportSpecialty}
          onChangeText={setSportSpecialty}
          style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 16 }}
        />
      )}

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Sign Up" onPress={handleSignup} />
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={{ marginTop: 16 }}
      >
        <Text style={{ textAlign: "center", color: "#007bff" }}>
          Already have an account? Log in
        </Text>
      </TouchableOpacity>
    </View>
  );
}
