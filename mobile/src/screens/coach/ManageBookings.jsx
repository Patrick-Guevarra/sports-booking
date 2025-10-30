import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { money, niceType } from '../../constants/format';
import { MOCK_BOOKINGS } from '../../constants/mockData';

const Pill = ({ label, bg }) => (
  <View style={{ backgroundColor: bg, paddingHorizontal:10, paddingVertical:4, borderRadius:999 }}>
    <Text style={{ color:'#fff', fontSize:12 }}>{label}</Text>
  </View>
);

export default function ManageBookings() {
  // Simulate local state based on mock data
  const coachName = 'Jordan Dasher'; // TODO: replace with logged-in coach
  const coachBookings = useMemo(
    () => MOCK_BOOKINGS.filter(b => b.coachName === coachName),
    [coachName]
  );
  const [data, setData] = useState(coachBookings);

  const setStatus = (id, status) => {
    setData(prev => prev.map(b => (b.id === id ? { ...b, status } : b)));
  };

  const statusColor = (s) => {
    if (s === 'confirmed') return '#10B981';
    if (s === 'pending') return '#F59E0B';
    if (s === 'completed') return '#6B7280';
    if (s === 'canceled') return '#EF4444';
    return COLORS.muted;
    };

  return (
    <View style={{ flex:1, padding:16, backgroundColor: COLORS.bg }}>
      {data.length === 0 ? (
        <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
          <Text style={{ color: COLORS.muted }}>No bookings yet.</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => (
            <View style={{
              backgroundColor:'#fff', borderRadius:14, borderWidth:1, borderColor:COLORS.border,
              padding:16, marginBottom:12
            }}>
              <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                <Text style={{ fontWeight:'700', fontSize:16, color: COLORS.text }}>
                  {item.sport} • {niceType(item.type)}
                </Text>
                <Pill label={item.status} bg={statusColor(item.status)} />
              </View>
              <Text style={{ color: COLORS.muted, marginTop:6 }}>
                Athlete booking — {new Date(item.startTime).toLocaleString()}
              </Text>
              <Text style={{ color: COLORS.text, marginTop:6 }}>
                Duration: {item.durationMinutes} min • {money(item.priceCents)}
              </Text>

              <View style={{ flexDirection:'row', gap:8, marginTop:12 }}>
                {item.status !== 'confirmed' && item.status !== 'completed' && item.status !== 'canceled' && (
                  <TouchableOpacity
                    onPress={() => setStatus(item.id, 'confirmed')}
                    style={{ backgroundColor:'#10B981', paddingVertical:8, paddingHorizontal:12, borderRadius:8 }}
                  >
                    <Text style={{ color:'#fff' }}>Confirm</Text>
                  </TouchableOpacity>
                )}
                {item.status !== 'completed' && item.status !== 'canceled' && (
                  <TouchableOpacity
                    onPress={() => setStatus(item.id, 'canceled')}
                    style={{ backgroundColor:'#EF4444', paddingVertical:8, paddingHorizontal:12, borderRadius:8 }}
                  >
                    <Text style={{ color:'#fff' }}>Cancel</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'confirmed' && (
                  <TouchableOpacity
                    onPress={() => setStatus(item.id, 'completed')}
                    style={{ backgroundColor:'#374151', paddingVertical:8, paddingHorizontal:12, borderRadius:8 }}
                  >
                    <Text style={{ color:'#fff' }}>Mark Completed</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom:24 }}
        />
      )}
    </View>
  );
}
