import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import CommentSection from '../../../components/CommentSection';
import buildings from '../../../data/buildings';
import { useCurrentOpenStatus } from '../../../hooks/useCurrentOpenStatus';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const building = buildings.find(b => b.id === id);

  if (!building) return <Text>Building not found</Text>;

  const isOpen = useCurrentOpenStatus(building.hours);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>
        {building.name} ({isOpen ? 'Open Now' : 'Closed'})
      </Text>
      <Text>{building.address}</Text>
      <Text style={styles.sectionTitle}>Hours:</Text>
      {Object.entries(building.hours).map(([day, hours]) => (
        <Text key={day}>
          {day}: {hours}
        </Text>
      ))}
      <CommentSection buildingId={building.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  name: { fontSize: 24, fontWeight: 'bold' },
  sectionTitle: { marginTop: 20, fontWeight: 'bold' },
});
