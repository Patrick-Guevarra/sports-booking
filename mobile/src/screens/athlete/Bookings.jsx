import { useCallback, useEffect, useState } from 'react';
import { View, FlatList, RefreshControl, Text, ActivityIndicator, Alert } from 'react-native';
import { COLORS } from '../../constants/colors';
import BookingCard from '../../components/BookingCard';
import { listBookings } from '../../config/api';
import { useRole } from '../../RoleContext';

export default function Bookings() {
  const { userId, role } = useRole();
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!userId || role !== "athlete") {
      setData([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const bookings = await listBookings({ athleteId: Number(userId) });
      setData(bookings);
    } catch (err) {
      console.warn("Failed to load bookings:", err);
      setError(err.message || "Could not load bookings.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [userId, role]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  if (!userId) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: COLORS.bg, padding: 16 }}>
        <Text style={{ color: COLORS.muted, textAlign:'center' }}>
          Log in as an athlete to view your bookings.
        </Text>
      </View>
    );
  }

  if (loading && !data) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: COLORS.bg }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: COLORS.bg, padding: 16 }}>
        <Text style={{ color: COLORS.muted, textAlign:'center' }}>{error}</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: COLORS.bg, padding: 16 }}>
        <Text style={{ color: COLORS.muted, textAlign:'center' }}>
          You don’t have any bookings yet.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex:1, padding:16, backgroundColor: COLORS.bg }}>
      <FlatList
        data={data}
        keyExtractor={(i) => String(i.booking_id || i.id)}
        renderItem={({ item }) => <BookingCard item={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
