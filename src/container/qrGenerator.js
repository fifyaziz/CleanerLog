import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useCallback } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Supabase from '../config/initSupabase';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const fontSize = parseInt((windowWidth * 4) / 100);

export default function QRGeneratorScreen() {
  const [QRvalue, setQRValue] = React.useState('');
  const [QRBase64, setQRBase64] = React.useState('');

  const [radioButton, setRadioButton] = React.useState('');
  const ref = React.useRef();

  const handleButton = useCallback(
    async (buttonType) => {
      if (!QRvalue) {
        ToastAndroid.show('Sila masukkan nombor tingkat bangunan', ToastAndroid.TOP);
        return;
      } else if (!radioButton) {
        ToastAndroid.show('Sila pilih jantina', ToastAndroid.TOP);
        return;
      } else {
        const { data: dataFetch, error: errorFetch } = await Supabase.from('room')
          .select('floor, gender')
          .eq('floor', QRvalue)
          .eq('gender', radioButton === 'lelaki' ? 1 : 2);

        if (dataFetch?.length > 0) {
          ToastAndroid.show('Kod QR telah wujud.!', ToastAndroid.TOP);
        } else {
          const { status, error } = await Supabase.from('room').insert({
            floor: QRvalue,
            gender: radioButton === 'lelaki' ? 1 : 2,
          });

          if (status === 201) {
            ref.current.toDataURL(async (data) => {
              setQRBase64(data);

              const filename = FileSystem.documentDirectory + 'QRCode.png'; //create new png file
              FileSystem.writeAsStringAsync(filename, QRBase64, {
                //write image on png file above
                encoding: FileSystem.EncodingType.Base64,
              });

              if (buttonType === 'share') {
                const options = {
                  mimeType: 'image/png',
                  dialogTitle: 'This is the Title?',
                };
                Sharing.shareAsync(filename, options);
              } else {
                ToastAndroid.show('Kod QR berjaya disimpan.!', ToastAndroid.BOTTOM);
              }
              // FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then((data) => {
              //   data.forEach(async (filename_) => {
              //     if (filename_.includes('QRCode.png')) {
              //       MediaLibrary.requestPermissionsAsync();
              //       // const mediaResult = await MediaLibrary.saveToLibraryAsync(filename); // direct simpan kat media folder
              //       // const assetResut = await MediaLibrary.createAssetAsync(filename).then(uri => {console.log('gg assetResut', uri)}); // perlukan permission untuk simpan kat media folder
              //     }
              //   });
              // });
            });
          }
        }
      }
    },
    [QRvalue, radioButton]
  );

  const RadioButton = useCallback(
    ({ type }) => {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginVertical: 30,
          }}
        >
          <View
            style={[
              {
                height: 24,
                width: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: '#000',
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
          >
            {radioButton === type ? (
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: '#000',
                }}
              />
            ) : null}
          </View>
          <Text style={{ textTransform: 'capitalize', marginLeft: 20 }}>{type}</Text>
        </View>
      );
    },
    [radioButton]
  );

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.row}>
          <TextInput
            placeholder="Masukkan nombor tingkat bangunan"
            style={styles.textInput}
            autoCapitalize="none"
            value={QRvalue}
            onChangeText={setQRValue}
            keyboardType="numeric"
          />
        </View>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => setRadioButton('lelaki')}>
            <RadioButton type="lelaki" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setRadioButton('perempuan')}>
            <RadioButton type="perempuan" />
          </TouchableOpacity>
        </View>

        <QRCode
          size={windowWidth - 50}
          value={
            JSON.stringify({
              floor: QRvalue,
              gender: radioButton === 'lelaki' ? 1 : 2,
            }) || 'NA'
          }
          logoSize={60}
          backgroundColor="white"
          getRef={ref}
          enableLinearGradient={true}
        />

        <View style={styles.sectionContainer}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.newButton} onPress={() => handleButton('save')}>
              <Text style={[styles.sectionDescription]}>Simpan Kod QR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.newButton} onPress={() => handleButton('share')}>
              <Text style={[styles.sectionDescription]}>Kongsi Kod QR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {},
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    minHeight: windowHeight,
  },
  sectionContainer: {
    marginTop: 42,
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
  },
  textInput: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    textAlign: 'center',
    marginTop: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    flex: 0.9,
  },
  sectionDescription: {
    fontSize: fontSize,
    color: '#fff',
    fontWeight: '900',
  },
  newButton: {
    backgroundColor: 'deepskyblue',
    marginHorizontal: '1%',
    marginBottom: 50,
    paddingVertical: 15,
    paddingHorizontal: '10%',
    borderRadius: 20,
  },
});
