// screens/HomeScreen.js
import React from 'react';
import {db} from '../firebase'; // Importing db from firebase.js
import { getFirestore } from 'firebase/firestore'; // Importing Firestore
import { getDocs, collection } from 'firebase/firestore'; // Importing Firestore methods
import { useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
//import { Dropdown } from 'react-native-element-dropdown'; 


export default function HomeScreen() {
  //const [sortOption, setSortOption] = React.useState('Newest');

  return (
    <View style={styles.container}>
      {/* Top Menu Bar */}
      <View style={styles.topBar}>
        {/* Logo */}
        <Text>Home Screen</Text> {/* add logo here */}

        {/* Search Bar */}
        <TextInput
          placeholder="Search..."
          style={styles.searchBar}
        />

        {/* Favorites Button */}
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="favorite" size={24} color="red" />
        </TouchableOpacity>

        {/* Sort Dropdown (simple mockup) */}
        <TouchableOpacity style={styles.dropdownFake}>
          <Text>Sort by ▼</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: 
  { flex: 1, 
    backgroundColor: '#fff', 
    justifyContent: 'center', 
    alignItems: 'center' },
  text: { fontSize: 24 },
  topBar: {
    flexDirection: 'row',
    paddingTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    height:100,
    elevation:2
  },
  logo:{
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: 'contain'
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10
  },
  iconButton: {
    padding: 10,
    marginRight: 10
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: '#f0f0f0'
  },
  sortText: {
    marginRight: 5,
    fontSize: 16,
    color: 'black'
  },
  dropdownFake: {
  marginLeft: 10,
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderWidth: 1,
  borderRadius: 5,
  borderColor: '#ccc',
  }
});