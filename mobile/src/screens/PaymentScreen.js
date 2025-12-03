import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { createPayment } from "../config/api";

export default function PaymentScreen() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    setStatus(null);

    try {
      const response = await createPayment({
        amount: 5000,
        currency: "usd",
        description: "Booking Payment",
        user_id: 1,
        booking_id: 123,
      });

      setStatus("Payment successful! Payment ID: " + response.payment_id);
    } catch (err) {
      setStatus("Payment failed: " + err.message);
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Payment</Text>

      <TouchableOpacity style={styles.button} onPress={handlePay}>
        <Text style={styles.buttonText}>
          {loading ? "Processing..." : "Pay Now"}
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />}

      {status && <Text style={styles.status}>{status}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#0066FF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  status: {
    marginTop: 20,
    fontSize: 16,
  },
});
