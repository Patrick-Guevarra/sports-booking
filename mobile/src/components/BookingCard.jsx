import { View, Text } from 'react-native';
import { COLORS } from '../constants/colors';
import { money, niceType } from '../constants/format';

// Displays a booking summary for athlete/coach lists with unified formatting.

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
  const sport = item.sport;
  const type = item.session_type || item.type;
  const coachName = item.coach_name || item.coachName || "Coach";
  const start = item.start_time || item.startTime;
  const end = item.end_time || item.endTime;
  const dateRaw = item.date || (item.scheduled_time ? item.scheduled_time.split(" ")[0] : null);
  const scheduled = item.scheduled_time || item.startTime;
  const priceCents =
    item.priceCents ||
    (item.price != null ? Math.round(Number(item.price) * 100) : 0);
  const dateLabel = scheduled
    ? new Date(scheduled).toLocaleString()
    : dateRaw && start
    ? `${dateRaw} ${start}-${end || ""}`
    : "TBD";

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
          {sport} • {niceType(type)}
        </Text>
        <Text style={{ color: '#fff', backgroundColor: statusColor(item.status), paddingHorizontal:10, paddingVertical:4, borderRadius:999, fontSize:12, overflow:'hidden' }}>
          {item.status}
        </Text>
      </View>

      <Text style={{ color: COLORS.muted, marginTop: 6 }}>
        Coach: <Text style={{ color: COLORS.text }}>{coachName}</Text>
      </Text>
      <Text style={{ color: COLORS.text, marginTop: 6 }}>When: {dateLabel}</Text>
      <Text style={{ color: COLORS.text, marginTop: 6 }}>Price: {money(priceCents)}</Text>
    </View>
  );
}
