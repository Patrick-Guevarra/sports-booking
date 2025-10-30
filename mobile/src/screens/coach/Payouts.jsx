import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '../../constants/colors';
import { money } from '../../constants/format';
import { MOCK_BOOKINGS } from '../../constants/mockData';

export default function Payouts() {
  const coachName = 'Jordan Dasher'; // TODO: replace with logged-in coach

  // Simulate: earnings are sum of completed bookings' priceCents
  const { totalCents, count } = useMemo(() => {
    const mine = MOCK_BOOKINGS.filter(b => b.coachName === coachName && b.status === 'completed');
    const sum = mine.reduce((acc, b) => acc + (b.priceCents || 0), 0);
    return { totalCents: sum, count: mine.length };
  }, [coachName]);

  return (
    <View style={{ flex:1, padding:16, backgroundColor: COLORS.bg }}>
      <View style={{
        backgroundColor:'#fff',
        borderRadius:14,
        borderWidth:1,
        borderColor: COLORS.border,
        padding:16
      }}>
        <Text style={{ fontSize:18, fontWeight:'800', color: COLORS.text }}>Payouts Summary</Text>
        <Text style={{ marginTop:10, color: COLORS.muted }}>Completed Sessions: {count}</Text>
        <Text style={{ marginTop:6, color: COLORS.text }}>Total Earnings: {money(totalCents)}</Text>
        <Text style={{ marginTop:12, color: COLORS.muted }}>
          (Simulated. In the real app, this pulls from Payments/Bookings tables.)
        </Text>
      </View>
    </View>
  );
}
