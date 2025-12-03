import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import colorsDefault, { COLORS as COLORS_OBJ } from '../../constants/colors';
import { aiQuery } from "../../config/api";
import AppButton from '../../components/AppButton';

const COLORS = COLORS_OBJ || colorsDefault;


export default function Chat() {
  const [messages, setMessages] = useState([{ from:'ai', text:'Hi! Ask me about pricing, booking, or policies.' }]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const send = async () => {
  if (!input.trim()) return;

  const userMessage = { from: 'you', text: input };
  setMessages(m => [...m, userMessage]);
  const userText = input; // save the input before clearing
  setInput('');

  try {
    // call FastAPI AI endpoint
    const data = await aiQuery({ message: userText, context: {} });

    // The API returns: { reply, suggestions, meta }
    const aiMessage = { from: 'ai', text: data.reply };
    setMessages(m => [...m, aiMessage]);
  } catch (err) {
    // fallback if API call fails
    setMessages(m => [...m, { from: 'ai', text: '⚠️ Could not reach AI service. Make sure it’s running on port 8001.' }]);
  }
};

  return (
    <View style={{ flex:1, padding:16, backgroundColor: COLORS.bg }}>
      <ScrollView ref={scrollRef} style={{ flex:1 }} contentContainerStyle={{ paddingBottom: 12 }}>
        {messages.map((m, i) => (
          <View
            key={i}
            style={{
              marginVertical: 8,
              alignSelf: m.from === 'ai' ? 'flex-start' : 'flex-end',
              backgroundColor: m.from === 'ai' ? '#0B1628' : COLORS.primary,
              padding: 12,
              borderRadius: 14,
              borderTopLeftRadius: m.from === 'ai' ? 4 : 14,
              borderTopRightRadius: m.from === 'ai' ? 14 : 4,
              maxWidth: '85%',
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 8,
            }}
          >
            <Text style={{ color: m.from === 'ai' ? COLORS.text : '#0B1628', fontWeight: '700', marginBottom: 4 }}>
              {m.from === 'ai' ? 'CoachBot' : 'You'}
            </Text>
            <Text style={{ color: m.from === 'ai' ? COLORS.muted : '#0B1628' }}>
              {m.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          placeholderTextColor={COLORS.muted}
          style={{ flex: 1, borderWidth: 1, borderColor: COLORS.border, padding: 12, borderRadius: 12, backgroundColor: COLORS.card, color: COLORS.text }}
        />
        <TouchableOpacity
          onPress={send}
          activeOpacity={0.9}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 12,
            paddingHorizontal: 16,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#0B1628', fontWeight: '800' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
