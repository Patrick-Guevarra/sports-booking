import { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colors';
import SessionCard from '../../components/SessionCard';
import { MOCK_SESSIONS } from '../../constants/mockData';
import FloatingChatButton from '../../components/FloatingChatButton';

export default function SessionsList({ navigation }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => setData(MOCK_SESSIONS), 250);
  }, []);

  if (!data) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: COLORS.bg }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.bg }}>
      <FlatList
        data={data}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <SessionCard
            item={item}
            onPress={() => navigation.navigate('SessionDetail', { sessionId: item.id })}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }} // avoid FAB overlap on last card
      />
      <FloatingChatButton onPress={() => navigation.navigate('Chat')} />
    </View>
  );
}
