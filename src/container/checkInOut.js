import { Entypo, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { dateTimeAPIFormat } from '../config';
import AuthContext from '../config/AuthContext';
import Supabase from '../config/initSupabase';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const headerSize = parseInt((windowWidth * 5) / 100);
const titleSize = parseInt((windowWidth * 4) / 100);
const fontSize = parseInt((windowWidth * 5) / 100);

export default function CheckInOutScreen({ route = {}, navigation }) {
  const routeData =
    route && typeof route?.params === 'string' ? JSON.parse(route?.params) : route?.params;

  const [inputId, setInputID] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [imageBase64, setImageBase64] = useState('');
  const [pickerStaff, setPickerStaff] = useState('');

  const { fixtureMode } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(false);
  const [listPickerStaff, setListPickerStaff] = useState([]);

  const [modalLogoutVisible, setModalLogoutVisible] = useState(false);

  const handleCheckOut = async () => {
    try {
      const storeCurrentCheckIn = await AsyncStorage.getItem('@store_current_checkin');
      const currentCheckInInfo = JSON.parse(storeCurrentCheckIn);
      if (pickerStaff) {
        const payload = {
          id_staff: currentCheckInInfo?.userId,
          name: currentCheckInInfo?.name,
          check_in: currentCheckInInfo?.dateTime,
          photo_in: currentCheckInInfo?.imageBase64,

          photo_out: imageBase64,
          check_out: dateTimeAPIFormat(new Date()),

          floor: routeData?.floor,
          building: routeData?.building,
          gender: routeData?.gender,
          toilet_name: routeData?.name,
          is_surau: routeData.is_surau,
          is_office: routeData.is_office,
        };
        let finalStatus = 0;
        if (!fixtureMode) {
          const { status, error } = await Supabase.from('check_in_out').insert(payload);
          finalStatus = status;
        }
        if (fixtureMode || finalStatus === 201) {
          // ToastAndroid.show('Maklumat log masuk berjaya disimpan.!', ToastAndroid.BOTTOM);
          await AsyncStorage.removeItem('@store_current_checkin');
          await AsyncStorage.removeItem('@store_data');
          navigation.pop();
          navigation.navigate('CheckOutSummary', payload);
        }
      }
    } catch (e) {
      console.error('ehn', e);
    }
  };

  const handleCheckIn = async () => {
    if (pickerStaff) {
      try {
        let temp = {
          name: pickerStaff,
          userId: inputId,
        };
        await AsyncStorage.setItem('@store_prev_checkin', JSON.stringify(temp));

        temp = {
          ...temp,
          dateTime: dateTimeAPIFormat(new Date()),
          imageBase64: imageBase64,
        };
        await AsyncStorage.setItem('@store_current_checkin', JSON.stringify(temp));
        await AsyncStorage.setItem('@store_data', JSON.stringify(routeData));

        navigation.pop();
        navigation.navigate('CheckInSummary');
      } catch (e) {
        console.error('ehci', e);
      }
    }
  };

  const convertImageToBase64 = async (uri) => {
    const manipResult = await manipulateAsync(uri, [{ resize: { height: 480, width: 640 } }], {
      compress: 0.8,
      format: SaveFormat.JPEG,
    });

    const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
      encoding: 'base64',
    });
    setImageBase64(base64);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      convertImageToBase64(result.assets[0].uri);
      setImageUrl(result.assets[0].uri);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const storeCurrentCheckIn = await AsyncStorage.getItem('@store_current_checkin');
        const currentCheckInInfo = JSON.parse(storeCurrentCheckIn);

        const storePrevCheckIn = await AsyncStorage.getItem('@store_prev_checkin');
        const prevCheckInInfo = JSON.parse(storePrevCheckIn);

        setIsLogin(Boolean(currentCheckInInfo?.name));
        setPickerStaff(currentCheckInInfo?.name || prevCheckInInfo?.name);
        setInputID(currentCheckInInfo?.userId || prevCheckInInfo?.prevId);

        navigation.setOptions({
          title: Boolean(currentCheckInInfo?.name) ? 'Log Keluar' : 'Log Masuk',
          headerRight: () =>
            Boolean(currentCheckInInfo?.name) ? (
              <TouchableOpacity
                style={styles.buttonLogout}
                onPress={() => setModalLogoutVisible(!modalLogoutVisible)}
              >
                <MaterialCommunityIcons name="delete-forever-outline" size={30} color="red" />
              </TouchableOpacity>
            ) : null,
        });
      } catch (e) {
        console.error('euengd', e);
      }
    };
    getData();

    if (fixtureMode) {
      setListPickerStaff(require('../constants/name.json'));
    } else {
      try {
        (async () => {
          const { data: dataFetch, error: errorFetch } = await Supabase.from('staff').select();
          if (dataFetch?.length > 0) {
            setListPickerStaff(dataFetch);
          }
        })();
      } catch (e) {
        console.error('eufn', e);
      }
    }
  }, []);

  useEffect(() => {
    if (routeData?.uri) {
      // from camera
      convertImageToBase64(routeData?.uri);
      setImageUrl(routeData?.uri);
    }
  }, [routeData?.uri]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, flexGrow: 1 }}>
        <View style={[styles.container, { padding: 30 }]}>
          {routeData && (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '600' }}>
                {`${routeData.is_surau ? 'Surau' : routeData.is_office ? 'Pejabat' : 'Tandas'} ${
                  routeData?.name
                }${routeData?.gender == 1 ? ' (L)' : routeData?.gender == 0 ? '' : ' (P)'}`}
              </Text>
              <Text style={{ fontSize: 20, fontWeight: '600' }}>
                <Text style={{ textTransform: 'capitalize' }}>{routeData?.building}</Text>
                {routeData?.floor && ` Tingkat ${routeData?.floor}`}
              </Text>
              <View style={{ width: 50, height: 10, borderBottomWidth: 1 }}></View>
            </View>
          )}
          <View style={styles.container}>
            {isLogin && (
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', textTransform: 'capitalize' }}>
                  Selamat Kembali
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: '900',
                    paddingTop: 10,
                  }}
                >
                  {pickerStaff}
                </Text>
              </View>
            )}

            {!isLogin && (
              <View style={{ paddingTop: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                  }}
                >
                  Sila Pilih Nama Anda
                </Text>
                {/* <TextInput
                placeholder="Nama Pekerja"
                style={{ borderWidth: 1, borderRadius: 5, padding: 10, marginTop: 10 }}
                onChangeText={setInputName}
                value={inputName}
              /> */}
                <View style={{ borderWidth: 1, borderRadius: 10, marginTop: 10, marginBottom: 20 }}>
                  <Picker
                    selectedValue={pickerStaff}
                    onValueChange={(itemValue, itemIndex) => {
                      listPickerStaff.map(
                        (a) => a.staff_name === itemValue && setInputID(a.staff_id)
                      );
                      setPickerStaff(itemValue);
                    }}
                  >
                    <Picker.Item label="Pilih Nama" value="" />
                    {listPickerStaff?.map((a, i) => (
                      <Picker.Item
                        key={i}
                        label={i + 1 + ' - ' + a.staff_name}
                        value={a.staff_name}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}

            <Text
              style={{
                fontSize: 14,
                marginTop: isLogin ? 30 : 3,
                textAlign: isLogin ? 'center' : 'left',
              }}
            >
              Sila lampirkan gambar
            </Text>
            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#2a908f',
                  borderRadius: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  marginHorizontal: 5,
                }}
                onPress={() => navigation.navigate('Camera', routeData)}
              >
                <View
                  style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Entypo name="camera" size={24} color="#2a908f" />
                  <Text
                    style={{
                      color: '#2a908f',
                      textAlign: 'center',
                      fontWeight: '500',
                      paddingHorizontal: 10,
                    }}
                  >
                    Buka Kamera
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#2a908f',
                  borderRadius: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  marginHorizontal: 5,
                }}
                onPress={pickImage}
              >
                <View
                  style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                >
                  <FontAwesome name="file-picture-o" size={24} color="#2a908f" />
                  <Text
                    style={{
                      color: '#2a908f',
                      textAlign: 'center',
                      fontWeight: '500',
                      paddingHorizontal: 10,
                    }}
                  >
                    Buka Galeri
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 20 }}>
              {imageUrl && (
                <Image
                  source={{ uri: imageUrl }}
                  style={{ width: '100%', height: 200, borderRadius: 10 }}
                />
              )}
            </View>

            {isLogin ? (
              <TouchableOpacity
                style={{
                  backgroundColor: !pickerStaff ? 'lightgrey' : '#2a908f',
                  borderRadius: 10,
                  paddingVertical: 15,
                  marginVertical: 20,
                }}
                onPress={() => handleCheckOut()}
              >
                <Text
                  style={{
                    color: !pickerStaff ? 'grey' : '#fff',
                    fontWeight: '500',
                    textAlign: 'center',
                  }}
                >
                  Log Keluar
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                disabled={!pickerStaff}
                style={{
                  backgroundColor: !pickerStaff ? 'lightgrey' : '#2a908f',
                  borderRadius: 10,
                  paddingVertical: 15,
                  marginVertical: 20,
                }}
                onPress={() => handleCheckIn()}
              >
                <Text
                  style={{
                    color: !pickerStaff ? 'grey' : '#fff',
                    fontWeight: '700',
                    textAlign: 'center',
                  }}
                >
                  Log Masuk
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Modal
          animationType="slide"
          //animationInTiming = {13900}
          transparent={false}
          visible={modalLogoutVisible}
          // animationOut = "slide"
          swipeDirection="down"
          style={{ opacity: 0.5 }}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Anda pasti ingin <Text style={{ fontWeight: 'bold' }}>Log Masuk</Text> semula?
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
                    setModalLogoutVisible(!modalLogoutVisible);
                  }}
                >
                  <Text style={[styles.textStyle, { color: '#2196F3' }]}>Kembali</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                  onPress={async () => {
                    setModalLogoutVisible(!modalLogoutVisible);
                    await AsyncStorage.clear();
                    navigation?.navigate('QRScanner');
                  }}
                >
                  <Text style={styles.textStyle}>Teruskan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: headerSize,
    fontWeight: '600',
    marginHorizontal: 10,
    textTransform: 'capitalize',
  },
  text: {
    fontSize: headerSize - 1,
    fontWeight: '400',
  },
  label: {},
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
  button: {
    marginTop: 10,
    backgroundColor: '#2a908f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  textButton: {
    color: '#fff',
    fontWeight: '900',
    textAlign: 'center',
  },
  newButton: {
    marginTop: 25,
    backgroundColor: '#2a908f',
    paddingVertical: 10,
    paddingHorizontal: '12%',
    borderRadius: 20,
  },
  camera: {
    flex: 1,
    width: windowWidth,
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
  buttonLogout: {
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 10,
  },
});
