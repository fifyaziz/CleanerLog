import { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Snackbar } from 'react-native-paper';
import { dateTimeFormat } from '../config';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const headerSize = parseInt((windowWidth * 7) / 100);
const fontSize = parseInt((windowWidth * 4) / 100);

export default function CheckOutSummaryScreen({ route, navigation }) {
  const routeData = typeof route?.params === 'string' ? JSON.parse(route?.params) : route?.params;
  const [snackbarMessage, setSnackbarMessage] = useState(true);

  const handleBack = async () => {
    navigation.navigate('QRScanner');
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.header}>
            {`${routeData.is_surau ? 'Surau' : routeData.is_office ? 'Pejabat' : 'Tandas'} ${
              routeData.toilet_name
            }${routeData.gender == 1 ? ' (L)' : routeData.gender == 0 ? '' : ' (P)'}`}
          </Text>
          <Text style={styles.header}>
            {routeData.building} Tingkat {routeData.floor}
          </Text>
          <View style={{ width: 50, height: 10, borderBottomWidth: 1, marginBottom: 25 }}></View>
        </View>

        <Text style={styles.title}>Dicuci Oleh</Text>
        <Text style={styles.desc}>{routeData.name}</Text>

        <View
          style={{
            minWidth: '40%',
            paddingHorizontal: 15,
            alignItems: routeData.activeTab === 1 ? 'flex-start' : 'center',
          }}
        >
          <Text style={styles.title}>Tarikh &amp; Masa{'\n'}Log Masuk</Text>
          <Text style={styles.desc}>{dateTimeFormat(routeData.check_in)}</Text>
          {routeData.photo_in ? (
            <Image
              source={{ uri: `data:image/jpeg;base64,${routeData.photo_in}` }}
              style={{ height: 200, width: 250 }}
            />
          ) : (
            <Text
              style={{
                color: 'grey',
                marginTop: 10,
                paddingHorizontal: 30,
                paddingVertical: 20,
                borderWidth: 1,
                borderColor: 'lightgrey',
                borderRadius: 10,
              }}
            >
              - Tiada Gambar -{' '}
            </Text>
          )}
        </View>

        <View
          style={{
            minWidth: '40%',
            paddingHorizontal: 15,
            alignItems: routeData.activeTab === 1 ? 'flex-start' : 'center',
          }}
        >
          <Text style={styles.title}>Tarikh &amp; Masa{'\n'}Log Keluar</Text>
          <Text style={styles.desc}>{dateTimeFormat(routeData.check_out)}</Text>
          {routeData.photo_out ? (
            <Image
              source={{ uri: `data:image/jpeg;base64,${routeData.photo_out}` }}
              style={{ height: 200, width: 250 }}
            />
          ) : (
            <Text
              style={{
                color: 'grey',
                marginTop: 10,
                paddingHorizontal: 30,
                paddingVertical: 20,
                borderWidth: 1,
                borderColor: 'lightgrey',
                borderRadius: 10,
              }}
            >
              - Tiada Gambar -{' '}
            </Text>
          )}
        </View>

        <View>
          <TouchableOpacity style={styles.newButton} onPress={handleBack}>
            <Text style={[styles.sectionDescription]}>Kembali ke Imbas Kamera</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Snackbar
        visible={snackbarMessage}
        onDismiss={() => setSnackbarMessage(false)}
        duration={1000}
        style={{ backgroundColor: '#00000000', opacity: 0.6 }}
      >
        <View
          style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: '#00000000' }}
        >
          <View
            style={{
              borderRadius: 50,
              backgroundColor: 'palegreen',
              paddingVertical: 10,
              paddingHorizontal: 30,
            }}
          >
            <Text>Log Keluar Telah Berjaya.</Text>
          </View>
        </View>
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: windowHeight,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '20%',
  },
  header: {
    fontSize: headerSize,
    fontWeight: '600',
    marginHorizontal: 10,
    textTransform: 'capitalize',
  },
  title: {
    marginTop: 25,
    fontSize: fontSize,
    fontWeight: '700',
    textAlign: 'center',
  },
  desc: {
    marginTop: 6,
    fontSize: fontSize,
    textAlign: 'center',
    alignItems: 'flex-start',
  },
  newButton: {
    marginTop: 40,
    backgroundColor: '#2a908f',
    paddingVertical: 10,
    paddingHorizontal: '12%',
    borderRadius: 10,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '800',
  },
});
