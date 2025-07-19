import type { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCurrentOpenStatus } from '../hooks/useCurrentOpenStatus';

type Building = {
  id: string;
  name: string;
  address: string;
  hours: { [day: string]: string };
};

type Props = {
  building: Building;
  onPress: () => void;
};

const BuildingCard: FC<Props> = ({ building, onPress }) => {
  const isOpen = useCurrentOpenStatus(building.hours);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{building.name}</Text>
        <Text style={[styles.status, isOpen ? styles.open : styles.closed]}>
          {isOpen ? 'Open' : 'Closed'}
        </Text>
      </View>
      <Text>{building.address}</Text>
    </TouchableOpacity>
  );
};

export default BuildingCard;

const styles = StyleSheet.create({
  card: { padding: 10, borderWidth: 1, marginBottom: 10 },
  title: { fontWeight: 'bold', fontSize: 16 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  status: { fontWeight: 'bold' },
  open: { color: 'green' },
  closed: { color: 'red' },
});
