import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function FirestoreTestScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const saveData = async () => {
    try {
      await addDoc(collection(db, 'users'), { name, age });
      alert('Data saved successfully!');
      setName('');
      setAge('');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error saving data');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Add User</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Button title="Save" onPress={saveData} />
    </View>
  );
}
