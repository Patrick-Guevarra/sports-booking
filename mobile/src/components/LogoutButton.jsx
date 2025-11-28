// src/components/LogoutButton.js
import React from "react";
import { Alert, TouchableOpacity, Text } from "react-native";
import { useRole } from "../RoleContext";

export default function LogoutButton({ small = false }) {
  const { logout } = useRole();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      style={{
        backgroundColor: "#ff4d4d",
        paddingVertical: small ? 6 : 12,
        paddingHorizontal: small ? 10 : 20,
        borderRadius: 8,
      }}
    >
      <Text
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: small ? 12 : 16,
        }}
      >
        Logout
      </Text>
    </TouchableOpacity>
  );
}
