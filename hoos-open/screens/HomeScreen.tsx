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

const BuildingsScreen = () => {
  type BuildingType = 'Library' | 'Gym' | 'Academic' | 'Other';
  
  const typeToEmojiMap: Record<BuildingType, string> = {
    Library: '📚',
    Gym: '🏋️',
    Academic: '🎓',
    Other: '🏠',
  };
  
  type Building = {
    name: string;
    status: string;
    hours: string;
    type: BuildingType;
    description: string;
  };
  
  const buildings: Building[] = [
    {
      name: 'Alderman Library',
      status: 'Open',
      hours: '8:00 AM - 5:00 PM',
      type: 'Library',
      description:
        'The main library of the University of Virginia. It is a beautiful building with a lot of history.',
    },
    {
      name: 'Aquatic and Fitness Center',
      status: 'Open',
      hours: '6:00 AM - 10:00 PM',
      type: 'Gym',
      description:
        'The gym and aquatic center of the University of Virginia. It is a beautiful building with a lot of history.',
    },
    {
      name: 'Clemons Library',
      status: 'Open',
      hours: '8:00 AM - 5:00 PM',
      type: 'Library',
      description:
        'The main library of the University of Virginia. It is a beautiful building with a lot of history.',
    },
    {
      name: 'Gilmer Hall',
      status: 'Open',
      hours: '8:00 AM - 5:00 PM',
      type: 'Academic',
      description:
        'The main academic building of the University of Virginia. It is a beautiful building with a lot of history.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.topBar__welcome}>
            <View style={styles.topBar__welcomeText}>
              <Text style={styles.topBar__welcomeTitle}>🏫 UVA buildings</Text>
              <Text style={styles.topBar__welcomeSubtitle}>Welcome back, Name!</Text>
            </View>
            <TouchableOpacity>
              <View style={styles.topBar__welcomeButton}>
                {/* LogOut Icon Placeholder */}
                <Text>↪</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.topBar__searchBar}>
            <TextInput 
              placeholder="Search Buildings..." 
              placeholderTextColor="#aaa"
              style={styles.topBar__searchInput}
            />
          </View>

          <View style={styles.topBar__userActions}>
            <View style={styles.topBar__selectWrapper}>
              <Picker
                style={styles.topBar__select}
                selectedValue=""
                mode="dropdown"
              >
                <Picker.Item label="Sort by Status" value="" enabled={false} />
                <Picker.Item label="Open" value="Open" />
                <Picker.Item label="Closed" value="Closed" />
              </Picker>
            </View>
            <TouchableOpacity style={styles.topBar__button}>
              <Text style={styles.topBar__buttonText}>Favorites</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.topBar__statuses}>
            <View style={styles.status}>
              <View style={[styles.status__icon, styles.status__icon__open]} />
              <Text style={styles.status__text}>9 open</Text>
            </View>
            <View style={styles.status}>
              <View style={[styles.status__icon, styles.status__icon__closed]} />
              <Text style={styles.status__text}>3 closed</Text>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.main}>
          {buildings.map((building, index) => (
            <View key={index} style={styles.buildingCard}>
              <View style={styles.buildingCard__header}>
                <View style={styles.buildingCard__title}>
                  <Text style={styles.buildingCard__icon}>
                    {typeToEmojiMap[building.type]}
                  </Text>
                  <View style={styles.buildingCard__name}>
                    <Text style={styles.buildingCard__nameText}>{building.name}</Text>
                    <View style={styles.buildingCard__status}>
                      <View style={[
                        styles.statusLabel,
                        building.status.toLowerCase() === 'open' 
                          ? styles.statusLabel__open 
                          : styles.statusLabel__closed
                      ]}>
                        <Text style={styles.statusLabel__text}>{building.status}</Text>
                      </View>
                      <View style={[styles.statusLabel, styles.statusLabel__type]}>
                        <Text style={styles.statusLabel__text}>{building.type}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <TouchableOpacity>
                  <View style={styles.buildingCard__button}>
                    {/* Heart Icon Placeholder */}
                    <Text>♡</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.buildingCard__hours}>
                <View style={styles.buildingCard__hoursIcon}>
                  {/* Clock Icon Placeholder */}
                  <Text>🕐</Text>
                </View>
                <Text style={styles.buildingCard__hoursText}>{building.hours}</Text>
              </View>

              <Text style={styles.buildingCard__description}>
                {building.description}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'column',
    gap: 12,
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  topBar__welcome: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  topBar__welcomeText: {
    flexDirection: 'column',
    gap: 5,
  },
  topBar__welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  topBar__welcomeSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#777',
  },
  topBar__welcomeButton: {
    color: '#777',
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar__searchBar: {
    borderWidth: 2,
    borderColor: '#eef',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 9999,
    width: '100%',
  },
  topBar__searchInput: {
    fontSize: 14,
  },
  topBar__userActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    alignItems: 'center',
  },
  topBar__selectWrapper: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#eef',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  topBar__select: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    fontSize: 13,
    fontWeight: '500',
    color: '#777',
  },
  topBar__button: {
    borderWidth: 2,
    borderColor: '#eef',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 9999,
    minWidth: 'auto',
  },
  topBar__buttonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#777',
  },
  topBar__statuses: {
    flexDirection: 'row',
    gap: 18,
    width: '100%',
    alignItems: 'center',
  },
  status: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  status__icon: {
    width: 10,
    height: 10,
    borderRadius: 9999,
  },
  status__icon__open: {
    backgroundColor: 'green',
  },
  status__icon__closed: {
    backgroundColor: 'red',
  },
  status__text: {
    fontSize: 14,
    color: '#777',
  },
  main: {
    flexDirection: 'column',
    gap: 16,
    paddingHorizontal: 36,
    paddingVertical: 24,
  },
  buildingCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#dfd',
  },
  buildingCard__header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  buildingCard__title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buildingCard__icon: {
    fontSize: 20,
  },
  buildingCard__name: {
    flexDirection: 'column',
    gap: 5,
  },
  buildingCard__nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  buildingCard__status: {
    flexDirection: 'row',
    gap: 5,
  },
  statusLabel: {
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 2,
  },
  statusLabel__text: {
    fontSize: 12,
    fontWeight: '500',
    color: '#777',
  },
  statusLabel__open: {
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
    borderColor: 'rgba(0, 255, 0, 0.5)',
  },
  statusLabel__closed: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderColor: 'rgba(245, 93, 93, 0.5)',
  },
  statusLabel__type: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderColor: '#ddd',
  },
  buildingCard__button: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buildingCard__hours: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buildingCard__hoursIcon: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buildingCard__hoursText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#777',
  },
  buildingCard__description: {
    marginTop: 8,
    fontSize: 12,
    color: '#777',
    letterSpacing: 0.2,
  },
});

export default BuildingsScreen;