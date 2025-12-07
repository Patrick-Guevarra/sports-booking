import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { COLORS } from "../constants/colors";

// Reusable button that supports variant styling and loading state for form actions.

export default function AppButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary", // "primary" | "secondary" | "ghost" | "danger"
  style,
}) {
  const isGhost = variant === "ghost";
  const isSecondary = variant === "secondary";
  const isDanger = variant === "danger";

  let backgroundColor = COLORS.primary;
  let borderColor = COLORS.primary;
  let textColor = "#0B1628";

  if (isGhost) {
    backgroundColor = "transparent";
    borderColor = COLORS.border;
    textColor = COLORS.text;
  } else if (isSecondary) {
    backgroundColor = COLORS.secondary;
    borderColor = COLORS.secondary;
    textColor = "#0B1628";
  } else if (isDanger) {
    backgroundColor = "#EF4444";
    borderColor = "#EF4444";
    textColor = "#fff";
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          backgroundColor,
          borderColor,
          borderWidth: 1,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled || loading ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={{ color: textColor, fontWeight: "700", fontSize: 15 }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
