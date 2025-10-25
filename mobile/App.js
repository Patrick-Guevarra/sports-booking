import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import SessionsList from './src/screens/SessionsList';
import SessionDetail from './src/screens/SessionDetail';
import Chat from './src/screens/Chat';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShadowVisible: false }}>
        <Stack.Screen name="Home" component={Home} options={{ title: 'Sports Training' }} />
        <Stack.Screen name="Sessions" component={SessionsList} options={{ title: 'Browse Sessions' }} />
        <Stack.Screen name="SessionDetail" component={SessionDetail} options={{ title: 'Session Detail' }} />
        <Stack.Screen name="Chat" component={Chat} options={{ title: 'AI Assistant' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
