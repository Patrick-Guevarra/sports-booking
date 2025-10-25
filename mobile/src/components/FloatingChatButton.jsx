import { TouchableOpacity, View, Text, Platform } from 'react-native';

export default function FloatingChatButton({ onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Open AI assistant"
      style={{
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#2563EB', // primary
        alignItems: 'center',
        justifyContent: 'center',
        // soft shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8, // Android shadow
      }}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 22, color: 'white' }}>🤖</Text>
      </View>
    </TouchableOpacity>
  );
}
