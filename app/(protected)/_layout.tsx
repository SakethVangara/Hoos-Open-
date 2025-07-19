import { Slot, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedLayout() {
  const [isReady, setIsReady] = useState(false);
  const { username } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Delay logic until after initial mount
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady && !username) {
      router.replace('/login');
    }
  }, [isReady, username, router]);

  return <Slot />;
}
