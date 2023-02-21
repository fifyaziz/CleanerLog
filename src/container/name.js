import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const headerSize = parseInt((windowWidth * 5) / 100);
const titleSize = parseInt((windowWidth * 5) / 100);
const fontSize = parseInt((windowWidth * 4) / 100);

export default function NameScreen({ route, navigation }) {
  const [inputName, setInputName] = useState();
  const [nameStored, setNameStored] = useState(false);
  const routeData = route?.params;

  const handleNext = () => {
    if (inputName) {
      navigation.navigate('Entry', { data: routeData, name: inputName });
    } else {
      ToastAndroid.show('Sila masukkan nama', ToastAndroid.TOP);
    }
  };

  const handleCheckIn = async () => {
    if (inputName) {
      try {
        await AsyncStorage.setItem('@storage_checkin', inputName);
        await AsyncStorage.setItem('@storage_checkin_date', new Date().toISOString());
        await AsyncStorage.setItem('@storage_data', routeData);

      ToastAndroid.show('Log Masuk Telah Berjaya', ToastAndroid.LONG);
      navigation.pop();
        navigation.navigate('Cleaning');
      } catch (e) {
        console.error('ehci', e);
      }
    } else {
      ToastAndroid.show('Sila masukkan nama', ToastAndroid.TOP);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        // await AsyncStorage.removeItem('@storage_checkin');
        const getName = await AsyncStorage.getItem('@storage_checkin');
        setNameStored(Boolean(getName));
        setInputName(getName);
      } catch (e) {
        console.error('euen', e);
      }
    };
    getData();
  }, []);

  console.log(routeData);

  return (
    <View style={styles.container}>
      {routeData && (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.title}>
            Tandas {JSON.parse(routeData).name}{' '}
            {JSON.parse(routeData).gender == 1 ? 'Lelaki' : 'Perempuan'}
          </Text>
          <Text style={styles.title}>
            {JSON.parse(routeData).building} Tingkat {JSON.parse(routeData).floor}
          </Text>
          <View style={{ width: 50, height: 10, borderBottomWidth: 1 }}></View>
        </View>
      )}
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
              {inputName}
            </Text>
          </View>
        ) : (
          <View>
            <Text style={styles.text}>Sila masukkan nama pekerja</Text>
            <TextInput
              placeholder="Nama Pekerja"
              style={styles.input}
              onChangeText={setInputName}
              value={inputName}
            />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '10%',
  },
  title: {
    fontSize: titleSize,
    fontWeight: '600',
    marginHorizontal: 10,
    textTransform: 'capitalize',
  },
  text: {
    fontSize: headerSize - 1,
    fontWeight: '400',
  },
  input: {
    minWidth: '80%',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionDescription: {
    fontSize: fontSize,
    fontWeight: '400',
  },
  newButton: {
    marginTop: 25,
    backgroundColor: 'deepskyblue',
    paddingVertical: 10,
    paddingHorizontal: '12%',
    borderRadius: 20,
  },
});
