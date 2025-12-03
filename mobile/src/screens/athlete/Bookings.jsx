// mobile/src/screens/athlete/Bookings.jsx

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import { createPayment } from "../../config/api"; // <-- our API helper
import { MOCK_BOOKINGS } from "../../constants/mockData";
import { COLORS } from "../../constants/colors";
import BookingCard from "../../components/BookingCard";

export default function Bookings() {
  const [data, setData] = useState(MOCK_BOOKINGS);
  const [refreshing, setRefreshing] = useState(false);
  const [payingId, setPayingId] = useState(null); // which booking is currently paying

  // Pull-to-refresh – still just re-loads mock data
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // simulate fetch from backend
    setTimeout(() => {
      setData([...MOCK_BOOKINGS]); // in a real app you’d fetch here
      setRefreshing(false);
    }, 600);
  }, []);

  // ---- PAY NOW HANDLER ----
  const handlePayNow = async (booking) => {
    try {
      setPayingId(booking.id);

      // Choose an amount – adjust these fields to match your real booking model
      const amount =
        booking.amount_cents ??
        (booking.price ? Math.round(booking.price * 100) : 5000); // fallback: $50.00

      const description =
        booking.title ||
        booking.session_name ||
        `Booking #${booking.id || "unknown"}`;

      const body = {
        amount, // cents (because backend only checks > 0 in our simulation)
        currency: "usd",
        description,
        user_id: booking.user_id || 1, // TODO: replace with real logged-in user id
        booking_id: booking.id ?? 123,
      };

      const res = await createPayment(body);

      Alert.alert(
        "Payment successful",
        `Payment ID: ${res.payment_id}\nStatus: ${res.status}`
      );
    } catch (err) {
      console.warn("Payment error", err);
      Alert.alert(
        "Payment failed",
        err?.message || "Something went wrong, please try again."
      );
    } finally {
      setPayingId(null);
    }
  };

  // ---- EMPTY STATE ----
  if (!data || data.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.bg,
          padding: 16,
        }}
      >
        <Text
          style={{
            color: COLORS.muted,
            textAlign: "center",
          }}
        >
          You don’t have any bookings yet.
        </Text>
      </View>
    );
  }

  // ---- RENDER ----
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.bg }}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            {/* Existing booking UI */}
            <BookingCard item={item} />

            {/* Pay Now button */}
            <TouchableOpacity
              onPress={() => handlePayNow(item)}
              disabled={payingId === item.id}
              style={{
                marginTop: 8,
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  payingId === item.id ? COLORS.disabled : COLORS.primary,
              }}
            >
              {payingId === item.id ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Pay Now
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
