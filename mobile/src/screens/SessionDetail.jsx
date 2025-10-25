import { View, Text, Button, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import { money, niceType } from '../constants/format';
import { MOCK_SESSIONS } from '../constants/mockData';

export default function SessionDetail({ route, navigation }) {
  const { sessionId } = route.params || {};
  const session = MOCK_SESSIONS.find(s => String(s.id) === String(sessionId));

  if (!session) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: COLORS.bg }}>
        <Text>Session not found.</Text>
      </View>
    );
  }

  const onBook = () => {
    // Later: POST /api/bookings
    Alert.alert('Booking', `Created booking for ${session.sport} (${niceType(session.type)})`);
  };

  return (
    <View style={{ flex:1, padding:16, backgroundColor: COLORS.bg }}>
      <Text style={{ fontSize: 20, fontWeight:'800', color: COLORS.text }}>
        {session.sport} • {niceType(session.type)}
      </Text>
      <Text style={{ color: COLORS.muted, marginTop: 6 }}>Coach: {session.coachName}</Text>
      <Text style={{ color: COLORS.text, marginTop: 6 }}>Price: {money(session.basePriceCents)}</Text>

      <View style={{ height: 16 }} />
      <Button title="Book (Simulated)" onPress={onBook} />
      <View style={{ height: 12 }} />
      <Button title="Ask AI" onPress={() => navigation.navigate('Chat')} />
    </View>
  );
}
