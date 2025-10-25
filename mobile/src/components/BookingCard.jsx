import { View, Text } from 'react-native';
import { COLORS } from '../constants/colors';
import { money, niceType } from '../constants/format';

const statusColor = (status) => {
  switch (status) {
    case 'confirmed': return '#10B981'; // green
    case 'pending':   return '#F59E0B'; // amber
    case 'completed': return '#6B7280'; // gray
    case 'canceled':  return '#EF4444'; // red
    default: return COLORS.muted;
  }
};

export default function BookingCard({ item }) {
  const date = new Date(item.startTime).toLocaleString();
  return (
    <View style={{
      backgroundColor: COLORS.card,
      borderColor: COLORS.border,
      borderWidth: 1,
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 8,
    }}>
      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
        <Text style={{ fontWeight:'700', fontSize:16, color: COLORS.text }}>
          {item.sport} • {niceType(item.type)}
        </Text>
        <Text style={{ color: '#fff', backgroundColor: statusColor(item.status), paddingHorizontal:10, paddingVertical:4, borderRadius:999, fontSize:12, overflow:'hidden' }}>
          {item.status}
        </Text>
      </View>

      <Text style={{ color: COLORS.muted, marginTop: 6 }}>
        Coach: <Text style={{ color: COLORS.text }}>{item.coachName}</Text>
      </Text>
      <Text style={{ color: COLORS.text, marginTop: 6 }}>When: {date}</Text>
      <Text style={{ color: COLORS.text, marginTop: 6 }}>Duration: {item.durationMinutes} min</Text>
      <Text style={{ color: COLORS.text, marginTop: 6 }}>Price: {money(item.priceCents)}</Text>
    </View>
  );
}
