import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
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

export default function QRScannerScreen() {
  const navigation = useNavigation();

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isRetryButton, setIsRetryButton] = useState(false);

  const [name, setName] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState();

  const [openMenu, setOpenMenu] = useState(false);

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
            setScanned(true);
            setModalVisible(!modalVisible);
            setIsVisible(!isVisible);
            setModalData(JSON.parse(getData));
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

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
  };

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
    <ScrollView style={{ backgroundColor: '#254252' }}>
      <View style={{ backgroundColor: '#254252' }}>
        <View
          style={{
            minHeight: windowHeight,
            minWidth: windowWidth,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#254252',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              paddingTop: 80,
              paddingBottom: 20,
              zIndex: 2,
              shadowColor: 'white',
              shadowOffset: {
                width: 3,
                height: 1,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 2,
            }}
          >
            {!name ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: '800',
                    color: '#f9982f',
                  }}
                >
                  Selamat Datang
                </Text>

                <Text
                  style={{
                    marginTop: 15,
                    color: 'white',
                    fontWeight: '600',
                  }}
                >
                  Sila imbas QR untuk log masuk
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: '800',
                    color: '#f9982f',
                  }}
                >
                  Selamat Kembali
                </Text>
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: '600',
                    color: '#e37239',
                  }}
                >
                  {name || '(Nama)'}
                </Text>
                <Text style={{ marginTop: 15, color: 'white', fontWeight: '600' }}>
                  Sila imbas QR untuk log keluar
                </Text>
              </View>
            )}
          </View>

          {isVisible && (
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{
                position: 'absolute',
                top: 0,
                height: windowHeight,
                width: windowHeight - 220,
                zIndex: 1,
              }}
            />
          )}

          {isRetryButton && (
            <View
              style={{
                zIndex: 2,
                position: 'absolute',
                bottom: '8%',
                borderRadius: 100,
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#e37239',
              }}
            >
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                }}
                onPress={() => {
                  setIsRetryButton(false);
                  setIsVisible(!isVisible);
                }}
              >
                <FontAwesome5 name="redo" size={25} color="#e76f51" />
              </TouchableOpacity>
            </View>
          )}

          {openMenu && (
            <View
              style={{
                alignItems: 'flex-end',
                position: 'absolute',
                bottom: '15%',
                right: 10,
                zIndex: 2,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    backgroundColor: 'lightgrey',
                    paddingVertical: 3,
                    paddingHorizontal: 5,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: '#2a908f', fontWeight: '700' }}>Laporan Harian</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setOpenMenu(!openMenu);
                    navigation.navigate('DrawerRight');
                  }}
                >
                  <View
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      borderRadius: 10,
                      backgroundColor: 'white',
                      marginLeft: 2,
                      marginBottom: 5,
                      borderWidth: 2,
                      borderColor: '#2a908f',
                    }}
                  >
                    <Ionicons name="clipboard" size={25} color="#2a908f" />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    backgroundColor: 'lightgrey',
                    paddingVertical: 3,
                    paddingHorizontal: 5,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: '#2a908f', fontWeight: '700' }}>Pilihan Manual</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setOpenMenu(!openMenu);
                    if (name) {
                      navigation.navigate('Room');
                    } else {
                      navigation.navigate('NewRoom');
                    }
                  }}
                >
                  <View
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      borderRadius: 10,
                      backgroundColor: 'white',
                      marginLeft: 2,
                      marginBottom: 5,
                      borderWidth: 2,
                      borderColor: '#2a908f',
                    }}
                  >
                    <Ionicons name="document-text" size={25} color="#2a908f" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View
            style={{
              position: 'absolute',
              bottom: '8%',
              right: 10,
              zIndex: 2,
              borderRadius: 10,
              backgroundColor: openMenu ? '#2a908f' : 'white',
              borderWidth: 2,
              borderColor: '#2a908f',
            }}
          >
            <TouchableOpacity onPress={handleOpenMenu}>
              <Ionicons
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                }}
                name="menu"
                size={25}
                color={openMenu ? 'white' : '#2a908f'}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              position: 'absolute',
              bottom: 0,
              zIndex: 3,
              backgroundColor: '#254252',
              minWidth: windowWidth,
              minHeight: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#f9982f' }}>
              By{' '}
              <Text style={{ color: '#e37239', fontStyle: 'italic', fontWeight: '700' }}>
                MTC Synergy SDN BHD
              </Text>
            </Text>
          </View>
        </View>
      </View>

      <Modal
        animationType="slide"
        //animationInTiming = {13900}
        transparent={true}
        visible={modalVisible}
        // animationOut = "slide"
        swipeDirection="down"
        style={{ opacity: 0.5 }}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText, { fontSize: 18, fontWeight: 'bold' }]}>
              Kod QR tidak sama
            </Text>
            <Text style={styles.modalText}>
              Anda telah Log Masuk di{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {modalData?.name}, {modalData?.building} Tingkat {modalData?.floor}
              </Text>
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity
                style={{
                  ...styles.openButton,
                  borderWidth: 1,
                  borderColor: '#2196F3',
                  backgroundColor: 'white',
                  marginHorizontal: 10,
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setScanned(false);
                }}
              >
                <Text style={[styles.textStyle, { color: '#2196F3' }]}>Kembali</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: windowHeight,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 20,
    // paddingHorizontal: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: '#254252',
  },
  scanAgain: {
    zIndex: 4,
    position: 'absolute',
    bottom: '8%',
    borderRadius: 100,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e37239',
  },
  header: {
    minWidth: '8%',
    fontSize: headerSize - 1,
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

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
