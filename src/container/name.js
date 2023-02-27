import { Entypo, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import Supabase from '../config/initSupabase';

const windowWidth = Dimensions.get('window').width;
const headerSize = parseInt((windowWidth * 5) / 100);
const titleSize = parseInt((windowWidth * 4) / 100);
const fontSize = parseInt((windowWidth * 5) / 100);

export default function NameScreen({ route = {}, navigation }) {
  const routeData =
    route && typeof route?.params === 'string' ? JSON.parse(route?.params) : route?.params;

  const [inputName, setInputName] = useState();
  const [nameStored, setNameStored] = useState(false);
  const [image, setImage] = useState();
  const [imageBase64, setImageBase64] = useState('');
  const [pickerStaff, setPickerStaff] = useState('');
  const [listPickerStaff, setListPickerStaff] = useState([]);

  const handleNext = async () => {
    try {
      const getName = await AsyncStorage.getItem('@storage_checkin');
      const getDate = await AsyncStorage.getItem('@storage_checkin_date');
      const getPhoto = await AsyncStorage.getItem('@storage_checkin_photo');
      if (inputName) {
        const payload = {
          name: getName,
          floor: routeData?.floor,
          building: routeData?.building,
          gender: routeData?.gender,
          check_in: getDate,
          photo_in: getPhoto,
          check_out: new Date().toISOString(),
          photo_out: imageBase64,
          toilet_name: routeData?.name,
        };
        const { status, error } = await Supabase.from('check_in_out').insert(payload);
        if (status === 201) {
          ToastAndroid.show('Maklumat log masuk berjaya disimpan.!', ToastAndroid.BOTTOM);
          navigation.pop();
          navigation.navigate('ReportStaff', payload);
        }
      } else {
        ToastAndroid.show('Sila masukkan nama', ToastAndroid.TOP);
      }
    } catch (e) {
      console.error('ehn', e);
    }
  };

  const handleCheckIn = async () => {
    if (inputName) {
      try {
        await AsyncStorage.setItem('@storage_checkin', inputName);
        await AsyncStorage.setItem('@storage_checkin_date', new Date().toISOString());
        await AsyncStorage.setItem('@storage_data', JSON.stringify(routeData));
        await AsyncStorage.setItem('@storage_checkin_photo', imageBase64);

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

  const convertImageToBase64 = async (uri) => {
    const manipResult = await manipulateAsync(
      uri,
      [
        //  { rotate: 90 }, { flip: FlipType.Vertical }
        {
          resize: {
            height: 480,
            width: 640,
          },
        },
      ],
      {
        compress: 0.8,
        format: SaveFormat.JPEG,
      }
    );

    const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
      encoding: 'base64',
    });
    setImageBase64(base64);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      convertImageToBase64(result.assets[0].uri);
      setImage(result.assets[0].uri);
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
        console.error('euengd', e);
      }
    };
    getData();

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
  }, []);

  useEffect(() => {
    if (routeData?.uri) {
      // from camera
      setImage(routeData?.uri);
      convertImageToBase64(routeData?.uri);
    }
  }, [routeData?.uri]);

  return (
    <ScrollView>
      <View style={[styles.container, { padding: 30 }]}>
        {routeData && (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: '600', textTransform: 'capitalize' }}>
              {`Tandas ${routeData?.name}${routeData?.gender == 1 ? ' (L)' : ' (P)'}`}
            </Text>
            <Text style={{ fontSize: 20, fontWeight: '600', textTransform: 'capitalize' }}>
              {routeData?.building} Tingkat {routeData?.floor}
            </Text>
            <View style={{ width: 50, height: 10, borderBottomWidth: 1 }}></View>
          </View>
        )}
        <View style={styles.container}>
          {nameStored && (
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
                {inputName}
              </Text>
            </View>
          )}

          {!nameStored && (
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
                    setInputName(itemValue);
                    setPickerStaff(itemValue);
                  }}
                >
                  <Picker.Item label="Pilih Nama" value="" />
                  {listPickerStaff?.map((a, i) => (
                    <Picker.Item key={i} label={a.staff_name} value={a.staff_name} />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          <Text
            style={{
              fontSize: 14,
              marginTop: nameStored ? 30 : 3,
              textAlign: nameStored ? 'center' : 'left',
            }}
          >
            Sila lampirkan gambar
          </Text>
          <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: 'deepskyblue',
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
                <Entypo name="camera" size={24} color="deepskyblue" />
                <Text
                  style={{
                    color: 'deepskyblue',
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
                borderColor: 'deepskyblue',
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
                <FontAwesome name="file-picture-o" size={24} color="deepskyblue" />
                <Text
                  style={{
                    color: 'deepskyblue',
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
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: '100%', height: 200, borderRadius: 10 }}
              />
            )}
          </View>

          {nameStored ? (
            <TouchableOpacity
              style={{
                backgroundColor: !inputName ? 'lightgrey' : 'deepskyblue',
                borderRadius: 10,
                paddingVertical: 15,
                marginVertical: 20,
              }}
              onPress={() => handleNext()}
            >
              <Text
                style={{
                  color: !inputName ? 'grey' : '#fff',
                  fontWeight: '500',
                  textAlign: 'center',
                }}
              >
                Log Keluar
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              disabled={!inputName}
              style={{
                backgroundColor: !inputName ? 'lightgrey' : 'deepskyblue',
                borderRadius: 10,
                paddingVertical: 15,
                marginVertical: 20,
              }}
              onPress={() => handleCheckIn()}
            >
              <Text
                style={{
                  color: !inputName ? 'grey' : '#fff',
                  fontWeight: '500',
                  textAlign: 'center',
                }}
              >
                Log Masuk
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
    backgroundColor: 'deepskyblue',
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
    backgroundColor: 'deepskyblue',
    paddingVertical: 10,
    paddingHorizontal: '12%',
    borderRadius: 20,
  },
  camera: {
    flex: 1,
    width: windowWidth,
  },
});
