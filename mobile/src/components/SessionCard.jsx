import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { money, niceType } from '../constants/format';

export default function SessionCard({ item, onPress }) {
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
      <Text style={{ fontWeight: '700', fontSize: 16, color: COLORS.text }}>
        {item.sport} • {niceType(item.type)}
      </Text>
      <Text style={{ color: COLORS.muted, marginTop: 4 }}>
        Coach: <Text style={{ color: COLORS.text }}>{item.coachName}</Text>
      </Text>
      <Text style={{ color: COLORS.text, marginTop: 6 }}>
        Price: {money(item.basePriceCents)}
      </Text>
    </TouchableOpacity>
  );
}
