import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text, ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native';
import { dateTimeFormat } from '../config';
import Supabase from '../config/initSupabase';

const windowWidth = Dimensions.get('window').width;
const headerSize = parseInt((windowWidth * 6) / 100);
const titleSize = parseInt((windowWidth * 5) / 100);
const title2Size = parseInt((windowWidth * 4) / 100);
const fontSize = parseInt((windowWidth * 4) / 100);

export default function ReportStaffScreen({ route, navigation }) {
  const routeData = route?.params;

  const [dateCheckIn, setDateCheckIn ] = useState()

  const handleSubmit = useCallback(async () => {
      const { status, error } = await Supabase.from('entry')
        .update({ approved: true })
        .eq('id', routeData.id);
      console.error(error);
      if (status === 204) {
        setApproval();
        ToastAndroid.show('Borang telah berjaya dihantar.', ToastAndroid.BOTTOM);
        navigation.navigate('Dashboard');
      }
  }, []);

  useEffect(()=>{
    const getData = async () => {
        try {
          const getDate = await AsyncStorage.getItem('@storage_checkin_date');
          setDateCheckIn(getDate);
        } catch (e) {
          console.error('euen', e);
        }
      };
      getData();
  },[])

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.header}>
            Tandas {JSON.parse(routeData).name}{' '}
            {JSON.parse(routeData).gender == 1 ? 'Lelaki' : 'Perempuan'}
          </Text>
          <Text style={styles.header}>
            {JSON.parse(routeData).building} Tingkat {JSON.parse(routeData).floor}
          </Text>
          <View style={{ width: 50, height: 10, borderBottomWidth: 1 }}></View>
        </View>

          <View
            style={{
              minWidth: '40%',
              paddingHorizontal: 15,
              alignItems: routeData.activeTab === 1 ? 'flex-start' : 'center',
            }}
          >
            <Text style={styles.title2}>Tarikh & Masa{'\n'}Log Masuk</Text>
            <Text style={styles.desc}>{dateTimeFormat(dateCheckIn)}</Text>
          </View>

      <View>
        <TouchableOpacity
          style={{
            marginTop: 20,
            borderRadius: 10,
            backgroundColor: 'deepskyblue',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}
          onPress={() => handleSubmit()}
        >
          <Text style={{ color: 'white', fontWeight: '500' }}>Simpan</Text>
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
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
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
    textDecorationLine: 'underline',
    paddingBottom: 10,
  },
  title: { marginTop: 0, fontSize: titleSize, fontWeight: '600' },
  title2: {
    marginTop: 20,
    fontSize: title2Size,
    fontWeight: '600',
    textDecorationLine: 'underline',
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
});
