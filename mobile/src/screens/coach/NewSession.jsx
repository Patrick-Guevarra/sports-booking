import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function NewSession({ navigation }) {
  // Local form state (simulated only)
  const [sport, setSport] = useState('basketball');
  const [type, setType] = useState('one_on_one'); // 'one_on_one' | 'group'
  const [startTime, setStartTime] = useState('2025-11-10T15:00:00Z');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [priceCents, setPriceCents] = useState('6000');
  const [capacity, setCapacity] = useState('1');

  const save = () => {
    // In real app: POST /api/sessions with payload
    // For now: simulate success
    Alert.alert(
      'Session Created',
      `Sport: ${sport}\nType: ${type}\nStarts: ${startTime}\nDuration: ${durationMinutes} min\nPrice: $${(Number(priceCents)/100).toFixed(2)}\nCapacity: ${capacity}`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const Field = ({ label, children }) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 6, color: COLORS.muted }}>{label}</Text>
      {children}
    </View>
  );

  const inputStyle = {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff'
  };

  return (
    <View style={{ flex:1, padding:16, backgroundColor: COLORS.bg }}>
      <Field label="Sport">
        <TextInput value={sport} onChangeText={setSport} style={inputStyle} />
      </Field>

      <Field label="Type (one_on_one or group)">
        <TextInput value={type} onChangeText={setType} style={inputStyle} />
      </Field>

      <Field label="Start Time (ISO)">
        <TextInput value={startTime} onChangeText={setStartTime} style={inputStyle} />
      </Field>

      <Field label="Duration (minutes)">
        <TextInput
          value={durationMinutes}
          onChangeText={setDurationMinutes}
          keyboardType="number-pad"
          style={inputStyle}
        />
      </Field>

      <Field label="Price (cents)">
        <TextInput
          value={priceCents}
          onChangeText={setPriceCents}
          keyboardType="number-pad"
          style={inputStyle}
        />
      </Field>

      <Field label="Capacity">
        <TextInput
          value={capacity}
          onChangeText={setCapacity}
          keyboardType="number-pad"
          style={inputStyle}
        />
      </Field>

      <Button title="Save Session (Simulated)" onPress={save} />
    </View>
  );
}
