import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import BuildingCard from '../../components/BuildingCard';
import buildings from '../../data/buildings';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const filtered = buildings.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
        <BuildingCard building={item} onPress={() => router.push(`/details/${item.id}`)} />
  )}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  search: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
});
