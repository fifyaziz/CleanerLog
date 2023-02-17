import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const headerSize = parseInt((windowWidth * 6) / 100);
const fontSize = parseInt((windowWidth * 4) / 100);

export default function NameScreen({ route, navigation }) {
  const [name, setName] = useState();
  const [nameStored, setNameStored] = useState(false);
  const routeData = route?.params?.data;

  const handleNext = () => {
    if (name) {
      navigation.navigate('Entry', { data: routeData, name });
    } else {
      ToastAndroid.show('Sila masukkan nama', ToastAndroid.TOP);
    }
  };

  const handleCheckIn = async () => {
    try {
      await AsyncStorage.setItem('@storage_checkin', name);
      await AsyncStorage.setItem('@storage_checkin_date', new Date().toISOString());
      navigation.navigate('Select');
    } catch (e) {
      console.error('ehci', e);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        // await AsyncStorage.removeItem('@storage_checkin');
        const getName = await AsyncStorage.getItem('@storage_checkin');
        console.log('getName', getName);
        setNameStored(Boolean(getName));
        setName(getName);
      } catch (e) {
        console.error('euen', e);
      }
    };
    getData();
  }, []);

  console.log(new Date().toISOString());

  return (
    <View style={styles.container}>
      {nameStored ? (
        <View>
          <Text style={styles.text}>Selamat Kembali</Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: fontSize + 10,
              fontWeight: '900',
              paddingTop: 10,
              paddingBottom: 30,
            }}
          >
            {name}
          </Text>
        </View>
      ) : (
        <View>
          <Text style={styles.text}>Sila Isikan Nama</Text>
          <TextInput placeholder="Nama" style={styles.input} onChangeText={setName} value={name} />
        </View>
      )}

      {nameStored ? (
        <TouchableOpacity style={styles.newButton} onPress={() => handleNext()}>
          <Text style={[styles.sectionDescription, { color: '#fff', fontWeight: '900' }]}>
            Seterusnya
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.newButton} onPress={() => handleCheckIn()}>
          <Text style={[styles.sectionDescription, { color: '#fff', fontWeight: '900' }]}>
            Check In
          </Text>
        </TouchableOpacity>
      )}
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
    fontSize: headerSize,
    fontWeight: '400',
    padding: 10,
    marginHorizontal: 10,
  },
  input: {
    minWidth: '80%',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionDescription: {
    fontSize: fontSize,
    fontWeight: '400',
  },
  newButton: {
    marginTop: 20,
    backgroundColor: 'deepskyblue',
    paddingVertical: 10,
    paddingHorizontal: '12%',
    borderRadius: 20,
  },
});
