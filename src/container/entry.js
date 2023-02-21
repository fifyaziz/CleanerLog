import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import Supabase from '../config/initSupabase';

const windowWidth = Dimensions.get('window').width;
const minTitleBox = parseInt((windowWidth * 40) / 100);
const maxTitleBox = parseInt((windowWidth * 42) / 100);
const headerSize = parseInt((windowWidth * 6) / 100);
const titleSize = parseInt((windowWidth * 5) / 100);
const title2Size = parseInt((windowWidth * 4) / 100);
const fontSize = parseInt((windowWidth * 4) / 100);

const RadioButton = ({ type, value }) => {
  return (
    <View
      key={type}
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
        {value === type ? (
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
    </View>
  );
};

const convertText = (value) => {
  const final = value.replace(/ /g, '_');
  return final;
};

export default function EntryScreen({ route, navigation }) {
  const [remarks, setRemarks] = useState();
  const [listKemudahan, setListKemudahan] = useState();
  const [payloadKemudahan, setPayloadKemudahan] = useState({});
  const [loading, setLoading] = useState(true);
  const routeData = route?.params;

  const dateAPI = new Date();
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const [today, setToday] = useState(
    `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year} ${
      hours < 10 ? '0' + hours : hours
    }:${minutes < 10 ? '0' + minutes : minutes}`
  );

  const handleSubmit = async () => {
    let temp = listKemudahan.map((a) => ({
      [a.ref_name]: a.value,
    }));
    temp = temp.reduce((r, c) => Object.assign(r, c), {});

    let getName = '';
    let getDate = '';
    try {
      getName = await AsyncStorage.getItem('@storage_checkin');
      getDate = await AsyncStorage.getItem('@storage_checkin_date');
    } catch (e) {
      console.error('euen', e);
    }

    const final = {
      ...temp,
      name: getName,
      datetime_checkin: getDate,
      floor: routeData?.data?.floor,
      gender: routeData?.data?.gender,
      remarks: remarks,
      datetime_created: dateAPI,
    };

    const { status, statusText, data, error } = await Supabase.from('entry').insert(final);
    if (status === 201) {
      ToastAndroid.show('Borang telah berjaya dihantar.', ToastAndroid.BOTTOM);
      try {
        await AsyncStorage.removeItem('@storage_checkin');
        await AsyncStorage.removeItem('@storage_checkin_date');
      } catch (e) {
        console.error('euen', e);
      }
      navigation.navigate('TabNav');
    }
  };

  const handleRadioButton = async (value, type) => {
    const final = listKemudahan.map((a, i) => {
      if (i === value) {
        return { ...a, value: type };
      } else {
        return a;
      }
    });
    setListKemudahan(final);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: dataFetch } = await Supabase.from('kemudahan').select();

      const final = dataFetch?.map((a, i) => ({ ...a, value: 2 }));
      setListKemudahan(final);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Maklumat Tingkat {routeData?.data?.floor}</Text>
        <Text style={styles.title}>
          Bilik {routeData?.data?.gender === '1' ? 'Lelaki' : 'Perempuan'}
        </Text>
        <Text style={styles.title2}>Tarikh & Masa</Text>
        <Text style={styles.desc}>{today}</Text>

        {loading && <ActivityIndicator style={{ marginTop: 40 }} color={'black'} size={50} />}
        <View style={{ marginTop: 10 }}>
          <View style={{ borderBottomWidth: 1, marginTop: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  minWidth: minTitleBox,
                  maxWidth: maxTitleBox,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
              >
                <Text style={{ textAlign: 'center', fontWeight: '700' }}>Kemudahan</Text>
              </View>
              <View style={{ maxWidth: 70, minWidth: 70, paddingHorizontal: 10 }}>
                <Text>Bersih</Text>
                <Text>/Baik</Text>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text>Kerosakan</Text>
              </View>
            </View>
          </View>
          {listKemudahan?.map((a, i) => (
            <View key={i} style={{ borderBottomWidth: 1 }}>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    minWidth: minTitleBox,
                    maxWidth: maxTitleBox,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}
                >
                  <Text>{a.name}</Text>
                </View>
                <View style={{ maxWidth: 70, minWidth: 70, paddingHorizontal: 10 }}>
                  <TouchableOpacity onPress={() => handleRadioButton(i, 0)}>
                    <RadioButton type={0} value={a.value} />
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity onPress={() => handleRadioButton(i, 1)}>
                    <RadioButton type={1} value={a.value} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        <TextInput
          placeholder="Komen"
          style={styles.input}
          onChangeText={setRemarks}
          value={remarks}
          multiline
        />

        <TouchableOpacity style={styles.newButton} onPress={handleSubmit}>
          <Text style={[styles.sectionDescription, { color: '#fff', fontWeight: '900' }]}>
            Hantar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  input: {
    minWidth: '80%',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 35,
  },
  header: {
    fontSize: headerSize,
    fontWeight: '600',
  },
  title: { marginTop: 0, fontSize: titleSize, fontWeight: '600' },
  title2: {
    marginTop: 30,
    fontSize: title2Size,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  desc: {
    marginTop: 2,
    fontSize: fontSize,
  },
  sectionDescription: {
    fontSize: fontSize,
    fontWeight: '400',
  },
  newButton: {
    marginTop: 20,
    backgroundColor: 'deepskyblue',
    paddingVertical: 10,
    paddingHorizontal: '12%',
    borderRadius: 20,
  },
});
