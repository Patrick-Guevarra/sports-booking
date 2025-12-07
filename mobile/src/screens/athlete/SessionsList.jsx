import { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, RefreshControl } from 'react-native';
import { COLORS } from '../../constants/colors';
import SessionCard from '../../components/SessionCard';
import { listSessions } from '../../config/api';
import FloatingChatButton from '../../components/FloatingChatButton';

export default function SessionsList({ navigation }) {
  // Lists all open sessions athletes can browse; supports pull-to-refresh.
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    // Fetch sessions from backend; errors are shown inline.
    setLoading(true);
    setError(null);
    try {
      const sessions = await listSessions();
      setData(sessions);
    } catch (err) {
      console.warn("Failed to load sessions:", err);
      setError(err.message || "Could not load sessions");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading && !data) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: COLORS.bg }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: COLORS.bg, padding:16 }}>
        <Text style={{ color: COLORS.muted, textAlign:'center' }}>{error}</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: COLORS.bg, padding:16 }}>
        <Text style={{ color: COLORS.muted, textAlign:'center' }}>
          No sessions yet. Pull to refresh after a coach publishes availability.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.bg }}>
      <FlatList
        data={data}
        keyExtractor={(i) => String(i.session_id || i.id)}
        renderItem={({ item }) => (
          <SessionCard
            item={item}
            onPress={() => navigation.navigate('SessionDetail', { sessionId: item.session_id || item.id, session: item })}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 100 }} // avoid FAB overlap on last card
      />
      <FloatingChatButton onPress={() => navigation.navigate('Chat')} />
    </View>
  );
}
