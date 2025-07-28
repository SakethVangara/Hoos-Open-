import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type BuildingType = 'Library' | 'Gym' | 'Academic' | 'Dining' | 'Cafe' | 'Convenience';

export type Building = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: BuildingType;
  hours: Record<string, string>;
  tags: string[];
};

const FAVORITES_KEY = 'UVA_FAVORITE_BUILDINGS';

const typeToEmojiMap: Record<BuildingType, string> = {
  Library: '📚',
  Gym: '🏋️',
  Academic: '🎓',
  Dining: '🥪',
  Cafe: '☕',
  Convenience: '🛍️',
};

const getTodayHours = (hours: Record<string, string>) => {
  const day = new Date().getDay();
  if (day === 0) return hours['Sun'] || 'Closed';
  if (day === 6) return hours['Sat'] || 'Closed';
  return hours['M-F'] || 'Closed';
};

const isOpenNow = (hours: string): boolean => {
  if (!hours || hours.toLowerCase() === 'closed') return false;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const [startStr, endStr] = hours.split('-').map((h) => h.trim());
  if (!startStr || !endStr) return false;

  const parseTimeString = (str: string, isEnd = false): number => {
    const match = str.match(/(\d{1,2})(?::(\d{2}))?(AM|PM)/i);
    if (!match) return -1;

    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2] || '0', 10);
    const period = match[3].toUpperCase();

    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = isEnd ? 24 : 0;

    return hour * 60 + minute;
  };

  const startMinutes = parseTimeString(startStr);
  const endMinutes = parseTimeString(endStr, true);

  if (startMinutes === -1 || endMinutes === -1) return false;

  if (endMinutes <= startMinutes) {
    return nowMinutes >= startMinutes || nowMinutes < endMinutes;
  }

  return nowMinutes >= startMinutes && nowMinutes < endMinutes;
};

