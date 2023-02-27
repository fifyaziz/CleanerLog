import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const headerSize = parseInt((windowWidth * 7) / 100);
const textSize = parseInt((windowWidth * 4) / 100);

export default function ScannerScreen() {
  const navigation = useNavigation();

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isRetryButton, setIsRetryButton] = useState(false);

  const [name, setName] = useState();

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(false);
    setHasPermission(null);
    const correctData = data.includes('name');

    if (correctData) {
      if (name) {
        try {
          const getData = await AsyncStorage.getItem('@storage_data');
          if (JSON.parse(getData)?.name === JSON.parse(data).name) {
            navigation.navigate('Name', data);
          } else {
            Alert.alert('Kod QR tidak sama');
          }
        } catch (e) {
          console.error('eufs', e);
        }
      } else {
        navigation.navigate('Name', data);
      }
    } else {
      Alert.alert('Kod QR tidak sah');
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
    if (isVisible) {
      const timer = setTimeout(() => setIsRetryButton(true), 5000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(!isVisible);
    }
  }, [isVisible]);

  // useFocusEffect(
  //   useCallback(() => {
  //     setIsVisible(true);
  //     return () => setIsVisible(false);
  //   }, [])
  // );

  useFocusEffect(() => {
    const fetchData = async () => {
      try {
        // await AsyncStorage.clear();
        const getData = await AsyncStorage.getItem('@storage_checkin');
        setName(getData);
      } catch (e) {
        console.error('eufs', e);
      }
    };

    fetchData();
  });

  return (
    <ScrollView>
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
            <Text style={{ marginTop: 10 }} />
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
        {isRetryButton && (
          <View style={styles.scanAgain}>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}
              onPress={() => {
                setIsRetryButton(false);
                setIsVisible(!isVisible);
              }}
            >
              <FontAwesome5 name="redo" size={25} color="deepskyblue" />
            </TouchableOpacity>
          </View>
        )}

        <View style={{ position: 'absolute', bottom: 20 }}>
          <Text style={{ backgroundColor: 'white' }}>
            By <Text style={{ fontStyle: 'italic', fontWeight: '700' }}>MTC Synergy SDN BHD</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: windowHeight,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 20,
  },
  scanAgain: {
    marginTop: -70,
    borderRadius: 100,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'deepskyblue',
  },
  header: {
    minWidth: '8%',
    fontSize: headerSize - 3,
    fontWeight: '500',
  },
  name: {
    textAlign: 'center',
    fontSize: headerSize,
    fontWeight: '900',
    paddingBottom: 25,
  },
  text: {
    minWidth: '8%',
    fontSize: textSize,
    fontWeight: '500',
    marginBottom: 15,
  },
});
