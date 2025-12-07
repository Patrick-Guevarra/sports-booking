import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { COLORS } from '../../constants/colors';
import { money, niceType } from '../../constants/format';
import { listBookings } from '../../config/api';
import { useRole } from '../../RoleContext';

const Pill = ({ label, bg }) => (
  <View style={{ backgroundColor: bg, paddingHorizontal:10, paddingVertical:4, borderRadius:999 }}>
    <Text style={{ color:'#fff', fontSize:12 }}>{label}</Text>
  </View>
);

export default function ManageBookings() {
  // Coach view of bookings for their sessions; read-only summary list.
  const { userId, role } = useRole();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    // Fetch bookings owned by the coach; handle missing auth gracefully.
    if (!userId || role !== "coach") {
      setData([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const bookings = await listBookings({ coachId: Number(userId) });
      setData(bookings);
    } catch (err) {
      console.warn("Failed to load coach bookings:", err);
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

  const statusColor = (s) => {
    // Map booking status to pill color for quick scanning.
    if (s === 'confirmed') return '#10B981';
    if (s === 'pending') return '#F59E0B';
    if (s === 'completed') return '#6B7280';
    if (s === 'canceled' || s === 'cancelled') return '#EF4444';
    return COLORS.muted;
  };

  if (role !== "coach") {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: COLORS.bg }}>
        <Text style={{ color: COLORS.text }}>Only coaches can view these bookings.</Text>
      </View>
    );
  }

  if (loading && !data) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: COLORS.bg }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', padding:16, backgroundColor: COLORS.bg }}>
        <Text style={{ color: COLORS.muted, textAlign:'center' }}>{error}</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', padding:16, backgroundColor: COLORS.bg }}>
        <Text style={{ color: COLORS.muted }}>No bookings yet.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex:1, padding:16, backgroundColor: COLORS.bg }}>
      <FlatList
        data={data}
        keyExtractor={(i) => String(i.booking_id || i.id)}
        renderItem={({ item }) => (
          <View style={{
            backgroundColor:COLORS.card, borderRadius:14, borderWidth:1, borderColor:COLORS.border,
            padding:16, marginBottom:12, shadowColor:'#000', shadowOpacity:0.2, shadowRadius:10
          }}>
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
              <Text style={{ fontWeight:'700', fontSize:16, color: COLORS.text }}>
                {item.sport} • {niceType(item.session_type || item.type)}
              </Text>
              <Pill label={item.status} bg={statusColor(item.status)} />
            </View>
            <Text style={{ color: COLORS.muted, marginTop:6 }}>
              Athlete: <Text style={{ color: COLORS.text, fontWeight:'600' }}>{item.athlete_name || `ID ${item.athlete_id}`}</Text>
            </Text>
            <Text style={{ color: COLORS.text, marginTop:6 }}>
              Session: #{item.session_id} • {item.date || 'TBD'} {item.start_time || ''}{item.end_time ? ` - ${item.end_time}` : ''}
            </Text>
            <Text style={{ color: COLORS.text, marginTop:6 }}>
              When: {item.scheduled_time ? new Date(item.scheduled_time).toLocaleString() : 'TBD'}
            </Text>
            <Text style={{ color: COLORS.text, marginTop:6 }}>
              Price: {money(item.price != null ? Math.round(Number(item.price) * 100) : 0)}
            </Text>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom:24 }}
      />
    </View>
  );
}
