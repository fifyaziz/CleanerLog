import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const fontSize = parseInt((windowWidth * 4) / 100);
const iconSize = parseInt((windowWidth * 15) / 100);
const textSize = parseInt((windowWidth * 10) / 100);
const descSize = parseInt((windowWidth * 4) / 100);

export default function SelectScreen({ navigation }) {
  const [name, getName] = useState();

  useFocusEffect(() => {
    const fetchData = async () => {
      try {
        const getData = await AsyncStorage.getItem('@storage_checkin');
        getName(getData);
      } catch (e) {
        console.log('eufs', e);
      }
    };

    fetchData();
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sila Pilih</Text>
      <Text style={styles.desc}>cara untuk mengisi borang</Text>

      <View style={styles.flexContainer}>
        {!name ? (
          <TouchableOpacity
            style={styles.touchableOpacity}
            onPress={() => navigation.navigate('Name')}
          >
            <View style={styles.buttonContainer}>
              <Ionicons name="finger-print-outline" size={iconSize} color="green" />
              <Text style={styles.textButton}>Log Masuk</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.touchableOpacity}
            onPress={() => navigation.navigate('Room')}
          >
            <View style={styles.buttonContainer}>
              <Ionicons name="clipboard-outline" size={iconSize} color="green" />
              <Text style={styles.textButton}>Pilihan Manual</Text>
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.buttonContainer}>
          <Text style={styles.text} />
        </View>
        <TouchableOpacity
          style={styles.touchableOpacity}
          onPress={() => navigation.navigate('QR_Scanner')}
        >
          <View style={styles.buttonContainer}>
            <Ionicons name="camera-outline" size={iconSize} color="green" />
            <Text style={styles.textButton}>Mengimbas{'\n'}Kod QR</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    minWidth: '8%',
    fontSize: textSize,
    fontWeight: '600',
  },
  desc: {
    minWidth: '8%',
    fontSize: descSize,
    fontWeight: '400',
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    fontSize: fontSize,
    fontWeight: '700',
    textAlign: 'center',
    color: 'green',
  },
  touchableOpacity: {
    padding: '8%',
    borderRadius: '8%',
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#68a0cf',
  },
});
