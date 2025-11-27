import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { listSessions } from "../../config/api";
import { useRole } from "../../RoleContext";

export default function MySessions() {
  const { userId, role } = useRole();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!userId || role !== "coach") return;

    setLoading(true);
    try {
      const all = await listSessions();

      const myId = Number(userId);           // 🔑 Make sure it’s a number
      const mine = all.filter(
        (s) => Number(s.coach_id) === myId   // 🔑 Compare numbers
      );

      setSessions(mine);
    } catch (err) {
      console.warn("Failed to load sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [userId, role]);

  if (role !== "coach") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Only coaches have sessions.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (sessions.length === 0) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>
          You have no sessions yet.
        </Text>
        <Text style={{ marginTop: 8, color: "#6B7280" }}>
          Create one from the Coach Dashboard.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#F7F7FB" }}>
      <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 12 }}>
        My Sessions
      </Text>

      <FlatList
        data={sessions}
        keyExtractor={(item) => String(item.session_id)}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 12,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Text style={{ fontWeight: "700", fontSize: 16 }}>
              {item.sport} ({item.session_type})
            </Text>
            <Text style={{ color: "#6B7280", marginTop: 2 }}>
              {item.date} • {item.start_time}–{item.end_time}
            </Text>
            <Text style={{ marginTop: 4 }}>
              ${Number(item.price).toFixed(2)} • Capacity: {item.capacity}
            </Text>
            <Text style={{ marginTop: 4 }}>
              Status:{" "}
              <Text
                style={{
                  fontWeight: "700",
                  color: item.status === "open" ? "#10b981" : "#ef4444",
                }}
              >
                {item.status.toUpperCase()}
              </Text>
            </Text>
            {item.location ? (
              <Text style={{ marginTop: 4 }}>Location: {item.location}</Text>
            ) : null}
            {item.description ? (
              <Text style={{ marginTop: 4, color: "#4B5563" }}>
                {item.description}
              </Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}