const BuildingsScreen = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState<'All' | 'Open' | 'Closed'>('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const db = getFirestore(app);
        const snapshot = await getDocs(collection(db, 'locations'));
        const fetched = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            address: data.address || '',
            lat: data.lat ?? 0,
            lng: data.lng ?? 0,
            type: data.type || 'Other',
            hours: data.hours || {},
            tags: data.tags || [],
          } as Building;
        });
        setBuildings(fetched);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as string[];
          setFavorites(new Set(parsed));
        }
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    };

    fetchBuildings();
    loadFavorites();
  }, []);

  const saveFavorites = async (updatedFavorites: Set<string>) => {
    try {
      const arr = Array.from(updatedFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(arr));
    } catch (err) {
      console.error('Error saving favorites:', err);
    }
  };

  const toggleFavorite = (name: string) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      if (updated.has(name)) {
        updated.delete(name);
      } else {
        updated.add(name);
      }
      saveFavorites(updated);
      return updated;
    });
  };

  const filteredBuildings = buildings.filter((b) => {
    const todayHours = getTodayHours(b.hours);
    const matchesSearch = b.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesFavorite = !showFavoritesOnly || favorites.has(b.name);
    const matchesFilter =
      filter === 'All' ||
      (filter === 'Open' && isOpenNow(todayHours)) ||
      (filter === 'Closed' && !isOpenNow(todayHours));
    return matchesSearch && matchesFavorite && matchesFilter;
  });

  return (
    <LinearGradient
      colors={['#f5d4ef', '#d6f5dc']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.topBar}>
            <View style={styles.topBar__welcome}>
              <View>
                <Text style={styles.topBar__welcomeTitle}>🏫 UVA Buildings</Text>
                <Text style={styles.topBar__welcomeSubtitle}>Welcome back!</Text>
              </View>
              <TouchableOpacity>
                <Text style={{ fontSize: 16 }}>↪</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.topBar__searchBar}>
              <TextInput
                placeholder="Search buildings..."
                placeholderTextColor="#5a2d2d"
                style={styles.topBar__searchInput}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            <View style={styles.topBar__userActions}>
              <View style={styles.topBar__selectWrapper}>
                <Picker
                  style={styles.topBar__select}
                  selectedValue={filter}
                  onValueChange={(value) => setFilter(value)}
                >
                  <Picker.Item label="Sort by Status" value="All" />
                  <Picker.Item label="Open" value="Open" />
                  <Picker.Item label="Closed" value="Closed" />
                </Picker>
              </View>
              <TouchableOpacity
                style={styles.topBar__button}
                onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
              >
                <Text style={styles.topBar__buttonText}>♡ Favorites</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.main}>
            {filteredBuildings.map((building, index) => {
              const todayHours = getTodayHours(building.hours);
              const open = isOpenNow(todayHours);

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigation.navigate('Details', { buildingId: building.id })}
                >
                  <View style={styles.buildingCard}>
                    <View style={styles.buildingCard__header}>
                      <View style={styles.buildingCard__title}>
                        <Text style={styles.buildingCard__icon}>
                          {typeToEmojiMap[building.type] || '🏠'}
                        </Text>
                        <View style={styles.buildingCard__name}>
                          <Text style={styles.buildingCard__nameText}>{building.name}</Text>
                          <View style={{ flexDirection: 'row', gap: 8 }}>
                            <View style={[styles.statusLabel, styles.statusLabel__type]}>
                              <Text style={styles.statusLabel__text}>{building.type}</Text>
                            </View>
                            <View
                              style={[
                                styles.statusLabel,
                                open ? styles.statusOpen : styles.statusClosed,
                              ]}
                            >
                              <Text style={styles.statusLabel__text}>
                                {open ? 'Open' : 'Closed'}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity onPress={() => toggleFavorite(building.name)}>
                        <Text style={{ fontSize: 16, color: favorites.has(building.name) ? 'red' : '#555' }}>
                          {favorites.has(building.name) ? '♥' : '♡'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.buildingCard__hours}>
                      <Text style={{ fontSize: 14 }}>🕒</Text>
                      <Text style={styles.buildingCard__hoursText}>
                        Today: {todayHours}
                      </Text>
                    </View>

                    <View style={styles.tagRow}>
                      {building.tags?.map((tag, i) => (
                        <View key={i} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  topBar: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 12 },
  topBar__welcome: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  topBar__welcomeTitle: { fontSize: 20, fontWeight: 'bold', color: '#5a2d2d' },
  topBar__welcomeSubtitle: { fontSize: 14, color: '#777' },
  topBar__searchBar: {
    marginTop: 12, borderWidth: 2, borderColor: '#eed', borderRadius: 9999,
    paddingHorizontal: 16, paddingVertical: 6,
  },
  topBar__searchInput: { fontSize: 14, color: '#5a2d2d' },
  topBar__userActions: {
    flexDirection: 'row', marginTop: 12, gap: 10, alignItems: 'center',
  },
  topBar__selectWrapper: {
    flex: 1, borderWidth: 2, borderColor: '#eed', borderRadius: 9999, overflow: 'hidden',
  },
  topBar__select: { fontSize: 13 },
  topBar__button: {
    borderWidth: 2, borderColor: '#eed', borderRadius: 9999,
    paddingHorizontal: 16, paddingVertical: 6,
  },
  topBar__buttonText: { fontSize: 13, color: '#555' },
  main: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  buildingCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 20,
    borderColor: '#ADEBB3', borderWidth: 2, shadowColor: '#000', shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2,
  },
  buildingCard__header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12,
  },
  buildingCard__title: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  buildingCard__icon: { fontSize: 20 },
  buildingCard__name: { flexDirection: 'column', gap: 4 },
  buildingCard__nameText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statusLabel: {
    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 2,
    borderRadius: 8, borderWidth: 1.5, marginTop: 4,
  },
  statusLabel__type: { backgroundColor: '#eee', borderColor: '#ddd' },
  statusLabel__text: { fontSize: 12, fontWeight: '500', color: '#555' },
  statusOpen: {
    backgroundColor: '#c8f7c5',
    borderColor: '#7ed87e',
  },
  statusClosed: {
    backgroundColor: '#f7c5c5',
    borderColor: '#e27b7b',
  },
  buildingCard__hours: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6,
  },
  buildingCard__hoursText: { fontSize: 14, fontWeight: '500', color: '#555' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: '#f5f5f5', borderColor: '#ddd', borderWidth: 1,
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 2,
  },
  tagText: { fontSize: 12, color: '#444' },
});

export default BuildingsScreen;
