// src/screens/Auth/SignupScreen.js
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
  // from RoleContext
  const { setRole, setUserId, setFullName, setEmail } = useRole();

  // local form state
  const [fullName, setFullNameInput] = useState("");
  const [email, setEmailInput] = useState("");
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
      // user = { user_id, full_name, email, role }

      // save into global context
      setRole(user.role);
      setUserId(user.user_id);
      setFullName(user.full_name);
      setEmail(user.email);

      // no navigation.reset here – RootNavigator will see userId/role
      // and automatically show ProviderHome or Home as the initial screen
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
        onChangeText={setFullNameInput}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
          marginBottom: 10,
        }}
      />

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
        }}
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
        }}
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
          style={{
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            marginBottom: 16,
          }}
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
