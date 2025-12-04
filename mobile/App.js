// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DefaultTheme } from "@react-navigation/native";

import Home from "./src/screens/athlete/Home";
import SessionsList from "./src/screens/athlete/SessionsList";
import SessionDetail from "./src/screens/athlete/SessionDetail";
import Bookings from "./src/screens/athlete/Bookings";
import Chat from "./src/screens/athlete/Chat";

import ProviderHome from "./src/screens/coach/ProviderHome";
import MySessions from "./src/screens/coach/MySessions";
import NewSession from "./src/screens/coach/NewSession";
import ManageBookings from "./src/screens/coach/ManageBookings";

import LoginScreen from "./src/screens/Auth/LoginScreen";
import SignupScreen from "./src/screens/Auth/SignupScreen";

import { RoleProvider, useRole } from "./src/RoleContext";
import { COLORS } from "./src/constants/colors";

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.bg,
    card: COLORS.card,
    text: COLORS.text,
    border: COLORS.border,
    primary: COLORS.primary,
  },
};

function RootNavigator() {
  const { role, userId } = useRole();   // we added userId earlier
  const isLoggedIn = !!userId;
  const isCoach = role === "coach";

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: COLORS.bg },
          headerTintColor: COLORS.text,
          headerTitleStyle: { color: COLORS.text, fontWeight: "800" },
          headerBackTitleVisible: false,
        }}
      >
        {/* NOT LOGGED IN: show auth screens */}
        {!isLoggedIn ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: "Login" }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ title: "Create Account" }}
            />
          </>
        ) : isCoach ? (
          // LOGGED IN AS COACH
          <>
            <Stack.Screen
              name="ProviderHome"
              component={ProviderHome}
              options={{ title: "Coach Dashboard" }}
            />
            <Stack.Screen
              name="MySessions"
              component={MySessions}
              options={{ title: "My Sessions" }}
            />
            <Stack.Screen
              name="NewSession"
              component={NewSession}
              options={{ title: "Create Session" }}
            />
            <Stack.Screen
              name="ManageBookings"
              component={ManageBookings}
              options={{ title: "Bookings" }}
            />
          </>
        ) : (
          // LOGGED IN AS ATHLETE
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ title: "Sports Training" }}
            />
            <Stack.Screen
              name="Sessions"
              component={SessionsList}
              options={{ title: "Browse Sessions" }}
            />
            <Stack.Screen
              name="SessionDetail"
              component={SessionDetail}
              options={{ title: "Session Detail" }}
            />
            <Stack.Screen
              name="Bookings"
              component={Bookings}
              options={{ title: "My Bookings" }}
            />
            <Stack.Screen
              name="Chat"
              component={Chat}
              options={{ title: "AI Assistant" }}
            />

            <Stack.Screen name="MySessions" component={MySessions} />
            <Stack.Screen name="NewSession" component={NewSession} />
            <Stack.Screen name="ManageBookings" component={ManageBookings} />
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
