import React, { useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { COLORS } from '../../constants/colors';
import { money, niceType } from '../../constants/format';
import { MOCK_SESSIONS } from '../../constants/mockData';

export default function MySessions() {
  // TODO: replace coachId=1 with the logged-in coach's id
  const coachId = 1;
  const mySessions = useMemo(
    () => MOCK_SESSIONS.filter(s => s.coachId === coachId),
    [coachId]
  );

  if (!mySessions.length) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: COLORS.bg }}>
        <Text style={{ color: COLORS.muted }}>No sessions posted yet.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex:1, padding:16, backgroundColor: COLORS.bg }}>
      <FlatList
        data={mySessions}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 14,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 16,
            marginBottom: 12
          }}>
            <Text style={{ fontWeight:'700', fontSize:16, color: COLORS.text }}>
              {item.sport} • {niceType(item.type)}
            </Text>
            <Text style={{ color: COLORS.muted, marginTop: 6 }}>
              Time: {new Date(item.startTime).toLocaleString()} — {new Date(item.endTime).toLocaleTimeString()}
            </Text>
            <Text style={{ color: COLORS.text, marginTop: 6 }}>
              Price: {money(item.basePriceCents)} • Capacity: {item.capacity}
            </Text>
            <Text style={{ color: COLORS.muted, marginTop: 6 }}>
              Status: {item.status}
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
