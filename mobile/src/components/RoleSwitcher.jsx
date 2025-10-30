import { View, Text, TouchableOpacity } from 'react-native';
import { useRole } from '../RoleContext';

export default function RoleSwitcher() {
  const { role, setRole } = useRole();
  const other = role === 'athlete' ? 'coach' : 'athlete';
  return (
    <View style={{ flexDirection:'row', gap:8 }}>
      <Text style={{ alignSelf:'center' }}>Role: {role}</Text>
      <TouchableOpacity
        onPress={() => setRole(other)}
        style={{ paddingHorizontal:10, paddingVertical:6, borderRadius:8, backgroundColor:'#2563EB' }}
      >
        <Text style={{ color:'#fff' }}>Switch to {other}</Text>
      </TouchableOpacity>
    </View>
  );
}
