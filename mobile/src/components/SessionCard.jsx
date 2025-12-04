import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { money, niceType } from '../constants/format';

export default function SessionCard({ item, onPress }) {
  const sessionType = item.session_type || item.type || "";
  const coachName = item.coach_name || item.coachName || "Coach";
  const priceCents = item.price != null ? Math.round(Number(item.price) * 100) : item.basePriceCents || 0;
  const status = item.status || "open";
  const pillColor = status === "open" ? "#10B981" : "#6B7280";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: COLORS.card,
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
      }}
    >
      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
        <Text style={{ fontWeight: '700', fontSize: 16, color: COLORS.text }}>
          {item.sport} • {niceType(sessionType)}
        </Text>
        <Text style={{ color: '#fff', backgroundColor: pillColor, paddingHorizontal:10, paddingVertical:4, borderRadius:999, fontSize:12, overflow:'hidden' }}>
          {status}
        </Text>
      </View>
      <Text style={{ color: COLORS.muted, marginTop: 4 }}>
        Coach: <Text style={{ color: COLORS.text }}>{coachName}</Text>
      </Text>
      <Text style={{ color: COLORS.text, marginTop: 6 }}>
        Price: {money(priceCents)}
      </Text>
    </TouchableOpacity>
  );
}
