import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RoleSwitcher from '../../components/RoleSwitcher';

const Card = ({ title, subtitle, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.9}
    style={{
      backgroundColor: '#FFFFFF',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
    }}
  >
    <Text style={{ fontWeight: '700', fontSize: 16, color: '#111827' }}>{title}</Text>
    {subtitle ? <Text style={{ color: '#6B7280', marginTop: 4 }}>{subtitle}</Text> : null}
  </TouchableOpacity>
);

export default function ProviderHome({ navigation }) {
  // Put the role switcher in the header
  useLayoutEffect(() => {
    navigation.setOptions({ headerRight: () => <RoleSwitcher /> });
  }, [navigation]);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#F7F7FB' }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 12 }}>
        Coach Dashboard
      </Text>

      <Card
        title="My Sessions"
        subtitle="View & edit upcoming sessions"
        onPress={() => navigation.navigate('MySessions')}
      />
      <Card
        title="Create Session"
        subtitle="Post new availability"
        onPress={() => navigation.navigate('NewSession')}
      />
      <Card
        title="Bookings"
        subtitle="Approve, cancel, mark complete"
        onPress={() => navigation.navigate('ManageBookings')}
      />
      <Card
        title="Payouts"
        subtitle="Simulated earnings summary"
        onPress={() => navigation.navigate('Payouts')}
      />
    </View>
  );
}
