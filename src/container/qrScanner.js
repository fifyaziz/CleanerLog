import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const headerSize = parseInt((windowWidth * 7) / 100);
const textSize = parseInt((windowWidth * 4) / 100);

export default function ScannerScreen() {
  const navigation = useNavigation();

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [name, setName] = useState();

  const handleBarCodeScanned = ({ data }) => {
    setScanned(false);
    setHasPermission(null);
    if(name){
      navigation.navigate('ReportStaff', data);
    } else{
      navigation.navigate('Name', data);
    }
  };

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getBarCodeScannerPermissions();
  }, [hasPermission]);

  useEffect(() => {
    if (!isVisible) {
      setIsVisible(!isVisible);
    }
  }, [isVisible]);

  useFocusEffect(() => {
    const fetchData = async () => {
      try {
        // await AsyncStorage.removeItem('@storage_checkin');
        const getData = await AsyncStorage.getItem('@storage_checkin');
        setName(getData);
      } catch (e) {
        console.error('eufs', e);
      }
    };

    fetchData();
  });

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {name ? (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.header}>Selamat Kembali</Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.text}>Sila imbas untuk log keluar</Text>
        </View>
      ) : (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.header}>Selamat Datang</Text>
          <Text style={styles.name} />
          <Text style={styles.text}>Sila imbas untuk log masuk</Text>
        </View>
      )}

      {isVisible && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: '60%', width: '100%', borderRadius: 50 }}
        />
      )}

      {/* {scanned && (
        <View style={styles.scanAgain}>
          <Button title={'Imbas Semula'} onPress={() => setScanned(false)} />
        </View>
      )} */}
      <View style={styles.scanAgain}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}
          onPress={() => setIsVisible(!isVisible)}
        >
          <Text style={{ color: 'white', fontWeight: '500' }}>Imbas Semula</Text>
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
    justifyContent: 'flex-start',
    paddingVertical: 30,
  },
  scanAgain: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: 'deepskyblue',
  },
  header: {
    minWidth: '8%',
    fontSize: headerSize-3,
    fontWeight: '500',
  },
  name: {
    textAlign: 'center',
    fontSize: headerSize,
    fontWeight: '900',
    paddingBottom: 30,
  },
  text: {
    minWidth: '8%',
    fontSize: textSize,
    fontWeight: '500',
    marginBottom: 20,
  },
});
