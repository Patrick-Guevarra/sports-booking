import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

export default function Home({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: COLORS.bg }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 16 }}>
        Sports Training
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('Sessions')}
        style={{ backgroundColor: COLORS.card, borderColor: COLORS.border, borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 12 }}
      >
        <Text style={{ fontWeight: '700', color: COLORS.text }}>Browse Sessions</Text>
        <Text style={{ color: COLORS.muted, marginTop: 4 }}>Find group or 1-on-1 training</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Chat')}
        style={{ backgroundColor: COLORS.card, borderColor: COLORS.border, borderWidth: 1, borderRadius: 14, padding: 16 }}
      >
        <Text style={{ fontWeight: '700', color: COLORS.text }}>Ask the AI Assistant</Text>
        <Text style={{ color: COLORS.muted, marginTop: 4 }}>Pricing, booking, and policy help</Text>
      </TouchableOpacity>
    </View>
  );
}
