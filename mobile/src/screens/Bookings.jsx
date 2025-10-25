import { useCallback, useState } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { COLORS } from '../constants/colors';
import { MOCK_BOOKINGS } from '../constants/mockData';
import BookingCard from '../components/BookingCard';

export default function Bookings() {
  const [data, setData] = useState(MOCK_BOOKINGS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // simulate fetch
    setTimeout(() => {
      setData([...MOCK_BOOKINGS]); // would replace with real API response
      setRefreshing(false);
    }, 600);
  }, []);

  if (!data || data.length === 0) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: COLORS.bg, padding: 16 }}>
        <Text style={{ color: COLORS.muted, textAlign:'center' }}>
          You don’t have any bookings yet.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex:1, padding:16, backgroundColor: COLORS.bg }}>
      <FlatList
        data={data}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => <BookingCard item={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
