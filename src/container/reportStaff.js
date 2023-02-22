import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { dateTimeFormat } from '../config';

const windowWidth = Dimensions.get('window').width;
const headerSize = parseInt((windowWidth * 6) / 100);
const titleSize = parseInt((windowWidth * 5) / 100);
const title2Size = parseInt((windowWidth * 4) / 100);
const fontSize = parseInt((windowWidth * 4) / 100);

export default function ReportStaffScreen({ route, navigation }) {
  const routeData = typeof route?.params === 'string' ? JSON.parse(route?.params) : route?.params;

  const handleBack = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Scanner');
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.header}>
            {`Tandas ${routeData.toilet_name}${routeData.gender == 1 ? ' Lelaki' : ' Perempuan'}`}
          </Text>
          <Text style={styles.header}>
            {routeData.building} Tingkat {routeData.floor}
          </Text>
          <View style={{ width: 50, height: 10, borderBottomWidth: 1 }}></View>
        </View>

        <Text style={styles.title2}>Dicuci Oleh</Text>
        <Text style={styles.desc}>{routeData.name}</Text>

        <View
          style={{
            minWidth: '40%',
            paddingHorizontal: 15,
            alignItems: routeData.activeTab === 1 ? 'flex-start' : 'center',
          }}
        >
          <Text style={styles.title2}>Tarikh &amp; Masa{'\n'}Log Masuk</Text>
          <Text style={styles.desc}>{dateTimeFormat(routeData.check_in)}</Text>
          <Image
            source={{ uri: `data:image/jpeg;base64,${routeData.photo_in}` }}
            style={{ height: 200, width: 250 }}
          />
        </View>

        <View
          style={{
            minWidth: '40%',
            paddingHorizontal: 15,
            alignItems: routeData.activeTab === 1 ? 'flex-start' : 'center',
          }}
        >
          <Text style={styles.title2}>Tarikh &amp; Masa{'\n'}Log Keluar</Text>
          <Text style={styles.desc}>{dateTimeFormat(routeData.check_out)}</Text>
          <Image
            source={{ uri: `data:image/jpeg;base64,${routeData.photo_out}` }}
            style={{ height: 200, width: 250 }}
          />
        </View>

        <View>
          <TouchableOpacity style={styles.newButton} onPress={handleBack}>
            <Text style={[styles.sectionDescription, { color: '#fff', fontWeight: '900' }]}>
              Kembali ke Imbas Kamera
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '20%',
  },
  header: {
    fontSize: titleSize,
    fontWeight: '600',
    marginHorizontal: 10,
    textTransform: 'capitalize',
  },
  headerTable: {
    fontSize: title2Size,
    fontWeight: '600',
    paddingBottom: 10,
  },
  title: { marginTop: 0, fontSize: titleSize, fontWeight: '600' },
  title2: {
    marginTop: 20,
    fontSize: title2Size,
    fontWeight: '600',
    textAlign: 'center',
  },
  desc: {
    marginTop: 2,
    fontSize: fontSize,
    textAlign: 'center',
    alignItems: 'flex-start',
  },
  textInput: {
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    width: windowWidth - 50,
    minHeight: 60,
  },
  newButton: {
    marginTop: 40,
    backgroundColor: 'deepskyblue',
    paddingVertical: 10,
    paddingHorizontal: '12%',
    borderRadius: 10,
  },
  sectionDescription: {
    fontSize: 16,
    fontWeight: '400',
  },
});
