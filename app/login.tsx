import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [usernameInput, setUsernameInput] = useState('');
  const { username, login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    if (usernameInput.trim()) {
      login(usernameInput.trim());
      router.replace('/'); // redirect to home (protected route)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoos Open</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        value={usernameInput}
        onChangeText={setUsernameInput}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20 },
});