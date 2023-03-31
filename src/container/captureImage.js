import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import { timeFormat } from '../config';

const widthA4 = 1200;
const windowWidth = Dimensions.get('window').width;

export default function CaptureImageScreen({ route }) {
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const refImage = useRef();
  const refQR = useRef();

  const routeData = route?.params || {};

  const [countMasa, setCountMasa] = useState(0);

  if (status === null) {
    requestPermission();
  }

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(refImage, {
        height: 440,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert('Saved!');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (routeData?.fourth_in) {
      setCountMasa(4);
    } else if (routeData?.third_in) {
      setCountMasa(3);
    } else if (routeData?.second_in) {
      setCountMasa(2);
    } else if (routeData?.first_in) {
      setCountMasa(1);
    } else {
      setCountMasa(0);
    }
  }, [countMasa]);

  console.log({
    name: routeData.name,
    floor: routeData.floor,
    building: routeData.building,
    gender: routeData.gender,
    first_in: routeData.first_in,
    first_out: routeData.first_out,
    second_in: routeData.second_in,
    second_out: routeData.second_out,
    third_in: routeData.third_in,
    third_out: routeData.third_out,
  });

  return (
    <ScrollView>
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <View ref={refImage} collapsable={false}>
              <View
                style={{
                  width: 1200,
                  height: 1700,
                  backgroundColor: 'white',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  paddingTop: 150,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    width: (widthA4 * 60) / 100,
                    justifyContent: 'flex-start',
                  }}
                >
                  <Image
                    style={{ width: 35, height: 35 }}
                    source={require('../../assets/logo.png')}
                  />
                  <Text style={{ fontSize: 25, fontWeight: '600', padding: 3 }}>
                    MTC SYNERGY Sdn Bhd
                  </Text>

                  <View
                    style={{
                      borderBottomWidth: 3,
                      width: (widthA4 * 38) / 100,
                      padding: 7,
                      marginLeft: 10,
                      marginBottom: 50,
                    }}
                  ></View>
                </View>

                {/* <Text style={{ fontSize: 32, fontWeight: '600' }}>MTC Synergy Sdn Bhd</Text> */}
                <Text style={{ fontSize: 28 }} />
                <Text style={{ fontSize: 28 }} />
                <Text style={{ fontSize: 60, fontWeight: '600' }}>
                  {routeData.is_surau ? 'Surau' : 'Tandas'} {routeData.name}{' '}
                  {routeData.gender === 1 ? '(L)' : '(P)'}
                </Text>
                <Text style={{ fontSize: 28, fontWeight: '400' }}>(Cleaner)</Text>
                <Text style={{ fontSize: 28 }} />

                <View
                  style={{
                    flexDirection: 'row',
                    borderWidth: 2,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      borderRightWidth: 1,
                      paddingVertical: 30,
                      paddingHorizontal: 45,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <QRCode
                      size={350}
                      value={
                        JSON.stringify({
                          name: routeData.name,
                          floor: routeData.floor,
                          building: routeData.building,
                          gender: routeData.gender,
                          first_in: routeData.first_in,
                          first_out: routeData.first_out,
                          second_in: routeData.second_in,
                          second_out: routeData.second_out,
                          third_in: routeData.third_in,
                          third_out: routeData.third_out,
                        }) || 'NA'
                      }
                      logo={require('../../assets/logo.png')}
                      logoSize={60}
                      logoBackgroundColor="deepskyblue"
                      getRef={refQR}
                      enableLinearGradient={true}
                    />
                    <View></View>
                    <Text style={{ fontSize: 20, paddingTop: 5, fontWeight: '500' }}>
                      {routeData.is_surau ? 'Surau' : 'Tandas'} {routeData.name}{' '}
                      {routeData.gender === 1 ? '(L)' : '(P)'}
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: '500' }}>
                      <Text style={{ textTransform: 'capitalize' }}>{routeData.building}</Text>{' '}
                      Tingkat {routeData.floor}
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingVertical: 20,
                      paddingHorizontal: 35,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 36, fontWeight: 'bold' }}>
                      SO FRESH
                      <Text style={{ fontSize: 24, fontWeight: 'bold' }}> &amp; </Text>
                    </Text>
                    <Text style={{ fontSize: 42, fontWeight: 'bold' }}>SO CLEAN</Text>
                    <Text style={{ fontSize: 36, fontWeight: 'bold' }}>_________</Text>
                    <Text style={{ fontSize: 28 }} />

                    <Text style={{ fontSize: 36, fontWeight: 'bold' }}>MTC CLEANER</Text>
                    <Text style={{ fontSize: 36, fontWeight: 'bold' }}>MONITORING</Text>
                    <Text style={{ fontSize: 36, fontWeight: 'bold' }}>APPS</Text>
                  </View>
                </View>

                <Text style={{ padding: 5 }}></Text>

                {countMasa > 0 && (
                  <View
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      width: (widthA4 * 60) / 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1,
                    }}
                  >
                    <Text style={{ color: 'white', padding: 10, fontWeight: 'bold', fontSize: 24 }}>
                      JADUAL PEMBERSIHAN
                    </Text>
                  </View>
                )}

                <View style={{ flexDirection: 'row' }}>
                  {countMasa > 0 && (
                    <Text
                      style={[
                        styles.table,
                        {
                          width: ((widthA4 / countMasa) * 60) / 100,
                        },
                      ]}
                    >
                      Masa Pertama (1)
                    </Text>
                  )}
                  {countMasa > 1 && (
                    <Text
                      style={[
                        styles.table,
                        {
                          width: ((widthA4 / countMasa) * 60) / 100,
                        },
                      ]}
                    >
                      Masa Kedua (2)
                    </Text>
                  )}
                  {countMasa > 2 && (
                    <Text
                      style={[
                        styles.table,
                        {
                          width: ((widthA4 / countMasa) * 60) / 100,
                        },
                      ]}
                    >
                      Masa Ketiga (3)
                    </Text>
                  )}
                  {countMasa > 3 && (
                    <Text
                      style={[
                        styles.table,
                        {
                          width: ((widthA4 / countMasa) * 60) / 100,
                        },
                      ]}
                    >
                      Masa Keempat (4)
                    </Text>
                  )}
                </View>
                <View style={{ flexDirection: 'row' }}>
                  {countMasa > 0 && (
                    <Text
                      style={[
                        styles.table,
                        {
                          width: ((widthA4 / countMasa) * 60) / 100,
                        },
                      ]}
                    >
                      {timeFormat(routeData.first_in)}-{timeFormat(routeData.first_out)}
                    </Text>
                  )}
                  {countMasa > 1 && (
                    <Text
                      style={[
                        styles.table,
                        {
                          width: ((widthA4 / countMasa) * 60) / 100,
                        },
                      ]}
                    >
                      {timeFormat(routeData.second_in)}-{timeFormat(routeData.second_out)}
                    </Text>
                  )}
                  {countMasa > 2 && (
                    <Text
                      style={[
                        styles.table,
                        {
                          width: ((widthA4 / countMasa) * 60) / 100,
                        },
                      ]}
                    >
                      {timeFormat(routeData.third_in)}-{timeFormat(routeData.third_out)}
                    </Text>
                  )}
                  {countMasa > 3 && (
                    <Text
                      style={[
                        styles.table,
                        {
                          width: ((widthA4 / countMasa) * 60) / 100,
                        },
                      ]}
                    >
                      {timeFormat(routeData.fourth_in)}-{timeFormat(routeData.fourth_out)}
                    </Text>
                  )}
                </View>

                <Text style={{ fontSize: 150 }} />

                <View style={{ flexDirection: 'row' }}>
                  <Image
                    style={{ width: 130, height: 130, marginRight: 50 }}
                    source={require('../../assets/no-smoke.png')}
                  />
                  <Image
                    style={{ width: 130, height: 130, marginLeft: 50 }}
                    source={require('../../assets/throw-rubbish.png')}
                  />
                </View>

                <View style={{ flexDirection: 'row', paddingVertical: 30 }}>
                  <Image
                    style={{ width: 150, height: 100, marginRight: 40 }}
                    source={require('../../assets/flush-toilet.png')}
                  />
                  <Image
                    style={{ width: 100, height: 100, marginHorizontal: 40 }}
                    source={require('../../assets/keep-distance.png')}
                  />
                  <Image
                    style={{ width: 150, height: 100, marginLeft: 40 }}
                    source={require('../../assets/dont-pee.png')}
                  />
                </View>

                <View
                  style={{ borderBottomWidth: 2, width: (widthA4 * 60) / 100, padding: 10 }}
                ></View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <Text style={{ paddingVertical: 5, fontWeight: '500', fontSize: 16 }}>
                    MTC CLEANER MONITORING
                  </Text>
                  <Text style={{ width: 390 }}></Text>
                  <Text style={{ paddingVertical: 5, fontWeight: '500', fontSize: 16 }}>
                    Helpline : +603-5888 9696
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <TouchableOpacity icon="save-alt" onPress={onSaveImageAsync}>
                <Text
                  style={{
                    padding: 20,
                    color: 'black',
                    backgroundColor: 'deepskyblue',
                    borderRadius: 10,
                  }}
                >
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  table: {
    borderWidth: 1,
    paddingVertical: 10,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '500',
  },
});
