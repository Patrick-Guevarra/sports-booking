import { View, Text, TouchableOpacity } from 'react-native';
import { useLayoutEffect } from 'react';
import { COLORS } from '../../constants/colors';
import FloatingChatButton from '../../components/FloatingChatButton';
import LogoutButton from '../../components/LogoutButton';

export default function Home({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: COLORS.bg }}>
      <Text style={{ fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 4 }}>
        Sports Training
      </Text>
      <Text style={{ color: COLORS.muted, marginBottom: 20 }}>
        Book world-class coaching sessions with one tap.
      </Text>
      <View
        style={{
          position: "absolute",
          top: 15,
          right: 15,
          zIndex: 10,
        }}
      >
        <LogoutButton small />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Sessions')}
        activeOpacity={0.9}
        style={{
          backgroundColor: COLORS.card,
          borderColor: COLORS.border,
          borderWidth: 1,
          borderRadius: 16,
          padding: 18,
          marginBottom: 12,
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 12,
        }}
      >
        <Text style={{ fontWeight: '700', color: COLORS.text, fontSize: 16 }}>Browse Sessions</Text>
        <Text style={{ color: COLORS.muted, marginTop: 6 }}>Find group or 1-on-1 training</Text>
      </TouchableOpacity>

        <TouchableOpacity
            onPress={() => navigation.navigate('Bookings')}
            activeOpacity={0.9}
            style={{
              backgroundColor: COLORS.card,
              borderColor: COLORS.border,
              borderWidth: 1,
              borderRadius: 16,
              padding: 18,
              marginBottom: 12,
              shadowColor: "#000",
              shadowOpacity: 0.25,
              shadowRadius: 12,
            }}>
            <Text style={{ fontWeight: '700', color: COLORS.text, fontSize: 16 }}>My Bookings</Text>
            <Text style={{ color: COLORS.muted, marginTop: 6 }}>See upcoming and past sessions</Text>
        </TouchableOpacity>
      
      {/* Floating AI button */}
      <FloatingChatButton onPress={() => navigation.navigate('Chat')} />
    </View>
  );
}
