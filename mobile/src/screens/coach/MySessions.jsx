import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Alert } from "react-native";
import { listSessions, updateSessionStatus, deleteSession } from "../../config/api";
import { useRole } from "../../RoleContext";
import { COLORS } from "../../constants/colors";

export default function MySessions() {
  // Coach-facing screen to review, close/reopen, or delete their own sessions.
  const { userId, role } = useRole();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    // Pull all sessions then filter by logged-in coach ID.
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

  const onCloseSession = async (sessionId) => {
    // Marks a session closed to stop new bookings.
    if (!userId) return;
    setUpdating(true);
    try {
      await updateSessionStatus({
        sessionId,
        status: "closed",
        coachId: Number(userId),
      });
      await load();
      Alert.alert("Session closed", "This session is now closed to new bookings.");
    } catch (err) {
      console.warn("Close session error:", err);
      Alert.alert("Error", err.message || "Could not close session.");
    } finally {
      setUpdating(false);
    }
  };

  const onReopenSession = async (sessionId) => {
    // Re-opens a session that was closed.
    if (!userId) return;
    setUpdating(true);
    try {
      await updateSessionStatus({
        sessionId,
        status: "open",
        coachId: Number(userId),
      });
      await load();
      Alert.alert("Session reopened", "This session is now open to new bookings.");
    } catch (err) {
      console.warn("Reopen session error:", err);
      Alert.alert("Error", err.message || "Could not reopen session.");
    } finally {
      setUpdating(false);
    }
  };

  const onDeleteSession = async (sessionId) => {
    // Hard delete; cascades bookings server-side. Confirmation required.
    if (!userId) return;
    Alert.alert(
      "Delete session?",
      "This will remove the session and its bookings.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(sessionId);
            try {
              await deleteSession({ sessionId, coachId: Number(userId) });
              await load();
            } catch (err) {
              console.warn("Delete session error:", err);
              Alert.alert("Error", err.message || "Could not delete session.");
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    load();
  }, [userId, role]);

  if (role !== "coach") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.bg }}>
        <Text style={{ color: COLORS.text }}>Only coaches have sessions.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.bg }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (sessions.length === 0) {
    return (
      <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.bg }}>
        <Text style={{ fontSize: 18, fontWeight: "600", color: COLORS.text }}>
          You have no sessions yet.
        </Text>
        <Text style={{ marginTop: 8, color: COLORS.muted }}>
          Create one from the Coach Dashboard.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.bg }}>
      <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 12, color: COLORS.text }}>
        My Sessions
      </Text>

      <FlatList
        data={sessions}
        keyExtractor={(item) => String(item.session_id)}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: COLORS.card,
              borderRadius: 14,
              padding: 14,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: COLORS.border,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 10,
            }}
          >
            <Text style={{ fontWeight: "700", fontSize: 16, color: COLORS.text }}>
              {item.sport} ({item.session_type})
            </Text>
            <Text style={{ color: COLORS.muted, marginTop: 2 }}>
              {item.date} • {item.start_time}–{item.end_time}
            </Text>
            <Text style={{ marginTop: 4, color: COLORS.text }}>
              ${Number(item.price).toFixed(2)} • Capacity: {item.capacity}
            </Text>
            <Text style={{ marginTop: 4, color: COLORS.text }}>
              Status:{" "}
              <Text
                style={{
                  fontWeight: "700",
                  color: item.status === "open" ? "#22C55E" : "#EF4444",
                }}
              >
                {item.status.toUpperCase()}
              </Text>
            </Text>
            {item.location ? (
              <Text style={{ marginTop: 4, color: COLORS.text }}>Location: {item.location}</Text>
            ) : null}
            {item.description ? (
            <Text style={{ marginTop: 4, color: COLORS.muted }}>
              {item.description}
            </Text>
          ) : null}
            <View style={{ flexDirection:'row', gap:8, marginTop:10 }}>
              {item.status === "open" ? (
                <TouchableOpacity
                  onPress={() => onCloseSession(item.session_id)}
                  disabled={updating}
                  style={{
                    flex:1,
                    backgroundColor: "#EF4444",
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>
                    {updating ? "Closing..." : "Close Session"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => onReopenSession(item.session_id)}
                  disabled={updating}
                  style={{
                    flex:1,
                    backgroundColor: "#10B981",
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>
                    {updating ? "Opening..." : "Reopen Session"}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => onDeleteSession(item.session_id)}
                disabled={deletingId === item.session_id}
                style={{
                  flex:1,
                  backgroundColor: "#374151",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  {deletingId === item.session_id ? "Deleting..." : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
