// mobile/src/screens/coach/NewSession.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { createSession } from "../../config/api";
import { useRole } from "../../RoleContext";

export default function NewSession({ navigation }) {
  const { role, userId } = useRole();

  const [sport, setSport] = useState("");
  const [sessionType, setSessionType] = useState("one-on-one");
  const [date, setDate] = useState("");        // YYYY-MM-DD
  const [startTime, setStartTime] = useState(""); // HH:MM
  const [endTime, setEndTime] = useState("");     // HH:MM
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("open");   // "open" | "closed"
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (role !== "coach") {
      Alert.alert("Not allowed", "Only coaches can create sessions.");
      return;
    }
    if (!userId) {
      Alert.alert("Missing user", "You must be logged in to create a session.");
      return;
    }
    if (!sport || !date || !startTime || !endTime || !price || !capacity) {
      Alert.alert(
        "Missing fields",
        "Please fill in sport, date, start/end time, price, and capacity."
      );
      return;
    }

    const priceNumber = parseFloat(price);
    const capacityNumber = parseInt(capacity, 10);

    if (Number.isNaN(priceNumber) || priceNumber <= 0) {
      Alert.alert("Invalid price", "Please enter a valid price.");
      return;
    }
    if (Number.isNaN(capacityNumber) || capacityNumber <= 0) {
      Alert.alert("Invalid capacity", "Please enter a positive integer.");
      return;
    }

    setLoading(true);
    try {
      await createSession({
        coach_id: userId,
        sport,
        session_type: sessionType,
        date,
        start_time: startTime,
        end_time: endTime,
        price: priceNumber,
        capacity: capacityNumber,
        status,
        location,
        description,
      });

      Alert.alert("Success", "Session created!", [
        { text: "OK", onPress: () => navigation.navigate("MySessions") },
      ]);
    } catch (err) {
      console.error("Create session error:", err);
      Alert.alert(
        "Error",
        err.message || "Could not create session. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { fontWeight: "600", marginBottom: 4, marginTop: 10 };
  const inputStyle = {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F7F7FB" }}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={{ fontSize: 22, fontWeight: "800" }}>Create Session</Text>

      {/* Sport */}
      <Text style={labelStyle}>Sport</Text>
      <TextInput
        placeholder="e.g. Basketball"
        value={sport}
        onChangeText={setSport}
        style={inputStyle}
      />

      {/* Session Type */}
      <Text style={labelStyle}>Session Type</Text>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => setSessionType("one-on-one")}
          style={{
            flex: 1,
            padding: 10,
            marginRight: 4,
            borderRadius: 8,
            borderWidth: 1,
            backgroundColor:
              sessionType === "one-on-one" ? "#007bff" : "#FFFFFF",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: sessionType === "one-on-one" ? "#fff" : "#000",
            }}
          >
            One-on-One
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSessionType("group")}
          style={{
            flex: 1,
            padding: 10,
            marginLeft: 4,
            borderRadius: 8,
            borderWidth: 1,
            backgroundColor: sessionType === "group" ? "#007bff" : "#FFFFFF",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: sessionType === "group" ? "#fff" : "#000",
            }}
          >
            Group
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date */}
      <Text style={labelStyle}>Date (YYYY-MM-DD)</Text>
      <TextInput
        placeholder="2025-12-01"
        value={date}
        onChangeText={setDate}
        style={inputStyle}
      />

      {/* Start / End time */}
      <Text style={labelStyle}>Start Time (HH:MM)</Text>
      <TextInput
        placeholder="14:00"
        value={startTime}
        onChangeText={setStartTime}
        style={inputStyle}
      />

      <Text style={labelStyle}>End Time (HH:MM)</Text>
      <TextInput
        placeholder="15:30"
        value={endTime}
        onChangeText={setEndTime}
        style={inputStyle}
      />

      {/* Price */}
      <Text style={labelStyle}>Price</Text>
      <TextInput
        placeholder="50.00"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
        style={inputStyle}
      />

      {/* Capacity */}
      <Text style={labelStyle}>Capacity (number of athletes)</Text>
      <TextInput
        placeholder="5"
        value={capacity}
        onChangeText={setCapacity}
        keyboardType="number-pad"
        style={inputStyle}
      />

      {/* Status */}
      <Text style={labelStyle}>Status</Text>
      <View style={{ flexDirection: "row", marginBottom: 4 }}>
        <TouchableOpacity
          onPress={() => setStatus("open")}
          style={{
            flex: 1,
            padding: 10,
            marginRight: 4,
            borderRadius: 8,
            borderWidth: 1,
            backgroundColor: status === "open" ? "#10b981" : "#FFFFFF",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: status === "open" ? "#fff" : "#000",
            }}
          >
            Open
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setStatus("closed")}
          style={{
            flex: 1,
            padding: 10,
            marginLeft: 4,
            borderRadius: 8,
            borderWidth: 1,
            backgroundColor: status === "closed" ? "#ef4444" : "#FFFFFF",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: status === "closed" ? "#fff" : "#000",
            }}
          >
            Closed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Location */}
      <Text style={labelStyle}>Location (optional)</Text>
      <TextInput
        placeholder="Gym A, Field 3, etc."
        value={location}
        onChangeText={setLocation}
        style={inputStyle}
      />

      {/* Description */}
      <Text style={labelStyle}>Description (optional)</Text>
      <TextInput
        placeholder="What will you focus on in this session?"
        value={description}
        onChangeText={setDescription}
        multiline
        style={[inputStyle, { minHeight: 80, textAlignVertical: "top" }]}
      />

      <View style={{ marginTop: 20, marginBottom: 10 }}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button title="Publish Session" onPress={handlePublish} />
        )}
      </View>
    </ScrollView>
  );
}
