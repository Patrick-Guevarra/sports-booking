import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRole } from "../../RoleContext";
import LogoutButton from "../../components/LogoutButton";
import colorsDefault, { COLORS as COLORS_OBJ } from "../../constants/colors";

const COLORS = COLORS_OBJ || colorsDefault;

const Card = ({ title, subtitle, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.9}
    style={{
      backgroundColor: COLORS.card,
      borderColor: COLORS.border,
      borderWidth: 1,
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 10,
    }}
  >
    <Text style={{ fontWeight: "700", fontSize: 16, color: COLORS.text }}>{title}</Text>
    {subtitle ? <Text style={{ color: COLORS.muted, marginTop: 4 }}>{subtitle}</Text> : null}
  </TouchableOpacity>
);

export default function ProviderHome({ navigation }) {
  const { userId, fullName } = useRole();

  const goToNewSession = () => {
    if (!userId) {
      Alert.alert(
        "No coach ID",
        "We couldn't find your user ID. Please log out and log back in as a coach."
      );
      return;
    }
    navigation.navigate("NewSession", { coachId: userId });
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.bg }}>
      <Text style={{ fontSize: 24, fontWeight: "800", color: COLORS.text, marginBottom: 4 }}>
        Coach Dashboard
      </Text>
      {fullName && (
        <Text style={{ color: COLORS.muted, marginBottom: 12 }}>Welcome, {fullName}</Text>
      )}
      <View
              style={{
                position: "absolute",
                top: 15,
                right: 15,
                zIndex: 10,
              }}
            >
              <LogoutButton small />
      </View>

      <Card
        title="My Sessions"
        subtitle="View & edit upcoming sessions"
        onPress={() => navigation.navigate("MySessions")}
      />

      <Card
        title="Create Session"
        subtitle="Post new availability"
        onPress={goToNewSession}
      />

      <Card
        title="Bookings"
        subtitle="View who booked your sessions"
        onPress={() => navigation.navigate("ManageBookings")}
      />
    </View>
  );
}
