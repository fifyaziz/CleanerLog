import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import QRCode from 'react-native-qrcode-svg';
import RadioButton from '../component/radioButton';
import { timeFormat } from '../config';
import Supabase from '../config/initSupabase';

const windowWidth = Dimensions.get('screen').width;

export default function EditQRScreen({ route }) {
  const refQR = useRef();
  const routeData = route?.params?.data;

  const [inputNama, setInputNama] = useState(routeData.name);
  const [inputTingkat, setInputTingkat] = useState(routeData.floor);
  const [pickerMenara, setPickerMenara] = useState(routeData.building);
  const [radioJantina, setRadioJantina] = useState(routeData.gender); // 1 - lelaki, 2 - perempuan

  const [masaMasukPertama, setMasaMasukPertama] = useState(routeData.first_in);
  const [masaKeluarPertama, setMasaKeluarPertama] = useState(routeData.first_out);
  const [masaMasukKedua, setMasaMasukKedua] = useState(routeData.second_in);
  const [masaKeluarKedua, setMasaKeluarKedua] = useState(routeData.second_out);
  const [masaMasukKetiga, setMasaMasukKetiga] = useState(routeData.third_in);
  const [masaKeluarKetiga, setMasaKeluarKetiga] = useState(routeData.third_out);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePickerType, setDatePickerType] = useState();
  const [datePickerNum, setDatePickerNum] = useState();

  const showDatePicker = (type, num) => {
    setDatePickerVisibility(true);
    setDatePickerType(type);
    setDatePickerNum(num);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setDatePickerType();
    setDatePickerNum();
  };

  const handleConfirmDatePicker = useCallback(
    (date) => {
      if (datePickerType === 'in' && datePickerNum === 1) {
        setMasaMasukPertama(date);
      } else if (datePickerType === 'out' && datePickerNum === 1) {
        setMasaKeluarPertama(date);
      } else if (datePickerType === 'in' && datePickerNum === 2) {
        setMasaMasukKedua(date);
      } else if (datePickerType === 'out' && datePickerNum === 2) {
        setMasaKeluarKedua(date);
      } else if (datePickerType === 'in' && datePickerNum === 3) {
        setMasaMasukKetiga(date);
      } else if (datePickerType === 'out' && datePickerNum === 3) {
        setMasaKeluarKetiga(date);
      }

      hideDatePicker();
    },
    [datePickerType, datePickerNum]
  );

  const handleUpdate = useCallback(async () => {
    const { status, error } = await Supabase.from('tandas')
      .update({
        name: inputNama,
        floor: inputTingkat,
        building: pickerMenara,
        gender: radioJantina,
        first_in: masaMasukPertama,
        first_out: masaKeluarPertama,
        second_in: masaMasukKedua,
        second_out: masaKeluarKedua,
        third_in: masaMasukKetiga,
        third_out: masaKeluarKetiga,
      })
      .eq('id', routeData.id);
    if (status === 204) {
      ToastAndroid.show('Maklumat Tandas berjaya dikemaskini.!', ToastAndroid.BOTTOM);
    }
    if (error) {
      console.error('error', error);
    }
  }, [
    inputTingkat,
    radioJantina,
    pickerMenara,
    radioJantina,
    masaMasukPertama,
    masaKeluarPertama,
    masaMasukKedua,
    masaKeluarKedua,
    masaMasukKetiga,
    masaKeluarKetiga,
  ]);

  const handleKongsi = useCallback(async () => {
    refQR.current.toDataURL(async (data) => {
      const html =
        data &&
        `<html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            </head>
            <style>
            table {
              font-family: arial, sans-serif;
              border-collapse: collapse;
              width: 100%;
            }
            td, th {
              border: 1px solid #dddddd;
              padding: 8px;
              font-size: 14px;
            }
            </style>
            <body style="text-align: center;">
              <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal; text-transform: capitalize">
                Tandas ${inputNama || ''} ${
          radioJantina === 1 ? 'Lelaki' : radioJantina === 2 ? 'perempuan' : ''
        }
              </h1>
              <h2 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal; text-transform: capitalize">
                ${pickerMenara || ''} ${inputTingkat ? ', Tingkat' + inputTingkat : ''}
              </h2>
              <img src="data:image/gif;base64, ${data}"/>

              ${
                masaMasukKetiga || masaMasukKedua || masaMasukPertama
                  ? `<table style="margin-top: 50px; font-size: 18px; font-weight: 600;">
                <tr>
                  <th colspan="${
                    masaMasukKetiga ? 3 : masaMasukKedua ? 2 : masaMasukPertama ? 1 : 0
                  }" style="background-color: red; color: white;">Jadual Pembersihan</th>
                </tr>
                <tr>
                  ${masaMasukPertama ? '<th>Masa Pertama(1)</th>' : ''}
                  ${masaMasukKedua ? '<th>Masa Kedua(2)</th>' : ''}
                  ${masaMasukKetiga ? '<th>Masa Ketiga(3)</th>' : ''}
                </tr>
                <tr>
                  ${
                    masaMasukPertama
                      ? `<th>${timeFormat(masaMasukPertama)} - ${timeFormat(
                          masaKeluarPertama
                        )}</th>`
                      : ''
                  }
                  ${
                    masaMasukKedua
                      ? `<th>${timeFormat(masaMasukKedua)} - ${timeFormat(masaKeluarKedua)}</th>`
                      : ''
                  }
                  ${
                    masaMasukKetiga
                      ? `<th>${timeFormat(masaMasukKetiga)} - ${timeFormat(masaKeluarKetiga)}</th>`
                      : ''
                  }
                </tr>
              </table>`
                  : ''
              }
            </body>
          </html>`;

      const { uri } = await Print.printToFileAsync({ html, base64: true });

      const pdfName = `${FileSystem.documentDirectory}QRCode_${inputNama}_${radioJantina}.pdf`;
      await FileSystem.moveAsync({
        from: uri,
        to: pdfName,
      });

      Sharing.shareAsync(pdfName, { UTI: '.pdf', mimeType: 'application/pdf' });
    });
  }, [
    inputTingkat,
    radioJantina,
    pickerMenara,
    radioJantina,
    masaMasukPertama,
    masaKeluarPertama,
    masaMasukKedua,
    masaKeluarKedua,
    masaMasukKetiga,
    masaKeluarKetiga,
  ]);

  useEffect(() => {
    MediaLibrary.requestPermissionsAsync().then(({ granted }) => {
      if (!granted) {
        Alert.alert('Permission required', 'Please allow the app to save photos to your device.');
      }
    });
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={{ fontSize: 15, fontWeight: '600', paddingTop: 30, paddingHorizontal: 10 }}>
          Maklumat Tandas
        </Text>
        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
          <TextInput
            placeholder="Nama tandas"
            style={[styles.textInput, { width: '55%', marginLeft: 10, marginRight: 5 }]}
            autoCapitalize="none"
            value={inputNama}
            onChangeText={setInputNama}
          />

          <TextInput
            placeholder="Tingkat"
            style={[styles.textInput, { marginRight: 10, marginLeft: 5, width: '35%' }]}
            autoCapitalize="none"
            value={inputTingkat}
            onChangeText={setInputTingkat}
            keyboardType="number-pad"
          />
        </View>

        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
          <View
            style={[
              {
                width: '55%',
                marginLeft: 10,
                marginRight: 5,
                borderRadius: 10,
                overflow: 'hidden',
                borderWidth: 1,
              },
            ]}
          >
            <Picker
              selectedValue={pickerMenara}
              onValueChange={(itemValue, itemIndex) => setPickerMenara(itemValue)}
            >
              <Picker.Item label="Pilih Bangunan" value="" />
              <Picker.Item label="Mall" value="mall" />
              <Picker.Item label="Tower 1" value="t1" />
              <Picker.Item label="Tower 2" value="t2" />
              <Picker.Item label="Tower 3" value="t3" />
            </Picker>
          </View>

          <View
            style={[{ width: '35%', marginRight: 10, marginLeft: 5, alignItems: 'flex-start' }]}
          >
            <View style={{ paddingBottom: 5 }}>
              <TouchableOpacity onPress={() => setRadioJantina(1)}>
                <RadioButton selected={radioJantina === 1} label="lelaki" />
              </TouchableOpacity>
            </View>

            <View style={{ paddingTop: 5 }}>
              <TouchableOpacity onPress={() => setRadioJantina(2)}>
                <RadioButton selected={radioJantina === 2} label="perempuan" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text
          style={{
            fontSize: 15,
            fontWeight: '600',
            paddingTop: 30,
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          Maklumat Masa Pembersihan
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <Text style={{ width: '35%' }}>Masa Pertama</Text>
          <View style={{ paddingHorizontal: 10 }}>
            <TouchableOpacity onPress={() => showDatePicker('in', 1)}>
              <Text
                style={[
                  styles.textInput,
                  { borderRadius: 10, overflow: 'hidden', padding: 10, minWidth: 75 },
                ]}
              >
                {masaMasukPertama ? timeFormat(masaMasukPertama) : ''}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            <TouchableOpacity onPress={() => showDatePicker('out', 1)}>
              <Text
                style={[
                  styles.textInput,
                  { borderRadius: 10, overflow: 'hidden', padding: 10, minWidth: 75 },
                ]}
              >
                {masaKeluarPertama ? timeFormat(masaKeluarPertama) : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <Text style={{ width: '35%' }}>Masa Kedua</Text>
          <View style={{ paddingHorizontal: 10 }}>
            <TouchableOpacity onPress={() => showDatePicker('in', 2)}>
              <Text
                style={[
                  styles.textInput,
                  { borderRadius: 10, overflow: 'hidden', padding: 10, minWidth: 75 },
                ]}
              >
                {masaMasukKedua ? timeFormat(masaMasukKedua) : ''}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            <TouchableOpacity onPress={() => showDatePicker('out', 2)}>
              <Text
                style={[
                  styles.textInput,
                  { borderRadius: 10, overflow: 'hidden', padding: 10, minWidth: 75 },
                ]}
              >
                {masaKeluarKedua ? timeFormat(masaKeluarKedua) : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <Text style={{ width: '35%' }}>Masa Ketiga</Text>
          <View style={{ paddingHorizontal: 10 }}>
            <TouchableOpacity onPress={() => showDatePicker('in', 3)}>
              <Text
                style={[
                  styles.textInput,
                  { borderRadius: 10, overflow: 'hidden', padding: 10, minWidth: 75 },
                ]}
              >
                {masaMasukKetiga ? timeFormat(masaMasukKetiga) : ''}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            <TouchableOpacity onPress={() => showDatePicker('out', 3)}>
              <Text
                style={[
                  styles.textInput,
                  { borderRadius: 10, overflow: 'hidden', padding: 10, minWidth: 75 },
                ]}
              >
                {masaKeluarKetiga ? timeFormat(masaKeluarKetiga) : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            paddingVertical: 20,
            justifyContent: 'center',
            alignItems: 'center',
            width: windowWidth,
          }}
        >
          <Text style={{ paddingBottom: 10 }}>Kod QR</Text>
          <QRCode
            size={100}
            value={
              JSON.stringify({
                floor: inputTingkat,
                gender: radioJantina,
              }) || 'NA'
            }
            logoSize={60}
            backgroundColor="white"
            getRef={refQR}
            enableLinearGradient={true}
          />

          <View style={{ flexDirection: 'row', marginTop: 30 }}>
            <View style={{ paddingHorizontal: 10 }}>
              <TouchableOpacity style={[styles.customButtton]} onPress={() => handleUpdate()}>
                <Text style={{ color: 'white', fontWeight: '600' }}>Kemaskini Kod QR</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 10 }}>
              <TouchableOpacity style={[styles.customButtton]} onPress={() => handleKongsi()}>
                <Text style={{ color: 'white', fontWeight: '600' }}>Kongsi Kod QR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="time"
          onConfirm={handleConfirmDatePicker}
          onCancel={hideDatePicker}
          // display="spinner"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingBottom: 30,
  },
  textInput: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  customButtton: {
    shadowColor: 'darkblue', // IOS
    shadowOffset: { height: 10, width: 10 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: 'deepskyblue',
    elevation: 5, // Android
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});
