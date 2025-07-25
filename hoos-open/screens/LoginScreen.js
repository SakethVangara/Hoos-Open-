import React, { useState } from 'react';
import {
  Text, TextInput, TouchableOpacity, StyleSheet, Alert, View, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleAuth = async () => {
    if (!email.endsWith('@virginia.edu')) {
      Alert.alert('Invalid Email', 'Use your virginia.edu email to register or sign in.');
      return;
    }

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert('Account Created', 'You can now log in.');
        setIsSignup(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert('Authentication Error', error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#EBAEE6', '#ADEBB3']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Image
          source={require('../assets/images/rotunda-building.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          Sign in to access UVA Campus Building Info!
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email (virginia.edu)"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>
            {isSignup ? 'Sign Up' : 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
          <Text style={styles.toggleText}>
            {isSignup
              ? 'Already have an account? Log in'
              : 'First time? Create an account'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.note}>UVA students only</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#6B403C',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderColor: '#6B403C',
    borderWidth: 1,
  },
  button: {
    width: '100%',
    backgroundColor: '#FF857A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  toggleText: {
    color: '#6B403C',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  note: {
    marginTop: 20,
    fontSize: 12,
    color: '#6B403C',
  },
});
