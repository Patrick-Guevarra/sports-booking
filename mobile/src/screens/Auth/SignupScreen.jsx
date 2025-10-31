import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('athlete'); // default

  const handleSignup = async () => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save extra user info (like role) in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email,
      role,
      createdAt: new Date(),
    });

    Alert.alert('Success', `Account created as ${role}`);

    // Navigate to correct screen based on role
    if (role === 'coach') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'ProviderHome' }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    Alert.alert('Error', error.message);
  }
};


  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Create Account</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      {/* Pick role */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
        <Button title="Athlete" onPress={() => setRole('athlete')} color={role === 'athlete' ? 'blue' : 'gray'} />
        <Button title="Coach" onPress={() => setRole('coach')} color={role === 'coach' ? 'blue' : 'gray'} />
      </View>

      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
}
