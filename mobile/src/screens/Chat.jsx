import { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { COLORS } from '../constants/colors';

export default function Chat() {
  const [messages, setMessages] = useState([{ from:'ai', text:'Hi! Ask me about pricing, booking, or policies.' }]);
  const [input, setInput] = useState('');

  const send = async () => {
    if (!input.trim()) return;
    const you = { from: 'you', text: input };
    setMessages(m => [...m, you]);

    // Later: POST /api/ai/query
    const lower = input.toLowerCase();
    const reply = (lower.includes('price') || lower.includes('cost'))
      ? 'One-on-one costs more; total = rate × hours × 1.5.'
      : 'I can help with pricing, booking, or training recommendations.';
    setMessages(m => [...m, you, { from:'ai', text: reply }]);
    setInput('');
  };

  return (
    <View style={{ flex:1, padding:16, backgroundColor: COLORS.bg }}>
      <ScrollView style={{ flex:1 }}>
        {messages.map((m, i) => (
          <Text
            key={i}
            style={{
              marginVertical: 6,
              alignSelf: m.from === 'ai' ? 'flex-start' : 'flex-end',
              backgroundColor: m.from === 'ai' ? '#EEF2FF' : '#DCFCE7',
              padding: 10,
              borderRadius: 10,
              maxWidth: '85%',
              color: COLORS.text
            }}
          >
            {m.from === 'ai' ? '🤖 ' : '👤 '}{m.text}
          </Text>
        ))}
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          style={{ flex: 1, borderWidth: 1, borderColor: COLORS.border, padding: 10, borderRadius: 8 }}
        />
        <Button title="Send" onPress={send} />
      </View>
    </View>
  );
}
