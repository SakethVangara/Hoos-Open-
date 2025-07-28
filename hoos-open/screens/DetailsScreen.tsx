import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Linking,
  Pressable,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { doc, onSnapshot, collection, addDoc, query, orderBy } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { app } from '../firebase';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  Details: { buildingId: string };
};

type Building = {
  name: string;
  type: string;
  address: string;
  description: string;
  hours: Record<string, string>;
  lat: number;
  lng: number;
  tags?: string[];
};

type Comment = {
  user: string;
  text: string;
  timestamp: { seconds: number };
};

const typeToEmojiMap: Record<string, string> = {
  Library: '📚',
  Gym: '🏋️',
  Academic: '🎓',
  Dining: '🥪',
  Cafe: '☕',
  Convenience: '🛍️',
};

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const weekdayKeys: Record<string, string> = {
  Monday: 'M-F',
  Tuesday: 'M-F',
  Wednesday: 'M-F',
  Thursday: 'M-F',
  Friday: 'M-F',
  Saturday: 'Sat',
  Sunday: 'Sun',
};

const DetailsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Details'>>();
  const navigation = useNavigation();
  const { params } = route;
  const buildingId = params?.buildingId ?? '';
  const db = getFirestore(app);

  const [building, setBuilding] = useState<Building | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    if (!buildingId) return;

    const unsub = onSnapshot(doc(db, 'locations', buildingId), (docSnap) => {
      if (docSnap.exists()) {
        setBuilding(docSnap.data() as Building);
      }
    });

    const q = query(
      collection(db, 'locations', buildingId, 'comments'),
      orderBy('timestamp', 'desc')
    );

    const unsubComments = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => d.data() as Comment);
      setComments(data);
    });

    return () => {
      unsub();
      unsubComments();
    };
  }, [buildingId]);

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;
    await addDoc(collection(db, 'locations', buildingId, 'comments'), {
      user: 'Anonymous',
      text: commentInput.trim(),
      timestamp: new Date(),
    });
    setCommentInput('');
  };

  if (!buildingId) {
    return (
      <View style={styles.loading}>
        <Text>Error: No building selected.</Text>
      </View>
    );
  }

  if (!building) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const getHoursForDay = (day: string): string => {
    const key = weekdayKeys[day] || day;
    const val = building.hours[key];
    return val || 'Closed';
  };

  const buildingEmoji = typeToEmojiMap[building.type] || '🏛️';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#5a2d2d" />
      </Pressable>

      <Text style={styles.title}>
        {buildingEmoji} {building.name}
      </Text>

      <View style={styles.badges}>
        <Text style={[styles.badge, styles.open]}>Open</Text>
        <Text style={styles.badge}>{building.type}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.description}>
          {building.description || 'No description available.'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🕓 Hours</Text>
        {weekdays.map((day) => (
          <View key={day} style={styles.hoursRow}>
            <Text style={styles.day}>{day}</Text>
            <Text style={styles.time}>{getHoursForDay(day)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📍 Address</Text>
        <Text style={styles.address}>{building.address}</Text>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => {
            const url = `https://www.google.com/maps/search/?api=1&query=${building.lat},${building.lng}`;
            Linking.openURL(url);
          }}
        >
          <Text style={styles.mapButtonText}>Open in Maps ↗</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>💬 Comments ({comments.length})</Text>
        <TextInput
          style={styles.input}
          placeholder="Ask a question or share info..."
          value={commentInput}
          onChangeText={setCommentInput}
        />
        <TouchableOpacity style={styles.commentButton} onPress={handleCommentSubmit}>
          <Text style={styles.commentButtonText}>Post Comment</Text>
        </TouchableOpacity>

        {comments.map((comment, idx) => (
          <View key={idx} style={styles.comment}>
            <Text style={styles.commentUser}>{comment.user}</Text>
            <Text style={styles.commentTime}>
              {new Date(comment.timestamp.seconds * 1000).toLocaleString()}
            </Text>
            <Text style={styles.commentText}>{comment.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fef6fb',
  },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5a2d2d',
    marginBottom: 6,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#eee',
    fontSize: 12,
    color: '#444',
  },
  open: { backgroundColor: '#c8f7c5' },
  card: {
    backgroundColor: '#fff0f8',
    padding: 14,
    borderRadius: 16,
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#5a2d2d',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5a2d2d',
    marginBottom: 12,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  day: { fontWeight: '500', color: '#444' },
  time: { color: '#666' },
  address: { color: '#444', marginBottom: 10 },
  mapButton: {
    backgroundColor: '#fce4ff',
    borderRadius: 10,
    padding: 10,
    alignSelf: 'flex-start',
  },
  mapButtonText: { color: '#7a1fa2', fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  commentButton: {
    backgroundColor: '#f5d4ef',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  commentButtonText: { fontWeight: '500', color: '#333' },
  comment: {
    backgroundColor: '#fdf8ff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  commentUser: { fontWeight: '600', color: '#5a2d2d' },
  commentTime: { fontSize: 12, color: '#888' },
  commentText: { color: '#333', marginTop: 4 },
});

export default DetailsScreen;
