
import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './src/screens/athlete/Home';
import SessionsList from './src/screens/athlete/SessionsList';
import SessionDetail from './src/screens/athlete/SessionDetail';
import Bookings from './src/screens/athlete/Bookings';
import Chat from './src/screens/athlete/Chat';

import ProviderHome from './src/screens/coach/ProviderHome';
import MySessions from './src/screens/coach/MySessions';
import NewSession from './src/screens/coach/NewSession';
import ManageBookings from './src/screens/coach/ManageBookings';
import Payouts from './src/screens/coach/Payouts';

import { RoleProvider, useRole } from './src/RoleContext';

const Stack = createNativeStackNavigator();



function RootNavigator() {
  const { role } = useRole(); // 'athlete' | 'coach'

  return (
    <NavigationContainer>
      {/* key={role} forces a remount when switching roles */}
      <Stack.Navigator key={role} screenOptions={{ headerShadowVisible: false }}>
        {role === 'athlete' ? (
          <>
            <Stack.Screen name="Home" component={Home} options={{ title: 'Sports Training' }} />
            <Stack.Screen name="Sessions" component={SessionsList} options={{ title: 'Browse Sessions' }} />
            <Stack.Screen name="SessionDetail" component={SessionDetail} options={{ title: 'Session Detail' }} />
            <Stack.Screen name="Bookings" component={Bookings} options={{ title: 'My Bookings' }} />
            <Stack.Screen name="Chat" component={Chat} options={{ title: 'AI Assistant' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="ProviderHome" component={ProviderHome} options={{ title: 'Coach Dashboard' }} />
            <Stack.Screen name="MySessions" component={MySessions} options={{ title: 'My Sessions' }} />
            <Stack.Screen name="NewSession" component={NewSession} options={{ title: 'Create Session' }} />
            <Stack.Screen name="ManageBookings" component={ManageBookings} options={{ title: 'Bookings' }} />
            <Stack.Screen name="Payouts" component={Payouts} options={{ title: 'Payouts' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <RoleProvider>
      <RootNavigator />
    </RoleProvider>
  );
}
