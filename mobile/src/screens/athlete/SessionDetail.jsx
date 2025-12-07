import { useEffect, useMemo, useState } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colors';
import { money, niceType } from '../../constants/format';
import FloatingChatButton from '../../components/FloatingChatButton';
import { createBooking, listSessions, payForBooking, listBookings, cancelBooking } from '../../config/api';
import { useRole } from '../../RoleContext';
import AppButton from '../../components/AppButton';

export default function SessionDetail({ route, navigation }) {
  // Shows details for a session and orchestrates booking/payment actions for athletes.
  const { sessionId, session: sessionFromList } = route.params || {};
  const [session, setSession] = useState(sessionFromList || null);
  const [loading, setLoading] = useState(!sessionFromList);
  const [booking, setBooking] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const { userId, role } = useRole();

  const priceCents = useMemo(() => {
    // Normalize price regardless of field naming from server/mock data.
    if (!session) return 0;
    if (session.price != null) return Math.round(Number(session.price) * 100);
    return session.basePriceCents || 0;
  }, [session]);

  const isOpen = (session?.status || "open") === "open";
  const hasBooking = !!booking;
  const bookingConfirmed = booking?.status === "confirmed" || booking?.status === "completed";

  useEffect(() => {
    const fetchSession = async () => {
      if (session) return;
      setLoading(true);
      try {
        const sessions = await listSessions();
        const found = sessions.find(
          (s) => String(s.session_id || s.id) === String(sessionId)
        );
        if (found) {
          setSession(found);
        }
      } catch (err) {
        console.warn("Failed to load session detail:", err);
        Alert.alert("Error", err.message || "Could not load this session.");
      } finally {
        setLoading(false);
      }
    };

    if (!session && sessionId) {
      fetchSession();
    }
  }, [session, sessionId]);

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: COLORS.bg }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!session) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: COLORS.bg }}>
        <Text>Session not found.</Text>
      </View>
    );
  }

  const onBook = async () => {
    // Create a pending booking and persist it server-side.
    if (role !== "athlete") {
      Alert.alert("Only athletes can book sessions.");
      return;
    }
    if (!userId) {
      Alert.alert("Please log in to book this session.");
      return;
    }

    if (!isOpen) {
      Alert.alert("Session closed", "This session is closed and cannot be booked.");
      return;
    }

    setBookingLoading(true);
    try {
      const res = await createBooking({
        session_id: session.session_id || session.id,
        athlete_id: Number(userId),
        scheduled_time:
          session.date && session.start_time
            ? `${session.date} ${session.start_time}`
            : session.startTime || null,
      });

      setBooking(res);
      Alert.alert("Booking created", "Booking set to pending. Pay now to confirm.");
    } catch (err) {
      console.warn("Create booking failed:", err);
      Alert.alert("Error", err.message || "Could not create booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  const onPay = async () => {
    // Simulates checkout by marking booking confirmed in backend.
    if (!booking?.booking_id) {
      Alert.alert("Book the session first to get a booking ID.");
      return;
    }

    setPayLoading(true);
    try {
      const res = await payForBooking(booking.booking_id);
      setBooking((prev) => ({
        ...prev,
        ...(res || {}),
        status: res?.status || "confirmed",
      }));
      Alert.alert("Payment successful", "Your booking is confirmed.");
    } catch (err) {
      console.warn("Payment failed:", err);
      Alert.alert("Payment failed", err.message || "Could not confirm booking.");
    } finally {
      setPayLoading(false);
    }
  };

  const refreshBooking = async () => {
    // Pull the latest booking status for this session to avoid stale UI.
    if (!userId || !sessionId) return;
    try {
      const rows = await listBookings({
        athleteId: Number(userId),
        sessionId: sessionId,
      });
      if (rows && rows.length > 0) {
        const active = rows.find((b) => b.status !== "cancelled");
        setBooking(active || null);
      } else {
        setBooking(null);
      }
    } catch (err) {
      console.warn("Failed to load booking:", err);
    }
  };

  useEffect(() => {
    refreshBooking();
  }, [userId, sessionId]);

  const onCancel = async () => {
    // Cancel booking and restore capacity in backend.
    if (!booking?.booking_id) return;
    try {
      await cancelBooking({ bookingId: booking.booking_id, athleteId: Number(userId) });
      setBooking(null);
      Alert.alert("Booking cancelled", "Your booking was cancelled.");
      await refreshBooking();
    } catch (err) {
      console.warn("Cancel booking failed:", err);
      Alert.alert("Error", err.message || "Could not cancel booking.");
    }
  };

  return (
    <View style={{ flex:1, padding:16, backgroundColor: COLORS.bg }}>
      <Text style={{ fontSize: 20, fontWeight:'800', color: COLORS.text }}>
        {session.sport} • {niceType(session.session_type || session.type)}
      </Text>
      <Text style={{ color: COLORS.muted, marginTop: 6 }}>
        Coach: {session.coach_name || session.coachName}
      </Text>
      <Text style={{ color: COLORS.text, marginTop: 6 }}>
        Price: {money(priceCents)}
      </Text>
      <Text style={{ color: isOpen ? "#10B981" : "#6B7280", marginTop: 6, fontWeight:'700' }}>
        {isOpen ? "OPEN" : "CLOSED"}
      </Text>
      {session.date && session.start_time ? (
        <Text style={{ color: COLORS.text, marginTop: 6 }}>
          When: {session.date} {session.start_time} - {session.end_time}
        </Text>
      ) : null}

      {booking ? (
        <Text style={{ marginTop: 12, color: COLORS.muted }}>
          Booking #{booking.booking_id} — {booking.status}
        </Text>
      ) : null}

      <View style={{ height: 16 }} />
      {bookingConfirmed ? (
        <Text style={{ color: COLORS.text, fontWeight: "700" }}>
          You’re all set. Booking is confirmed.
        </Text>
      ) : (
        <View style={{ gap: 10 }}>
          {!hasBooking ? (
            <AppButton
              title={bookingLoading ? "Booking..." : "Book Session"}
              onPress={onBook}
              disabled={bookingLoading}
              variant={isOpen ? "secondary" : "ghost"}
              style={{ opacity: isOpen ? 1 : 0.5 }}
            />
          ) : (
            <AppButton
              title={payLoading ? "Processing..." : "Pay Now"}
              onPress={() => {
                if (!isOpen) {
                  Alert.alert("Session closed", "You can't pay because the session is closed.");
                  return;
                }
                onPay();
              }}
              disabled={payLoading}
              variant="secondary"
            />
          )}

          {hasBooking && !bookingConfirmed ? (
            <AppButton
              title="Cancel Booking"
              onPress={() => {
                if (!isOpen) {
                  Alert.alert("Session closed", "This session is closed; cancelling will free your spot.");
                }
                onCancel();
              }}
              variant="danger"
            />
          ) : null}
        </View>
      )}

      <FloatingChatButton onPress={() => navigation.navigate('Chat')} />
    </View>
  );
}
