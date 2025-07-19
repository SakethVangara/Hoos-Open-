import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  // ✅ Correct proxy-based redirect URI
  const redirectUri = 'https://auth.expo.io/@svangara1/Hoos-Open-';

  console.log('Redirect URI:', redirectUri); // should log https://auth.expo.io/@svangara1/Hoos-Open-

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '1032365950842-fnth47ang8j8rtpmkmd15sb5lduftcgq.apps.googleusercontent.com',
    androidClientId: '1032365950842-fbqn45ems3cmugqcfov5p84mmfmdqj0l.apps.googleusercontent.com',
    expoClientId: '1032365950842-e28jr97vcmhc8hden78ambpk4pqkc012.apps.googleusercontent.com',
    redirectUri,
    selectAccount: true,
  } as any);

  useEffect(() => {
    if (response?.type === 'success') {
      const email = response.authentication?.idToken ? parseJwt(response.authentication.idToken).email : null;
      if (email) {
        login({ email });
        router.replace('/');
      }
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>UVA Campus Buildings</Text>
        <Text style={styles.subtitle}>Sign in with your Google Account</Text>

        <View style={styles.button}>
          <Button
            title="Sign in with Google"
            color="#6B403C"
            disabled={!request}
            onPress={() => promptAsync()}
          />
        </View>
      </View>
    </View>
  );
}

// Helper to decode JWT token to extract email
function parseJwt(token: string): any {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBAEE6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ADEBB3',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6B403C',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B403C',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginBottom: 20,
  },
});
